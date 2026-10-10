"use client";

import type { ComponentType, KeyboardEvent, ReactNode } from "react";
import { cx } from "../lib/cx";
import { useGenUI } from "./Provider";

export type TabItem = {
  key: string;
  label: string;
  icon?: ComponentType<{ size?: number; "aria-hidden"?: boolean | "true" }>;
  /** Contador o marca a la derecha del label. */
  badge?: ReactNode;
};

/** Navegación con flechas/Home/End entre botones hermanos de un grupo. */
function rovingKey(
  event: KeyboardEvent<HTMLElement>,
  index: number,
  count: number,
  selector: string,
  onMove: (next: number) => void,
) {
  let next = index;
  if (event.key === "ArrowRight") next = (index + 1) % count;
  else if (event.key === "ArrowLeft") next = (index - 1 + count) % count;
  else if (event.key === "Home") next = 0;
  else if (event.key === "End") next = count - 1;
  else return;
  event.preventDefault();
  onMove(next);
  event.currentTarget.parentElement?.querySelectorAll<HTMLElement>(selector)[next]?.focus();
}

/** Tabs (role=tablist) con lengüeta de 3px; flechas, Home y End. */
export function Tabs({
  items,
  activeKey,
  onChange,
  panelId,
  ariaLabel,
  className,
}: {
  items: TabItem[];
  activeKey: string;
  onChange: (key: string) => void;
  /** id del panel controlado (aria-controls). */
  panelId?: string;
  ariaLabel: string;
  className?: string;
}) {
  return (
    <div className={cx("tabs", className)} role="tablist" aria-label={ariaLabel}>
      {items.map((item, index) => {
        const Icon = item.icon;
        const active = item.key === activeKey;
        return (
          <button
            key={item.key}
            type="button"
            role="tab"
            id={panelId ? `${panelId}-tab-${item.key}` : undefined}
            aria-controls={panelId}
            aria-selected={active}
            tabIndex={active ? 0 : -1}
            className={active ? "active" : ""}
            onKeyDown={(e) => rovingKey(e, index, items.length, '[role="tab"]', (n) => onChange(items[n].key))}
            onClick={() => onChange(item.key)}
          >
            {Icon && <Icon size={16} aria-hidden="true" />}
            {item.label}
            {item.badge}
          </button>
        );
      })}
    </div>
  );
}

/** Tabs de navegación entre rutas (links con aria-current). */
export function RouteTabs({
  items,
  activeHref,
  ariaLabel,
  className,
}: {
  items: { href: string; label: string }[];
  /** href activo; el consumidor resuelve el match con su router. */
  activeHref: string | null;
  ariaLabel: string;
  className?: string;
}) {
  const { Link } = useGenUI();
  return (
    <nav className={cx("section-tabs", className)} aria-label={ariaLabel}>
      {items.map((item) => (
        <Link key={item.href} href={item.href} aria-current={item.href === activeHref ? "page" : undefined}>
          {item.label}
        </Link>
      ))}
    </nav>
  );
}

export type SegmentOption<T extends string> = { value: T; label: ReactNode; ariaLabel?: string };

/** Control segmentado (2–4 opciones excluyentes). */
export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  ariaLabel,
  className,
}: {
  options: SegmentOption<T>[];
  value: T;
  onChange: (value: T) => void;
  ariaLabel: string;
  className?: string;
}) {
  return (
    <div className={cx("segmented", className)} role="radiogroup" aria-label={ariaLabel}>
      {options.map((o, index) => {
        const active = o.value === value;
        return (
          <button
            key={o.value}
            type="button"
            role="radio"
            aria-checked={active}
            aria-label={o.ariaLabel}
            tabIndex={active ? 0 : -1}
            className={cx("segmented-btn", active && "is-active")}
            onKeyDown={(e) => rovingKey(e, index, options.length, '[role="radio"]', (n) => onChange(options[n].value))}
            onClick={() => onChange(o.value)}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

/** Selector de vista sólo íconos (grilla/lista) con aria-pressed. */
export function ViewSwitch<T extends string>({
  options,
  value,
  onChange,
  ariaLabel,
}: {
  options: { value: T; label: string; icon: ComponentType<{ size?: number }> }[];
  value: T;
  onChange: (value: T) => void;
  ariaLabel: string;
}) {
  return (
    <div className="view-switch" role="group" aria-label={ariaLabel}>
      {options.map((o) => {
        const Icon = o.icon;
        return (
          <button
            key={o.value}
            type="button"
            aria-pressed={o.value === value}
            aria-label={o.label}
            title={o.label}
            onClick={() => onChange(o.value)}
          >
            <Icon size={18} />
          </button>
        );
      })}
    </div>
  );
}
