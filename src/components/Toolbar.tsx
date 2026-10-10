"use client";

import { useId, useRef, useState, type ComponentType, type ReactNode } from "react";
import { ArrowUpDown, ChevronDown, SlidersHorizontal, X } from "./icons";
import { SearchInput } from "./Field";
import { ViewSwitch } from "./Tabs";

export type ToolbarChip = { key: string; label: string; onRemove: () => void };

/**
 * Barra de listado: búsqueda + panel de filtros desplegable + orden + vista,
 * y un resumen con el conteo, los filtros activos (chips) y acciones.
 */
export function Toolbar<V extends string = string>({
  ariaLabel,
  search,
  filters,
  sort,
  view,
  count,
  chips,
  onReset,
  resetLabel = "Limpiar filtros",
  summaryActions,
}: {
  ariaLabel: string;
  search?: { value: string; onChange: (v: string) => void; placeholder?: string; ariaLabel: string };
  /** Contenido del panel de filtros (usar `ToolbarFilterField`). */
  filters?: { content: ReactNode; activeCount?: number; label?: string };
  sort?: { value: string; onChange: (v: string) => void; options: { value: string; label: string }[]; ariaLabel: string; label?: string };
  view?: {
    value: V;
    onChange: (v: V) => void;
    options: { value: V; label: string; icon: ComponentType<{ size?: number }> }[];
    ariaLabel: string;
  };
  /** Texto de conteo ("12 servidores"); se anuncia por lector de pantalla. */
  count?: ReactNode;
  chips?: ToolbarChip[];
  onReset?: () => void;
  resetLabel?: string;
  summaryActions?: ReactNode;
}) {
  const [expanded, setExpanded] = useState(false);
  const panelId = useId();
  const trigger = useRef<HTMLButtonElement>(null);
  const hasSummary = count != null || (chips && chips.length > 0) || onReset || summaryActions;

  return (
    <section className="toolbar" aria-label={ariaLabel}>
      <div className="toolbar-main">
        {search && (
          <SearchInput value={search.value} onChange={search.onChange} placeholder={search.placeholder} ariaLabel={search.ariaLabel} />
        )}
        {filters && (
          <button
            ref={trigger}
            type="button"
            className="toolbar-filter-trigger"
            aria-expanded={expanded}
            aria-controls={panelId}
            onClick={() => setExpanded(!expanded)}
          >
            <SlidersHorizontal size={18} aria-hidden="true" />
            {filters.label ?? "Filtros"}
            {!!filters.activeCount && <span className="toolbar-filter-count">{filters.activeCount}</span>}
          </button>
        )}
        {sort && (
          <label className="toolbar-sort">
            <ArrowUpDown size={18} aria-hidden="true" />
            <span className="toolbar-sort-label">{sort.label ?? "Ordenar"}</span>
            <select aria-label={sort.ariaLabel} value={sort.value} onChange={(e) => sort.onChange(e.target.value)}>
              {sort.options.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
            <ChevronDown size={16} aria-hidden="true" />
          </label>
        )}
        {view && <ViewSwitch {...view} />}
      </div>
      {filters && (
        <div
          id={panelId}
          hidden={!expanded}
          className="toolbar-filter-panel"
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              e.stopPropagation();
              setExpanded(false);
              trigger.current?.focus();
            }
          }}
        >
          <div className="toolbar-filter-fields">{filters.content}</div>
        </div>
      )}
      {hasSummary && (
        <div className="toolbar-summary">
          {count != null && (
            <span className="toolbar-count" role="status" aria-live="polite" aria-atomic="true">
              {count}
            </span>
          )}
          {chips && chips.length > 0 && (
            <div className="toolbar-chips" aria-label="Filtros activos">
              {chips.map((c) => (
                <button key={c.key} type="button" onClick={c.onRemove} aria-label={`Quitar filtro: ${c.label}`} title={`Quitar filtro: ${c.label}`}>
                  <span>{c.label}</span>
                  <X size={14} aria-hidden="true" />
                </button>
              ))}
            </div>
          )}
          {(onReset || summaryActions) && (
            <div className="toolbar-summary-actions">
              {onReset && (
                <button type="button" className="toolbar-reset" onClick={onReset}>
                  {resetLabel}
                </button>
              )}
              {summaryActions}
            </div>
          )}
        </div>
      )}
    </section>
  );
}

/** Campo del panel de filtros: rótulo + select. */
export function ToolbarFilterField({
  label,
  value,
  onChange,
  options,
  allLabel,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  /** Opción vacía ("Todos"). */
  allLabel: string;
}) {
  return (
    <label className="toolbar-filter-field">
      <span>{label}</span>
      <select aria-label={label} value={value} onChange={(e) => onChange(e.target.value)}>
        <option value="">{allLabel}</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}

/** Filtro como pill: `<select>` nativo invisible sobre un chip. */
export function FilterPill({
  value,
  onChange,
  options,
  placeholder,
  ariaLabel,
  dotColor,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  placeholder: string;
  ariaLabel: string;
  dotColor?: string;
}) {
  const current = options.find((o) => o.value === value);
  return (
    <label className={`filter-pill ${value ? "is-active" : ""}`}>
      {dotColor && <span className="filter-pill-dot" style={{ background: dotColor }} aria-hidden="true" />}
      <span className="filter-pill-label">{current?.label ?? placeholder}</span>
      <select aria-label={ariaLabel} value={value} onChange={(e) => onChange(e.target.value)}>
        <option value="">{placeholder}</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}
