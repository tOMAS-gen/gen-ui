import type { ComponentType, ReactNode } from "react";
import { cx } from "../lib/cx";
import { AlertCircle, CheckCircle, Info, type IconProps } from "./icons";

export type AlertTone = "danger" | "success" | "warning" | "info" | "neutral";

const TONE_ICON: Record<AlertTone, ComponentType<IconProps>> = {
  danger: AlertCircle,
  success: CheckCircle,
  warning: AlertCircle,
  info: Info,
  neutral: Info,
};

/** Aviso en línea. Siempre con ícono: el estado no depende sólo del color. */
export function InlineAlert({
  tone = "danger",
  title,
  children,
  icon,
  className,
}: {
  tone?: AlertTone;
  title?: ReactNode;
  children?: ReactNode;
  icon?: ComponentType<IconProps>;
  className?: string;
}) {
  const Icon = icon ?? TONE_ICON[tone];
  return (
    <div className={cx("alert", `alert-${tone}`, className)} role={tone === "danger" ? "alert" : "status"}>
      <Icon size={18} className="alert-icon" />
      <div className="alert-body">
        {title && <strong className="alert-title">{title}</strong>}
        {children}
      </div>
    </div>
  );
}

/** Separador horizontal, opcionalmente con texto ("o"). */
export function Divider({ children }: { children?: ReactNode }) {
  return (
    <div className="divider" role="separator">
      {children}
    </div>
  );
}

/** Iniciales (máx. 2) de un nombre o email. */
export function initials(name: string): string {
  const base = name.includes("@") ? name.split("@")[0].replace(/[._-]+/g, " ") : name;
  const parts = base.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2);
  return parts[0][0] + parts[parts.length - 1][0];
}

export function Avatar({
  name,
  src,
  size = 32,
  className,
}: {
  name: string;
  src?: string | null;
  size?: number;
  className?: string;
}) {
  return (
    <span
      className={cx("avatar", className)}
      style={{ width: size, height: size, fontSize: Math.round(size * 0.375) }}
      aria-hidden="true"
    >
      {src ? <img src={src} alt="" referrerPolicy="no-referrer" /> : initials(name)}
    </span>
  );
}

export function Kbd({ children }: { children: ReactNode }) {
  return <kbd className="kbd">{children}</kbd>;
}
