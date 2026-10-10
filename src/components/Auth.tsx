"use client";

import type { ComponentType, ReactNode } from "react";
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
