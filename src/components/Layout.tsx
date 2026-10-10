import type { ComponentType, HTMLAttributes, ReactNode } from "react";
import { cx } from "../lib/cx";
import type { IconProps } from "./icons";

/** Encabezado de página: ícono compacto + título 24/700 + descripción + acciones. */
export function PageHeader({
  title,
  description,
  icon: Icon,
  actions,
  children,
}: {
  title: ReactNode;
  description?: ReactNode;
  icon?: ComponentType<IconProps>;
  actions?: ReactNode;
  /** Contenido extra bajo el título (migas, estado…). */
  children?: ReactNode;
}) {
  return (
    <header className="page-header">
      <div className="page-header-heading">
        {Icon && (
          <span className="page-header-icon">
            <Icon size={22} aria-hidden="true" />
          </span>
        )}
        <div className="page-header-copy">
          <h1>{title}</h1>
          {description && <p>{description}</p>}
          {children}
        </div>
      </div>
      {actions && <div className="page-header-actions">{actions}</div>}
    </header>
  );
}

/** Columna de bloques de página con 16px entre sí. */
export function PageStack({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cx("page-stack", className)} {...props} />;
}

/** Panel de sección con título 14/600 y acciones opcionales. */
export function SectionPanel({
  title,
  description,
  actions,
  children,
  className,
}: {
  title?: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <section className={cx("section-panel", className)}>
      {(title || actions) && (
        <div className="section-panel-head">
          {title && <h2>{title}</h2>}
          {actions && <div className="section-panel-actions">{actions}</div>}
        </div>
      )}
      {description && <p className="section-panel-description">{description}</p>}
      {children}
    </section>
  );
}

/** Rótulo de sección 11/700 en mayúsculas. */
export function SectionLabel({ children, className }: { children: ReactNode; className?: string }) {
  return <span className={cx("section-label", className)}>{children}</span>;
}

/** Lista densa de registros (filas con identidad, meta y acciones). */
export function RecordList({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cx("record-list", className)}>{children}</div>;
}

export function RecordRow({
  title,
  subtitle,
  leading,
  meta,
  actions,
}: {
  title: ReactNode;
  subtitle?: ReactNode;
  leading?: ReactNode;
  meta?: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <div className="card">
      <div className="record-row">
        {leading}
        <div className="record-identity">
          <strong>{title}</strong>
          {subtitle && <span className="muted">{subtitle}</span>}
        </div>
        {meta && <div className="record-meta">{meta}</div>}
        {actions && <div className="record-actions">{actions}</div>}
      </div>
    </div>
  );
}

/** Lista clave/valor (dl). */
export function DescriptionList({ items }: { items: { term: ReactNode; detail: ReactNode }[] }) {
  return (
    <dl className="detail-metadata">
      {items.map((it, i) => (
        <div key={i} style={{ display: "contents" }}>
          <dt className="muted">{it.term}</dt>
          <dd>{it.detail}</dd>
        </div>
      ))}
    </dl>
  );
}
