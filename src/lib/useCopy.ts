"use client";

import { useEffect, useState } from "react";

export type CopyState = "idle" | "copied" | "error";

/**
 * Copia texto al portapapeles y recuerda el resultado por 2 s ("copied" o "error"), después vuelve a "idle".
 * Lo usan `CopyButton` e `InlineCode`: el aviso queda en el mismo lugar donde se hizo clic.
 */
export function useCopy(text: string): { state: CopyState; copy: () => Promise<void> } {
  const [state, setState] = useState<CopyState>("idle");

  useEffect(() => {
    if (state === "idle") return;
    const id = setTimeout(() => setState("idle"), 2000);
    return () => clearTimeout(id);
  }, [state]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setState("copied");
    } catch {
      setState("error");
    }
  };

  return { state, copy };
}
