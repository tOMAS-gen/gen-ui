import type { CSSProperties, ReactNode } from "react";
import { cx } from "../lib/cx";

export type StatusTone = "neutral" | "success" | "warning" | "danger" | "info" | "accent";

/** Pill de estado (4px de radio). `dot` agrega un punto del mismo color. */
export function StatusPill({
  tone = "neutral",
  dot,
  children,
  className,
}: {
  tone?: StatusTone;
  dot?: boolean;
  children: ReactNode;
  className?: string;
}) {
  return (
    <span className={cx("status-pill", `status-${tone}`, className)}>
      {dot && <span className="status-pill-dot" aria-hidden="true" />}
      {children}
    </span>
  );
}

export type TagKind = "work" | "exec" | "ref" | "user" | "label";

/** Etiqueta semántica (colores con significado propio, independientes de la marca). */
export function Tag({ kind, children, className }: { kind: TagKind; children: ReactNode; className?: string }) {
  return <span className={cx("tag", `tag-${kind}`, className)}>{children}</span>;
}

/** Chip con color arbitrario (hex del usuario) — fondo y texto derivados con color-mix. */
export function ColorChip({ color, children, className }: { color: string; children: ReactNode; className?: string }) {
  return (
    <span className={cx("color-chip", className)} style={{ "--c": color } as CSSProperties}>
      {children}
    </span>
  );
}

export function ColorDot({ color, className, label }: { color: string; className?: string; label?: string }) {
  return (
    <span
      className={cx("color-dot", className)}
      style={{ "--c": color } as CSSProperties}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    />
  );
}
