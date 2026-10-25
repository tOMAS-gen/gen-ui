import type { ReactNode } from "react";
import { Text } from "react-email";
import { useEmailTheme } from "./EmailLayout";

/** Párrafo del correo. `muted` para aclaraciones (por ejemplo, cuánto dura un enlace). */
export function EmailText({ children, muted = false }: { children: ReactNode; muted?: boolean }) {
  const theme = useEmailTheme();
  return (
    <Text
      style={{
        margin: "0 0 16px",
        fontSize: muted ? "14px" : "16px",
        lineHeight: muted ? "20px" : "24px",
        color: muted ? theme.muted : theme.text,
      }}
    >
      {children}
    </Text>
  );
}
