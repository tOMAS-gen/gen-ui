import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { useState } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { initials } from "../src/components/Alert";
import { Field, Input, PasswordInput } from "../src/components/Field";
import { OtpInput, sanitizeOtp } from "../src/components/OtpInput";
import { pageWindow } from "../src/components/Pagination";
import { percentOf } from "../src/components/ProgressBar";
import { Tabs } from "../src/components/Tabs";
import { ToastProvider, showToast, useToast } from "../src/components/Toast";

afterEach(cleanup);

describe("helpers", () => {
  it("sanitizeOtp deja sólo dígitos y recorta", () => {
    expect(sanitizeOtp(" 12-34 56 7", 6)).toBe("123456");
    expect(sanitizeOtp("abc", 6)).toBe("");
  });

  it("pageWindow muestra extremos y vecinas con huecos", () => {
    expect(pageWindow(1, 3)).toEqual([1, 2, 3]);
    expect(pageWindow(5, 10)).toEqual([1, null, 4, 5, 6, null, 10]);
  });

  it("percentOf redondea y protege total 0", () => {
    expect(percentOf(1, 3)).toBe(33);
    expect(percentOf(5, 0)).toBe(0);
  });

  it("initials usa nombre o email", () => {
    expect(initials("Tomás Gentile")).toBe("TG");
    expect(initials("iara.lopez@gen.net.ar")).toBe("il");
    expect(initials("")).toBe("?");
  });
});

function OtpHarness({ onComplete }: { onComplete: (v: string) => void }) {
  const [value, setValue] = useState("");
  return <OtpInput value={value} onChange={setValue} onComplete={onComplete} />;
}

describe("OtpInput", () => {
  it("avanza al escribir y completa", () => {
    const done = vi.fn();
    render(<OtpHarness onComplete={done} />);
    const boxes = screen.getAllByRole("textbox");
    expect(boxes).toHaveLength(6);
    "123456".split("").forEach((d, i) => {
      fireEvent.change(boxes[i], { target: { value: d } });
    });
    expect(done).toHaveBeenCalledWith("123456");
    expect((boxes[5] as HTMLInputElement).value).toBe("6");
  });

  it("acepta pegar el código completo", () => {
    const done = vi.fn();
    render(<OtpHarness onComplete={done} />);
    const [first] = screen.getAllByRole("textbox");
    fireEvent.paste(first, { clipboardData: { getData: () => "654 321" } });
    expect(done).toHaveBeenCalledWith("654321");
  });

  it("Backspace en casilla vacía borra la anterior", () => {
    const done = vi.fn();
    render(<OtpHarness onComplete={done} />);
    const boxes = screen.getAllByRole("textbox");
    fireEvent.change(boxes[0], { target: { value: "1" } });
    fireEvent.change(boxes[1], { target: { value: "2" } });
    fireEvent.keyDown(boxes[2], { key: "Backspace" });
    expect((boxes[1] as HTMLInputElement).value).toBe("");
    expect((boxes[0] as HTMLInputElement).value).toBe("1");
  });
});

describe("Tabs", () => {
  it("flechas mueven la selección", () => {
    const onChange = vi.fn();
    render(
      <Tabs
        ariaLabel="Secciones"
        activeKey="a"
        onChange={onChange}
        items={[
          { key: "a", label: "A" },
          { key: "b", label: "B" },
          { key: "c", label: "C" },
        ]}
      />,
    );
    const tabs = screen.getAllByRole("tab");
    expect(tabs[0].getAttribute("aria-selected")).toBe("true");
    fireEvent.keyDown(tabs[0], { key: "ArrowLeft" });
    expect(onChange).toHaveBeenCalledWith("c");
    fireEvent.keyDown(tabs[0], { key: "End" });
    expect(onChange).toHaveBeenLastCalledWith("c");
  });
});

describe("Field", () => {
  it("vincula label, error y estado inválido al control", () => {
    render(
      <Field label="Email" error="Formato inválido">
        <Input type="email" />
      </Field>,
    );
    const input = screen.getByLabelText("Email");
    expect(input.getAttribute("aria-invalid")).toBe("true");
    const describedBy = input.getAttribute("aria-describedby")!;
    expect(document.getElementById(describedBy)?.textContent).toContain("Formato inválido");
  });

  it("PasswordInput alterna visibilidad", () => {
    render(
      <Field label="Contraseña">
        <PasswordInput />
      </Field>,
    );
    const input = screen.getByLabelText("Contraseña") as HTMLInputElement;
    expect(input.type).toBe("password");
    fireEvent.click(screen.getByRole("button", { name: "Mostrar contraseña" }));
    expect(input.type).toBe("text");
  });
});

describe("Toast", () => {
  function Trigger() {
    const { toast } = useToast();
    return <button onClick={() => toast("Guardado", "success")}>disparar</button>;
  }

  it("muestra y autocierra success; showToast usa el provider montado", () => {
    vi.useFakeTimers();
    render(
      <ToastProvider>
        <Trigger />
      </ToastProvider>,
    );
    fireEvent.click(screen.getByText("disparar"));
    expect(screen.getByText("Guardado")).toBeTruthy();
    act(() => {
      showToast({ message: "Con link", href: "/x" });
    });
    expect(screen.getByText("Con link")).toBeTruthy();
    act(() => {
      vi.advanceTimersByTime(3500);
    });
    expect(screen.queryByText("Guardado")).toBeNull();
    expect(screen.getByText("Con link")).toBeTruthy();
    vi.useRealTimers();
  });
});
