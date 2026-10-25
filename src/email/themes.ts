// Temas de correo: los mismos colores de `src/themes/*.css` y `src/styles/tokens.css` (tema claro), pero como
// valores fijos. Los clientes de correo no soportan variables CSS ni modo oscuro confiable.

export type EmailBrand = "gen" | "genstock" | "genwork";

export type EmailTheme = {
  /** Color de la marca: botones y detalles. */
  accent: string;
  /** Marca sobre fondo claro con contraste para texto (logotipo, enlaces). */
  accentText: string;
  /** Texto sobre `accent`. */
  onAccent: string;
  bg: string;
  surface: string;
  text: string;
  muted: string;
  border: string;
  /** Producto al lado del logotipo `›gen` (`›genstock`). El ámbito `gen` va solo con `›gen`. */
  product?: string;
};

const base = {
  bg: "#f4f5f8",
  surface: "#ffffff",
  text: "#111118",
  muted: "#5c5c70",
  border: "#d2d6de",
};

export const emailThemes: Record<EmailBrand, EmailTheme> = {
  gen: { ...base, accent: "#e52713", accentText: "#c8200e", onAccent: "#ffffff" },
  genstock: { ...base, accent: "#13e28e", accentText: "#087a4c", onAccent: "#0c0c0c", product: "stock" },
  genwork: { ...base, accent: "#3b5bfa", accentText: "#3b5bfa", onAccent: "#ffffff", product: "work" },
};

/** Montserrat si el cliente la tiene; si no, la del sistema. Los correos no cargan fuentes web de forma confiable. */
export const emailFont = 'Montserrat, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';
