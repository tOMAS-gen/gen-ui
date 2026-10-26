import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { BackupCodes, backupCodesText } from "../src/components/BackupCodes";
import { CopyButton } from "../src/components/CopyButton";
import { QrCode, formatSecret, qrMatrix } from "../src/components/QrCode";

const URI = "otpauth://totp/gen%20saas:tomas%40gen.net.ar?secret=JBSWY3DPEHPK3PXP&issuer=gen%20saas";

let copiado: string[];
beforeEach(() => {
  copiado = [];
  Object.defineProperty(navigator, "clipboard", {
    configurable: true,
    value: { writeText: vi.fn(async (texto: string) => void copiado.push(texto)) },
  });
});
afterEach(() => {
  cleanup();
  vi.useRealTimers();
  vi.restoreAllMocks();
});

describe("qrMatrix y formatSecret", () => {
  it("qrMatrix arma una matriz cuadrada con los patrones de posición en las esquinas", () => {
    const matriz = qrMatrix(URI);

    expect(matriz.length).toBeGreaterThanOrEqual(21);
    expect(matriz.every((fila) => fila.length === matriz.length)).toBe(true);
    // Los tres patrones de posición empiezan con una fila de 7 módulos oscuros.
    const n = matriz.length;
    expect(matriz[0].slice(0, 7).every(Boolean)).toBe(true);
    expect(matriz[0].slice(n - 7).every(Boolean)).toBe(true);
    expect(matriz[n - 1].slice(0, 7).every(Boolean)).toBe(true);
  });

  it("formatSecret agrupa la clave de a 4 para escribirla a mano", () => {
    expect(formatSecret("JBSWY3DPEHPK3PXP")).toBe("JBSW Y3DP EHPK 3PXP");
    expect(formatSecret(" jbsw y3dp ehp ")).toBe("JBSW Y3DP EHP");
  });
});

describe("QrCode", () => {
  it("dibuja el QR como imagen accesible, con zona de silencio", () => {
    render(<QrCode value={URI} />);

    const imagen = screen.getByRole("img", { name: "Código QR para la app de autenticación" });
    const lado = qrMatrix(URI).length + 8;
    expect(imagen.getAttribute("viewBox")).toBe(`0 0 ${lado} ${lado}`);
    expect(imagen.querySelector("path")?.getAttribute("d")).toMatch(/^M4 4h1v1h-1z/);
  });

  it("muestra la clave para escribirla a mano y la copia sin espacios", async () => {
    render(<QrCode value={URI} secret="JBSWY3DPEHPK3PXP" />);

    expect(screen.getByText("JBSW Y3DP EHPK 3PXP")).toBeTruthy();
    await act(async () => fireEvent.click(screen.getByRole("button", { name: "Copiar clave" })));

    expect(copiado).toEqual(["JBSWY3DPEHPK3PXP"]);
  });

  it("sin clave, no muestra la sección para escribirla", () => {
    render(<QrCode value={URI} />);

    expect(screen.queryByRole("button", { name: /Copiar/ })).toBeNull();
  });
});

describe("CopyButton", () => {
  it("avisa que copió y vuelve al texto original", async () => {
    vi.useFakeTimers();
    render(<CopyButton text="hola" />);

    await act(async () => fireEvent.click(screen.getByRole("button", { name: "Copiar" })));
    expect(copiado).toEqual(["hola"]);
    expect(screen.getByRole("button", { name: "Copiado" })).toBeTruthy();

    act(() => vi.advanceTimersByTime(2000));
    expect(screen.getByRole("button", { name: "Copiar" })).toBeTruthy();
  });

  it("si el navegador no deja copiar, lo dice", async () => {
    navigator.clipboard.writeText = vi.fn(async () => {
      throw new Error("denegado");
    });
    render(<CopyButton text="hola" />);

    await act(async () => fireEvent.click(screen.getByRole("button", { name: "Copiar" })));

    expect(screen.getByRole("button", { name: "No se pudo copiar" })).toBeTruthy();
  });
});

/** jsdom no tiene `Blob.text()`. */
const leer = (blob: Blob) =>
  new Promise<string>((resolve) => {
    const lector = new FileReader();
    lector.onload = () => resolve(lector.result as string);
    lector.readAsText(blob);
  });

describe("BackupCodes", () => {
  const CODIGOS = ["a1b2-c3d4", "e5f6-g7h8", "i9j0-k1l2"];

  it("backupCodesText deja un código por renglón, con un encabezado", () => {
    expect(backupCodesText(CODIGOS, "gen saas · tomas@gen.net.ar")).toBe(
      "gen saas · tomas@gen.net.ar\nCódigos de respaldo: cada uno sirve una sola vez.\n\na1b2-c3d4\ne5f6-g7h8\ni9j0-k1l2\n",
    );
  });

  it("lista los códigos y avisa que se muestran una sola vez", () => {
    render(<BackupCodes codes={CODIGOS} />);

    expect(screen.getAllByRole("listitem").map((li) => li.textContent)).toEqual(CODIGOS);
    expect(screen.getByText(/Se muestran una sola vez/)).toBeTruthy();
  });

  it("copia todos los códigos juntos", async () => {
    render(<BackupCodes codes={CODIGOS} heading="gen saas" />);

    await act(async () => fireEvent.click(screen.getByRole("button", { name: "Copiar códigos" })));

    expect(copiado).toEqual([backupCodesText(CODIGOS, "gen saas")]);
  });

  it("descarga un .txt con los códigos", async () => {
    const blobs: Blob[] = [];
    URL.createObjectURL = vi.fn((blob: Blob) => {
      blobs.push(blob);
      return "blob:codigos";
    });
    URL.revokeObjectURL = vi.fn();
    const descargas: string[] = [];
    vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(function (this: HTMLAnchorElement) {
      descargas.push(`${this.download} ${this.href}`);
    });
    render(<BackupCodes codes={CODIGOS} fileName="gen-saas-codigos.txt" />);

    fireEvent.click(screen.getByRole("button", { name: "Descargar .txt" }));

    expect(descargas).toEqual(["gen-saas-codigos.txt blob:codigos"]);
    expect(await leer(blobs[0])).toBe(backupCodesText(CODIGOS));
    expect(blobs[0].type).toBe("text/plain;charset=utf-8");
  });
});
