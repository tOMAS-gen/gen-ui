"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { createRoot, type Root } from "react-dom/client";
import { AlertCircle, CheckCircle, Info, X } from "./icons";
import { useGenUI } from "./Provider";

/**
 * Avisos no bloqueantes, apilados abajo a la derecha (máx. 3).
 *
 * - `useToast().toast(mensaje, tipo?, opciones?)` dentro de `<ToastProvider>`.
 * - `showToast({ message, href?, linkLabel?, type? })` imperativo, desde
 *   cualquier lado: usa el provider montado o, si no hay, monta uno propio.
 *
 * success/info se cierran a los 3 s; error y los que traen link quedan hasta
 * que se cierran a mano (si se autocierra un link, no se llega a clickear).
 * No roban foco: role="status" + aria-live="polite".
 */

export type ToastType = "success" | "error" | "info";

export type ToastOptions = { href?: string; linkLabel?: string };

export type ShowToastOptions = ToastOptions & { message: string; type?: ToastType };

const AUTO_DISMISS_MS = 3000;
const EXIT_ANIM_MS = 180; // = duración de .toast-item-closing
const MAX_VISIBLE = 3;

type ToastData = ToastOptions & { id: number; message: string; type: ToastType; closing: boolean };

type ToastFn = (message: string, type?: ToastType, options?: ToastOptions) => void;

const ToastContext = createContext<{ toast: ToastFn } | null>(null);

const TYPE_ICON: Record<ToastType, typeof CheckCircle> = {
  success: CheckCircle,
  error: AlertCircle,
  info: Info,
};

let seq = 0;
/** Provider montado más recientemente (destino de `showToast`). */
let activeToast: ToastFn | null = null;
let fallbackRoot: Root | null = null;
let fallbackQueue: ShowToastOptions[] = [];

export function showToast(options: ShowToastOptions): void {
  if (typeof document === "undefined") return;
  if (activeToast) {
    activeToast(options.message, options.type, options);
    return;
  }
  // Sin provider: monta uno en un contenedor propio y entrega al registrarse.
  fallbackQueue.push(options);
  if (fallbackRoot) return;
  const container = document.createElement("div");
  document.body.appendChild(container);
  fallbackRoot = createRoot(container);
  fallbackRoot.render(<ToastProvider>{null}</ToastProvider>);
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastData[]>([]);
  const timers = useRef(new Map<number, ReturnType<typeof setTimeout>>());
  const { labels, Link } = useGenUI();

  const remove = useCallback((id: number) => {
    const timer = timers.current.get(id);
    if (timer) clearTimeout(timer);
    timers.current.delete(id);
    setToasts((current) => current.filter((t) => t.id !== id));
  }, []);

  const startClosing = useCallback(
    (id: number) => {
      const timer = timers.current.get(id);
      if (timer) clearTimeout(timer);
      setToasts((current) => current.map((t) => (t.id === id ? { ...t, closing: true } : t)));
      timers.current.set(
        id,
        setTimeout(() => remove(id), EXIT_ANIM_MS),
      );
    },
    [remove],
  );

  const toast = useCallback<ToastFn>(
    (message, type = "info", options) => {
      const id = ++seq;
      setToasts((current) => {
        const next = [...current, { id, message, type, closing: false, ...options }];
        return next.length > MAX_VISIBLE ? next.slice(next.length - MAX_VISIBLE) : next;
      });
      if (type !== "error" && !options?.href) {
        timers.current.set(
          id,
          setTimeout(() => startClosing(id), AUTO_DISMISS_MS),
        );
      }
    },
    [startClosing],
  );

  useEffect(() => {
    const previous = activeToast;
    activeToast = toast;
    const queued = fallbackQueue;
    fallbackQueue = [];
    queued.forEach((o) => toast(o.message, o.type, o));
    const timersMap = timers.current;
    return () => {
      if (activeToast === toast) activeToast = previous;
      timersMap.forEach((timer) => clearTimeout(timer));
      timersMap.clear();
    };
  }, [toast]);

  const value = useMemo(() => ({ toast }), [toast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="toast-stack">
        {toasts.map((t) => {
          const Icon = TYPE_ICON[t.type];
          const persistent = t.type === "error" || Boolean(t.href);
          return (
            <div
              key={t.id}
              className={`toast-item toast-item-${t.type} ${t.closing ? "toast-item-closing" : ""}`}
              role="status"
              aria-live="polite"
            >
              <Icon size={16} className="toast-item-icon" />
              <span className="toast-item-message">{t.message}</span>
              {t.href && (
                <Link className="toast-link" href={t.href} onClick={() => startClosing(t.id)}>
                  {t.linkLabel ?? "Ver"}
                </Link>
              )}
              {persistent && (
                <button
                  type="button"
                  className="toast-item-close"
                  onClick={() => startClosing(t.id)}
                  aria-label={labels.dismiss}
                >
                  <X size={14} />
                </button>
              )}
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): { toast: ToastFn } {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast debe usarse dentro de <ToastProvider>");
  return ctx;
}
