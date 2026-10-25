import { createContext, useContext, type ReactNode } from "react";
import { Body, Container, Head, Html, Preview, Section, Text } from "react-email";
import { emailFont, emailThemes, type EmailBrand, type EmailTheme } from "./themes";

const EmailThemeContext = createContext<EmailTheme>(emailThemes.gen);

/** Tema de la marca del correo que se está armando. Lo usan los componentes de `@gen/ui/email`. */
export function useEmailTheme(): EmailTheme {
  return useContext(EmailThemeContext);
}

/**
 * Estructura de todo correo ›gen: logotipo de texto (las imágenes y el SVG no se ven en todos los clientes), el
 * contenido en una tarjeta y el aviso de correo automático al pie (ADR-008: sin `Reply-To`).
 */
export function EmailLayout({
  marca,
  preview,
  children,
}: {
  marca: EmailBrand;
  /** Texto que el cliente de correo muestra al lado del asunto, antes de abrirlo. */
  preview: string;
  children: ReactNode;
}) {
  const theme = emailThemes[marca];
  return (
    <EmailThemeContext.Provider value={theme}>
      <Html lang="es">
        <Head />
        <Preview>{preview}</Preview>
        <Body style={{ margin: 0, padding: "32px 16px", backgroundColor: theme.bg, fontFamily: emailFont }}>
          <Container style={{ maxWidth: "560px", margin: "0 auto" }}>
            <Section style={{ padding: "0 4px 16px" }}>
              <Text style={{ margin: 0, fontSize: "26px", lineHeight: "32px", fontWeight: 600 }}>
                <span style={{ color: theme.accentText }}>›gen</span>
                {theme.product && <span style={{ color: theme.text, fontWeight: 400 }}>{theme.product}</span>}
              </Text>
            </Section>
            <Section
              style={{
                padding: "32px",
                backgroundColor: theme.surface,
                border: `1px solid ${theme.border}`,
                borderRadius: "12px",
              }}
            >
              {children}
            </Section>
            <Text style={{ margin: "16px 4px 0", fontSize: "12px", lineHeight: "18px", color: theme.muted }}>
              Este es un correo automático, no lo respondas.
            </Text>
          </Container>
        </Body>
      </Html>
    </EmailThemeContext.Provider>
  );
}
