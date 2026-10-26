# Nomenclatura común

Mismo nombre para la misma pieza en genwork, gen saas, licencia y cualquier producto nuevo. Si una pantalla
necesita algo que no está acá, primero se agrega a gen-ui y después se usa.

## Componentes (React)

| Pieza | Componente | Clase CSS raíz | Nombre anterior en genwork |
| --- | --- | --- | --- |
| Estructura de la app | `AppShell` | `.shell` | `Shell` |
| Menú lateral | `SidebarNav` + `NavItem` / `NavGroup` | `.sidebar`, `a.nav`, `.nav-group` | `DrawerNav` (interno) |
| Encabezado de página | `PageHeader` | `.page-header` | igual (ícono por nombre → componente) |
| Panel de sección | `SectionPanel` | `.section-panel` | sólo clase |
| Botón | `Button` (`variant`) | `.btn`, `.btn-primary`… | sólo clase |
| Botón de ícono | `IconButton` | `.icon-btn` | sólo clase |
| Campo de formulario | `Field` + `Input`/`Select`/… | `.field` | `.dialog-field` |
| Aviso en línea | `InlineAlert` | `.alert` | `.form-error`, `.login-error` |
| Pill de estado | `StatusPill` (`tone`) | `.status-pill` | `.status-pending`… |
| Tabs | `Tabs` | `.tabs` | `ProjectTabs` / `.project-tabs` |
| Tabs de rutas | `RouteTabs` | `.section-tabs` | `SettingsNav` |
| Barra de listado | `Toolbar` | `.toolbar` | `FilterBar`, `SectorToolbar` / `.project-toolbar` |
| Búsqueda | `SearchInput` | `.search-input` | `.project-search` |
| Selector de vista | `ViewSwitch` | `.view-switch` | `.project-view-switch` |
| Tabla | `DataTable` | `.data-table` | `.project-table` |
| Grilla de cards | `CardGrid` | `.card-grid` | `.project-grid` |
| Card clickeable | `InteractiveCard` | `.card-interactive` + `.card-link` | `.project-card` + `.project-card-link` |
| Autocompletar | `Combobox` | `.combobox` | `MemberSearchField` / `.member-search` |
| Encabezado plegable | — | `.section-toggle` | `.sector-section-toggle` |
| Diálogo de texto | `PromptDialog` | `.dialog` | `RenameDialog` (alias conservado) |
| Avisos flotantes | `useToast` / `showToast` | `.toast-stack` | dos sistemas → uno |
| Código de verificación | `OtpInput` | `.otp` | — (nuevo) |
| QR de la app de autenticación | `QrCode` | `.qr-code` | — (nuevo) |
| Códigos de respaldo | `BackupCodes` | `.backup-codes` | — (nuevo) |
| Copiar al portapapeles | `CopyButton` | `.btn` | — (nuevo) |
| Acceso | `AuthLayout`, `AuthSplit`, `GoogleButton` | `.login-wrap`, `.auth-card`, `.auth-split*` | `.login-card` |
| Correo (estructura) | `EmailLayout` (`@gen/ui/email`) | — (estilos en línea) | — (nuevo) |
| Correo (contenido) | `EmailHeading`, `EmailText`, `EmailButton`, `EmailCode`, `EmailDivider` | — (estilos en línea) | — (nuevo) |

## Props

- `variant` para la forma de un botón (`primary`, `outline`, `ghost`, `danger`); `tone` para el color de un
  estado (`neutral`, `success`, `warning`, `danger`, `info`, `accent`).
- `label` / `ariaLabel` siempre explícitos en controles sin texto visible.
- `icon` recibe un componente de `@gen/ui/icons`, nunca un nombre en texto.
- Booleanos de estado en positivo: `loading`, `invalid`, `disabled`, `open`.

## Clases

- Bloque en kebab-case (`.toolbar`), elementos con guion (`.toolbar-count`), modificadores con prefijo `is-` o
  sufijo de variante (`.is-active`, `.btn-primary`).
- Nada de nombres de dominio en gen-ui: `project`, `sector`, `task` viven en cada producto.

## Tokens

- Marca: `--accent`, `--accent-text`, `--on-accent`, `--accent-soft` (derivado).
- Superficies: `--bg`, `--surface`, `--field`, `--floating`, `--hover-soft`.
- Texto y bordes: `--text`, `--muted`, `--border`, `--outline`.
- Estados: `--danger`, `--ok`, `--color-{success,warning,danger,info}[-bg|-text]`.
- Escalas: `--space-1…7`, `--text-xs…2xl`, `--radius-{sm,control,md,lg,full}`, `--shadow-{sm,md,lg}`, `--z-*`.

## localStorage

Prefijo por producto vía `GenUIProvider storagePrefix`: `gw:` genwork, `gs:` gen saas. Claves: `theme`,
`drawer-collapsed`, `drawer-width`.
