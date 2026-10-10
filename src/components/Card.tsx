"use client";

import type { HTMLAttributes, ReactNode } from "react";
import { cx } from "../lib/cx";
import { useGenUI } from "./Provider";

/** Card plana: superficie + borde, sin sombra (DESIGN.md). */
export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cx("card", className)} {...props} />;
}

/** Grilla responsive de cards (auto-fill, mínimo 320px; `sm` = 300px). */
export function CardGrid({ size = "md", className, ...props }: HTMLAttributes<HTMLDivElement> & { size?: "md" | "sm" }) {
  return <div className={cx(size === "sm" ? "card-grid-sm" : "card-grid", className)} {...props} />;
}

/**
 * Card clickeable: un link "estirado" cubre toda la card sin anidar los
 * botones propios (`actions`), que quedan por encima. Hover = sólo borde.
 */
export function InteractiveCard({
  href,
  label,
  header,
  actions,
  children,
  footer,
  className,
}: {
  href: string;
  /** Nombre accesible del link (normalmente el título de la card). */
  label: string;
  header?: ReactNode;
  actions?: ReactNode;
  children?: ReactNode;
  footer?: ReactNode;
  className?: string;
}) {
  const { Link } = useGenUI();
  return (
    <article className={cx("card-interactive", className)}>
      <Link href={href} className="card-link" aria-label={label} />
      {(header || actions) && (
        <div className="card-header">
          <div style={{ minWidth: 0, flex: 1 }}>{header}</div>
          {actions && <div className="card-actions">{actions}</div>}
        </div>
      )}
      {children}
      {footer}
    </article>
  );
}
