# gen-ui

Biblioteca general de componentes, estilos y ejemplos para React y Flutter.
La identidad de **›gen UI** usa naranja `#F97316` como color principal.

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
import "@gen/ui/themes/ui.css"; // siempre DESPUÉS de styles.css
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

## Correos (`@gen/ui/email`)

Piezas para armar correos con la marca de cada plataforma, hechas con [React Email](https://react.email). Los
clientes de correo no entienden variables CSS ni clases: los temas son valores fijos (`emailThemes`) y los estilos
van en línea. Necesitan `react-email` en la app que arma los correos (dependencia par opcional; las apps que solo
usan la interfaz no lo instalan).

```tsx
import { render, toPlainText } from "react-email";
import { EmailButton, EmailHeading, EmailLayout, EmailText } from "@gen/ui/email";

const html = await render(
  <EmailLayout marca="gen" preview="Te invitaron al panel de ›gen">
    <EmailHeading>Te invitaron al panel</EmailHeading>
    <EmailText>Para entrar, creá tu contraseña.</EmailText>
    <EmailButton href={enlace}>Crear contraseña</EmailButton>
  </EmailLayout>,
);
const text = toPlainText(html);
```

| Pieza | Para qué |
| --- | --- |
| `EmailLayout` (`marca`, `preview`) | Estructura: logotipo de texto (`›gen`, `›genstock`, `›genwork`), tarjeta y aviso "Este es un correo automático, no lo respondas." al pie |
| `EmailHeading` | Título, uno por correo |
| `EmailText` (`muted`) | Párrafo; `muted` para aclaraciones |
| `EmailButton` (`href`) | Acción principal (también se ve en Outlook) |
| `EmailCode` | Códigos y enlaces para copiar a mano |
| `EmailDivider` | Separador |

Vista previa: pantalla **Correos** del catálogo (`npm run dev`, `?screen=email`).

## Tema UI

Importá `@gen/ui/themes/ui.css` después de los estilos compartidos. El color principal es `#F97316`.
El texto usa `#C2410C` en claro y `#FB923C` en oscuro para mantener contraste. Los botones naranjas
usan texto oscuro. Los colores semánticos de éxito, advertencia y error conservan su significado.

## Desarrollo

```bash
npm install
npm run build:flutter # prepara las vistas previas Flutter (requiere Flutter 3.44+)
npm run dev        # catálogo en http://localhost:5180 con tema claro y oscuro
npm test           # vitest + Testing Library
npm run typecheck
```

La galería (`@gen/ui/gallery`) también se monta en la ruta `/ui` de cada producto.

## Catálogo de pantallas React y Flutter

El playground es una biblioteca general de **›gen UI** con color principal **naranja `#F97316`**.
Incluye login, registro, recuperación, proyectos, panel de administración, inventario y ventas,
clientes y configuración. Cada ejemplo ofrece código y vista previa en las plataformas disponibles.
No hay selección de producto o entorno: todos los ejemplos usan la misma identidad.

La sección Componentes conserva la galería React existente.

- `playground/src/examples/`: pantallas React, compuestas con `@gen/ui`.
- `examples/flutter/lib/`: implementaciones Flutter y tema compartido, con Montserrat y Roboto Mono incluidas como assets.
- `playground/src/catalog-data.ts`: registro de pantallas. El código mostrado se importa de los archivos
  que ejecuta cada demo; no hay snippets duplicados que mantener.

Los ejemplos simulan acciones con estado local. No envían correos, autentican usuarios ni guardan datos
en un servidor. La sección **Empezar** explica cómo integrarlos en una aplicación real.

Para ejecutar Flutter por separado:

```bash
cd examples/flutter
flutter pub get
flutter run -d chrome
flutter analyze
flutter test
```

La preview Flutter del catálogo ejecuta la compilación web real dentro de un iframe. Después de cambiar
un archivo Dart, ejecutá `npm run build:flutter` y recargá la preview. Si todavía no se compiló, el catálogo
muestra instrucciones y permite consultar el código Dart igualmente. Los widgets también se pueden
integrar en proyectos Flutter para Android/iOS; este repositorio sólo configura el destino web.

Para generar el sitio completo y servirlo localmente:

```bash
npm run build:catalog
npm run preview:catalog
```

Publicá el contenido de `playground/dist/` en un hosting estático. Para un subdirectorio:
`npm run build:catalog -- --base=/ui/`. `npm run build:playground` sigue disponible para compilar React sin
necesitar Flutter; incluye la preview Flutter si ya existe en `playground/public/flutter/`.
Los archivos Flutter compilados se generan localmente y se excluyen de Git.

Cada pantalla se puede compartir por URL, por ejemplo:
`?screen=dashboard`, `?screen=admin-panel` o `?screen=inventory-dashboard&theme=dark`.

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
