"use client";

import { useEffect, useRef, useState, type ComponentType, type ReactNode } from "react";
import { cx } from "../lib/cx";
import { Button } from "./Button";
import { EmptyState } from "./EmptyState";
import { History, type IconProps } from "./icons";
import type { StatusTone } from "./Tag";

export type TimelineEvent = {
  id: string;
  /** Cuándo pasó. */
  at: Date | string | number;
  /** Quién lo hizo (nombre, correo o "Sistema"). */
  actor?: ReactNode;
  /** Qué pasó. */
  title: ReactNode;
  /** Detalle opcional: texto, o por ejemplo el valor anterior y el nuevo. */
  detail?: ReactNode;
  /** Clave del tipo de evento; toma ícono y tono de `types`. */
  type?: string;
  /** Ícono propio (pisa el del tipo). El estado no debe depender sólo del color: conviene un ícono distinto por tono. */
  icon?: ComponentType<IconProps>;
  /** Color del marcador (pisa el del tipo). */
  tone?: StatusTone;
};

export type TimelineType = { icon?: ComponentType<IconProps>; tone?: StatusTone };

const MONTHS = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
const WEEKDAYS = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];

type Parts = { year: number; month: number; day: number; hour: number; minute: number };

/** Fecha y hora de pared en la zona indicada (la del navegador si no se indica), sin depender de los textos del idioma. */
function partsOf(date: Date, timeZone?: string): Parts {
  const out: Record<string, number> = {};
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hourCycle: "h23",
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  });
  for (const p of formatter.formatToParts(date)) if (p.type !== "literal") out[p.type] = Number(p.value);
  return out as Parts;
}

const pad = (n: number) => String(n).padStart(2, "0");
const dayKey = (p: Parts) => `${p.year}-${pad(p.month)}-${pad(p.day)}`;
const dayIndex = (p: Parts) => Math.floor(Date.UTC(p.year, p.month - 1, p.day) / 86_400_000);

function toDate(at: TimelineEvent["at"]): Date | null {
  const d = at instanceof Date ? at : new Date(at);
  return Number.isNaN(d.getTime()) ? null : d;
}

/** "14:35" */
function formatTime(date: Date, timeZone?: string): string {
  const p = partsOf(date, timeZone);
  return `${pad(p.hour)}:${pad(p.minute)}`;
}

/** "3 de noviembre de 2026, 14:35" (con el año sólo si no es el actual). */
function formatDateTime(date: Date, { now = new Date(), timeZone }: { now?: Date; timeZone?: string } = {}): string {
  const p = partsOf(date, timeZone);
  const year = p.year === partsOf(now, timeZone).year ? "" : ` de ${p.year}`;
  return `${p.day} de ${MONTHS[p.month - 1]}${year}, ${pad(p.hour)}:${pad(p.minute)}`;
}

/** "hace un momento", "hace 5 min", "hace 3 h", "ayer", "hace 4 días"; pasadas las semanas, la fecha ("3 de octubre"). */
export function formatRelativeTime(date: Date, { now = new Date(), timeZone }: { now?: Date; timeZone?: string } = {}): string {
  const seconds = Math.round((now.getTime() - date.getTime()) / 1000);
  if (seconds < 60) return "hace un momento";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `hace ${minutes} min`;
  const days = dayIndex(partsOf(now, timeZone)) - dayIndex(partsOf(date, timeZone));
  const hours = Math.floor(minutes / 60);
  if (hours < 24 && days <= 0) return `hace ${hours} h`;
  if (days === 1) return "ayer";
  if (days < 30) return `hace ${days} días`;
  const p = partsOf(date, timeZone);
  const sameYear = p.year === partsOf(now, timeZone).year;
  return `${p.day} de ${MONTHS[p.month - 1]}${sameYear ? "" : ` de ${p.year}`}`;
}

/** Título del grupo de un día: "Hoy", "Ayer", "lunes 2 de noviembre" (con el año si no es el actual). */
export function formatDayHeading(date: Date, { now = new Date(), timeZone }: { now?: Date; timeZone?: string } = {}): string {
  const p = partsOf(date, timeZone);
  const today = partsOf(now, timeZone);
  const diff = dayIndex(today) - dayIndex(p);
  if (diff === 0) return "Hoy";
  if (diff === 1) return "Ayer";
  const weekday = WEEKDAYS[new Date(Date.UTC(p.year, p.month - 1, p.day)).getUTCDay()];
  return `${weekday} ${p.day} de ${MONTHS[p.month - 1]}${p.year === today.year ? "" : ` de ${p.year}`}`;
}

type Entry = { event: TimelineEvent; date: Date | null };

/**
 * Línea de tiempo vertical de eventos: quién, qué y cuándo, con detalle opcional. Agrupa por día, ordena del más
 * nuevo al más viejo (`order`), muestra de a `pageSize` eventos con "Ver más" y, sin eventos, un estado vacío.
 * El cuándo se ve relativo ("hace 5 min") o absoluto ("14:35"); el otro queda en el tooltip y en `<time>`.
 */
export function Timeline({
  events,
  timeFormat = "relative",
  groupByDay = true,
  order = "desc",
  pageSize = 10,
  types,
  now,
  timeZone,
  emptyTitle = "Todavía no hay movimientos",
  emptyDescription = "Cuando pase algo, lo vas a ver acá.",
  empty,
  moreLabel = "Ver más",
  className,
  "aria-label": ariaLabel = "Historial",
}: {
  events: TimelineEvent[];
  /** `relative`: "hace 5 min". `absolute`: la hora (agrupado por día) o la fecha y hora (sin agrupar). */
  timeFormat?: "relative" | "absolute";
  /** Agrupa bajo un título por día ("Hoy", "Ayer", "lunes 2 de noviembre"). */
  groupByDay?: boolean;
  /** `desc`: lo más nuevo arriba (historial). `asc`: lo más viejo arriba. */
  order?: "desc" | "asc";
  /** Cuántos eventos se ven al principio y cuántos se suman con "Ver más". */
  pageSize?: number;
  /** Ícono y tono por tipo de evento: `{ pago: { icon: Check, tone: "success" } }`. */
  types?: Record<string, TimelineType>;
  /** Momento de referencia para "hace…", "Hoy" y "Ayer". Por defecto, ahora. */
  now?: Date | string | number;
  /** Zona horaria IANA para agrupar y mostrar horas (`"America/Argentina/Buenos_Aires"`). Por defecto, la del navegador. */
  timeZone?: string;
  emptyTitle?: string;
  emptyDescription?: ReactNode;
  /** Reemplaza todo el estado vacío. */
  empty?: ReactNode;
  moreLabel?: string;
  className?: string;
  "aria-label"?: string;
}) {
  const [visible, setVisible] = useState(pageSize);
  const firstNew = useRef<HTMLLIElement | null>(null);
  const grew = useRef(false);

  // Al sumar eventos con "Ver más", el foco pasa al primero nuevo: si no, se pierde al desaparecer el botón.
  useEffect(() => {
    if (grew.current) firstNew.current?.focus();
    grew.current = false;
  }, [visible]);

  if (events.length === 0) {
    return (
      <div className={cx("timeline-empty", className)}>
        {empty ?? <EmptyState icon={History} title={emptyTitle} description={emptyDescription} />}
      </div>
    );
  }

  const reference = now === undefined ? new Date() : (toDate(now) ?? new Date());
  const entries: Entry[] = events
    .map((event) => ({ event, date: toDate(event.at) }))
    .sort((a, b) => {
      // Las fechas inválidas van al final; el resto, por fecha (estable ante empates).
      if (!a.date || !b.date) return a.date ? -1 : b.date ? 1 : 0;
      return order === "desc" ? b.date.getTime() - a.date.getTime() : a.date.getTime() - b.date.getTime();
    });
  const shown = entries.slice(0, visible);
  const remaining = entries.length - shown.length;

  const groups: { key: string; heading: string; items: Entry[] }[] = [];
  if (groupByDay) {
    for (const entry of shown) {
      const key = entry.date ? dayKey(partsOf(entry.date, timeZone)) : "sin-fecha";
      let group = groups[groups.length - 1];
      if (!group || group.key !== key) {
        group = { key, heading: entry.date ? formatDayHeading(entry.date, { now: reference, timeZone }) : "Sin fecha", items: [] };
        groups.push(group);
      }
      group.items.push(entry);
    }
  } else {
    groups.push({ key: "todo", heading: "", items: shown });
  }

  const previouslyShown = Math.min(visible - pageSize, shown.length);
  let index = 0;
  const renderItem = ({ event, date }: Entry) => {
    const type = event.type ? types?.[event.type] : undefined;
    const tone = event.tone ?? type?.tone ?? "neutral";
    const Icon = event.icon ?? type?.icon;
    const isFirstNew = index === previouslyShown && previouslyShown > 0;
    index++;
    const absolute = date ? formatDateTime(date, { now: reference, timeZone }) : "";
    const label = !date
      ? ""
      : timeFormat === "relative"
        ? formatRelativeTime(date, { now: reference, timeZone })
        : groupByDay
          ? formatTime(date, timeZone)
          : absolute;
    return (
      <li key={event.id} ref={isFirstNew ? firstNew : undefined} tabIndex={isFirstNew ? -1 : undefined} className="timeline-item">
        <span className={cx("timeline-marker", `timeline-${tone}`)} aria-hidden="true">
          {Icon ? <Icon size={14} /> : <span className="timeline-dot" />}
        </span>
        <div className="timeline-body">
          <div className="timeline-head">
            <span className="timeline-title">{event.title}</span>
            {date && (
              <time className="timeline-time" dateTime={date.toISOString()} title={absolute} suppressHydrationWarning>
                {label}
              </time>
            )}
          </div>
          {event.actor && <span className="timeline-actor">{event.actor}</span>}
          {event.detail && <div className="timeline-detail">{event.detail}</div>}
        </div>
      </li>
    );
  };

  return (
    <div className={cx("timeline", className)}>
      {groupByDay ? (
        <ol className="timeline-groups" role="list" aria-label={ariaLabel}>
          {groups.map((group) => (
            <li key={group.key} className="timeline-group">
              <h3 className="timeline-day">{group.heading}</h3>
              <ol className="timeline-list" role="list">
                {group.items.map(renderItem)}
              </ol>
            </li>
          ))}
        </ol>
      ) : (
        <ol className="timeline-list" role="list" aria-label={ariaLabel}>
          {groups[0].items.map(renderItem)}
        </ol>
      )}
      {remaining > 0 && (
        <Button
          variant="outline"
          size="sm"
          className="timeline-more"
          onClick={() => {
            grew.current = true;
            setVisible(visible + pageSize);
          }}
        >
          {moreLabel} ({remaining})
        </Button>
      )}
    </div>
  );
}
