"use client";

import { useMemo } from "react";
import { encode } from "uqr";
import { cx } from "../lib/cx";
import { CopyButton } from "./CopyButton";

/** Zona de silencio alrededor del QR, en módulos: la que piden los lectores (ISO/IEC 18004). */
const MARGEN = 4;

/** Matriz del QR (`true` = módulo oscuro), sin margen. Corrección de errores M: alcanza para un `otpauth://`. */
export function qrMatrix(value: string): boolean[][] {
  return encode(value, { ecc: "M", border: 0 }).data;
}

/** La clave en mayúsculas y de a 4, para copiarla a mano en la app de autenticación. */
export function formatSecret(secret: string): string {
  return secret.replace(/\s+/g, "").toUpperCase().replace(/(.{4})(?=.)/g, "$1 ");
}

/**
 * Código QR para configurar una app de autenticación (`value`: el `otpauth://…`). Se dibuja como SVG, oscuro sobre
 * blanco en los dos temas (las cámaras leen mal el QR invertido). Con `secret`, muestra también la clave para
 * escribirla a mano y un botón para copiarla.
 */
export function QrCode({
  value,
  secret,
  size = 192,
  label = "Código QR para la app de autenticación",
  className,
}: {
  value: string;
  secret?: string;
  /** Lado aproximado en píxeles: se redondea para que cada módulo mida un número entero de píxeles. */
  size?: number;
  label?: string;
  className?: string;
}) {
  const matriz = useMemo(() => qrMatrix(value), [value]);
  const lado = matriz.length + MARGEN * 2;
  // Píxeles enteros por módulo: con módulos de ancho desparejo el QR se ve borroso (se lee igual, pero peor).
  const pixeles = Math.max(1, Math.round(size / lado)) * lado;
  const d = useMemo(
    () =>
      matriz
        .flatMap((fila, y) => fila.map((oscuro, x) => (oscuro ? `M${x + MARGEN} ${y + MARGEN}h1v1h-1z` : "")))
        .join(""),
    [matriz],
  );

  return (
    <div className={cx("qr-code", className)}>
      <svg
        className="qr-code-image"
        role="img"
        aria-label={label}
        viewBox={`0 0 ${lado} ${lado}`}
        width={pixeles}
        height={pixeles}
        shapeRendering="crispEdges"
      >
        <rect width={lado} height={lado} fill="#fff" />
        <path d={d} fill="#000" />
      </svg>
      {secret && (
        <div className="qr-code-secret">
          <span className="field-label">¿No podés escanearlo? Escribí esta clave</span>
          <code className="qr-code-key">{formatSecret(secret)}</code>
          <CopyButton text={secret.replace(/\s+/g, "")} label="Copiar clave" />
        </div>
      )}
    </div>
  );
}
