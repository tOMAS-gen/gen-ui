import { cx } from "../lib/cx";

/** Porcentaje entero 0–100 de `done/total` (0 si total es 0). */
export function percentOf(done: number, total: number): number {
  if (!total || total <= 0) return 0;
  return Math.max(0, Math.min(100, Math.round((done / total) * 100)));
}

/**
 * Barra de progreso lineal. `value` en 0–100. `label` es el texto visible a la
 * derecha (por defecto el porcentaje; `null` lo oculta).
 */
export function ProgressBar({
  value,
  size = "md",
  tone = "accent",
  label,
  ariaLabel,
  className,
}: {
  value: number;
  size?: "md" | "sm";
  tone?: "accent" | "ok" | "warning" | "danger";
  label?: string | null;
  ariaLabel?: string;
  className?: string;
}) {
  const v = Math.max(0, Math.min(100, Math.round(value)));
  return (
    <div
      className={cx("progress-bar", size === "sm" && "progress-bar-sm", tone !== "accent" && `progress-${tone}`, className)}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={v}
      aria-label={ariaLabel ?? `${v}%`}
    >
      <div className="progress-track">
        <div className="progress-fill" style={{ width: `${v}%` }} />
      </div>
      {label !== null && <span className="progress-label">{label ?? `${v}%`}</span>}
    </div>
  );
}
