"use client";

import { createContext, useContext, type AnchorHTMLAttributes, type ComponentType, type ReactNode } from "react";

/** Link inyectable: `next/link` en Next, `<a>` por defecto. */
export type LinkComponent = ComponentType<AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }>;

/** Textos de la interfaz que los componentes muestran por su cuenta. */
export type GenUILabels = {
  close: string;
  cancel: string;
  accept: string;
  save: string;
  actions: string;
  openMenu: string;
  closeMenu: string;
  showMenu: string;
  hideMenu: string;
  resizeMenu: string;
  menu: string;
  dismiss: string;
  theme: string;
  themeLight: string;
  themeDark: string;
  themeSystem: string;
  showPassword: string;
  hidePassword: string;
  clearSearch: string;
  noDate: string;
  clearDate: string;
  previousPage: string;
  nextPage: string;
  noResults: string;
  loading: string;
};

export const DEFAULT_LABELS: GenUILabels = {
  close: "Cerrar",
  cancel: "Cancelar",
  accept: "Aceptar",
  save: "Guardar",
  actions: "Acciones",
  openMenu: "Abrir menú",
  closeMenu: "Cerrar menú",
  showMenu: "Mostrar menú",
  hideMenu: "Ocultar menú",
  resizeMenu: "Redimensionar menú lateral",
  menu: "Menú",
  dismiss: "Cerrar aviso",
  theme: "Tema",
  themeLight: "Claro",
  themeDark: "Oscuro",
  themeSystem: "Sistema",
  showPassword: "Mostrar contraseña",
  hidePassword: "Ocultar contraseña",
  clearSearch: "Limpiar búsqueda",
  noDate: "Sin fecha",
  clearDate: "Quitar fecha",
  previousPage: "Página anterior",
  nextPage: "Página siguiente",
  noResults: "Sin resultados",
  loading: "Cargando…",
};

const DefaultLink: LinkComponent = (props) => <a {...props} />;

type GenUIConfig = {
  Link: LinkComponent;
  /** Prefijo de las claves de localStorage (tema, ancho del menú…). */
  storagePrefix: string;
  labels: GenUILabels;
};

const GenUIContext = createContext<GenUIConfig>({
  Link: DefaultLink,
  storagePrefix: "gen:",
  labels: DEFAULT_LABELS,
});

/**
 * Configuración por producto: link del router, prefijo de almacenamiento y
 * textos. Opcional — sin provider se usan `<a>`, `gen:` y español.
 */
export function GenUIProvider({
  linkComponent,
  storagePrefix = "gen:",
  labels,
  children,
}: {
  linkComponent?: LinkComponent;
  storagePrefix?: string;
  labels?: Partial<GenUILabels>;
  children: ReactNode;
}) {
  return (
    <GenUIContext.Provider
      value={{
        Link: linkComponent ?? DefaultLink,
        storagePrefix,
        labels: { ...DEFAULT_LABELS, ...labels },
      }}
    >
      {children}
    </GenUIContext.Provider>
  );
}

export function useGenUI(): GenUIConfig {
  return useContext(GenUIContext);
}

export function useLabels(): GenUILabels {
  return useContext(GenUIContext).labels;
}
