// gen-ui — piezas de correo (`@gen/ui/email`), hechas con React Email.
// Necesitan `react-email` instalado en la app (dependencia par opcional): solo las usa quien arma correos.
// Cada .tsx empieza con `@jsxRuntime automatic`: las herramientas de Node (tsx, esbuild) compilan lo que viene de
// node_modules sin el tsconfig de la app, y sin ese comentario usarían el JSX viejo ("React is not defined").

export * from "./themes";
export * from "./EmailLayout";
export * from "./EmailHeading";
export * from "./EmailText";
export * from "./EmailButton";
export * from "./EmailCode";
export * from "./EmailDivider";
