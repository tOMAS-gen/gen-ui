/** @jsxRuntime automatic */
import { Hr } from "react-email";
import { useEmailTheme } from "./EmailLayout";

/** Separa partes del correo (por ejemplo, la acción principal de la ayuda que va abajo). */
export function EmailDivider() {
  const theme = useEmailTheme();
  return <Hr style={{ margin: "24px 0", borderColor: theme.border }} />;
}
