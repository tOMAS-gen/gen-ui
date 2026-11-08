import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { CodeBlock, InlineCode, shortenMiddle } from "../src/components/Code";
import { IconButton } from "../src/components/Button";
import * as paquete from "../src";

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

const HASH = "9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08"; // SHA-256 de "test"
const COMANDO = ["gcloud kms asymmetric-sign \\", "  --location=global \\", "  --input-file=manifiesto.json"].join("\n");

let copiado: string[];
beforeEach(() => {
  copiado = [];
  Object.defineProperty(navigator, "clipboard", {
    configurable: true,
    value: {
      writeText: vi.fn(async (texto: string) => {
        copiado.push(texto);
      }),
    },
  });
});

describe("shortenMiddle", () => {
  it("deja el principio y el final, en `max` caracteres con la elipsis", () => {
    const corto = shortenMiddle(HASH, 17);
    expect(corto).toEqual({ head: "9f86d081", tail: "b0f00a08" });
    expect(corto!.head.length + 1 + corto!.tail.length).toBe(17);
  });

  it("no recorta lo que entra entero ni un máximo absurdo", () => {
    expect(shortenMiddle("abc", 3)).toBeNull();
    expect(shortenMiddle(HASH, 64)).toBeNull();
    expect(shortenMiddle(HASH, 2)).toBeNull();
  });
});

describe("InlineCode", () => {
  it("sin opciones es un <code> pelado, para que fluya con el texto", () => {
    const { container } = render(<p>Clave <InlineCode>key-2026-11</InlineCode> activa</p>);
    const code = container.querySelector("code")!;
    expect(code.textContent).toBe("key-2026-11");
    expect(code.className).toBe("code-inline");
    expect(code.parentElement!.tagName).toBe("P");
    expect(screen.queryByRole("button")).toBeNull();
  });

  it("recorta el hash a la vista, pero lo entero queda para el lector de pantalla y en el title", () => {
    const { container } = render(<InlineCode maxChars={17}>{HASH}</InlineCode>);
    const code = container.querySelector("code")!;
    expect(code.querySelector("[aria-hidden='true']")!.textContent).toBe("9f86d081…b0f00a08");
    expect(code.querySelector(".visually-hidden")!.textContent).toBe(HASH);
    expect(code.getAttribute("title")).toBe(HASH);
  });

  it("'Ver completo' muestra el hash entero y 'Ver menos' lo vuelve a recortar", () => {
    const { container } = render(<InlineCode maxChars={17}>{HASH}</InlineCode>);
    const boton = screen.getByRole("button", { name: "Ver completo" });
    expect(boton.getAttribute("aria-expanded")).toBe("false");

    fireEvent.click(boton);
    expect(container.querySelector("code")!.textContent).toBe(HASH);
    expect(container.querySelector("code [aria-hidden]")).toBeNull();
    expect(screen.getByRole("button", { name: "Ver menos" }).getAttribute("aria-expanded")).toBe("true");

    fireEvent.click(screen.getByRole("button", { name: "Ver menos" }));
    expect(container.querySelector("code [aria-hidden]")).not.toBeNull();
  });

  it("un valor que entra no lleva botón de ver completo", () => {
    render(<InlineCode maxChars={40}>abc123</InlineCode>);
    expect(screen.queryByRole("button")).toBeNull();
  });

  it("copia el valor entero aunque se vea recortado, y lo confirma con un aviso", async () => {
    vi.useFakeTimers();
    render(
      <InlineCode copy copyLabel="Copiar hash" maxChars={17}>
        {HASH}
      </InlineCode>,
    );
    const estado = screen.getByRole("status");
    expect(estado.textContent).toBe("");

    await act(async () => fireEvent.click(screen.getByRole("button", { name: "Copiar hash" })));
    expect(copiado).toEqual([HASH]);
    expect(estado.textContent).toBe("Copiado");

    act(() => vi.advanceTimersByTime(2000));
    expect(estado.textContent).toBe("");
  });

  it("si el navegador no deja copiar, lo dice", async () => {
    navigator.clipboard.writeText = vi.fn(async () => {
      throw new Error("denegado");
    });
    render(<InlineCode copy>{HASH}</InlineCode>);

    await act(async () => fireEvent.click(screen.getByRole("button", { name: "Copiar" })));

    expect(screen.getByRole("status").textContent).toBe("No se pudo copiar");
  });

  it("acepta textos propios para los avisos", async () => {
    render(
      <InlineCode copy copyLabel="Copy" copiedLabel="Copied">
        key-1
      </InlineCode>,
    );
    await act(async () => fireEvent.click(screen.getByRole("button", { name: "Copy" })));
    expect(screen.getByRole("status").textContent).toBe("Copied");
  });
});

describe("CodeBlock", () => {
  it("muestra el comando con sus saltos de línea en <pre><code>", () => {
    const { container } = render(<CodeBlock>{COMANDO}</CodeBlock>);
    const pre = container.querySelector("pre")!;
    expect(pre.querySelector("code")!.textContent).toBe(COMANDO);
    expect(container.querySelector(".code-block-head")).toBeNull(); // sin rótulo ni copiar, no hay encabezado
  });

  it("es una región con nombre y foco, para scrollear con el teclado", () => {
    render(<CodeBlock label="Cloud Shell">{COMANDO}</CodeBlock>);
    const region = screen.getByRole("region", { name: "Cloud Shell" });
    expect(region.tagName).toBe("PRE");
    expect(region.getAttribute("tabindex")).toBe("0");
  });

  it("sin rótulo, la región se llama «Código»", () => {
    render(<CodeBlock>ls</CodeBlock>);
    expect(screen.getByRole("region", { name: "Código" })).toBeTruthy();
  });

  it("copia el texto completo y el botón confirma", async () => {
    vi.useFakeTimers();
    render(
      <CodeBlock label="Cloud Shell" copy copyLabel="Copiar comando">
        {COMANDO}
      </CodeBlock>,
    );
    await act(async () => fireEvent.click(screen.getByRole("button", { name: "Copiar comando" })));
    expect(copiado).toEqual([COMANDO]);
    expect(screen.getByRole("button", { name: "Copiado" })).toBeTruthy();

    act(() => vi.advanceTimersByTime(2000));
    expect(screen.getByRole("button", { name: "Copiar comando" })).toBeTruthy();
  });

  it("sin `copy` no hay botón", () => {
    render(<CodeBlock label="Cloud Shell">{COMANDO}</CodeBlock>);
    expect(screen.queryByRole("button")).toBeNull();
  });

  it("`wrap` y `maxHeight` cambian cómo se acomoda, no el contenido", () => {
    const { container } = render(
      <CodeBlock wrap maxHeight={120}>
        {COMANDO}
      </CodeBlock>,
    );
    expect(container.querySelector(".code-block")!.classList.contains("is-wrap")).toBe(true);
    expect(container.querySelector("pre")!.style.maxHeight).toBe("120px");
    expect(container.querySelector("code")!.textContent).toBe(COMANDO);
  });
});

describe("IconButton size", () => {
  it("`sm` suma el modificador y por defecto no", () => {
    render(
      <>
        <IconButton label="chico" size="sm">x</IconButton>
        <IconButton label="normal">x</IconButton>
      </>,
    );
    expect(screen.getByRole("button", { name: "chico" }).className).toBe("icon-btn icon-btn-sm");
    expect(screen.getByRole("button", { name: "normal" }).className).toBe("icon-btn");
  });
});

describe("exportaciones", () => {
  it("el paquete exporta InlineCode, CodeBlock y shortenMiddle, y no pisa el ícono Code", () => {
    expect(typeof paquete.InlineCode).toBe("function");
    expect(typeof paquete.CodeBlock).toBe("function");
    expect(typeof paquete.shortenMiddle).toBe("function");
    expect("Code" in paquete).toBe(false);
  });
});
