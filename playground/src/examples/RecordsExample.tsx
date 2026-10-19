import { useState } from "react";
import {
  Button,
  DataTable,
  Dialog,
  Field,
  Input,
  Select,
  StatusPill,
} from "../../../src";
import { ExampleShell, type ExampleProps } from "./shared";

const initialClients = [
  {
    id: "1",
    name: "Estudio Norte",
    email: "hola@norte.example",
    status: "Activo",
  },
  {
    id: "2",
    name: "Almacén Central",
    email: "equipo@central.example",
    status: "Activo",
  },
  {
    id: "3",
    name: "Taller Sur",
    email: "contacto@sur.example",
    status: "Pendiente",
  },
  {
    id: "4",
    name: "Casa Oliva",
    email: "hola@oliva.example",
    status: "Activo",
  },
];

export function RecordsExample(props: ExampleProps) {
  const [clients, setClients] = useState(initialClients);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("");
  const [open, setOpen] = useState(false);
  const visible = clients.filter(
    (client) =>
      `${client.name} ${client.email}`
        .toLowerCase()
        .includes(query.toLowerCase()) &&
      (!status || client.status === status),
  );
  return (
    <ExampleShell {...props} active="records" title="Clientes">
      <p className="muted">Las personas y empresas con las que trabajás.</p>
      <div className="example-toolbar">
        <Input
          aria-label="Buscar clientes"
          placeholder="Buscar por nombre o email…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <Select
          aria-label="Estado de clientes"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          options={[
            { value: "", label: "Todos los estados" },
            { value: "Activo", label: "Activos" },
            { value: "Pendiente", label: "Pendientes" },
          ]}
        />
        <Button variant="primary" onClick={() => setOpen(true)}>
          Nuevo cliente
        </Button>
      </div>
      <section className="example-panel">
        <p className="example-eyebrow" role="status">
          {visible.length} clientes
        </p>
        <DataTable
          caption="Clientes del espacio"
          rows={visible}
          rowKey={(row) => row.id}
          empty={
            <div className="example-empty">
              <h3>No encontramos clientes</h3>
              <p>Probá otro nombre o quitá los filtros.</p>
              <Button
                onClick={() => {
                  setQuery("");
                  setStatus("");
                }}
              >
                Limpiar filtros
              </Button>
            </div>
          }
          columns={[
            {
              key: "name",
              header: "Nombre",
              render: (row) => <strong>{row.name}</strong>,
            },
            { key: "email", header: "Email", render: (row) => row.email },
            {
              key: "status",
              header: "Estado",
              render: (row) => (
                <StatusPill
                  tone={row.status === "Activo" ? "success" : "warning"}
                  dot
                >
                  {row.status}
                </StatusPill>
              ),
            },
          ]}
        />
      </section>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        title="Nuevo cliente"
        description="Se agregará sólo a esta demostración."
      >
        <form
          className="example-form"
          onSubmit={(e) => {
            e.preventDefault();
            const data = new FormData(e.currentTarget);
            setClients([
              ...clients,
              {
                id: crypto.randomUUID(),
                name: String(data.get("name")).trim(),
                email: String(data.get("email")).trim(),
                status: "Activo",
              },
            ]);
            setQuery("");
            setStatus("");
            setOpen(false);
          }}
        >
          <Field label="Nombre">
            <Input name="name" required pattern=".*\S.*" />
          </Field>
          <Field label="Email">
            <Input name="email" type="email" required />
          </Field>
          <Button variant="primary" type="submit">
            Agregar cliente
          </Button>
        </form>
      </Dialog>
    </ExampleShell>
  );
}
