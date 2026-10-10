"use client";

import { useEffect, useId, useRef, type ReactNode } from "react";
import { cx } from "../lib/cx";
import { X } from "./icons";
import { useLabels } from "./Provider";

/**
 * Diálogo sobre `<dialog>` nativo: foco atrapado, Esc cierra, scrim y retorno
 * de foco los maneja el navegador. Click en el backdrop también cierra.
 */
export function Dialog({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  allowOverflow,
  className,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: ReactNode;
  children: ReactNode;
  /** Botonera al pie (alineada a la derecha). */
  footer?: ReactNode;
  /** Deja que un popover interno se desborde del rectángulo del diálogo. */
  allowOverflow?: boolean;
  className?: string;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const labels = useLabels();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (open && !el.open) el.showModal();
    if (!open && el.open) el.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      className={cx("dialog", allowOverflow && "dialog--overflow-visible", className)}
      onClose={onClose}
      onCancel={onClose}
      onClick={(e) => {
        if (e.target === ref.current) onClose();
      }}
    >
      <div className="dialog-body">
        <div className="dialog-header">
          <h2 id={titleId} className="dialog-title">
            {title}
          </h2>
          <button type="button" className="icon-btn" onClick={onClose} aria-label={labels.close}>
            <X size={18} />
          </button>
        </div>
        {description && <p className="dialog-description">{description}</p>}
        {children}
        {footer && <div className="dialog-actions">{footer}</div>}
      </div>
    </dialog>
  );
}
