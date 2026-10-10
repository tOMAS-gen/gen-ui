"use client";

import type { ComponentType, ReactNode } from "react";
import type { IconProps } from "./icons";
import { useGenUI } from "./Provider";

/**
 * Estado vacío: ícono + título + descripción + acción opcional, centrado.
 * `action` acepta `{label, href|onClick}` o un nodo propio.
 */
export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: ComponentType<IconProps>;
  title: string;
  description: ReactNode;
  action?: { label: string; onClick?: () => void; href?: string } | ReactNode;
}) {
  const { Link } = useGenUI();
  const isConfig = action !== null && typeof action === "object" && "label" in (action as object);
  const cfg = isConfig ? (action as { label: string; onClick?: () => void; href?: string }) : null;
  return (
    <div className="empty-state">
      <Icon size={48} className="empty-state-icon" aria-hidden="true" />
      <p className="empty-state-title">{title}</p>
      <p className="empty-state-description">{description}</p>
      {cfg ? (
        cfg.href ? (
          <Link className="btn btn-primary empty-state-action" href={cfg.href}>
            {cfg.label}
          </Link>
        ) : (
          <button type="button" className="btn btn-primary empty-state-action" onClick={cfg.onClick}>
            {cfg.label}
          </button>
        )
      ) : (
        action != null && <div className="empty-state-action">{action as ReactNode}</div>
      )}
    </div>
  );
}
