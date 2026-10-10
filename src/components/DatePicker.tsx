"use client";

import { useRef } from "react";
import { cx } from "../lib/cx";
import { Calendar } from "./icons";
import { useLabels } from "./Provider";

/** `YYYY-MM-DD` → `DD/MM/YYYY`. */
export function formatIsoDate(iso: string): string {
  const [year, month, day] = iso.split("-");
  if (!year || !month || !day) return iso;
  return `${day}/${month}/${year}`;
}

/** Chip de fecha que abre el selector nativo; con botón para quitarla. */
export function DatePicker({
  value,
  onChange,
  ariaLabel,
  emptyLabel,
  className,
}: {
  value: string | null;
  onChange: (iso: string | null) => void;
  ariaLabel: string;
  emptyLabel?: string;
  className?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const labels = useLabels();

  const openPicker = () => {
    inputRef.current?.showPicker?.();
    inputRef.current?.focus();
  };

  return (
    <span className={cx("date-picker-trigger", className)}>
      <button type="button" className="date-picker-btn" onClick={openPicker}>
        <Calendar size={14} />
        <span>{value ? formatIsoDate(value) : (emptyLabel ?? labels.noDate)}</span>
      </button>
      {value && (
        <button
          type="button"
          className="date-picker-clear"
          aria-label={labels.clearDate}
          onClick={(e) => {
            e.stopPropagation();
            onChange(null);
          }}
        >
          ×
        </button>
      )}
      <input
        ref={inputRef}
        type="date"
        aria-label={ariaLabel}
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value || null)}
        className="date-picker-input"
      />
    </span>
  );
}
