"use client";

import { forwardRef, type AnchorHTMLAttributes, type ButtonHTMLAttributes, type ReactNode } from "react";
import { cx } from "../lib/cx";
import { useGenUI } from "./Provider";

export type ButtonVariant = "default" | "primary" | "outline" | "ghost" | "danger";

const VARIANT_CLASS: Record<ButtonVariant, string | undefined> = {
  default: undefined,
  primary: "btn-primary",
  outline: "btn-outline",
  ghost: "btn-ghost",
  danger: "btn-danger",
};

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: "md" | "sm";
  /** Ocupa todo el ancho del contenedor. */
  block?: boolean;
  /** Muestra un spinner, deshabilita el botón y, si se pasa, cambia el texto. */
  loading?: boolean;
  loadingLabel?: ReactNode;
  icon?: ReactNode;
};

export function Spinner({ className, label }: { className?: string; label?: string }) {
  return (
    <span
      className={cx("spinner", className)}
      role={label ? "status" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    />
  );
}

/** Botón de acción. Acciones en 13px/600, sentence case (DESIGN.md). */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = "default", size = "md", block, loading, loadingLabel, icon, className, children, disabled, type = "button", ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      className={cx("btn", VARIANT_CLASS[variant], size === "sm" && "btn-sm", block && "btn-block", className)}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading ? <Spinner /> : icon}
      {loading && loadingLabel ? loadingLabel : children}
    </button>
  );
});

/** Link con aspecto de botón (usa el Link del provider). */
export function ButtonLink({
  href,
  variant = "default",
  size = "md",
  block,
  icon,
  className,
  children,
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  variant?: ButtonVariant;
  size?: "md" | "sm";
  block?: boolean;
  icon?: ReactNode;
  className?: string;
  children: ReactNode;
}) {
  const { Link } = useGenUI();
  return (
    <Link {...props} href={href} className={cx("btn", VARIANT_CLASS[variant], size === "sm" && "btn-sm", block && "btn-block", className)}>
      {icon}
      {children}
    </Link>
  );
}

export type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  /** Nombre accesible obligatorio: el botón no tiene texto visible. */
  label: string;
  children: ReactNode;
};

/** Botón de ícono 36px con área táctil de 44px. */
export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
  { label, className, children, type = "button", ...props },
  ref,
) {
  return (
    <button ref={ref} type={type} className={cx("icon-btn", className)} aria-label={label} title={label} {...props}>
      {children}
    </button>
  );
});

/** Acción secundaria en texto ("¿Olvidaste tu contraseña?"). */
export const LinkButton = forwardRef<
  HTMLButtonElement,
  ButtonHTMLAttributes<HTMLButtonElement> & { muted?: boolean }
>(function LinkButton({ muted, className, type = "button", ...props }, ref) {
  return <button ref={ref} type={type} className={cx("link-btn", muted && "link-btn-muted", className)} {...props} />;
});
