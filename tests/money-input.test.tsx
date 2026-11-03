import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { useState } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Field } from "../src/components/Field";
import { MoneyInput, formatCents, formatMoney, moneyError, parseMoney } from "../src/components/MoneyInput";

afterEach(cleanup);

const campo = () => screen.getByRole("textbox") as HTMLInputElement;
const escribir = (texto: string) => fireEvent.change(campo(), { target: { value: texto } });

describe("formatCents / formatMoney", () => {
  it("da formato es-AR: miles con punto, coma decimal y dos decimales", () => {
    expect(formatCents(0)).toBe("0,00");
    expect(formatCents(5)).toBe("0,05");
    expect(formatCents(123456)).toBe("1.234,56");
    expect(formatCents(100_000_000)).toBe("1.000.000,00");
  });

  it("formatMoney agrega el símbolo de la moneda", () => {
    expect(formatMoney(123456)).toBe("$ 1.234,56");
    expect(formatMoney(123456, "USD")).toBe("US$ 1.234,56");
  });

  it("no formatea lo que no son centavos enteros", () => {
    expect(formatCents(12.5)).toBe("");
    expect(formatCents(-1)).toBe("");
    expect(formatCents(Number.NaN)).toBe("");
  });
});

describe("parseMoney", () => {
  it.each([
    ["1.234,56", 123456],
    ["1234,56", 123456],
    ["1234,5", 123450],
    ["1234", 123400],
    ["1.234", 123400],
    ["1.234.567,89", 123456789],
    ["0,05", 5],
    [",5", 50],
    ["1234.56", 123456],
    ["12.5", 1250],
    ["$ 1.234,56", 123456],
    ["US$1.234,56", 123456],
    ["007", 700],
  ])("%s → %i centavos", (texto, centavos) => {
    expect(parseMoney(texto)).toBe(centavos);
  });

  it.each(["", "abc", "1,234,5", "1,234", "1.2.3", "1234.567", "12.345.67", "99999999999999"])("rechaza %j", (texto) => {
    expect(parseMoney(texto)).toBeNull();
  });

  it("nunca pasa por un flotante: 19,99 son 1999 centavos", () => {
    expect(parseMoney("19,99")).toBe(1999);
    expect(parseMoney("0,29")).toBe(29);
    expect(parseMoney("1.005,10")).toBe(100510);
  });
});

describe("moneyError", () => {
  it("avisa de mínimo, máximo y faltante con la moneda", () => {
    expect(moneyError(500, { min: 1000 })).toBe("El importe mínimo es $ 10,00.");
    expect(moneyError(500_000, { max: 100_000, currency: "USD" })).toBe("El importe máximo es US$ 1.000,00.");
    expect(moneyError(null, { required: true })).toBe("Ingresá un importe.");
    expect(moneyError(null, {})).toBeNull();
    expect(moneyError(1000, { min: 1000, max: 1000 })).toBeNull();
  });
});

describe("MoneyInput", () => {
  it("da formato mientras se escribe y entrega centavos enteros", () => {
    const onChange = vi.fn();
    render(<MoneyInput onChange={onChange} aria-label="Precio" />);

    escribir("1234,5");
    expect(campo().value).toBe("1.234,5");
    expect(onChange).toHaveBeenLastCalledWith(123450);

    escribir("1.234,56");
    expect(onChange).toHaveBeenLastCalledWith(123456);

    escribir("19,99");
    expect(onChange).toHaveBeenLastCalledWith(1999);
  });

  it("completa los centavos al salir del campo", () => {
    render(<MoneyInput defaultValue={null} aria-label="Precio" />);
    escribir("1234,5");
    fireEvent.blur(campo());
    expect(campo().value).toBe("1.234,50");

    escribir("12");
    fireEvent.blur(campo());
    expect(campo().value).toBe("12,00");
  });

  it("limita a dos decimales, quita ceros a la izquierda y descarta lo que no es número", () => {
    render(<MoneyInput aria-label="Precio" />);
    escribir("1,239");
    expect(campo().value).toBe("1,23");
    escribir("007");
    expect(campo().value).toBe("7");
    escribir("ab12x");
    expect(campo().value).toBe("12");
    escribir(",");
    expect(campo().value).toBe("0,");
  });

  it("toma el punto del teclado numérico al final como coma decimal", () => {
    const onChange = vi.fn();
    render(<MoneyInput onChange={onChange} aria-label="Precio" />);
    escribir("12.");
    expect(campo().value).toBe("12,");
    escribir("12,5");
    expect(onChange).toHaveBeenLastCalledWith(1250);
  });

  it("vaciar el campo entrega null", () => {
    const onChange = vi.fn();
    render(<MoneyInput defaultValue={5000} onChange={onChange} aria-label="Precio" />);
    expect(campo().value).toBe("50,00");
    escribir("");
    expect(onChange).toHaveBeenLastCalledWith(null);
    expect(campo().value).toBe("");
  });

  it("controlado: muestra el valor y sigue los cambios de afuera", () => {
    function Controlado() {
      const [v, setV] = useState<number | null>(123456);
      return (
        <>
          <MoneyInput value={v} onChange={setV} aria-label="Precio" />
          <button onClick={() => setV(5000)}>Poner 50</button>
          <output>{String(v)}</output>
        </>
      );
    }
    render(<Controlado />);
    expect(campo().value).toBe("1.234,56");

    escribir("2.000");
    expect(screen.getByRole("status").textContent).toBe("200000");

    fireEvent.click(screen.getByRole("button", { name: "Poner 50" }));
    expect(campo().value).toBe("50,00");
  });

  it("controlado: un valor que no son centavos enteros se toma como vacío, sin romper", () => {
    render(<MoneyInput value={12.5} aria-label="Precio" />);
    expect(campo().value).toBe("");
  });

  it("muestra el símbolo y el código de la moneda, y la anuncia", () => {
    const { rerender } = render(<MoneyInput aria-label="Precio" />);
    expect(screen.getByText("$")).toBeTruthy();
    expect(screen.getByText("ARS")).toBeTruthy();
    expect(campo().getAttribute("aria-describedby")).toContain("money-currency");
    expect(screen.getByText("Importe en pesos argentinos")).toBeTruthy();

    rerender(<MoneyInput currency="USD" aria-label="Precio" />);
    expect(screen.getByText("US$")).toBeTruthy();
    expect(screen.getByText("Importe en dólares estadounidenses")).toBeTruthy();
  });

  it("pegar un importe con otro formato lo convierte", () => {
    const onChange = vi.fn();
    render(<MoneyInput onChange={onChange} aria-label="Precio" />);
    fireEvent.paste(campo(), { clipboardData: { getData: () => "1234.56" } });
    expect(campo().value).toBe("1.234,56");
    expect(onChange).toHaveBeenLastCalledWith(123456);
  });

  it("fuera de rango se marca inválido al salir, con su mensaje", () => {
    render(<MoneyInput min={1000} max={100_000} aria-label="Precio" />);
    escribir("5");
    expect(campo().getAttribute("aria-invalid")).toBeNull();

    fireEvent.blur(campo());
    expect(campo().getAttribute("aria-invalid")).toBe("true");
    expect(campo().className).toContain("input-error");
    const mensaje = screen.getByText("El importe mínimo es $ 10,00.");
    expect(campo().getAttribute("aria-describedby")).toContain(mensaje.id);

    escribir("2.000");
    expect(screen.getByText("El importe máximo es $ 1.000,00.")).toBeTruthy();

    escribir("500");
    expect(campo().getAttribute("aria-invalid")).toBeNull();
    expect(screen.queryByText(/El importe/)).toBeNull();
  });

  it("`required` avisa si queda vacío al salir", () => {
    render(<MoneyInput required aria-label="Precio" />);
    fireEvent.blur(campo());
    expect(screen.getByText("Ingresá un importe.")).toBeTruthy();
  });

  it("`error` y `invalid` marcan el campo", () => {
    const { rerender } = render(<MoneyInput error="Ya existe un precio vigente." aria-label="Precio" />);
    expect(screen.getByText("Ya existe un precio vigente.")).toBeTruthy();
    expect(campo().getAttribute("aria-invalid")).toBe("true");

    rerender(<MoneyInput invalid aria-label="Precio" />);
    expect(campo().getAttribute("aria-invalid")).toBe("true");
  });

  it("dentro de un Field toma el id, la etiqueta y la ayuda, y no repite el error del Field", () => {
    const { rerender } = render(
      <Field label="Precio mensual" hint="Sin IVA.">
        <MoneyInput currency="USD" />
      </Field>,
    );
    const input = screen.getByLabelText("Precio mensual") as HTMLInputElement;
    expect(input).toBe(campo());
    expect(input.getAttribute("aria-describedby")).toContain("-hint");

    rerender(
      <Field label="Precio mensual" error="Falta el precio.">
        <MoneyInput />
      </Field>,
    );
    expect(screen.getAllByText("Falta el precio.")).toHaveLength(1);
    expect(campo().getAttribute("aria-invalid")).toBe("true");
  });

  it("con `name`, el formulario envía los centavos", () => {
    const { container } = render(<MoneyInput name="precio" defaultValue={123456} aria-label="Precio" />);
    const oculto = container.querySelector('input[type="hidden"][name="precio"]') as HTMLInputElement;
    expect(oculto.value).toBe("123456");
    escribir("");
    expect(oculto.value).toBe("");
    expect(campo().getAttribute("name")).toBeNull();
  });

  it("deshabilitado y de solo lectura", () => {
    const { rerender } = render(<MoneyInput disabled defaultValue={100} aria-label="Precio" />);
    expect(campo().disabled).toBe(true);
    rerender(<MoneyInput readOnly defaultValue={100} aria-label="Precio" />);
    expect(campo().readOnly).toBe(true);
  });
});
