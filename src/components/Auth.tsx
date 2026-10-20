"use client";

import type { ComponentType, CSSProperties, ReactNode } from "react";
import { Button, type ButtonProps } from "./Button";
import { BrandLogo } from "./BrandLogo";
import { GoogleLogo, type IconProps } from "./icons";

/**
 * Pantalla de acceso: card centrada con marca, ícono de paso opcional, título,
 * subtítulo, cuerpo (formulario) y pie.
 */
export function AuthLayout({
  product,
  brand,
  icon: Icon,
  title,
  subtitle,
  children,
  footer,
  legal,
  aside,
}: {
  /** Producto para el logotipo (›gen + product). Ignorado si se pasa `brand`. */
  product?: string;
  brand?: ReactNode;
  icon?: ComponentType<IconProps>;
  title?: ReactNode;
  subtitle?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  legal?: ReactNode;
  /** Elementos fuera de la card (p. ej. selector de tema arriba a la derecha). */
  aside?: ReactNode;
}) {
  return (
    <div className="login-wrap">
      {aside && <div className="auth-aside">{aside}</div>}
      <main className="card auth-card">
        <header className="auth-header">
          {brand ?? <BrandLogo product={product} />}
          {Icon && (
            <span className="auth-icon">
              <Icon size={24} aria-hidden="true" />
            </span>
          )}
          {title && <h1 className="auth-title">{title}</h1>}
          {subtitle && <p className="auth-subtitle">{subtitle}</p>}
        </header>
        <div className="auth-body">{children}</div>
        {footer && <footer className="auth-footer">{footer}</footer>}
        {legal && <p className="auth-legal">{legal}</p>}
      </main>
    </div>
  );
}

/** "Continuar con Google": superficie neutra + logo oficial. */
export function GoogleButton({ children = "Continuar con Google", ...props }: Omit<ButtonProps, "variant" | "icon">) {
  return (
    <Button block className="btn-google" icon={<GoogleLogo size={18} />} {...props}>
      {children}
    </Button>
  );
}

/**
 * Pantalla de acceso en dos columnas: a la izquierda la marca sobre una foto de fondo, a la derecha
 * el formulario en una tarjeta. Ambas siguen el tema (la foto se aclara u oscurece con él). Misma
 * base que `AuthLayout`. Desde 1100px: dos columnas; debajo: un único bloque centrado con logo,
 * título, formulario, pie e `info` en el mismo contenedor.
 */
export function AuthSplit({
  product,
  eyebrow,
  headline,
  headlineAccent,
  lead,
  highlights,
  made,
  backgroundImage,
  icon: Icon,
  title,
  subtitle,
  children,
  footer,
  aside,
  info,
}: {
  /** Producto para el logotipo (›gen + product). */
  product?: string;
  /** Texto chico sobre el titular de la columna de marca. */
  eyebrow?: ReactNode;
  headline?: ReactNode;
  /** Segunda línea del titular, en color de marca. */
  headlineAccent?: ReactNode;
  lead?: ReactNode;
  /** Informativos (no son enlaces): ícono + etiqueta. */
  highlights?: { icon: ComponentType<IconProps>; label: string }[];
  /** Línea al pie de la columna de marca (con la bandera). */
  made?: ReactNode;
  /** URL de la foto de fondo (p. ej. `/login-bg.jpg`). */
  backgroundImage?: string;
  icon?: ComponentType<IconProps>;
  title: ReactNode;
  subtitle?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  /** Elementos arriba a la derecha (p. ej. selector de tema). */
  aside?: ReactNode;
  /** Enlace discreto al final del bloque en pantallas chicas (p. ej. ayuda de desarrollo). */
  info?: ReactNode;
}) {
  const style = backgroundImage
    ? ({ "--auth-split-bg": `url("${backgroundImage}")` } as CSSProperties)
    : undefined;
  return (
    <div className={backgroundImage ? "auth-split" : "auth-split auth-split-plain"} style={style}>
      <section className="auth-split-brand">
        <BrandLogo product={product} className="auth-split-logo" />
        {(eyebrow || headline || lead || highlights) && (
          <div className="auth-split-pitch">
            {eyebrow && <p className="auth-split-eyebrow">{eyebrow}</p>}
            {headline && (
              <h2 className="auth-split-headline">
                {headline}
                {headlineAccent && <span>{headlineAccent}</span>}
              </h2>
            )}
            {lead && <p className="auth-split-lead">{lead}</p>}
            {highlights && (
              <ul className="auth-split-highlights">
                {highlights.map(({ icon: HighlightIcon, label }) => (
                  <li key={label}>
                    <HighlightIcon size={28} aria-hidden="true" />
                    <strong>{label}</strong>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
        {made && (
          <p className="auth-split-made">
            <span className="auth-split-flag" aria-hidden="true" />
            {made}
          </p>
        )}
      </section>

      <main className="auth-split-form">
        {aside && <div className="auth-split-aside">{aside}</div>}
        <div className="auth-split-inner">
          <BrandLogo product={product} className="auth-split-logo-mobile" />
          <header className="auth-split-header">
            {Icon && (
              <span className="auth-icon">
                <Icon size={24} aria-hidden="true" />
              </span>
            )}
            <h1 className="auth-split-title">{title}</h1>
            {subtitle && <p className="auth-split-subtitle">{subtitle}</p>}
          </header>
          <div className="auth-body">{children}</div>
          {footer && <footer className="auth-split-footer">{footer}</footer>}
          {info}
        </div>
      </main>
    </div>
  );
}
