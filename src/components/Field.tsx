"use client";

import {
  createContext,
  forwardRef,
  useContext,
  useId,
  useRef,
  useState,
  type InputHTMLAttributes,
  type ReactNode,
  type SelectHTMLAttributes,
  type TextareaHTMLAttributes,
} from "react";
import { cx } from "../lib/cx";
import { AlertCircle, Eye, EyeOff, Search, X } from "./icons";
import { CharLimit } from "./CharLimit";
import { useLabels } from "./Provider";

type FieldContextValue = { id: string; describedBy?: string; invalid: boolean };

const FieldContext = createContext<FieldContextValue | null>(null);

/** Props ARIA que un control hereda del `<Field>` que lo envuelve. */
function useFieldProps(id?: string, invalid?: boolean) {
  const ctx = useContext(FieldContext);
  return {
    id: id ?? ctx?.id,
    "aria-describedby": ctx?.describedBy,
    "aria-invalid": invalid || ctx?.invalid || undefined,
    invalid: invalid || ctx?.invalid || false,
  };
}

/**
 * Campo de formulario: label + control + ayuda o error (+ contador opcional).
 * El control hijo (`Input`, `Select`, `Textarea`, `PasswordInput`…) toma id y
 * aria-describedby del campo automáticamente.
 */
export function Field({
  label,
  hint,
  error,
  optional,
  labelAction,
  charCount,
  id: idProp,
  className,
  children,
}: {
  label: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
  /** Texto "(opcional)" junto al label; `true` usa el default. */
  optional?: boolean | string;
  /** Acción a la derecha del label (p. ej. "¿Olvidaste tu contraseña?"). */
  labelAction?: ReactNode;
  /** Muestra el contador de caracteres bajo el control. */
  charCount?: { length: number; max: number };
  id?: string;
  className?: string;
  children: ReactNode;
}) {
  const autoId = useId();
  const id = idProp ?? autoId;
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const countId = charCount ? `${id}-count` : undefined;
  const describedBy = [errorId, hintId, countId].filter(Boolean).join(" ") || undefined;
  const labelNode = (
    <label className="field-label" htmlFor={id}>
      {label}
      {optional && <span className="field-optional"> {optional === true ? "(opcional)" : optional}</span>}
    </label>
  );
  return (
    <FieldContext.Provider value={{ id, describedBy, invalid: Boolean(error) }}>
      <div className={cx("field", className)}>
        {labelAction ? (
          <div className="field-label-row">
            {labelNode}
            {labelAction}
          </div>
        ) : (
          labelNode
        )}
        {children}
        {error ? (
          <p className="field-error" id={errorId}>
            <AlertCircle size={14} />
            {error}
          </p>
        ) : (
          hint && (
            <p className="field-hint" id={hintId}>
              {hint}
            </p>
          )
        )}
        {charCount && <CharLimit id={countId} length={charCount.length} max={charCount.max} />}
      </div>
    </FieldContext.Provider>
  );
}

export type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  invalid?: boolean;
  /** Ícono a la izquierda, dentro del campo. */
  startIcon?: ReactNode;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { id, invalid, startIcon, className, ...props },
  ref,
) {
  const { invalid: isInvalid, ...field } = useFieldProps(id, invalid);
  const input = <input ref={ref} {...field} className={cx(isInvalid && "input-error", className)} {...props} />;
  if (!startIcon) return input;
  return (
    <span className="input-wrap input-wrap-start">
      <span className="input-adornment">{startIcon}</span>
      {input}
    </span>
  );
});

/** Contraseña con botón mostrar/ocultar. */
export const PasswordInput = forwardRef<HTMLInputElement, Omit<InputProps, "type">>(function PasswordInput(
  { id, invalid, startIcon, className, ...props },
  ref,
) {
  const [visible, setVisible] = useState(false);
  const labels = useLabels();
  const { invalid: isInvalid, ...field } = useFieldProps(id, invalid);
  return (
    <span className={cx("input-wrap input-wrap-end", Boolean(startIcon) && "input-wrap-start")}>
      {startIcon && <span className="input-adornment">{startIcon}</span>}
      <input
        ref={ref}
        type={visible ? "text" : "password"}
        {...field}
        className={cx(isInvalid && "input-error", className)}
        {...props}
      />
      <button
        type="button"
        className="icon-btn input-action"
        aria-label={visible ? labels.hidePassword : labels.showPassword}
        aria-pressed={visible}
        onClick={() => setVisible((v) => !v)}
      >
        {visible ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    </span>
  );
});

export const Textarea = forwardRef<
  HTMLTextAreaElement,
  TextareaHTMLAttributes<HTMLTextAreaElement> & { invalid?: boolean }
>(function Textarea({ id, invalid, className, ...props }, ref) {
  const { invalid: isInvalid, ...field } = useFieldProps(id, invalid);
  return <textarea ref={ref} {...field} className={cx(isInvalid && "input-error", className)} {...props} />;
});

export type SelectOption = { value: string; label: string; disabled?: boolean };

export const Select = forwardRef<
  HTMLSelectElement,
  SelectHTMLAttributes<HTMLSelectElement> & { invalid?: boolean; options?: SelectOption[]; placeholder?: string }
>(function Select({ id, invalid, options, placeholder, className, children, ...props }, ref) {
  const { invalid: isInvalid, ...field } = useFieldProps(id, invalid);
  return (
    <select ref={ref} {...field} className={cx(isInvalid && "input-error", className)} {...props}>
      {placeholder !== undefined && <option value="">{placeholder}</option>}
      {options?.map((o) => (
        <option key={o.value} value={o.value} disabled={o.disabled}>
          {o.label}
        </option>
      ))}
      {children}
    </select>
  );
});

type CheckProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & {
  label: ReactNode;
  hint?: ReactNode;
};

export const Checkbox = forwardRef<HTMLInputElement, CheckProps>(function Checkbox(
  { label, hint, className, ...props },
  ref,
) {
  return (
    <label className={cx("check", className)}>
      <input ref={ref} type="checkbox" {...props} />
      <span>
        {label}
        {hint && <span className="check-hint">{hint}</span>}
      </span>
    </label>
  );
});

export const Radio = forwardRef<HTMLInputElement, CheckProps>(function Radio({ label, hint, className, ...props }, ref) {
  return (
    <label className={cx("check", className)}>
      <input ref={ref} type="radio" {...props} />
      <span>
        {label}
        {hint && <span className="check-hint">{hint}</span>}
      </span>
    </label>
  );
});

export const Switch = forwardRef<HTMLInputElement, Omit<CheckProps, "hint">>(function Switch(
  { label, className, ...props },
  ref,
) {
  return (
    <label className={cx("switch", className)}>
      <input ref={ref} type="checkbox" role="switch" {...props} />
      <span className="switch-track" aria-hidden="true" />
      <span>{label}</span>
    </label>
  );
});

/** Búsqueda con ícono y botón limpiar (estilo toolbar). */
export function SearchInput({
  value,
  onChange,
  placeholder,
  ariaLabel,
  className,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  ariaLabel: string;
  className?: string;
}) {
  const labels = useLabels();
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <div className={cx("search-input", className)}>
      <Search size={20} aria-hidden="true" />
      <input
        ref={inputRef}
        type="search"
        value={value}
        placeholder={placeholder}
        aria-label={ariaLabel}
        onChange={(e) => onChange(e.target.value)}
      />
      {value && (
        <button
          type="button"
          className="search-input-clear"
          aria-label={labels.clearSearch}
          onClick={() => {
            onChange("");
            inputRef.current?.focus();
          }}
        >
          <X size={16} aria-hidden="true" />
        </button>
      )}
    </div>
  );
}
