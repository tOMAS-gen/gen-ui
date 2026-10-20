# gen-ui

Componentes y estilos compartidos de las plataformas ›gen: **genwork**, **gen saas**, **licencia** y lo que
venga. Todas se ven igual; cada producto cambia sólo el color de marca.

El sistema visual sale de genwork (que a su vez sigue a genstock). Las reglas están en
[DESIGN.md](DESIGN.md) y los nombres comunes en [NOMENCLATURA.md](NOMENCLATURA.md).

## Uso en una app Next.js

```bash
npm install https://github.com/tOMAS-gen/gen-ui/releases/download/v0.1.0/gen-ui-0.1.0.tgz
```

```ts
// next.config.ts — el paquete se publica como fuente TS/TSX, sin build.
const nextConfig = { transpilePackages: ["@gen/ui"] };
```

```tsx
// src/app/layout.tsx
import { Montserrat, Roboto_Mono } from "next/font/google";
import Link from "next/link";
import "@gen/ui/styles.css";
import "@gen/ui/themes/gensaas.css"; // la marca, siempre DESPUÉS de styles.css
import { GenUIProvider, ThemeScript, ToastProvider } from "@gen/ui";

const sans = Montserrat({ subsets: ["latin"], variable: "--font-sans" });
const mono = Roboto_Mono({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-mono" });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${sans.variable} ${mono.variable}`} suppressHydrationWarning>
      <head>
        <ThemeScript storageKey="gs:theme" />
      </head>
      <body>
        <GenUIProvider linkComponent={Link} storagePrefix="gs:">
          <ToastProvider>{children}</ToastProvider>
        </GenUIProvider>
      </body>
    </html>
  );
}
```

`GenUIProvider` necesita un componente cliente para recibir `next/link`; ver `gen-saas/src/app/providers.tsx`.

Íconos: `import { Server, Globe } from "@gen/ui/icons"` (Material Symbols Outlined en SVG, sin fuentes).
Tailwind (opcional): `presets: [require("@gen/ui/tailwind-preset")]`.

## Marcas

| Tema | Claro | Oscuro |
| --- | --- | --- |
| `themes/genwork.css` | `#3b5bfa` | `#5b7fff` |
| `themes/gensaas.css` | `#e52713` (rojo ›gen) | `#ff3939` |
| `themes/genstock.css` | `#13e28e` | `#13e28e` |

Un tema nuevo define tres variables por modo: `--accent`, `--accent-text` (el accent usado como texto, más
oscuro si no llega a AA) y `--on-accent` (texto sobre el accent). `--accent-soft` se deriva solo.

## Desarrollo

```bash
npm install
npm run dev        # galería en http://localhost:5180 con selector de marca y tema
npm test           # vitest + Testing Library
npm run typecheck
```

La galería (`@gen/ui/gallery`) también se monta en la ruta `/ui` de cada producto.

## Publicar una versión

1. Subir `version` en `package.json` y anotar el cambio.
2. `npm pack` → `gen-ui-X.Y.Z.tgz`.
3. Tag `vX.Y.Z` y release en GitHub con el `.tgz` adjunto.
4. En cada app, actualizar la URL de la dependencia.

## Componentes

| Grupo | Componentes |
| --- | --- |
| Base | `Button`, `ButtonLink`, `IconButton`, `LinkButton`, `Spinner`, `Card`, `CardGrid`, `InteractiveCard`, `Badge`, `StatusPill`, `Tag`, `ColorChip`, `ColorDot`, `Avatar`, `Kbd`, `Divider`, `BrandLogo` |
| Formularios | `Field`, `Input`, `PasswordInput`, `Textarea`, `Select`, `Checkbox`, `Radio`, `Switch`, `SearchInput`, `DatePicker`, `OtpInput`, `Combobox`, `ColorPicker`, `ColorField`, `CharLimit` |
| Feedback | `ToastProvider`/`useToast`/`showToast`, `InlineAlert`, `Dialog`, `showConfirm`, `PromptDialog` (`RenameDialog`), `Skeleton`, `EmptyState`, `ProgressBar`, `ProgressRing` |
| Navegación | `AppShell`, `SidebarNav`, `NavSection`, `NavItem`, `NavGroup`, `NavSubItem`, `SidebarProfile`, `SidebarLogout`, `Tabs`, `RouteTabs`, `SegmentedControl`, `ViewSwitch`, `Breadcrumbs`, `Pagination`, `Menu` |
| Página y datos | `PageHeader`, `PageStack`, `SectionPanel`, `SectionLabel`, `RecordList`, `RecordRow`, `DescriptionList`, `StatsBar`, `StatCard`, `Toolbar`, `ToolbarFilterField`, `FilterPill`, `DataTable` |
| Tema y acceso | `GenUIProvider`, `ThemeScript`, `useTheme`, `ThemeToggle`, `AuthLayout`, `AuthSplit`, `GoogleButton` |

Origen del CSS: `scripts/extract-genwork-css.py` registra qué rangos de `genwork/src/app/globals.css` se
extrajeron para la v0.1.0.
