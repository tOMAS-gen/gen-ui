"use client";

import {
  forwardRef,
  useId,
  useLayoutEffect,
  useReducer,
  useRef,
  useState,
  type ChangeEvent,
  type ClipboardEvent,
  type FocusEvent,
  type InputHTMLAttributes,
  type ReactNode,
} from "react";
import { cx } from "../lib/cx";
import { useFieldContext } from "./Field";
import { AlertCircle } from "./icons";

export type MoneyCurrency = "ARS" | "USD";

const CURRENCY: Record<MoneyCurrency, { symbol: string; description: string }> = {
  ARS: { symbol: "$", description: "pesos argentinos" },
  USD: { symbol: "US$", description: "dólares estadounidenses" },
};

/** 13 dígitos enteros + 2 decimales = 15 dígitos: entra siempre en un entero seguro de JavaScript. */
const MAX_INTEGER_DIGITS = 13;
export const MAX_MONEY_CENTS = 10 ** (MAX_INTEGER_DIGITS + 2) - 1;

/** El valor como centavos válidos (entero, de 0 al máximo), o `null` si no lo es. */
function validCents(value: number | null | undefined): number | null {
  return typeof value === "number" && Number.isSafeInteger(value) && value >= 0 && value <= MAX_MONEY_CENTS ? value : null;
}

const groupThousands = (digits: string) => digits.replace(/\B(?=(\d{3})+(?!\d))/g, ".");

/** Centavos como texto `es-AR` con dos decimales: `123456` → `"1.234,56"`. */
export function formatCents(cents: number): string {
  const c = validCents(cents);
  if (c === null) return "";
  return `${groupThousands(String(Math.floor(c / 100)))},${String(c % 100).padStart(2, "0")}`;
}

/** Importe para mostrar, con la moneda: `formatMoney(123456, "USD")` → `"US$ 1.234,56"`. */
export function formatMoney(cents: number, currency: MoneyCurrency = "ARS"): string {
  return `${CURRENCY[currency].symbol} ${formatCents(cents)}`;
}

/**
 * Lee un importe escrito o pegado y devuelve **centavos enteros**, sin pasar nunca por un flotante.
 * Entiende `1.234,56` (es-AR), `1234,5`, `1234.56` (un punto con uno o dos decimales) y un símbolo delante (`$`, `US$`).
 * Devuelve `null` si no es un importe válido o si trae más de dos decimales (no redondea plata).
 */
export function parseMoney(text: string): number | null {
  const t = text.replace(/[\s ]/g, "").replace(/^(US\$|\$|ARS|USD)/i, "");
  if (!/^[\d.,]+$/.test(t)) return null;
  let int: string;
  let frac = "";
  const comma = t.lastIndexOf(",");
  if (comma >= 0) {
    int = t.slice(0, comma).replace(/\./g, "");
    frac = t.slice(comma + 1);
    if (/[.,]/.test(frac) || /,/.test(int)) return null;
  } else {
    const groups = t.split(".");
    if (groups.length === 2 && groups[1].length >= 1 && groups[1].length <= 2) {
      // "1234.5" / "1234.56": un punto con uno o dos decimales es el decimal de quien escribe a la inglesa.
      [int, frac] = groups;
    } else {
      // Si no, los puntos son miles: grupos de tres, con 1 a 3 dígitos al principio.
      if (groups.length > 1 && (groups[0].length > 3 || groups.slice(1).some((g) => g.length !== 3))) return null;
      int = groups.join("");
    }
  }
  if (frac.length > 2) return null;
  int = int.replace(/^0+(?=\d)/, "");
  if (int.length > MAX_INTEGER_DIGITS) return null;
  if (int === "" && frac === "") return null;
  return Number((int || "0") + frac.padEnd(2, "0"));
}

/** Mensaje para un importe fuera de rango o faltante (o `null` si está bien). */
export function moneyError(
  cents: number | null,
  { min, max, currency = "ARS", required }: { min?: number; max?: number; currency?: MoneyCurrency; required?: boolean },
): string | null {
  if (cents === null) return required ? "Ingresá un importe." : null;
  if (min !== undefined && cents < min) return `El importe mínimo es ${formatMoney(min, currency)}.`;
  if (max !== undefined && cents > max) return `El importe máximo es ${formatMoney(max, currency)}.`;
  return null;
}

/**
 * Texto del campo mientras se escribe: sólo dígitos y una coma, miles con punto y hasta dos decimales.
 * Un punto al final es el punto del teclado numérico: se toma como coma. Los demás puntos son los miles que ya puso el campo.
 */
function typedText(raw: string): string {
  let s = raw.replace(/[^\d.,]/g, "");
  if (!s.includes(",") && s.endsWith(".")) s = `${s.slice(0, -1)},`;
  const comma = s.indexOf(",");
  const hasComma = comma >= 0;
  const intRaw = (hasComma ? s.slice(0, comma) : s).replace(/\./g, "");
  const fracRaw = hasComma ? s.slice(comma + 1).replace(/[.,]/g, "").slice(0, 2) : "";
  const int = intRaw.replace(/^0+(?=\d)/, "").slice(0, MAX_INTEGER_DIGITS);
  if (!int && !hasComma) return "";
  return `${groupThousands(int || "0")}${hasComma ? `,${fracRaw}` : ""}`;
}

/** Posición del cursor después de `n` caracteres significativos (dígitos y coma). */
function caretAfter(text: string, n: number): number {
  if (n <= 0) return 0;
  let seen = 0;
  for (let i = 0; i < text.length; i++) {
    if (/[\d,]/.test(text[i]) && ++seen === n) return i + 1;
  }
  return text.length;
}

export type MoneyInputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "value" | "defaultValue" | "onChange" | "type" | "min" | "max" | "size" | "inputMode"
> & {
  /** Importe en **centavos enteros** (controlado). `null` = vacío. */
  value?: number | null;
  /** Importe inicial en centavos (no controlado). */
  defaultValue?: number | null;
  /** Recibe centavos enteros, o `null` si el campo quedó vacío. */
  onChange?: (cents: number | null) => void;
  currency?: MoneyCurrency;
  /** Mínimo y máximo permitidos, en centavos. Al salir del campo, uno fuera de rango se marca inválido con su mensaje. */
  min?: number;
  max?: number;
  invalid?: boolean;
  /** Mensaje de error propio. Dentro de un `Field`, usá el `error` del `Field`. */
  error?: ReactNode;
};

/**
 * Importe con moneda (`ARS`, `USD`). Se escribe con separadores `es-AR` (miles con punto, decimales con coma) y
 * entrega y recibe **centavos enteros**: `$ 1.234,56` ↔ `123456`. Con `name`, el formulario envía los centavos.
 * Toma id y ayuda de un `Field` que lo envuelva, como `Input`.
 */
export const MoneyInput = forwardRef<HTMLInputElement, MoneyInputProps>(function MoneyInput(
  {
    value,
    defaultValue,
    onChange,
    currency = "ARS",
    min,
    max,
    invalid,
    error,
    name,
    id: idProp,
    required,
    className,
    onBlur,
    onPaste,
    ...props
  },
  forwardedRef,
) {
  const field = useFieldContext();
  const autoId = useId();
  const id = idProp ?? field?.id ?? autoId;
  const inputRef = useRef<HTMLInputElement | null>(null);
  const caret = useRef<number | null>(null);
  const [, rerender] = useReducer((n: number) => n + 1, 0);
  const [touched, setTouched] = useState(false);

  const controlled = value !== undefined;
  const [text, setText] = useState(() => {
    const initial = validCents(controlled ? value : defaultValue);
    return initial === null ? "" : formatCents(initial);
  });

  const cents = parseMoney(text);
  // Controlado: si el valor de afuera ya no es el del campo (lo cambió la app), el campo lo sigue.
  if (controlled && validCents(value) !== cents) setText(validCents(value) === null ? "" : formatCents(validCents(value)!));

  // Después de dar formato, el cursor vuelve al lugar donde se estaba escribiendo.
  useLayoutEffect(() => {
    const el = inputRef.current;
    if (caret.current !== null && el && document.activeElement === el) el.setSelectionRange(caret.current, caret.current);
    caret.current = null;
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    const next = typedText(raw);
    const significant = raw.slice(0, e.target.selectionStart ?? raw.length).replace(/[^\d,]/g, "").length;
    caret.current = raw.endsWith(".") ? next.length : caretAfter(next, significant);
    setText(next);
    rerender();
    onChange?.(parseMoney(next));
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    onPaste?.(e);
    if (e.defaultPrevented) return;
    const el = e.currentTarget;
    const replacesAll = el.selectionStart === 0 && el.selectionEnd === el.value.length;
    const pasted = parseMoney(e.clipboardData.getData("text"));
    if (pasted === null || !replacesAll) return;
    e.preventDefault();
    setText(formatCents(pasted));
    onChange?.(pasted);
  };

  const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
    onBlur?.(e);
    setTouched(true);
    // Al salir, los centavos quedan completos: "1.234,5" → "1.234,50".
    if (cents !== null) setText(formatCents(cents));
  };

  const rangeMessage = touched ? moneyError(cents, { min, max, currency, required }) : null;
  const message = error ?? rangeMessage;
  const isInvalid = Boolean(invalid || field?.invalid || message);
  // Si el `Field` ya muestra su error, no repetimos el mensaje.
  const messageId = message && !field?.invalid ? `${id}-money-error` : undefined;
  const currencyId = `${id}-money-currency`;
  const describedBy = [props["aria-describedby"], field?.describedBy, messageId, currencyId].filter(Boolean).join(" ");

  return (
    <div className="money-input">
      <span className={cx("input-wrap", `money-input-${currency.toLowerCase()}`)}>
        <span className="input-adornment money-input-symbol" aria-hidden="true">
          {CURRENCY[currency].symbol}
        </span>
        <input
          {...props}
          ref={(el) => {
            inputRef.current = el;
            if (typeof forwardedRef === "function") forwardedRef(el);
            else if (forwardedRef) forwardedRef.current = el;
          }}
          id={id}
          type="text"
          inputMode="decimal"
          autoComplete="off"
          spellCheck={false}
          value={text}
          required={required}
          aria-invalid={isInvalid || undefined}
          aria-describedby={describedBy}
          className={cx("money-input-field", isInvalid && "input-error", className)}
          onChange={handleChange}
          onPaste={handlePaste}
          onBlur={handleBlur}
        />
        <span className="money-input-code" aria-hidden="true">
          {currency}
        </span>
      </span>
      <span id={currencyId} className="visually-hidden">
        Importe en {CURRENCY[currency].description}
      </span>
      {name && <input type="hidden" name={name} value={cents ?? ""} />}
      {messageId && (
        <p className="field-error" id={messageId}>
          <AlertCircle size={14} />
          {message}
        </p>
      )}
    </div>
  );
});
