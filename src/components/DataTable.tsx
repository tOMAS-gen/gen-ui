"use client";

import type { KeyboardEvent, ReactNode } from "react";
import { cx } from "../lib/cx";

export type DataColumn<T> = {
  key: string;
  header: ReactNode;
  render: (row: T) => ReactNode;
  /** Clase de la celda (`col-primary`, `col-chips`, `num`…). */
  className?: string;
  align?: "left" | "right" | "center";
};

/**
 * Tabla de datos con scroll horizontal propio. Si se pasa `onRowClick`, cada
 * fila es navegable con teclado (Enter) y se anuncia como link.
 */
export function DataTable<T>({
  columns,
  rows,
  rowKey,
  onRowClick,
  rowLabel,
  caption,
  empty,
  className,
}: {
  columns: DataColumn<T>[];
  rows: T[];
  rowKey: (row: T) => string;
  onRowClick?: (row: T) => void;
  /** Nombre accesible de la fila clickeable. */
  rowLabel?: (row: T) => string;
  caption?: string;
  /** Contenido cuando no hay filas. */
  empty?: ReactNode;
  className?: string;
}) {
  return (
    <div className="table-scroll-wrapper">
      <table className={cx("data-table", !onRowClick && "data-table-static", className)}>
        {caption && <caption className="visually-hidden">{caption}</caption>}
        <thead>
          <tr>
            {columns.map((c) => (
              <th key={c.key} scope="col" style={c.align ? { textAlign: c.align } : undefined}>
                {c.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 && empty ? (
            <tr className="data-table-empty">
              <td colSpan={columns.length}>{empty}</td>
            </tr>
          ) : (
            rows.map((row) => (
              <tr
                key={rowKey(row)}
                role={onRowClick ? "link" : undefined}
                tabIndex={onRowClick ? 0 : undefined}
                aria-label={onRowClick && rowLabel ? rowLabel(row) : undefined}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
                onKeyDown={
                  onRowClick
                    ? (e: KeyboardEvent<HTMLTableRowElement>) => {
                        if (e.key === "Enter") onRowClick(row);
                      }
                    : undefined
                }
              >
                {columns.map((c) => (
                  <td key={c.key} style={c.align ? { textAlign: c.align } : undefined}>
                    {c.className ? <div className={c.className}>{c.render(row)}</div> : c.render(row)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
