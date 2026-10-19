import { useState } from "react";
import { Button, Field, Input, InlineAlert, Switch } from "../../../src";
import { ExampleShell, type ExampleProps } from "./shared";

export function SettingsExample(props: ExampleProps) {
  const [saved, setSaved] = useState(false);
  return (
    <ExampleShell {...props} active="settings" title="Configuración">
      <p className="muted">Tu perfil y las preferencias del espacio.</p>
      <form
        className="example-panel example-form example-settings"
        onChange={() => setSaved(false)}
        onSubmit={(e) => {
          e.preventDefault();
          setSaved(true);
        }}
      >
        <div>
          <h2>Perfil del espacio</h2>
          <p className="muted">Esta información identifica a tu equipo.</p>
        </div>
        <Field label="Nombre del espacio">
          <Input
            name="workspace"
            defaultValue="Mi empresa"
            required
            pattern=".*\S.*"
          />
        </Field>
        <Field label="Email de contacto">
          <Input
            name="email"
            type="email"
            defaultValue="equipo@empresa.example"
            required
          />
        </Field>
        <hr />
        <h2>Notificaciones</h2>
        <div>
          <Switch label="Resumen semanal" defaultChecked />
          <p className="muted">Recibí la actividad de tu equipo cada lunes.</p>
        </div>
        <div>
          <Switch label="Nuevos clientes" defaultChecked />
          <p className="muted">Una notificación cuando se suma un cliente.</p>
        </div>
        <div>
          <Button variant="primary" type="submit">
            Guardar cambios
          </Button>
        </div>
        {saved && (
          <InlineAlert tone="success">
            Cambios aplicados a la demo. Se restablecen al recargar.
          </InlineAlert>
        )}
      </form>
    </ExampleShell>
  );
}
