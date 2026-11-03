import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { useState } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Field } from "../src/components/Field";
import { FileUpload, acceptsFile, checkFiles, describeAccept, formatFileSize } from "../src/components/FileUpload";

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

const MB = 1024 * 1024;

/** Un archivo de prueba con el peso que se pida, sin crear el contenido. */
function archivo(name: string, type: string, size = 1000, lastModified = 1): File {
  const f = new File(["x"], name, { type, lastModified });
  Object.defineProperty(f, "size", { value: size });
  return f;
}
const pdf = (name = "comprobante.pdf", size = 2 * MB) => archivo(name, "application/pdf", size);
const png = (name = "foto.png", size = 500_000) => archivo(name, "image/png", size);

const area = () => screen.getByRole("button", { name: /Elegir/ }) as HTMLButtonElement;
const selector = (c: HTMLElement) => c.querySelector('input[type="file"]') as HTMLInputElement;
const elegir = (c: HTMLElement, ...files: File[]) => fireEvent.change(selector(c), { target: { files } });
const soltar = (files: File[], el: HTMLElement = area()) => fireEvent.drop(el, { dataTransfer: { files, types: ["Files"] } });

describe("formatFileSize", () => {
  it("usa unidades legibles con coma decimal", () => {
    expect(formatFileSize(0)).toBe("0 B");
    expect(formatFileSize(850)).toBe("850 B");
    expect(formatFileSize(1536)).toBe("1,5 KB");
    expect(formatFileSize(5 * MB)).toBe("5 MB");
    expect(formatFileSize(1_258_291)).toBe("1,2 MB");
    expect(formatFileSize(3 * 1024 * MB)).toBe("3 GB");
    expect(formatFileSize(-1)).toBe("");
  });
});

describe("accept", () => {
  it("describeAccept nombra los tipos sin repetirlos", () => {
    expect(describeAccept(".pdf,image/png,image/jpeg")).toEqual(["PDF", "PNG", "JPG"]);
    expect(describeAccept("application/pdf,.pdf")).toEqual(["PDF"]);
    expect(describeAccept("image/*")).toEqual(["imágenes"]);
    expect(describeAccept(undefined)).toEqual([]);
  });

  it("acceptsFile entiende extensiones, tipos exactos y familias", () => {
    expect(acceptsFile({ name: "A.PDF", type: "" }, ".pdf")).toBe(true);
    expect(acceptsFile({ name: "a.png", type: "image/png" }, "image/png,application/pdf")).toBe(true);
    expect(acceptsFile({ name: "a.webp", type: "image/webp" }, "image/*")).toBe(true);
    expect(acceptsFile({ name: "a.exe", type: "application/x-msdownload" }, "image/*,.pdf")).toBe(false);
    expect(acceptsFile({ name: "a.exe", type: "" }, undefined)).toBe(true);
  });

  it("checkFiles rechaza por tipo, por peso y por cantidad, con un mensaje claro cada una", () => {
    const { accepted, rejected } = checkFiles(
      [pdf("ok.pdf", MB), archivo("virus.exe", "application/x-msdownload"), png("grande.png", 8 * MB + 200_000), pdf("otro.pdf", MB)],
      { accept: ".pdf,image/png,image/jpeg", maxSize: 5 * MB, maxFiles: 1 },
    );
    expect(accepted.map((f) => f.name)).toEqual(["ok.pdf"]);
    expect(rejected.map((r) => [r.reason, r.message])).toEqual([
      ["type", '"virus.exe" no es un tipo de archivo permitido. Probá con PDF, PNG o JPG.'],
      ["size", '"grande.png" pesa 8,2 MB y el máximo es 5 MB.'],
      ["count", 'Podés elegir hasta 1 archivo. "otro.pdf" quedó afuera.'],
    ]);
  });

  it("checkFiles no repite los archivos que ya están", () => {
    const a = pdf();
    const { accepted, rejected } = checkFiles([pdf(), png()], { current: [a] });
    expect(accepted.map((f) => f.name)).toEqual(["foto.png"]);
    expect(rejected).toEqual([]);
  });
});

describe("FileUpload", () => {
  it("el área es un botón real y la ayuda sale de accept y maxSize", () => {
    render(<FileUpload accept=".pdf,image/png,image/jpeg" maxSize={5 * MB} />);
    const boton = area();
    expect(boton.tagName).toBe("BUTTON");
    expect(boton.getAttribute("type")).toBe("button");
    const ayuda = screen.getByText("PDF, PNG o JPG · hasta 5 MB");
    expect(boton.getAttribute("aria-describedby")).toContain(ayuda.id);
  });

  it("el botón abre el selector de archivos", () => {
    const click = vi.spyOn(HTMLInputElement.prototype, "click").mockImplementation(() => {});
    render(<FileUpload />);
    fireEvent.click(area());
    expect(click).toHaveBeenCalledTimes(1);
  });

  it("elegir un archivo lo lista con nombre y peso, y se puede quitar", () => {
    const onChange = vi.fn();
    const { container } = render(<FileUpload accept="application/pdf" onChange={onChange} />);

    elegir(container, pdf("comprobante.pdf", 1_258_291));
    expect(onChange).toHaveBeenLastCalledWith([expect.objectContaining({ name: "comprobante.pdf" })]);
    const lista = screen.getByRole("list", { name: "Archivos elegidos" });
    expect(within(lista).getByText("comprobante.pdf")).toBeTruthy();
    expect(within(lista).getByText("1,2 MB")).toBeTruthy();
    expect(area().textContent).toContain("Elegir otro archivo");

    fireEvent.click(screen.getByRole("button", { name: "Quitar comprobante.pdf" }));
    expect(onChange).toHaveBeenLastCalledWith([]);
    expect(screen.queryByRole("list", { name: "Archivos elegidos" })).toBeNull();
    // El foco vuelve al área para seguir con el teclado.
    expect(document.activeElement).toBe(area());
  });

  it("un tipo no permitido muestra el error, avisa por onReject y no cambia nada", () => {
    const onChange = vi.fn();
    const onReject = vi.fn();
    const { container } = render(<FileUpload accept=".pdf,image/png" onChange={onChange} onReject={onReject} />);

    elegir(container, archivo("planilla.xlsx", "application/vnd.ms-excel"));

    const error = screen.getByRole("alert");
    expect(error.textContent).toContain('"planilla.xlsx" no es un tipo de archivo permitido. Probá con PDF o PNG.');
    expect(area().getAttribute("aria-describedby")).toContain(error.id);
    expect(area().className).toContain("is-invalid");
    expect(onChange).not.toHaveBeenCalled();
    expect(onReject).toHaveBeenCalledWith([expect.objectContaining({ reason: "type" })]);
  });

  it("un archivo muy pesado muestra cuánto pesa y cuál es el máximo; el siguiente archivo válido limpia el error", () => {
    const { container } = render(<FileUpload maxSize={5 * MB} />);

    elegir(container, pdf("pesado.pdf", 12 * MB));
    expect(screen.getByRole("alert").textContent).toContain('"pesado.pdf" pesa 12 MB y el máximo es 5 MB.');

    elegir(container, pdf("liviano.pdf", MB));
    expect(screen.queryByRole("alert")).toBeNull();
    expect(screen.getByText("liviano.pdf")).toBeTruthy();
  });

  it("de un solo archivo, el nuevo reemplaza al anterior", () => {
    const onChange = vi.fn();
    const { container } = render(<FileUpload onChange={onChange} />);
    elegir(container, pdf("uno.pdf"));
    elegir(container, pdf("dos.pdf"));

    expect(onChange).toHaveBeenLastCalledWith([expect.objectContaining({ name: "dos.pdf" })]);
    expect(screen.queryByText("uno.pdf")).toBeNull();
    expect(screen.getByText("dos.pdf")).toBeTruthy();
  });

  it("con multiple suma archivos, respeta maxFiles y acepta los válidos aunque haya otros rechazados", () => {
    const onChange = vi.fn();
    const { container } = render(<FileUpload multiple maxFiles={2} accept="image/png" onChange={onChange} />);
    expect(area().textContent).toContain("Elegir archivos");
    expect(selector(container).multiple).toBe(true);

    elegir(container, png("a.png"), pdf("b.pdf"));
    expect(screen.getByText("a.png")).toBeTruthy();
    expect(screen.getByRole("alert").textContent).toContain("b.pdf");

    elegir(container, png("c.png", 1000), png("d.png", 2000));
    expect(onChange).toHaveBeenLastCalledWith([expect.objectContaining({ name: "a.png" }), expect.objectContaining({ name: "c.png" })]);
    expect(screen.getByRole("alert").textContent).toContain("Podés elegir hasta 2 archivos");
  });

  it("arrastrar encima marca el área; soltar agrega los archivos", () => {
    const onChange = vi.fn();
    render(<FileUpload onChange={onChange} />);

    fireEvent.dragEnter(area(), { dataTransfer: { types: ["Files"] } });
    expect(area().className).toContain("is-dragging");
    expect(area().textContent).toContain("Soltalo acá para agregarlo");
    // El nombre accesible del botón no cambia mientras se arrastra.
    expect(area().textContent).toContain("Elegir archivo");

    fireEvent.dragLeave(area());
    expect(area().className).not.toContain("is-dragging");

    fireEvent.dragEnter(area(), { dataTransfer: { types: ["Files"] } });
    soltar([pdf("arrastrado.pdf")]);
    expect(area().className).not.toContain("is-dragging");
    expect(onChange).toHaveBeenCalledWith([expect.objectContaining({ name: "arrastrado.pdf" })]);
  });

  it("arrastrar texto o enlaces (que no son archivos) no hace nada", () => {
    render(<FileUpload />);
    fireEvent.dragEnter(area(), { dataTransfer: { types: ["text/plain"] } });
    expect(area().className).not.toContain("is-dragging");
  });

  it("el arrastre pasa por los hijos del área sin apagar el resaltado", () => {
    render(<FileUpload />);
    const hijo = area().querySelector("span") as HTMLElement;
    fireEvent.dragEnter(area(), { dataTransfer: { types: ["Files"] } });
    fireEvent.dragEnter(hijo, { dataTransfer: { types: ["Files"] } });
    fireEvent.dragLeave(area());
    expect(area().className).toContain("is-dragging");
    fireEvent.dragLeave(hijo);
    expect(area().className).not.toContain("is-dragging");
  });

  it("deshabilitado: no abre el selector ni acepta archivos soltados", () => {
    const click = vi.spyOn(HTMLInputElement.prototype, "click").mockImplementation(() => {});
    const onChange = vi.fn();
    render(<FileUpload disabled onChange={onChange} />);
    expect(area().disabled).toBe(true);
    fireEvent.click(area());
    soltar([pdf()]);
    expect(click).not.toHaveBeenCalled();
    expect(onChange).not.toHaveBeenCalled();
  });

  it("subiendo: muestra el avance, bloquea agregar y quitar, pero el área sigue enfocable", () => {
    const click = vi.spyOn(HTMLInputElement.prototype, "click").mockImplementation(() => {});
    const onChange = vi.fn();
    render(<FileUpload defaultValue={[pdf("subiendo.pdf")]} progress={42} onChange={onChange} />);

    const barra = screen.getByRole("progressbar", { name: "Progreso de la subida" });
    expect(barra.getAttribute("aria-valuenow")).toBe("42");
    expect(screen.getByText("Subiendo… 42%")).toBeTruthy();
    expect(area().disabled).toBe(false);
    expect(area().getAttribute("aria-disabled")).toBe("true");
    expect((screen.getByRole("button", { name: "Quitar subiendo.pdf" }) as HTMLButtonElement).disabled).toBe(true);

    fireEvent.click(area());
    soltar([png()]);
    expect(click).not.toHaveBeenCalled();
    expect(onChange).not.toHaveBeenCalled();
  });

  it("subiendo sin porcentaje muestra un aviso, y al terminar (100) desaparece", () => {
    const { rerender } = render(<FileUpload uploading defaultValue={[pdf()]} />);
    expect(screen.getByText("Subiendo…", { selector: ".file-upload-wait" })).toBeTruthy();
    expect(screen.queryByRole("progressbar")).toBeNull();

    rerender(<FileUpload progress={100} defaultValue={[pdf()]} />);
    expect(screen.queryByRole("progressbar")).toBeNull();
    expect((screen.getByRole("button", { name: "Quitar comprobante.pdf" }) as HTMLButtonElement).disabled).toBe(false);
  });

  it("controlado: muestra lo que le pasan y avisa los cambios", () => {
    function Controlado() {
      const [files, setFiles] = useState<File[]>([pdf("inicial.pdf")]);
      return (
        <>
          <FileUpload value={files} onChange={setFiles} />
          <button onClick={() => setFiles([])}>Vaciar</button>
        </>
      );
    }
    const { container } = render(<Controlado />);
    expect(screen.getByText("inicial.pdf")).toBeTruthy();

    elegir(container, pdf("nuevo.pdf"));
    expect(screen.getByText("nuevo.pdf")).toBeTruthy();
    expect(screen.queryByText("inicial.pdf")).toBeNull();

    fireEvent.click(screen.getByRole("button", { name: "Vaciar" }));
    expect(screen.queryByRole("list", { name: "Archivos elegidos" })).toBeNull();
  });

  it("un error de afuera (el del servidor) se muestra y marca el área", () => {
    render(<FileUpload error="No pudimos subir el archivo. Probá de nuevo." />);
    expect(screen.getByRole("alert").textContent).toContain("No pudimos subir el archivo. Probá de nuevo.");
    expect(area().className).toContain("is-invalid");
  });

  it("dentro de un Field toma la etiqueta como nombre y queda descrito por la ayuda del Field", () => {
    render(
      <Field label="Comprobante" hint="Subí la constancia de la transferencia.">
        <FileUpload accept=".pdf" />
      </Field>,
    );
    const boton = screen.getByLabelText("Comprobante");
    expect(boton.tagName).toBe("BUTTON");
    expect(boton.className).toContain("file-upload-area");
    expect(boton.getAttribute("aria-describedby")).toContain("-hint");
  });

  it("con name, el selector oculto lleva el nombre para el formulario", () => {
    const { container } = render(<FileUpload name="comprobante" />);
    expect(selector(container).getAttribute("name")).toBe("comprobante");
    expect(selector(container).hidden).toBe(true);
  });

  it("la ayuda se puede reemplazar o quitar", () => {
    const { rerender } = render(<FileUpload accept=".pdf" hint="Solo el PDF del banco." />);
    expect(screen.getByText("Solo el PDF del banco.")).toBeTruthy();
    rerender(<FileUpload />);
    expect(document.querySelector(".field-hint")).toBeNull();
  });
});
