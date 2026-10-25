// @vitest-environment node
// Los correos se arman del lado del servidor (react-dom/server), sin DOM.
import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { render, toPlainText } from "react-email";
import { describe, expect, it } from "vitest";
import {
  EmailButton,
  EmailCode,
  EmailDivider,
  EmailHeading,
  EmailLayout,
  EmailText,
  emailThemes,
  type EmailBrand,
} from "../src/email";
import { EjemploInvitacion, MARCA_GALERIA } from "../playground/src/examples/EmailExamples";

const AVISO = "Este es un correo automático, no lo respondas.";

function Ejemplo({ marca }: { marca: EmailBrand }) {
  return (
    <EmailLayout marca={marca} preview="Vista previa del correo">
      <EmailHeading>Hola, Tomi</EmailHeading>
      <EmailText>Te invitaron al panel de ›gen.</EmailText>
    </EmailLayout>
  );
}

describe("emailThemes", () => {
  it("toma los colores de los temas de la librería", () => {
    expect(emailThemes.gen.accent).toBe("#e52713");
    expect(emailThemes.genstock.accent).toBe("#13e28e");
    expect(emailThemes.genwork.accent).toBe("#3b5bfa");
    expect(emailThemes.ui.accent).toBe("#f97316");
  });

  it("usa colores fijos, sin variables CSS (los clientes de correo no las soportan)", () => {
    for (const tema of Object.values(emailThemes)) {
      for (const valor of Object.values(tema)) {
        if (typeof valor === "string") expect(valor).not.toContain("var(");
      }
    }
  });
});

describe("EmailLayout", () => {
  it.each(["ui", "gen", "genstock", "genwork"] as const)("arma el correo de %s con su color y el aviso al pie", async (marca) => {
    const html = await render(<Ejemplo marca={marca} />);

    expect(html).toContain('lang="es"');
    expect(html).toContain(emailThemes[marca].accentText);
    expect(html).toContain("›gen");
    expect(html).toContain(AVISO);
    expect(html).not.toContain("var(");
  });

  it("muestra el producto al lado del logotipo, salvo en gen", async () => {
    const gen = await render(<Ejemplo marca="gen" />);
    const genstock = await render(<Ejemplo marca="genstock" />);

    expect(genstock).toContain(">stock<");
    expect(gen).not.toContain(">saas<");
  });

  it("lleva el texto de vista previa", async () => {
    const html = await render(<Ejemplo marca="gen" />);
    expect(html).toContain("Vista previa del correo");
  });

  it("la versión en texto conserva el título, el texto y el aviso", async () => {
    const texto = toPlainText(await render(<Ejemplo marca="gen" />));

    // En la versión en texto los títulos van en mayúsculas (convención de html-to-text).
    expect(texto).toContain("HOLA, TOMI");
    expect(texto).toContain("Te invitaron al panel de ›gen.");
    expect(texto).toContain(AVISO);
  });
});

const ENLACE = "https://saas.gen.net.ar/crear-contrasena?token=abc123";

function ConPiezas({ marca }: { marca: EmailBrand }) {
  return (
    <EmailLayout marca={marca} preview="Piezas">
      <EmailButton href={ENLACE}>Crear contraseña</EmailButton>
      <EmailDivider />
      <EmailCode>{ENLACE}</EmailCode>
    </EmailLayout>
  );
}

describe("EmailButton", () => {
  it.each(["gen", "genstock", "genwork"] as const)("en %s usa el color de la marca y su texto encima", async (marca) => {
    const html = await render(<ConPiezas marca={marca} />);
    const tema = emailThemes[marca];

    expect(html).toContain(`href="${ENLACE.replaceAll("&", "&amp;")}"`);
    expect(html).toContain(`background-color:${tema.accent}`);
    expect(html).toContain(`color:${tema.onAccent}`);
    expect(html).toContain("Crear contraseña");
  });

  it("en la versión en texto queda el enlace, para quien no ve HTML", async () => {
    const texto = toPlainText(await render(<ConPiezas marca="gen" />));
    expect(texto).toContain(ENLACE);
  });
});

describe("EmailCode", () => {
  it("muestra el código en letra de ancho fijo, con borde del tema", async () => {
    const html = await render(<ConPiezas marca="genwork" />);

    // Las comillas del nombre de la fuente salen como &quot; en el HTML.
    expect(html).toMatch(/font-family:[^>]*monospace/);
    expect(html).toContain(`border:1px solid ${emailThemes.genwork.border}`);
    expect(html).toContain(">https://saas.gen.net.ar/crear-contrasena?token=abc123<");
  });
});

describe("EmailDivider", () => {
  it("es una línea con el color de borde del tema", async () => {
    const html = await render(<ConPiezas marca="gen" />);
    expect(html).toMatch(new RegExp(`<hr[^>]*${emailThemes.gen.border}`));
  });
});

describe("correo de ejemplo de la galería", () => {
  it("la galería de gen-ui muestra solo el tema UI, como el resto del catálogo (sin marcas de producto)", () => {
    expect(MARCA_GALERIA).toBe("ui");
  });

  it("la invitación se arma con todas las piezas y el logotipo ›genui", async () => {
    const html = await render(<EjemploInvitacion />);

    expect(html).toContain(emailThemes.ui.accent);
    expect(html).toContain(">ui<");
    expect(html).toContain("Crear contraseña");
    expect(html).toContain("Este es un correo automático, no lo respondas.");
  });
});

describe("dependencias", () => {
  it("fuera de src/email nada importa react-email: las apps que solo usan la interfaz no lo necesitan", () => {
    const raiz = path.resolve(__dirname, "../src");
    const archivos = (dir: string): string[] =>
      readdirSync(dir).flatMap((nombre) => {
        const ruta = path.join(dir, nombre);
        return statSync(ruta).isDirectory() ? archivos(ruta) : [ruta];
      });

    const conReactEmail = archivos(raiz)
      .filter((ruta) => !ruta.startsWith(path.join(raiz, "email")) && /\.(ts|tsx)$/.test(ruta))
      .filter((ruta) => /from ["']react-email["']/.test(readFileSync(ruta, "utf8")));

    expect(conReactEmail).toEqual([]);
  });
});
