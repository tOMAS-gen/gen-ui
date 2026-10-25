import type { ReactNode } from "react";
import { Heading } from "react-email";
import { useEmailTheme } from "./EmailLayout";

/** Título del correo. Uno por correo, arriba de todo. */
export function EmailHeading({ children }: { children: ReactNode }) {
  const theme = useEmailTheme();
  return (
    <Heading as="h1" style={{ margin: "0 0 16px", fontSize: "22px", lineHeight: "30px", fontWeight: 600, color: theme.text }}>
      {children}
    </Heading>
  );
}
