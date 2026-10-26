"use client";

import { useEffect, useState } from "react";
import { Button, type ButtonProps } from "./Button";
import { Check, Copy } from "./icons";

type Estado = "listo" | "copiado" | "error";

/**
 * Copia `text` al portapapeles. El texto del botón confirma ("Copiado") o avisa si el navegador no dejó copiar, y a
 * los 2 s vuelve a `label`: el aviso queda en el mismo lugar donde se hizo clic.
 */
export function CopyButton({
  text,
  label = "Copiar",
  copiedLabel = "Copiado",
  variant = "outline",
  size = "sm",
  ...props
}: Omit<ButtonProps, "onClick" | "children"> & { text: string; label?: string; copiedLabel?: string }) {
  const [estado, setEstado] = useState<Estado>("listo");

  useEffect(() => {
    if (estado === "listo") return;
    const id = setTimeout(() => setEstado("listo"), 2000);
    return () => clearTimeout(id);
  }, [estado]);

  const copiar = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setEstado("copiado");
    } catch {
      setEstado("error");
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      icon={estado === "copiado" ? <Check size={16} /> : <Copy size={16} />}
      onClick={copiar}
      {...props}
    >
      {/* El texto más largo de los dos, invisible, reserva el ancho: el botón no salta al cambiar a "Copiado". */}
      <span className="copy-button-label">
        <span aria-live="polite">{estado === "copiado" ? copiedLabel : estado === "error" ? "No se pudo copiar" : label}</span>
        <span className="copy-button-sizer" aria-hidden="true">
          {label.length >= copiedLabel.length ? label : copiedLabel}
        </span>
      </span>
    </Button>
  );
}
