"use client";

import { cx } from "../lib/cx";
import { InlineAlert } from "./Alert";
import { Button } from "./Button";
import { CopyButton } from "./CopyButton";
import { Download } from "./icons";

/** Los códigos como texto: encabezado opcional (producto, cuenta), el aviso y un código por renglón. */
export function backupCodesText(codes: string[], heading?: string): string {
  const encabezado = heading ? `${heading}\n` : "";
  return `${encabezado}Códigos de respaldo: cada uno sirve una sola vez.\n\n${codes.join("\n")}\n`;
}

/**
 * Códigos de respaldo de los dos pasos, recién generados. Se muestran una sola vez: la persona los copia o los descarga
 * en un `.txt`. `heading` encabeza lo copiado y el archivo (por ejemplo, "gen saas · tomas@gen.net.ar").
 */
export function BackupCodes({
  codes,
  heading,
  fileName = "codigos-de-respaldo.txt",
  className,
}: {
  codes: string[];
  heading?: string;
  fileName?: string;
  className?: string;
}) {
  const texto = backupCodesText(codes, heading);

  const descargar = () => {
    const url = URL.createObjectURL(new Blob([texto], { type: "text/plain;charset=utf-8" }));
    const enlace = document.createElement("a");
    enlace.href = url;
    enlace.download = fileName;
    enlace.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className={cx("backup-codes", className)}>
      <InlineAlert tone="warning">
        Guardalos en un lugar seguro: se muestran una sola vez. Cada código sirve para entrar una vez si no tenés la app
        a mano.
      </InlineAlert>
      <ol className="backup-codes-list">
        {codes.map((code) => (
          <li key={code}>{code}</li>
        ))}
      </ol>
      <div className="backup-codes-actions">
        <CopyButton text={texto} label="Copiar códigos" />
        <Button variant="outline" size="sm" icon={<Download size={16} />} onClick={descargar}>
          Descargar .txt
        </Button>
      </div>
    </div>
  );
}
