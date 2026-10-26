"use client";

import { useState, type ReactNode } from "react";
import {
  Avatar,
  BackupCodes,
  Badge,
  Breadcrumbs,
  Button,
  Card,
  CardGrid,
  Checkbox,
  ColorChip,
  ColorDot,
  ColorField,
  Combobox,
  CopyButton,
  DataTable,
  DatePicker,
  DescriptionList,
  Dialog,
  Divider,
  EmptyState,
  Field,
  FilterPill,
  GoogleButton,
  IconButton,
  InlineAlert,
  Input,
  InteractiveCard,
  Kbd,
  LinkButton,
  Menu,
  OtpInput,
  PageHeader,
  Pagination,
  PasswordInput,
  ProgressBar,
  ProgressRing,
  PromptDialog,
  QrCode,
  Radio,
  RecordList,
  RecordRow,
  SectionPanel,
  SegmentedControl,
  Select,
  Skeleton,
  StatCard,
  StatsBar,
  StatusPill,
  Switch,
  Tabs,
  Tag,
  Textarea,
  ThemeToggle,
  Toolbar,
  ToolbarFilterField,
  showConfirm,
  useToast,
} from "../index";
import {
  Cloud,
  Cpu,
  Database,
  Globe,
  LayoutGrid,
  List,
  Lock,
  Mail,
  Pencil,
  Plus,
  RefreshCw,
  Server,
  Trash2,
} from "../components/icons";

/** Datos de ejemplo de los dos pasos (clave de demostración de RFC 6238, no es de nadie). */
const OTP_SECRET = "JBSWY3DPEHPK3PXP";
const OTP_URI = `otpauth://totp/gen%20UI:persona%40ejemplo.com?secret=${OTP_SECRET}&issuer=gen%20UI`;
const BACKUP_CODES = ["7f3k-q9xm", "2hd8-vw4n", "p6ra-3jzc", "m9tb-x2ke", "4wqs-h7dl", "c8nv-5ryu", "j2ef-9mpa", "u5gx-6kbt"];

/** Bloque titulado de la galería. */
function Section({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <SectionPanel className="gallery-section">
      <h2 id={id} className="gallery-title">
        {title}
      </h2>
      {children}
    </SectionPanel>
  );
}

function Row({ children }: { children: ReactNode }) {
  return <div className="gallery-row">{children}</div>;
}

type Server = { id: string; name: string; ip: string; status: "online" | "degraded" | "offline"; cpu: number; services: number };

const SERVERS: Server[] = [
  { id: "s1", name: "gen-node-01", ip: "10.0.0.11", status: "online", cpu: 42, services: 12 },
  { id: "s2", name: "gen-node-02", ip: "10.0.0.12", status: "degraded", cpu: 88, services: 9 },
  { id: "s3", name: "gen-node-03", ip: "10.0.0.13", status: "offline", cpu: 0, services: 0 },
];

const STATUS = {
  online: { tone: "success", label: "En línea" },
  degraded: { tone: "warning", label: "Degradado" },
  offline: { tone: "danger", label: "Sin conexión" },
} as const;

/**
 * Galería de todos los componentes de gen-ui. La usan el playground de la
 * librería y la ruta /ui de cada producto para verificar la marca activa.
 */
export function Gallery({ heading = "Componentes", showThemeToggle = true }: { heading?: string; showThemeToggle?: boolean }) {
  const { toast } = useToast();
  const [tab, setTab] = useState("resumen");
  const [segment, setSegment] = useState<"dia" | "semana" | "mes">("semana");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [search, setSearch] = useState("");
  const [region, setRegion] = useState("");
  const [sort, setSort] = useState("name");
  const [pill, setPill] = useState("");
  const [page, setPage] = useState(3);
  const [otp, setOtp] = useState("");
  const [date, setDate] = useState<string | null>("2026-10-10");
  const [color, setColor] = useState<string | null>("#e52713");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [promptOpen, setPromptOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [picked, setPicked] = useState<string | null>(null);
  const [checked, setChecked] = useState(true);
  const [on, setOn] = useState(true);

  const matches = SERVERS.filter((s) => s.name.includes(query.toLowerCase()));

  return (
    <div className="gallery page-stack">
      <PageHeader
        title={heading}
        description="Componentes de interfaz para construir tus aplicaciones."
        icon={LayoutGrid}
        actions={
          <>
            {showThemeToggle && <ThemeToggle mini />}
            <Button variant="primary" icon={<Plus size={18} />} onClick={() => toast("Acción simulada", "success")}>
              Nuevo servicio
            </Button>
          </>
        }
      >
        <Breadcrumbs items={[{ label: "Panel", href: "#" }, { label: "Sistema" }, { label: "Componentes" }]} />
      </PageHeader>

      <Section id="botones" title="Botones">
        <Row>
          <Button variant="primary">Primario</Button>
          <Button>Por defecto</Button>
          <Button variant="outline">Contorno</Button>
          <Button variant="ghost">Fantasma</Button>
          <Button variant="danger" icon={<Trash2 size={18} />}>
            Eliminar
          </Button>
          <Button variant="primary" loading loadingLabel="Guardando…">
            Guardar
          </Button>
          <Button disabled>Deshabilitado</Button>
          <Button size="sm">Chico</Button>
        </Row>
        <Row>
          <IconButton label="Editar">
            <Pencil size={18} />
          </IconButton>
          <IconButton label="Actualizar">
            <RefreshCw size={18} />
          </IconButton>
          <Menu
            items={[
              { label: "Editar", icon: <Pencil size={16} />, onSelect: () => toast("Editar") },
              { label: "Reiniciar", icon: <RefreshCw size={16} />, onSelect: () => toast("Reinicio simulado", "success") },
              { label: "Eliminar", icon: <Trash2 size={16} />, danger: true, onSelect: () => void showConfirm("¿Eliminar el servicio?", { danger: true, confirmLabel: "Eliminar" }) },
            ]}
          />
          <LinkButton>Link de acción</LinkButton>
          <LinkButton muted>Link apagado</LinkButton>
          <span className="muted">
            Atajo <Kbd>⌘</Kbd> <Kbd>K</Kbd>
          </span>
        </Row>
        <div style={{ maxWidth: 360 }}>
          <GoogleButton onClick={() => toast("Google simulado", "info")} />
        </div>
      </Section>

      <Section id="estados" title="Estados, etiquetas y avisos">
        <Row>
          <StatusPill tone="success" dot>
            En línea
          </StatusPill>
          <StatusPill tone="warning" dot>
            Degradado
          </StatusPill>
          <StatusPill tone="danger" dot>
            Sin conexión
          </StatusPill>
          <StatusPill tone="info">Desplegando</StatusPill>
          <StatusPill tone="accent">Nuevo</StatusPill>
          <StatusPill>Pausado</StatusPill>
          <Badge count={7} />
          <Badge count={1200} />
        </Row>
        <Row>
          <Tag kind="work">#proyecto</Tag>
          <Tag kind="exec">@ejecutor</Tag>
          <Tag kind="ref">$referencia</Tag>
          <Tag kind="label">etiqueta</Tag>
          <ColorChip color="#0f766e">Producción</ColorChip>
          <ColorChip color="#7c3aed">Staging</ColorChip>
          <ColorDot color="#e52713" label="Color rojo" />
          <Avatar name="Tomás Gentile" />
          <Avatar name="iara@gen.net.ar" size={28} />
        </Row>
        <div className="gallery-stack">
          <InlineAlert tone="danger" title="No se pudo conectar">
            El servidor gen-node-03 no responde desde hace 5 minutos.
          </InlineAlert>
          <InlineAlert tone="success">Certificado renovado para menuweb.ar.</InlineAlert>
          <InlineAlert tone="warning">El disco de gen-node-02 está al 88%.</InlineAlert>
          <InlineAlert tone="info">Los procesos de esta etapa son simulados.</InlineAlert>
        </div>
        <Row>
          <Button onClick={() => toast("Servicio creado", "success")}>Toast éxito</Button>
          <Button onClick={() => toast("No se pudo desplegar", "error")}>Toast error</Button>
          <Button onClick={() => toast("Sincronizando…", "info")}>Toast info</Button>
        </Row>
      </Section>

      <Section id="formularios" title="Formularios">
        <div className="gallery-grid">
          <Field label="Nombre del servicio" hint="Minúsculas, sin espacios." charCount={{ length: 9, max: 40 }}>
            <Input defaultValue="menuweb-1" />
          </Field>
          <Field label="Email" error="Ingresá un email válido.">
            <Input type="email" defaultValue="tomi@" startIcon={<Mail size={18} />} />
          </Field>
          <Field label="Contraseña" labelAction={<LinkButton>¿La olvidaste?</LinkButton>}>
            <PasswordInput defaultValue="secreto" startIcon={<Lock size={18} />} />
          </Field>
          <Field label="Región" optional>
            <Select
              placeholder="Elegir…"
              options={[
                { value: "ar", label: "Argentina (Mendoza)" },
                { value: "us", label: "Estados Unidos" },
              ]}
            />
          </Field>
          <Field label="Notas">
            <Textarea rows={3} placeholder="Detalle del despliegue…" />
          </Field>
          <div className="gallery-stack">
            <Checkbox label="Respaldos diarios" hint="Se guardan 7 días en R2." checked={checked} onChange={(e) => setChecked(e.target.checked)} />
            <Radio name="plan" label="Plan chico" defaultChecked />
            <Radio name="plan" label="Plan grande" />
            <Switch label="Monitoreo activo" checked={on} onChange={(e) => setOn(e.target.checked)} />
            <Row>
              <DatePicker value={date} onChange={setDate} ariaLabel="Fecha de renovación" />
              <ColorField value={color} onChange={setColor} />
            </Row>
          </div>
        </div>
        <Divider>o</Divider>
        <div className="gallery-grid">
          <div className="gallery-stack">
            <span className="field-label">Código de verificación</span>
            <OtpInput value={otp} onChange={setOtp} onComplete={(v) => toast(`Código ${v}`, "info")} />
          </div>
          <div className="gallery-stack">
            <span className="field-label">Buscar servidor</span>
            <Combobox
              query={query}
              onQueryChange={setQuery}
              results={matches}
              getKey={(s) => s.id}
              renderItem={(s) => (
                <>
                  <span className="combobox-item-name">{s.name}</span>
                  <span className="combobox-item-email muted">{s.ip}</span>
                </>
              )}
              onSelect={(s) => {
                setPicked(s.name);
                setQuery("");
              }}
              ariaLabel="Buscar servidor"
              placeholder="gen-node…"
            />
            {picked && <span className="muted">Elegido: {picked}</span>}
          </div>
        </div>
      </Section>

      <Section id="dos-pasos" title="Dos pasos">
        <div className="gallery-grid">
          <div className="gallery-stack">
            <span className="field-label">Escaneá el código con la app de autenticación</span>
            <QrCode value={OTP_URI} secret={OTP_SECRET} />
          </div>
          <div className="gallery-stack">
            <span className="field-label">Códigos de respaldo</span>
            <BackupCodes codes={BACKUP_CODES} heading="gen UI · persona@ejemplo.com" fileName="gen-ui-codigos-de-respaldo.txt" />
          </div>
        </div>
        <Row>
          <CopyButton text="https://ejemplo.com/invitacion" label="Copiar enlace" />
        </Row>
      </Section>

      <Section id="navegacion" title="Navegación">
        <Tabs
          ariaLabel="Secciones del servicio"
          activeKey={tab}
          onChange={setTab}
          items={[
            { key: "resumen", label: "Resumen", icon: LayoutGrid },
            { key: "dominios", label: "Dominios", icon: Globe },
            { key: "recursos", label: "Recursos", icon: Cpu },
            { key: "base", label: "Base de datos", icon: Database },
          ]}
        />
        <Row>
          <SegmentedControl
            ariaLabel="Período"
            value={segment}
            onChange={setSegment}
            options={[
              { value: "dia", label: "Día" },
              { value: "semana", label: "Semana" },
              { value: "mes", label: "Mes" },
            ]}
          />
          <FilterPill
            value={pill}
            onChange={setPill}
            placeholder="Estado"
            ariaLabel="Filtrar por estado"
            options={[
              { value: "online", label: "En línea" },
              { value: "offline", label: "Sin conexión" },
            ]}
          />
        </Row>
        <Pagination page={page} totalPages={9} onChange={setPage} />
      </Section>

      <Section id="datos" title="Datos">
        <StatsBar ariaLabel="Resumen de infraestructura">
          <StatCard value="3" label="Servidores" detail="2 en línea" />
          <StatCard value="21" label="Servicios" />
          <StatCard value="64%" label="CPU promedio" />
          <StatCard value="1.2 TB" label="Almacenamiento" />
        </StatsBar>
        <Toolbar
          ariaLabel="Buscar, filtrar y ordenar servidores"
          search={{ value: search, onChange: setSearch, placeholder: "Buscar servidores…", ariaLabel: "Buscar servidores" }}
          filters={{
            activeCount: region ? 1 : 0,
            content: (
              <ToolbarFilterField
                label="Región"
                value={region}
                onChange={setRegion}
                allLabel="Todas las regiones"
                options={[
                  { value: "mza", label: "Mendoza" },
                  { value: "bsas", label: "Buenos Aires" },
                ]}
              />
            ),
          }}
          sort={{
            value: sort,
            onChange: setSort,
            ariaLabel: "Ordenar servidores",
            options: [
              { value: "name", label: "Nombre · A–Z" },
              { value: "cpu", label: "Más CPU" },
            ],
          }}
          view={{
            value: view,
            onChange: setView,
            ariaLabel: "Vista",
            options: [
              { value: "grid", label: "Ver como grilla", icon: LayoutGrid },
              { value: "list", label: "Ver como lista", icon: List },
            ],
          }}
          count={`${SERVERS.length} servidores`}
          chips={region ? [{ key: "region", label: region === "mza" ? "Mendoza" : "Buenos Aires", onRemove: () => setRegion("") }] : []}
          onReset={search || region ? () => (setSearch(""), setRegion("")) : undefined}
        />
        <DataTable
          caption="Servidores"
          columns={[
            {
              key: "name",
              header: "Servidor",
              className: "col-primary",
              render: (s: Server) => (
                <>
                  <Server size={18} /> {s.name}
                </>
              ),
            },
            { key: "ip", header: "IP", render: (s) => <span className="mono">{s.ip}</span> },
            { key: "status", header: "Estado", render: (s) => <StatusPill tone={STATUS[s.status].tone} dot>{STATUS[s.status].label}</StatusPill> },
            { key: "cpu", header: "CPU", render: (s) => <ProgressBar value={s.cpu} size="sm" tone={s.cpu > 80 ? "warning" : "accent"} /> },
            { key: "services", header: "Servicios", align: "right", render: (s) => <span className="num">{s.services}</span> },
          ]}
          rows={SERVERS}
          rowKey={(s) => s.id}
          onRowClick={(s) => toast(`Abrir ${s.name}`)}
          rowLabel={(s) => `Abrir ${s.name}`}
        />
        <CardGrid>
          {SERVERS.map((s) => (
            <InteractiveCard
              key={s.id}
              href="#"
              label={s.name}
              header={
                <span style={{ display: "inline-flex", alignItems: "center", gap: 8, fontWeight: 600 }}>
                  <Server size={18} /> {s.name}
                </span>
              }
              actions={<Menu items={[{ label: "Reiniciar", onSelect: () => toast("Reinicio simulado", "success") }]} />}
            >
              <Row>
                <StatusPill tone={STATUS[s.status].tone} dot>
                  {STATUS[s.status].label}
                </StatusPill>
                <span className="muted mono">{s.ip}</span>
              </Row>
              <ProgressBar value={s.cpu} label={`CPU ${s.cpu}%`} />
            </InteractiveCard>
          ))}
        </CardGrid>
        <RecordList>
          <RecordRow title="menuweb.ar" subtitle="Certificado válido hasta 08/01/2027" leading={<Globe size={20} />} meta={<StatusPill tone="success">Activo</StatusPill>} actions={<Button size="sm">Configurar</Button>} />
          <RecordRow title="app.example.com" subtitle="Proxy → gen-node-01:3010" leading={<Globe size={20} />} meta={<StatusPill tone="warning">Renovar</StatusPill>} actions={<Button size="sm">Configurar</Button>} />
        </RecordList>
        <Card>
          <DescriptionList
            items={[
              { term: "Servidor", detail: "gen-node-01" },
              { term: "Imagen", detail: <span className="mono">ghcr.io/example/app:1.4.2</span> },
              { term: "Memoria", detail: "512 MB de 1 GB" },
            ]}
          />
        </Card>
        <Row>
          <ProgressRing percent={72} size={44} />
          <ProgressRing percent={100} tone="ok" size={44} />
          <ProgressRing percent={30} tone="danger" size={44} />
          <div style={{ flex: 1, minWidth: 200 }}>
            <ProgressBar value={38} />
          </div>
        </Row>
      </Section>

      <Section id="feedback" title="Carga, vacío y diálogos">
        <Row>
          <Skeleton width="180px" />
          <Skeleton variant="circle" width="32px" height="32px" />
          <Skeleton variant="card" width="220px" height="60px" />
        </Row>
        <Card>
          <EmptyState icon={Cloud} title="Sin servicios todavía" description="Creá el primer servicio para verlo acá." action={{ label: "Nuevo servicio", onClick: () => toast("Acción simulada", "success") }} />
        </Card>
        <Row>
          <Button onClick={() => setDialogOpen(true)}>Abrir diálogo</Button>
          <Button onClick={() => setPromptOpen(true)}>Renombrar…</Button>
          <Button onClick={() => void showConfirm("¿Dar de baja el servicio?", { title: "Dar de baja", danger: true, confirmLabel: "Dar de baja" })}>Confirmación</Button>
        </Row>
        <Dialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          title="Nuevo dominio"
          description="Se configura el proxy y el certificado automáticamente."
          footer={
            <>
              <Button onClick={() => setDialogOpen(false)}>Cancelar</Button>
              <Button
                variant="primary"
                onClick={() => {
                  setDialogOpen(false);
                  toast("Dominio agregado (simulado)", "success");
                }}
              >
                Agregar
              </Button>
            </>
          }
        >
          <Field label="Dominio">
            <Input placeholder="cliente.com.ar" />
          </Field>
        </Dialog>
        <PromptDialog
          open={promptOpen}
          onClose={() => setPromptOpen(false)}
          title="Renombrar servicio"
          label="Nombre"
          initialValue="menuweb-1"
          maxLength={40}
          onSave={() => new Promise((r) => setTimeout(r, 600))}
        />
      </Section>
    </div>
  );
}
