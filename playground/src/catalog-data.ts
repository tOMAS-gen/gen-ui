export const screens = [
  {
    id: "login",
    title: "Login",
    group: "Acceso",
    description:
      "Una bienvenida simple. Email, contraseña y acceso a tu espacio de trabajo.",
    web: "AuthExamples.tsx",
    flutter: "auth_screen.dart",
    parts: "AuthLayout · Field · PasswordInput · Button",
  },
  {
    id: "signup",
    title: "Registro",
    group: "Acceso",
    description:
      "El primer paso de un nuevo equipo. Un formulario breve con validación de datos.",
    web: "AuthExamples.tsx",
    flutter: "auth_screen.dart",
    parts: "AuthLayout · Field · Input · InlineAlert",
  },
  {
    id: "recovery",
    title: "Recuperar contraseña",
    group: "Acceso",
    description:
      "Un camino claro para volver a entrar, con confirmación de la solicitud.",
    web: "AuthExamples.tsx",
    flutter: "auth_screen.dart",
    parts: "AuthLayout · Field · Input · InlineAlert",
  },
  {
    id: "dashboard",
    title: "Proyectos",
    group: "Ejemplos",
    description:
      "Organizá proyectos: filtros, tarjetas, favoritos, archivado y progreso de tareas.",
    web: "ProjectsExample.tsx",
    flutter: null,
    parts: "AppShell · StatsBar · Toolbar · ProgressBar · DataTable",
  },
  {
    id: "admin-panel",
    title: "Panel de administración",
    group: "Ejemplos",
    description:
      "Navegación lateral y secciones para administrar infraestructura y aplicaciones.",
    web: "AdminPanelExample.tsx",
    flutter: null,
    parts: "AppShell · SidebarNav · PageHeader · SectionPanel · EmptyState",
  },
  {
    id: "inventory-dashboard",
    title: "Inventario y ventas",
    group: "Ejemplos",
    description:
      "Resumen de ventas y cobros, alertas de stock y últimas operaciones.",
    web: null,
    flutter: "inventory_dashboard.dart",
    parts: "KpiTile · StockStatusChip · AppInlineNotice · DataTable",
  },
  {
    id: "records",
    title: "Listado de clientes",
    group: "Aplicación",
    description:
      "Encontrá, filtrá y agregá clientes. Incluye un estado vacío y formulario de alta.",
    web: "RecordsExample.tsx",
    flutter: "clients_screen.dart",
    parts: "DataTable · Input · Select · Dialog",
  },
  {
    id: "settings",
    title: "Configuración",
    group: "Aplicación",
    description:
      "El perfil y las preferencias del espacio, con validación y confirmación de guardado.",
    web: "SettingsExample.tsx",
    flutter: "settings_screen.dart",
    parts: "Field · Input · Switch · InlineAlert",
  },
] as const;

export type ScreenId = (typeof screens)[number]["id"];
export type Platform = "web" | "flutter";
export type PageId = ScreenId | "start" | "components";
export const examplePlatforms: Partial<Record<PageId, Platform>> = {
  dashboard: "web",
  "admin-panel": "web",
  "inventory-dashboard": "flutter",
};

export function readLocation() {
  const query = new URLSearchParams(window.location.search);
  const page = query.get("screen");
  const platform = Object.hasOwn(examplePlatforms, page ?? "")
    ? examplePlatforms[page as PageId]
    : undefined;
  return {
    page: (page === "start" ||
    page === "components" ||
    screens.some((item) => item.id === page)
      ? page
      : "login") as PageId,
    platform:
      platform ??
      ((query.get("platform") === "flutter" ? "flutter" : "web") as Platform),
    theme:
      query.get("theme") === "dark" ? ("dark" as const) : ("light" as const),
    preview: query.get("preview") === "1",
  };
}

const webFiles = import.meta.glob<string>("./examples/*.{tsx,css}", {
  query: "?raw",
  import: "default",
  eager: true,
});
const dartFiles = import.meta.glob<string>(
  "../../examples/flutter/lib/*.dart",
  { query: "?raw", import: "default", eager: true },
);
import pubspec from "../../examples/flutter/pubspec.yaml?raw";

export function sourceFiles(
  platform: Platform,
  selected: (typeof screens)[number],
) {
  if (!selected[platform]) return [];
  const entries =
    platform === "web"
      ? Object.entries(webFiles).map(([path, code]) => ({
          name: path.split("/").pop()!,
          code: code
            .replaceAll('"../../../src"', '"@gen/ui"')
            .replaceAll('"../../../src/components/icons"', '"@gen/ui/icons"')
            .replaceAll('"../../../src/gallery/Gallery"', '"@gen/ui/gallery"')
            .replaceAll(
              '"../../../src/gallery/gallery.css"',
              '"@gen/ui/gallery.css"',
            ),
        }))
      : [
          ...Object.entries(dartFiles).map(([path, code]) => ({
            name: path.split("/").pop()!,
            code,
          })),
          { name: "pubspec.yaml", code: pubspec },
        ];
  const primary = platform === "web" ? selected.web : selected.flutter;
  return entries.sort((a, b) =>
    a.name === primary
      ? -1
      : b.name === primary
        ? 1
        : a.name.localeCompare(b.name),
  );
}
