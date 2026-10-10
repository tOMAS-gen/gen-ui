import type { ReactNode } from "react";

/** Tarjeta de cifra: número grande en mono + rótulo (· detalle opcional). */
export function StatCard({ value, label, detail }: { value: ReactNode; label: ReactNode; detail?: ReactNode }) {
  return (
    <div className="stat-card">
      <div className="stat-number">{value}</div>
      <div className="stat-pct">
        {label}
        {detail != null && <> · {detail}</>}
      </div>
    </div>
  );
}

export function StatsBar({ children, ariaLabel }: { children: ReactNode; ariaLabel?: string }) {
  return (
    <section className="stats-bar" aria-label={ariaLabel}>
      {children}
    </section>
  );
}
