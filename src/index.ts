// gen-ui — componentes compartidos de las plataformas ›gen.
// Estilos: importar "@gen/ui/styles.css" + "@gen/ui/themes/<marca>.css".

export * from "./components/Provider";
// Íconos: subpath "@gen/ui/icons" (algunos nombres chocan con componentes: Tag, Menu).
export type { IconProps } from "./components/icons";

// Base
export * from "./components/Button";
export * from "./components/Card";
export * from "./components/Badge";
export * from "./components/Tag";
export * from "./components/Alert";
export * from "./components/BrandLogo";

// Formularios
export * from "./components/Field";
export * from "./components/CharLimit";
export * from "./components/DatePicker";
export * from "./components/OtpInput";
export * from "./components/Combobox";
export * from "./components/ColorPicker";
export * from "./components/ColorField";

// Dos pasos
export * from "./components/CopyButton";
export * from "./components/QrCode";
export * from "./components/BackupCodes";

// Feedback
export * from "./components/Toast";
export * from "./components/Dialog";
export * from "./components/ConfirmDialog";
export * from "./components/PromptDialog";
export * from "./components/Skeleton";
export * from "./components/EmptyState";
export * from "./components/ProgressBar";
export * from "./components/ProgressRing";

// Navegación y layout
export * from "./components/AppShell";
export * from "./components/Tabs";
export * from "./components/Breadcrumbs";
export * from "./components/Pagination";
export * from "./components/Menu";
export * from "./components/Layout";
export * from "./components/Stats";
export * from "./components/Toolbar";
export * from "./components/DataTable";
export * from "./components/Theme";
export * from "./components/Auth";

// Utilidades puras
export * from "./lib/cx";
export * from "./lib/colorConvert";
export * from "./lib/contrast";
export * from "./lib/palette";
