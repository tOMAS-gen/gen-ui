import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, it } from "vitest";
import { GenUIProvider } from "../src";
import { ExamplesApp } from "../playground/src/examples/ExamplesApp";
import {
  readLocation,
  examplePlatforms,
  screens,
  sourceFiles,
} from "../playground/src/catalog-data";

afterEach(cleanup);

it("cada pantalla ofrece las fuentes de su plataforma original", () => {
  for (const example of screens) {
    for (const platform of ["web", "flutter"] as const) {
      const files = sourceFiles(platform, example);
      if (!example[platform]) {
        expect(files).toEqual([]);
        continue;
      }
      expect(files[0].name).toBe(example[platform]);
      expect(files.every((file) => !file.code.includes('"../../../src'))).toBe(
        true,
      );
      expect(
        files.some(
          (file) =>
            file.name ===
            (platform === "web" ? "ExamplesApp.tsx" : "pubspec.yaml"),
        ),
      ).toBe(true);
    }
  }
});

it("cada ejemplo usa una plataforma disponible sin seleccionar marcas", () => {
  for (const [page, platform] of Object.entries(examplePlatforms)) {
    history.replaceState(
      null,
      "",
      `?screen=${page}&platform=flutter&brand=gensaas`,
    );
    expect(readLocation()).toMatchObject({
      page,
      platform,
    });
  }
  history.replaceState(null, "", "/");
});

it("los enlaces inválidos vuelven a una pantalla y plataforma válidas", () => {
  history.replaceState(
    null,
    "",
    "?screen=unknown&brand=__proto__&platform=other&theme=invalid",
  );
  expect(readLocation()).toEqual({
    page: "login",
    platform: "web",
    theme: "light",
    preview: false,
  });
  history.replaceState(null, "", "/");
});

it("permite recorrer login, recuperación y registro sin conservar la confirmación", () => {
  render(
    <GenUIProvider>
      <ExamplesApp />
    </GenUIProvider>,
  );
  fireEvent.click(screen.getByRole("button", { name: "¿La olvidaste?" }));
  expect(
    screen.getByRole("heading", { name: "Recuperá tu contraseña" }),
  ).toBeTruthy();
  fireEvent.change(screen.getByLabelText("Email"), {
    target: { value: "demo@example.com" },
  });
  fireEvent.submit(
    screen.getByRole("button", { name: "Enviar enlace" }).closest("form")!,
  );
  expect(
    screen.getByText("Solicitud simulada. No se envió ningún email."),
  ).toBeTruthy();
  fireEvent.click(screen.getByRole("button", { name: "Ingresar" }));
  expect(
    screen.queryByText("Solicitud simulada. No se envió ningún email."),
  ).toBeNull();
  fireEvent.click(screen.getByRole("button", { name: "Crear cuenta" }));
  expect(screen.getByLabelText("Nombre completo")).toBeTruthy();
});
