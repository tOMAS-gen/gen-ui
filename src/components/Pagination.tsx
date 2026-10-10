"use client";

import { ChevronLeft, ChevronRight } from "./icons";
import { useLabels } from "./Provider";

/** Páginas a mostrar: primera, última y vecinas de la actual, con huecos (null). */
export function pageWindow(page: number, totalPages: number, siblings = 1): Array<number | null> {
  const pages: Array<number | null> = [];
  for (let p = 1; p <= totalPages; p++) {
    if (p === 1 || p === totalPages || Math.abs(p - page) <= siblings) pages.push(p);
    else if (pages[pages.length - 1] !== null) pages.push(null);
  }
  return pages;
}

/** Paginación numerada (1-based). No se muestra si hay una sola página. */
export function Pagination({
  page,
  totalPages,
  onChange,
  ariaLabel = "Paginación",
}: {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
  ariaLabel?: string;
}) {
  const labels = useLabels();
  if (totalPages <= 1) return null;
  return (
    <nav className="pagination" aria-label={ariaLabel}>
      <button type="button" disabled={page <= 1} onClick={() => onChange(page - 1)} aria-label={labels.previousPage}>
        <ChevronLeft size={16} />
      </button>
      {pageWindow(page, totalPages).map((p, i) =>
        p === null ? (
          <span key={`gap-${i}`} className="pagination-gap" aria-hidden="true">
            …
          </span>
        ) : (
          <button
            key={p}
            type="button"
            className={p === page ? "active" : ""}
            aria-current={p === page ? "page" : undefined}
            onClick={() => onChange(p)}
          >
            {p}
          </button>
        ),
      )}
      <button type="button" disabled={page >= totalPages} onClick={() => onChange(page + 1)} aria-label={labels.nextPage}>
        <ChevronRight size={16} />
      </button>
    </nav>
  );
}
