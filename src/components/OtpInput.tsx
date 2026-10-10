"use client";

import { forwardRef, useImperativeHandle, useRef, type ClipboardEvent, type KeyboardEvent } from "react";
import { cx } from "../lib/cx";

export type OtpInputHandle = { focus: () => void; clear: () => void };

/** Deja sólo dígitos y recorta al largo del código. */
export function sanitizeOtp(raw: string, length: number): string {
  return raw.replace(/\D/g, "").slice(0, length);
}

/**
 * Código de verificación de N dígitos (2FA, email). Avanza solo al escribir,
 * acepta pegar el código completo, Backspace vuelve a la casilla anterior y
 * flechas mueven el foco. `onComplete` se dispara al llenar la última casilla.
 */
export const OtpInput = forwardRef<
  OtpInputHandle,
  {
    value: string;
    onChange: (value: string) => void;
    onComplete?: (value: string) => void;
    length?: number;
    /** Separador visual en la mitad (123-456). */
    split?: boolean;
    invalid?: boolean;
    disabled?: boolean;
    autoFocus?: boolean;
    ariaLabel?: string;
    ariaDescribedBy?: string;
  }
>(function OtpInput(
  {
    value,
    onChange,
    onComplete,
    length = 6,
    split = true,
    invalid,
    disabled,
    autoFocus,
    ariaLabel = "Código de verificación",
    ariaDescribedBy,
  },
  ref,
) {
  const inputs = useRef<Array<HTMLInputElement | null>>([]);
  const digits = Array.from({ length }, (_, i) => value[i] ?? "");
  // Valor vigente aunque React todavía no haya re-renderizado (tipeo rápido,
  // foco que salta de casilla antes del próximo render).
  const current = useRef(value);
  current.current = value;

  const focusAt = (i: number) => {
    const el = inputs.current[Math.max(0, Math.min(length - 1, i))];
    el?.focus();
    el?.select();
  };

  useImperativeHandle(ref, () => ({
    focus: () => focusAt(Math.min(current.current.length, length - 1)),
    clear: () => {
      onChange("");
      focusAt(0);
    },
  }));

  const commit = (next: string) => {
    current.current = next;
    onChange(next);
    if (next.length === length) onComplete?.(next);
  };

  const setDigit = (at: number, raw: string) => {
    const i = Math.min(at, current.current.length);
    const typed = sanitizeOtp(raw, length);
    if (!typed) return;
    // Varios dígitos de golpe (autocompletado del SO): rellenan desde esta casilla.
    const chars = current.current.split("");
    for (let k = 0; k < typed.length && i + k < length; k++) chars[i + k] = typed[k];
    const next = chars.join("").slice(0, length);
    commit(next);
    focusAt(i + typed.length);
  };

  const onKeyDown = (i: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      // El código es contiguo desde el inicio: borrar quita el dígito y corre el resto.
      const chars = current.current.split("");
      if (chars[i]) {
        chars.splice(i, 1);
        current.current = chars.join("");
        onChange(current.current);
      } else if (i > 0) {
        chars.splice(i - 1, 1);
        current.current = chars.join("");
        onChange(current.current);
        focusAt(i - 1);
      }
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      focusAt(i - 1);
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      focusAt(i + 1);
    }
  };

  const onPaste = (e: ClipboardEvent<HTMLInputElement>) => {
    const pasted = sanitizeOtp(e.clipboardData.getData("text"), length);
    if (!pasted) return;
    e.preventDefault();
    commit(pasted);
    focusAt(pasted.length);
  };

  const half = Math.ceil(length / 2);

  return (
    <div className={cx("otp", invalid && "otp-error")} role="group" aria-label={ariaLabel} aria-describedby={ariaDescribedBy}>
      {digits.map((d, i) => (
        <span key={i} style={{ display: "contents" }}>
          {split && i === half && <span className="otp-sep" aria-hidden="true" />}
          <input
            ref={(el) => {
              inputs.current[i] = el;
            }}
            value={d}
            inputMode="numeric"
            autoComplete={i === 0 ? "one-time-code" : "off"}
            pattern="[0-9]*"
            maxLength={length}
            placeholder=" "
            disabled={disabled}
            autoFocus={autoFocus && i === 0}
            aria-label={`Dígito ${i + 1} de ${length}`}
            aria-invalid={invalid || undefined}
            onChange={(e) => {
              const prev = current.current[i] ?? "";
              setDigit(i, e.target.value.replace(prev, "") || e.target.value);
            }}
            onKeyDown={(e) => onKeyDown(i, e)}
            onPaste={onPaste}
            onFocus={(e) => {
              // No se puede saltear casillas: el foco va a la primera vacía.
              if (i > current.current.length) focusAt(current.current.length);
              else e.target.select();
            }}
          />
        </span>
      ))}
    </div>
  );
});
