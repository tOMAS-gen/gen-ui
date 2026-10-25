import { useEffect, useState } from "react";
import { render } from "react-email";
import { SegmentedControl } from "../../../src";
import {
  EmailButton,
  EmailCode,
  EmailDivider,
  EmailHeading,
  EmailLayout,
  EmailText,
  type EmailBrand,
} from "../../../src/email";

const ENLACE = "https://saas.gen.net.ar/crear-contrasena?token=ejemplo";

/** Invitación de ejemplo: usa todas las piezas de `@gen/ui/email`. */
export function EjemploInvitacion({ marca }: { marca: EmailBrand }) {
  return (
    <EmailLayout marca={marca} preview="Te invitaron al panel de ›gen">
      <EmailHeading>Te invitaron al panel</EmailHeading>
      <EmailText>Hola, Tomi. Para entrar, creá tu contraseña con el botón de abajo.</EmailText>
      <EmailButton href={ENLACE}>Crear contraseña</EmailButton>
      <EmailText muted>El enlace sirve una sola vez y vence en 24 horas.</EmailText>
      <EmailDivider />
      <EmailText muted>Si el botón no funciona, copiá este enlace en el navegador:</EmailText>
      <EmailCode>{ENLACE}</EmailCode>
    </EmailLayout>
  );
}

const marcas: { value: EmailBrand; label: string }[] = [
  { value: "gen", label: "gen" },
  { value: "genstock", label: "genstock" },
  { value: "genwork", label: "genwork" },
];

/** Vista previa del correo como lo arma React Email (el mismo HTML que se envía), dentro de un iframe. */
export function EmailExamples() {
  const [marca, setMarca] = useState<EmailBrand>("gen");
  const [html, setHtml] = useState("");

  useEffect(() => {
    let vigente = true;
    render(<EjemploInvitacion marca={marca} />).then((resultado) => {
      if (vigente) setHtml(resultado);
    });
    return () => {
      vigente = false;
    };
  }, [marca]);

  return (
    <div className="email-examples">
      <SegmentedControl ariaLabel="Marca del correo" options={marcas} value={marca} onChange={setMarca} />
      <iframe className="email-examples-frame" title={`Correo de invitación (${marca})`} srcDoc={html} />
    </div>
  );
}
