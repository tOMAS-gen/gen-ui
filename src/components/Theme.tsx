"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Monitor, Moon, Sun } from "./icons";
import { useGenUI } from "./Provider";

export type ThemePreference = "light" | "dark" | "system";

function resolve(theme: ThemePreference): "light" | "dark" {
  if (theme === "system") {
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  return theme;
}

/**
 * Script anti-parpadeo: fija `data-theme` en `<html>` antes de hidratar.
 * Renderizarlo en `<head>` (y `suppressHydrationWarning` en `<html>`).
 */
export function ThemeScript({ storageKey = "gen:theme" }: { storageKey?: string }) {
  const code = `(function(){try{var t=localStorage.getItem(${JSON.stringify(storageKey)});if(t!=="light"&&t!=="dark"){t=window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}document.documentElement.dataset.theme=t}catch(e){}})();`;
  return <script dangerouslySetInnerHTML={{ __html: code }} />;
}

/** Preferencia de tema persistida en `${storagePrefix}theme`. */
export function useTheme(): [ThemePreference, (t: ThemePreference) => void] {
  const { storagePrefix } = useGenUI();
  const key = `${storagePrefix}theme`;
  const [theme, setThemeState] = useState<ThemePreference>("system");

  useEffect(() => {
    const stored = localStorage.getItem(key);
    if (stored === "light" || stored === "dark" || stored === "system") setThemeState(stored);
  }, [key]);

  useEffect(() => {
    document.documentElement.dataset.theme = resolve(theme);
    if (theme !== "system") return;
    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => {
      document.documentElement.dataset.theme = resolve("system");
    };
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, [theme]);

  const setTheme = useCallback(
    (next: ThemePreference) => {
      setThemeState(next);
      try {
        localStorage.setItem(key, next);
      } catch {
        /* almacenamiento no disponible */
      }
    },
    [key],
  );

  return [theme, setTheme];
}

const ICON = { light: Sun, dark: Moon, system: Monitor };
const OPTIONS: ThemePreference[] = ["light", "dark", "system"];

/** Menú de tema (claro / oscuro / sistema). `mini` = sólo ícono (topbar, rail). */
export function ThemeToggle({ mini = false }: { mini?: boolean }) {
  const [theme, setTheme] = useTheme();
  const { labels } = useGenUI();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const LABEL = { light: labels.themeLight, dark: labels.themeDark, system: labels.themeSystem };
  const itemSelector = '[role="menuitem"]';

  useEffect(() => {
    if (!open) return;
    ref.current?.querySelector<HTMLElement>(itemSelector)?.focus();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
        return;
      }
      if (!["ArrowDown", "ArrowUp", "Home", "End"].includes(e.key)) return;
      e.preventDefault();
      const els = Array.from(ref.current?.querySelectorAll<HTMLElement>(itemSelector) ?? []);
      if (els.length === 0) return;
      const current = els.indexOf(document.activeElement as HTMLElement);
      let next: number;
      if (e.key === "Home") next = 0;
      else if (e.key === "End") next = els.length - 1;
      else if (e.key === "ArrowDown") next = current < els.length - 1 ? current + 1 : 0;
      else next = current > 0 ? current - 1 : els.length - 1;
      els[next]?.focus();
    };
    document.addEventListener("mousedown", onClickOutside);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onClickOutside);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const ActiveIcon = ICON[theme];

  return (
    <div ref={ref} className="theme-menu-wrap" style={{ position: "relative" }}>
      <button
        ref={triggerRef}
        type="button"
        className={`theme-menu-trigger ${mini ? "theme-menu-trigger-mini" : ""}`}
        aria-label={`${labels.theme}: ${LABEL[theme]}`}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
      >
        <ActiveIcon size={mini ? 18 : 15} />
        {!mini && <span className="theme-menu-label">{LABEL[theme]}</span>}
      </button>
      {open && (
        <div className="theme-menu-dropdown" role="menu">
          {OPTIONS.map((opt) => {
            const Icon = ICON[opt];
            return (
              <button
                key={opt}
                type="button"
                role="menuitem"
                className={`theme-menu-item ${theme === opt ? "active" : ""}`}
                onClick={() => {
                  setTheme(opt);
                  setOpen(false);
                }}
              >
                <Icon size={14} />
                {LABEL[opt]}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
