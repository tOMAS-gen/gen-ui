import type { ReactNode } from "react";
import { Text } from "react-email";
import { useEmailTheme } from "./EmailLayout";

/** Códigos y enlaces para copiar a mano, en letra de ancho fijo. Corta las líneas largas para no romper el ancho. */
export function EmailCode({ children }: { children: ReactNode }) {
  const theme = useEmailTheme();
  return (
    <Text
      style={{
        margin: "0 0 16px",
        padding: "12px 16px",
        backgroundColor: theme.bg,
        border: `1px solid ${theme.border}`,
        borderRadius: "8px",
        fontFamily: '"Roboto Mono", "SF Mono", Menlo, Consolas, monospace',
        fontSize: "14px",
        lineHeight: "20px",
        color: theme.text,
        wordBreak: "break-all",
      }}
    >
      {children}
    </Text>
  );
}
