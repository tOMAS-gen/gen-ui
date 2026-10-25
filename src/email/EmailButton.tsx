/** @jsxRuntime automatic */
import type { ReactNode } from "react";
import { Button, Section } from "react-email";
import { useEmailTheme } from "./EmailLayout";

/**
 * Acción principal del correo: un enlace con forma de botón (React Email lo arma para que también se vea en
 * Outlook). Uno por correo; si el enlace es importante, repetirlo abajo con `EmailCode` para copiarlo a mano.
 */
export function EmailButton({ href, children }: { href: string; children: ReactNode }) {
  const theme = useEmailTheme();
  return (
    <Section style={{ margin: "8px 0 24px" }}>
      <Button
        href={href}
        style={{
          display: "inline-block",
          padding: "12px 24px",
          borderRadius: "8px",
          backgroundColor: theme.accent,
          color: theme.onAccent,
          fontSize: "16px",
          lineHeight: "24px",
          fontWeight: 600,
          textDecoration: "none",
        }}
      >
        {children}
      </Button>
    </Section>
  );
}
