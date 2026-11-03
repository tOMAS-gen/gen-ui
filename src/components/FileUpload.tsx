"use client";

import {
  forwardRef,
  useEffect,
  useId,
  useImperativeHandle,
  useRef,
  useState,
  type DragEvent,
  type ReactNode,
} from "react";
import { cx } from "../lib/cx";
import { Spinner } from "./Button";
import { useFieldContext } from "./Field";
import { AlertCircle, FileText, ImageIcon, Upload, X } from "./icons";
import { ProgressBar } from "./ProgressBar";

/** Peso legible con separador `es-AR`: `1258291` → `"1,2 MB"`. */
export function formatFileSize(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes < 0) return "";
  if (bytes < 1024) return `${bytes} B`;
  const units = ["KB", "MB", "GB", "TB"];
  let value = bytes / 1024;
  let unit = 0;
  while (value >= 1024 && unit < units.length - 1) {
    value /= 1024;
    unit++;
  }
  const rounded = Math.round(value * 10) / 10;
  return `${String(rounded).replace(".", ",")} ${units[unit]}`;
}

const NAMED_TYPES: Record<string, string> = {
  "application/pdf": "PDF",
  "image/jpeg": "JPG",
  "image/png": "PNG",
  "image/webp": "WEBP",
  "image/gif": "GIF",
  "image/*": "imágenes",
  "text/csv": "CSV",
  "text/plain": "TXT",
  "application/zip": "ZIP",
};

/** Los tipos de `accept` en palabras: `".pdf,image/png"` → `["PDF", "PNG"]`. */
export function describeAccept(accept: string | undefined): string[] {
  if (!accept) return [];
  const names: string[] = [];
  for (const token of accept.split(",").map((t) => t.trim().toLowerCase()).filter(Boolean)) {
    const name = NAMED_TYPES[token] ?? (token.startsWith(".") ? token.slice(1).toUpperCase() : token.split("/").pop()?.toUpperCase() ?? token);
    if (!names.includes(name)) names.push(name);
  }
  return names;
}

const joinList = (items: string[]) =>
  items.length < 2 ? items.join("") : `${items.slice(0, -1).join(", ")} o ${items[items.length - 1]}`;

/** ¿El archivo cumple con `accept` (extensiones `.pdf`, tipos `image/png` o familias `image/*`)? */
export function acceptsFile(file: Pick<File, "name" | "type">, accept: string | undefined): boolean {
  if (!accept) return true;
  const tokens = accept.split(",").map((t) => t.trim().toLowerCase()).filter(Boolean);
  if (tokens.length === 0) return true;
  const name = file.name.toLowerCase();
  const type = file.type.toLowerCase();
  return tokens.some((token) => {
    if (token.startsWith(".")) return name.endsWith(token);
    if (token.endsWith("/*")) return type.startsWith(token.slice(0, -1));
    return type === token;
  });
}

export type FileRejection = { file: File; reason: "type" | "size" | "count"; message: string };

/**
 * Separa los archivos que cumplen las reglas de los que no, con un mensaje claro por cada rechazado.
 * `current` son los ya elegidos: cuentan para `maxFiles` y no se repiten.
 */
export function checkFiles(
  incoming: File[],
  { accept, maxSize, maxFiles, current = [] }: { accept?: string; maxSize?: number; maxFiles?: number; current?: File[] },
): { accepted: File[]; rejected: FileRejection[] } {
  const accepted: File[] = [];
  const rejected: FileRejection[] = [];
  const types = joinList(describeAccept(accept));
  const same = (a: File, b: File) => a.name === b.name && a.size === b.size && a.lastModified === b.lastModified;
  for (const file of incoming) {
    if (current.some((c) => same(c, file)) || accepted.some((c) => same(c, file))) continue;
    if (!acceptsFile(file, accept)) {
      rejected.push({
        file,
        reason: "type",
        message: `"${file.name}" no es un tipo de archivo permitido${types ? `. Probá con ${types}.` : "."}`,
      });
    } else if (maxSize !== undefined && file.size > maxSize) {
      rejected.push({
        file,
        reason: "size",
        message: `"${file.name}" pesa ${formatFileSize(file.size)} y el máximo es ${formatFileSize(maxSize)}.`,
      });
    } else if (maxFiles !== undefined && current.length + accepted.length >= maxFiles) {
      rejected.push({
        file,
        reason: "count",
        message: `Podés elegir hasta ${maxFiles} ${maxFiles === 1 ? "archivo" : "archivos"}. "${file.name}" quedó afuera.`,
      });
    } else {
      accepted.push(file);
    }
  }
  return { accepted, rejected };
}

export type FileUploadHandle = { focus: () => void; open: () => void };

export type FileUploadProps = {
  /** Archivos elegidos (controlado). */
  value?: File[];
  /** Archivos iniciales (no controlado). */
  defaultValue?: File[];
  onChange?: (files: File[]) => void;
  /** Se llama con los archivos que no cumplieron las reglas, además de mostrar el mensaje. */
  onReject?: (rejected: FileRejection[]) => void;
  /** Tipos permitidos, como el `accept` de un `<input type="file">`: `".pdf,image/png,image/jpeg"`. */
  accept?: string;
  /** Peso máximo por archivo, en bytes. */
  maxSize?: number;
  multiple?: boolean;
  /** Con `multiple`, cuántos archivos como máximo. */
  maxFiles?: number;
  /** Subiendo: se bloquea agregar y quitar. Si no se pasa, se deduce de `progress` (0–99). */
  uploading?: boolean;
  /** Avance de la subida, de 0 a 100. Sin él, se muestra un aviso sin porcentaje. */
  progress?: number;
  disabled?: boolean;
  invalid?: boolean;
  /** Mensaje de error propio (por ejemplo, el que devuelve el servidor). */
  error?: ReactNode;
  /** Texto del área; por defecto "Elegir archivo" o "Elegir archivos". */
  label?: string;
  /** Ayuda bajo el área; por defecto arma "PDF, JPG o PNG · hasta 5 MB" con `accept` y `maxSize`. `false` la quita. */
  hint?: ReactNode;
  /** Con `name`, el formulario envía los archivos elegidos. */
  name?: string;
  id?: string;
  className?: string;
};

/**
 * Elegir archivos con el botón o arrastrándolos. Valida tipo y peso al elegirlos, lista lo elegido con su peso y un
 * botón para quitarlo, y muestra el avance de la subida. El área es un botón real: se usa con teclado y lector de
 * pantalla, y la ayuda y el error quedan en `aria-describedby`. Toma id y ayuda de un `Field` que lo envuelva.
 * No sube nada: entrega los `File` por `onChange` y la app los envía.
 */
export const FileUpload = forwardRef<FileUploadHandle, FileUploadProps>(function FileUpload(
  {
    value,
    defaultValue,
    onChange,
    onReject,
    accept,
    maxSize,
    multiple,
    maxFiles,
    uploading,
    progress,
    disabled,
    invalid,
    error,
    label,
    hint,
    name,
    id: idProp,
    className,
  },
  ref,
) {
  const field = useFieldContext();
  const autoId = useId();
  const id = idProp ?? field?.id ?? autoId;
  const areaRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const depth = useRef(0);
  const [inner, setInner] = useState<File[]>(defaultValue ?? []);
  const [dragging, setDragging] = useState(false);
  const [problems, setProblems] = useState<string[]>([]);

  const files = value ?? inner;
  const busy = uploading ?? (progress !== undefined && progress < 100);
  const locked = Boolean(disabled || busy);
  const limit = multiple ? maxFiles : 1;

  useImperativeHandle(ref, () => ({ focus: () => areaRef.current?.focus(), open: () => inputRef.current?.click() }));

  // El <input> oculto lleva los archivos para que un <form> los envíe con `name`.
  const syncInput = (list: File[]) => {
    const input = inputRef.current;
    if (!input || typeof DataTransfer === "undefined") return;
    try {
      const transfer = new DataTransfer();
      list.forEach((f) => transfer.items.add(f));
      input.files = transfer.files;
    } catch {
      /* Navegador sin DataTransfer constructible: el envío por <form> no incluye los archivos. */
    }
  };
  useEffect(() => syncInput(files), [files]);

  const commit = (next: File[]) => {
    if (value === undefined) setInner(next);
    onChange?.(next);
  };

  const add = (incoming: File[]) => {
    if (locked || incoming.length === 0) return;
    // Un solo archivo: el nuevo reemplaza al anterior.
    const current = multiple ? files : [];
    const { accepted, rejected } = checkFiles(incoming, { accept, maxSize, maxFiles: limit, current });
    setProblems(rejected.map((r) => r.message));
    if (rejected.length > 0) onReject?.(rejected);
    if (accepted.length > 0) commit(multiple ? [...current, ...accepted] : accepted.slice(0, 1));
  };

  const remove = (index: number) => {
    if (locked) return;
    setProblems([]);
    commit(files.filter((_, i) => i !== index));
    areaRef.current?.focus();
  };

  const hasFiles = (e: DragEvent) => Array.from(e.dataTransfer?.types ?? []).includes("Files");
  const onDragEnter = (e: DragEvent) => {
    if (locked || !hasFiles(e)) return;
    e.preventDefault();
    depth.current++;
    setDragging(true);
  };
  const onDragOver = (e: DragEvent) => {
    if (locked || !hasFiles(e)) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
  };
  const onDragLeave = () => {
    // Entrar a un hijo del área dispara dragleave del padre: se cuenta la profundidad.
    depth.current = Math.max(0, depth.current - 1);
    if (depth.current === 0) setDragging(false);
  };
  const onDrop = (e: DragEvent) => {
    if (!hasFiles(e)) return;
    e.preventDefault();
    depth.current = 0;
    setDragging(false);
    add(Array.from(e.dataTransfer.files));
  };

  const hintId = `${id}-hint`;
  const errorId = `${id}-error`;
  const hintText =
    hint ??
    ([joinList(describeAccept(accept)), maxSize !== undefined ? `hasta ${formatFileSize(maxSize)}` : ""].filter(Boolean).join(" · ") ||
      undefined);
  const shown: ReactNode[] = error ? [error] : problems;
  const isInvalid = Boolean(invalid || field?.invalid || shown.length > 0);
  const ownError = shown.length > 0;
  const describedBy = [field?.describedBy, hintText ? hintId : "", ownError ? errorId : ""].filter(Boolean).join(" ") || undefined;
  const title = label ?? (files.length > 0 && !multiple ? "Elegir otro archivo" : multiple ? "Elegir archivos" : "Elegir archivo");

  return (
    <div className={cx("file-upload", className)}>
      <button
        ref={areaRef}
        id={id}
        type="button"
        className={cx("file-upload-area", dragging && "is-dragging", isInvalid && "is-invalid", busy && "is-busy")}
        disabled={disabled}
        aria-disabled={busy || undefined}
        aria-describedby={describedBy}
        onClick={() => !locked && inputRef.current?.click()}
        onDragEnter={onDragEnter}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
      >
        <Upload size={24} className="file-upload-icon" />
        <span className="file-upload-title">{title}</span>
        <span className="file-upload-drag">
          {dragging ? (multiple ? "Soltalos acá para agregarlos" : "Soltalo acá para agregarlo") : multiple ? "o arrastralos hasta acá" : "o arrastralo hasta acá"}
        </span>
      </button>
      <input
        ref={inputRef}
        type="file"
        hidden
        tabIndex={-1}
        aria-hidden="true"
        name={name}
        accept={accept}
        multiple={multiple}
        disabled={disabled}
        onChange={(e) => {
          add(Array.from(e.target.files ?? []));
          // Se vacía el selector para poder elegir de nuevo el mismo archivo después de quitarlo.
          e.target.value = "";
          syncInput(files);
        }}
      />
      {hintText && (
        <p className="field-hint" id={hintId}>
          {hintText}
        </p>
      )}
      {ownError && (
        <div className="field-error file-upload-errors" id={errorId} role="alert">
          <AlertCircle size={14} />
          <div>
            {shown.map((m, i) => (
              <p key={i}>{m}</p>
            ))}
          </div>
        </div>
      )}
      {files.length > 0 && (
        <ul className="file-upload-list" role="list" aria-label="Archivos elegidos">
          {files.map((file, i) => {
            const Icon = file.type.startsWith("image/") ? ImageIcon : FileText;
            return (
              <li key={`${file.name}-${file.size}-${file.lastModified}-${i}`} className="file-upload-item">
                <Icon size={20} className="file-upload-item-icon" />
                <span className="file-upload-name" title={file.name}>
                  {file.name}
                </span>
                <span className="file-upload-size">{formatFileSize(file.size)}</span>
                <button
                  type="button"
                  className="icon-btn"
                  aria-label={`Quitar ${file.name}`}
                  title="Quitar"
                  disabled={locked}
                  onClick={() => remove(i)}
                >
                  <X size={18} />
                </button>
              </li>
            );
          })}
        </ul>
      )}
      {busy && (
        <div className="file-upload-progress">
          <span className="visually-hidden" role="status">
            Subiendo…
          </span>
          {progress !== undefined ? (
            <ProgressBar value={progress} size="sm" ariaLabel="Progreso de la subida" label={`Subiendo… ${Math.round(Math.max(0, Math.min(100, progress)))}%`} />
          ) : (
            <span className="file-upload-wait">
              <Spinner /> Subiendo…
            </span>
          )}
        </div>
      )}
    </div>
  );
});
