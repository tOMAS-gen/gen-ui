"use client";

import { useState } from "react";
import { cx } from "../lib/cx";
import { useCopy } from "../lib/useCopy";
import { IconButton, LinkButton } from "./Button";
import { CopyButton } from "./CopyButton";
import { AlertCircle, Check, Copy } from "./icons";

/**
 * Recorta por el medio: `head` + "…" + `tail` en `max` caracteres en total ("a1b2c3d4…e5f6a7b8"). Devuelve `null`
 * si el valor entra entero.
 */
export function shortenMiddle(value: string, max: number): { head: string; tail: string } | null {
  if (max < 3 || value.length <= max) return null;
  const keep = max - 1;
  const head = Math.ceil(keep / 2);
  return { head: value.slice(0, head), tail: value.slice(value.length - (keep - head)) };
}

export type InlineCodeProps = {
  /** El valor, siempre como texto: es lo que se copia y lo que leen los lectores de pantalla. */
  children: string;
  /** Agrega un botón para copiar el valor entero. */
  copy?: boolean;
  /** Nombre accesible del botón de copiar; conviene decir qué se copia ("Copiar hash"). */
  copyLabel?: string;
  copiedLabel?: string;
  /** Recorta por el medio los valores más largos que esto (un SHA-256 son 64). Se ve entero con "Ver completo". */
  maxChars?: number;
  expandLabel?: string;
  collapseLabel?: string;
  className?: string;
};

/**
 * Valor técnico dentro de un texto: un hash, un id de clave, una ruta. Fuente monoespaciada del tema.
 * Si se recorta, el valor completo sigue en el árbol de accesibilidad y en `title`, y se puede expandir y copiar.
 */
export function InlineCode({
  children: value,
  copy = false,
  copyLabel = "Copiar",
  copiedLabel = "Copiado",
  maxChars,
  expandLabel = "Ver completo",
  collapseLabel = "Ver menos",
  className,
}: InlineCodeProps) {
  const [expanded, setExpanded] = useState(false);
  const { state, copy: copiar } = useCopy(value);
  const short = maxChars === undefined ? null : shortenMiddle(value, maxChars);
  const collapsed = short !== null && !expanded;

  const code = (
    <code className={cx("code-inline", expanded && "is-expanded", !short && !copy && className)} title={collapsed ? value : undefined}>
      {collapsed ? (
        <>
          {/* Lo visible va recortado; el lector de pantalla lee el valor entero, no "a1b2 puntos suspensivos e5f6". */}
          <span aria-hidden="true">
            {short.head}…{short.tail}
          </span>
          <span className="visually-hidden">{value}</span>
        </>
      ) : (
        value
      )}
    </code>
  );
  if (!short && !copy) return code;

  const announcement = state === "copied" ? copiedLabel : state === "error" ? "No se pudo copiar" : "";
  return (
    <span className={cx("code-inline-wrap", className)}>
      {code}
      {short && (
        <LinkButton className="code-inline-toggle" aria-expanded={expanded} onClick={() => setExpanded(!expanded)}>
          {expanded ? collapseLabel : expandLabel}
        </LinkButton>
      )}
      {copy && (
        <IconButton size="sm" label={copyLabel} onClick={copiar}>
          {state === "copied" ? <Check size={16} /> : state === "error" ? <AlertCircle size={16} /> : <Copy size={16} />}
        </IconButton>
      )}
      {/* Aviso para lectores de pantalla: el ícono cambia, pero eso solo no se anuncia. */}
      <span className="visually-hidden" role="status">
        {announcement}
      </span>
    </span>
  );
}

export type CodeBlockProps = {
  /** El texto tal cual, con sus saltos de línea: es lo que se copia. */
  children: string;
  /** Rótulo de arriba ("Cloud Shell", "payload.json"); también es el nombre accesible del bloque. */
  label?: string;
  /** Agrega el botón de copiar (con su aviso "Copiado") en el encabezado del bloque. */
  copy?: boolean;
  copyLabel?: string;
  copiedLabel?: string;
  /** Parte los renglones largos en vez de scrollear en horizontal. */
  wrap?: boolean;
  /** Alto máximo (px o CSS); pasado ese alto el bloque scrollea. */
  maxHeight?: number | string;
  className?: string;
};

/** Comando de varias líneas o payload, para leer y copiar. Sin resaltado de sintaxis. Scrollea en su propio contenedor. */
export function CodeBlock({
  children: value,
  label,
  copy = false,
  copyLabel = "Copiar",
  copiedLabel = "Copiado",
  wrap = false,
  maxHeight,
  className,
}: CodeBlockProps) {
  return (
    <div className={cx("code-block", wrap && "is-wrap", className)}>
      {(label || copy) && (
        <div className="code-block-head">
          {label && <span className="code-block-label">{label}</span>}
          {copy && <CopyButton text={value} label={copyLabel} copiedLabel={copiedLabel} className="code-block-copy" />}
        </div>
      )}
      {/* Con foco para poder scrollear con el teclado; `region` le da el nombre. */}
      <pre
        className="code-block-pre"
        tabIndex={0}
        role="region"
        aria-label={label ?? "Código"}
        style={maxHeight === undefined ? undefined : { maxHeight }}
      >
        <code>{value}</code>
      </pre>
    </div>
  );
}
