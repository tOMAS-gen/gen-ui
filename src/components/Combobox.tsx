"use client";

import { useId, useState, type ReactNode } from "react";
import { useLabels } from "./Provider";

/**
 * Autocompletar controlado: el consumidor busca (con debounce, fetch, etc.) y
 * pasa `results`. Flechas recorren, Enter elige, Escape cierra.
 */
export function Combobox<T>({
  query,
  onQueryChange,
  results,
  loading,
  onSelect,
  getKey,
  renderItem,
  placeholder,
  ariaLabel,
  emptyText,
}: {
  query: string;
  onQueryChange: (q: string) => void;
  results: T[];
  loading?: boolean;
  onSelect: (item: T) => void;
  getKey: (item: T) => string;
  renderItem: (item: T) => ReactNode;
  placeholder?: string;
  ariaLabel: string;
  emptyText?: string;
}) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const listId = useId();
  const labels = useLabels();
  const showList = open && query.trim().length > 0;

  const choose = (item: T) => {
    onSelect(item);
    setOpen(false);
  };

  return (
    <div className="combobox">
      <input
        className="combobox-input"
        role="combobox"
        aria-label={ariaLabel}
        aria-expanded={showList}
        aria-controls={listId}
        aria-autocomplete="list"
        aria-activedescendant={showList && results[active] ? `${listId}-${active}` : undefined}
        value={query}
        placeholder={placeholder}
        onChange={(e) => {
          onQueryChange(e.target.value);
          setActive(0);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 120)}
        onKeyDown={(e) => {
          if (!showList) return;
          if (e.key === "ArrowDown") {
            e.preventDefault();
            setActive((a) => Math.min(results.length - 1, a + 1));
          } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setActive((a) => Math.max(0, a - 1));
          } else if (e.key === "Enter" && results[active]) {
            e.preventDefault();
            choose(results[active]);
          } else if (e.key === "Escape") {
            setOpen(false);
          }
        }}
      />
      {showList && (
        <div className="combobox-dropdown" id={listId} role="listbox" aria-label={ariaLabel}>
          {loading ? (
            <div className="combobox-loading">{labels.loading}</div>
          ) : results.length === 0 ? (
            <div className="combobox-empty">{emptyText ?? labels.noResults}</div>
          ) : (
            results.map((item, i) => (
              <div
                key={getKey(item)}
                id={`${listId}-${i}`}
                role="option"
                aria-selected={i === active}
                className={`combobox-item ${i === active ? "active" : ""}`}
                onMouseDown={(e) => e.preventDefault()}
                onMouseEnter={() => setActive(i)}
                onClick={() => choose(item)}
              >
                {renderItem(item)}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
