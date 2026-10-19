import { useState } from "react";
import {
  AuthLayout,
  Button,
  Checkbox,
  Divider,
  Field,
  Input,
  InlineAlert,
  LinkButton,
  PasswordInput,
} from "../../../src";
import type { ExampleProps } from "./shared";

export function AuthExample({
  mode = "login",
  product = "ui",
  onNavigate,
}: ExampleProps & {
  mode?: "login" | "signup" | "recovery";
}) {
  const [complete, setComplete] = useState(false);
  const title = {
    login: "Qué bueno verte de nuevo",
    signup: "Creá tu espacio de trabajo",
    recovery: "Recuperá tu contraseña",
  }[mode];
  const action = {
    login: "Ingresar",
    signup: "Crear cuenta",
    recovery: "Enviar enlace",
  }[mode];
  return (
    <AuthLayout
      product={product}
      title={title}
      subtitle={
        mode === "recovery"
          ? "Ingresá tu email y te ayudamos a volver."
          : "Todo lo que necesitás, en un mismo lugar."
      }
      footer={
        <>
          <span>
            {mode === "login"
              ? "¿Todavía no tenés cuenta?"
              : "¿Ya tenés cuenta?"}
          </span>
          <LinkButton
            onClick={() => onNavigate?.(mode === "login" ? "signup" : "login")}
          >
            {mode === "login" ? "Crear cuenta" : "Ingresar"}
          </LinkButton>
        </>
      }
      legal="Ejemplo interactivo · sin conexión a un servicio de acceso"
    >
      <form
        className="example-form"
        onSubmit={(event) => {
          event.preventDefault();
          setComplete(true);
        }}
      >
        {mode === "signup" && (
          <Field label="Nombre completo">
            <Input
              name="name"
              autoComplete="name"
              placeholder="Tu nombre"
              required
            />
          </Field>
        )}
        <Field label="Email">
          <Input
            type="email"
            name="email"
            autoComplete="email"
            placeholder="vos@empresa.com"
            required
          />
        </Field>
        {mode !== "recovery" && (
          <Field
            label="Contraseña"
            hint={mode === "signup" ? "Usá al menos 8 caracteres." : undefined}
            labelAction={
              mode === "login" ? (
                <LinkButton
                  type="button"
                  onClick={() => onNavigate?.("recovery")}
                >
                  ¿La olvidaste?
                </LinkButton>
              ) : undefined
            }
          >
            <PasswordInput
              name="password"
              autoComplete={
                mode === "signup" ? "new-password" : "current-password"
              }
              minLength={mode === "signup" ? 8 : 1}
              placeholder="Tu contraseña"
              required
            />
          </Field>
        )}
        {mode === "login" && (
          <Checkbox label="Mantener la sesión iniciada" defaultChecked />
        )}
        <Button variant="primary" block type="submit">
          {action}
        </Button>
        {complete && (
          <InlineAlert tone="success">
            {mode === "recovery"
              ? "Solicitud simulada. No se envió ningún email."
              : "Formulario validado. El acceso es una demostración."}
          </InlineAlert>
        )}
      </form>
      {mode === "login" && (
        <>
          <Divider>o explorá primero</Divider>
          <Button block onClick={() => onNavigate?.("dashboard")}>
            Entrar a la demo
          </Button>
        </>
      )}
    </AuthLayout>
  );
}
