import {
  cleanup,
  fireEvent,
  render,
  screen,
  within,
} from "@testing-library/react";
import { useState } from "react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { ButtonLink } from "../src";
import { Catalog } from "../playground/src/Catalog";
import { readLocation } from "../playground/src/catalog-data";

let mobile = false;
beforeEach(() => {
  const storage = new Map<string, string>();
  vi.stubGlobal("localStorage", {
    getItem: (key: string) => storage.get(key) ?? null,
    setItem: (key: string, value: string) => storage.set(key, value),
    removeItem: (key: string) => storage.delete(key),
    clear: () => storage.clear(),
  });
  vi.stubGlobal("matchMedia", (query: string) => ({
    matches: mobile && query.includes("max-width"),
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  }));
  // jsdom no calcula geometría: modelar los controles ocultos del drawer móvil.
  vi.spyOn(HTMLElement.prototype, "getClientRects").mockImplementation(
    function (this: HTMLElement) {
      const hidden =
        mobile &&
        (this.classList.contains("drawer-collapse-desktop") ||
          this.classList.contains("sidebar-resize-handle"));
      return (hidden
        ? []
        : [new DOMRect(0, 0, 44, 44)]) as unknown as DOMRectList;
    },
  );
});
afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  mobile = false;
});

function Harness() {
  const [route, setRoute] = useState<ReturnType<typeof readLocation>>({
    page: "start",
    platform: "web",
    theme: "light",
    preview: false,
  });
  return (
    <Catalog
      route={route}
      onRoute={(changes) =>
        setRoute((previous) => ({ ...previous, ...changes }))
      }
    />
  );
}

it("el catálogo conserva ancho y colapso del drawer compartido", () => {
  render(<Harness />);
  const resize = screen.getByRole("separator", {
    name: "Redimensionar menú lateral",
  });
  fireEvent.keyDown(resize, { key: "ArrowRight" });
  expect(resize.getAttribute("aria-valuenow")).toBe("256");
  fireEvent.click(screen.getByRole("button", { name: "Ocultar menú" }));
  expect(window.localStorage.getItem("gen-ui-catalog:drawer-collapsed")).toBe(
    "1",
  );
  expect(
    screen.queryByRole("searchbox", { name: "Buscar pantallas" }),
  ).toBeNull();
  fireEvent.click(screen.getByRole("button", { name: "Mostrar menú" }));
  expect(screen.getByRole("separator").getAttribute("aria-valuenow")).toBe(
    "256",
  );
  fireEvent.click(
    screen
      .getByRole("navigation", { name: "Documentación" })
      .querySelector('a[href*="screen=dashboard"]')!,
  );
  expect(screen.getByRole("heading", { name: "Proyectos" })).toBeTruthy();
});

it("el drawer móvil retiene el foco después de filtrar y lo devuelve al cerrar", () => {
  mobile = true;
  render(<Harness />);
  const trigger = screen.getByRole("button", { name: "Abrir menú" });
  fireEvent.click(trigger);
  const drawer = screen.getByRole("dialog", { name: "Menú" });
  expect(document.body.style.overflow).toBe("hidden");
  // El último enlace del menú, sea cual sea la última pantalla del catálogo.
  const last = within(drawer).getAllByRole("link").at(-1)!;
  last.focus();
  fireEvent.keyDown(last, { key: "Tab" });
  expect(document.activeElement).toBe(
    within(drawer).getByRole("button", { name: "Cerrar menú" }),
  );
  fireEvent.change(within(drawer).getByRole("searchbox"), {
    target: { value: "inexistente" },
  });
  const reset = within(drawer)
    .getAllByRole("button", { name: "Limpiar búsqueda" })
    .at(-1)!;
  reset.focus();
  fireEvent.keyDown(reset, { key: "Tab" });
  expect(document.activeElement).toBe(
    within(drawer).getByRole("button", { name: "Cerrar menú" }),
  );
  fireEvent.keyDown(drawer, { key: "Escape" });
  expect(screen.queryByRole("dialog")).toBeNull();
  expect(document.activeElement).toBe(trigger);
  expect(document.body.style.overflow).toBe("");
  expect(drawer.hasAttribute("inert")).toBe(true);
});

it("navegar desde el drawer móvil cierra el menú sin perder la selección", () => {
  mobile = true;
  render(<Harness />);
  fireEvent.click(screen.getByRole("button", { name: "Abrir menú" }));
  fireEvent.click(
    within(screen.getByRole("dialog")).getByRole("link", {
      name: "Panel de administración",
    }),
  );
  expect(screen.queryByRole("dialog")).toBeNull();
  expect(
    screen.getByRole("heading", { name: "Panel de administración" }),
  ).toBeTruthy();
  expect(
    screen
      .getByRole("navigation", { name: "Documentación" })
      .querySelector('[aria-current="page"]')?.textContent,
  ).toBe("Panel de administración");
});

it("ButtonLink permite abrir previews en otra pestaña", () => {
  render(
    <ButtonLink href="/preview" target="_blank" rel="noreferrer">
      Abrir
    </ButtonLink>,
  );
  expect(screen.getByRole("link").getAttribute("target")).toBe("_blank");
  expect(screen.getByRole("link").getAttribute("rel")).toBe("noreferrer");
});

it("el rail muestra etiquetas fuera del scroll y las cierra con Escape", () => {
  render(<Harness />);
  fireEvent.click(screen.getByRole("button", { name: "Ocultar menú" }));
  const link = screen.getByRole("link", { name: "Proyectos" });
  fireEvent.focusIn(link);
  const tooltip = document.querySelector(".rail-tooltip");
  expect(tooltip?.textContent).toBe("Proyectos");
  expect(tooltip?.parentElement).toBe(document.body);
  fireEvent.keyDown(link, { key: "Escape" });
  expect(document.querySelector(".rail-tooltip")).toBeNull();
});
