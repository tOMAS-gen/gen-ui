import { useCallback, useMemo, useState, type CSSProperties } from "react";
import {
  AppShell,
  Button,
  Checkbox,
  ColorChip,
  DataTable,
  Dialog,
  EmptyState,
  Field,
  GenUIProvider,
  Input,
  Menu,
  NavItem,
  NavSection,
  PageHeader,
  PageStack,
  Pagination,
  ProgressBar,
  Select,
  SidebarNav,
  SidebarProfile,
  StatCard,
  StatsBar,
  Toolbar,
  ToolbarFilterField,
  type LinkComponent,
} from "../../../src";
import {
  Archive,
  Calendar,
  FolderOpen,
  LayoutGrid,
  List,
  Plus,
  Star,
  Users,
} from "../../../src/components/icons";
import type { ExampleProps } from "./shared";
import "./dashboards.css";

type Project = {
  id: string;
  name: string;
  group: string;
  sector: string;
  label: string;
  color: string;
  done: number;
  total: number;
  due: string;
  remaining: string;
  favorite: boolean;
  archived: boolean;
  mine: boolean;
  template: boolean;
};
const initialProjects: Project[] = [
  {
    id: "web",
    name: "Rediseño del sitio web",
    group: "Diseño",
    sector: "Diseño",
    label: "Web",
    color: "#7c3aed",
    done: 12,
    total: 20,
    due: "24 oct 2026",
    remaining: "5 días",
    favorite: true,
    archived: false,
    mine: true,
    template: false,
  },
  {
    id: "launch",
    name: "Lanzamiento de producto",
    group: "Marketing",
    sector: "Comunicación",
    label: "Campaña",
    color: "#2563eb",
    done: 8,
    total: 16,
    due: "30 oct 2026",
    remaining: "11 días",
    favorite: false,
    archived: false,
    mine: false,
    template: false,
  },
  {
    id: "identity",
    name: "Identidad de marca",
    group: "Diseño",
    sector: "Diseño",
    label: "Marca",
    color: "#0f766e",
    done: 10,
    total: 10,
    due: "19 oct 2026",
    remaining: "Completado",
    favorite: true,
    archived: false,
    mine: true,
    template: false,
  },
  {
    id: "catalog",
    name: "Catálogo de servicios",
    group: "Marketing",
    sector: "Comunicación",
    label: "Web",
    color: "#7c3aed",
    done: 0,
    total: 8,
    due: "02 nov 2026",
    remaining: "14 días",
    favorite: false,
    archived: false,
    mine: true,
    template: false,
  },
  {
    id: "onboarding",
    name: "Onboarding de clientes",
    group: "Operaciones",
    sector: "Gestión",
    label: "Proceso",
    color: "#b45309",
    done: 3,
    total: 12,
    due: "28 oct 2026",
    remaining: "9 días",
    favorite: false,
    archived: false,
    mine: true,
    template: false,
  },
  {
    id: "planning",
    name: "Planificación mensual",
    group: "",
    sector: "Gestión",
    label: "Proceso",
    color: "#b45309",
    done: 0,
    total: 6,
    due: "",
    remaining: "",
    favorite: false,
    archived: false,
    mine: true,
    template: true,
  },
];
const statusOf = (p: Project) =>
  p.total > 0 && p.done === p.total
    ? "completed"
    : p.done > 0
      ? "in_progress"
      : "pending";
const percentOf = (p: Project) =>
  p.total ? Math.round((p.done / p.total) * 100) : 0;
const titles: Record<string, string> = {
  all: "Todos los Proyectos",
  mine: "Mis Proyectos",
  favorites: "Proyectos Favoritos",
  templates: "Plantillas de objetivo",
  archived: "Archivados",
};

/** Ejemplo de gestión de proyectos. Referencias en docs/catalog-sources.md. */
export function ProjectsExample(_props: ExampleProps) {
  const [projects, setProjects] = useState(initialProjects);
  const [section, setSection] = useState("all");
  const [query, setQuery] = useState("");
  const [sector, setSector] = useState("");
  const [label, setLabel] = useState("");
  const [status, setStatus] = useState("");
  const [groups, setGroups] = useState<string[]>([]);
  const [sort, setSort] = useState("recent");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [page, setPage] = useState(1);
  const [create, setCreate] = useState<"project" | "template" | null>(null);
  const [detail, setDetail] = useState<Project | null>(null);
  const [archive, setArchive] = useState<Project | null>(null);
  const navigate = useCallback((next: string) => {
    setSection(next);
    setPage(1);
  }, []);
  const DemoLink = useMemo<LinkComponent>(
    () =>
      function DemoLink({ href, onClick, ...rest }) {
        return (
          <a
            {...rest}
            href={href}
            onClick={(event) => {
              onClick?.(event);
              event.preventDefault();
              navigate(href.slice(1));
            }}
          />
        );
      },
    [navigate],
  );
  const reset = () => {
    setQuery("");
    setSector("");
    setLabel("");
    setStatus("");
    setGroups([]);
    setPage(1);
  };
  const filtered = projects.filter(
    (p) =>
      p.archived === (section === "archived") &&
      (section === "templates" ? p.template : !p.template) &&
      (section !== "favorites" || p.favorite) &&
      (section !== "mine" || p.mine) &&
      p.name.toLocaleLowerCase().includes(query.toLocaleLowerCase()) &&
      (!sector || p.sector === sector) &&
      (!label || p.label === label) &&
      (!status || statusOf(p) === status) &&
      (!groups.length || groups.includes(p.group)),
  );
  const sorted = [...filtered].sort((a, b) =>
    sort === "name"
      ? a.name.localeCompare(b.name)
      : sort === "progress"
        ? percentOf(b) - percentOf(a)
        : 0,
  );
  const visible = sorted.slice((page - 1) * 6, page * 6);
  const toggleFavorite = (id: string) =>
    setProjects((rows) =>
      rows.map((p) => (p.id === id ? { ...p, favorite: !p.favorite } : p)),
    );
  const archiveProject = (p: Project) => {
    setProjects((rows) =>
      rows.map((item) =>
        item.id === p.id ? { ...item, archived: !item.archived } : item,
      ),
    );
    setPage(1);
    setArchive(null);
  };
  const activeFilters =
    Number(!!sector) + Number(!!label) + Number(!!status) + groups.length;
  return (
    <GenUIProvider linkComponent={DemoLink} storagePrefix="catalog-projects:">
      <AppShell
        product="ui"
        sidebarTitle="Espacio de trabajo"
        topbarEnd={<span className="product-demo-label">Demostración</span>}
        sidebar={
          <SidebarNav
            footer={
              <SidebarProfile name="Usuario demo" email="demo@gen.example" />
            }
          >
            <NavSection title="Proyectos">
              <NavItem
                href="#all"
                icon={FolderOpen}
                label="Todos los proyectos"
                active={section === "all"}
              />
              <NavItem
                href="#mine"
                icon={Users}
                label="Mis proyectos"
                active={section === "mine"}
              />
              <NavItem
                href="#favorites"
                icon={Star}
                label="Favoritos"
                active={section === "favorites"}
              />
              <NavItem
                href="#templates"
                icon={LayoutGrid}
                label="Plantillas de objetivo"
                active={section === "templates"}
              />
              <NavItem
                href="#archived"
                icon={Archive}
                label="Archivados"
                active={section === "archived"}
              />
            </NavSection>
          </SidebarNav>
        }
      >
        <PageStack className="projects-dashboard">
          <PageHeader
            title={titles[section] ?? titles.all}
            icon={FolderOpen}
            actions={
              section === "archived" || section === "favorites" ? undefined : (
                <Menu
                  label="Crear un proyecto"
                  trigger={<Plus size={20} />}
                  className="btn btn-primary"
                  items={[
                    {
                      label: "Nuevo proyecto",
                      onSelect: () => setCreate("project"),
                    },
                    {
                      label: "Nuevo proyecto desde plantilla",
                      onSelect: () => setCreate("template"),
                    },
                  ]}
                />
              )
            }
          />
          <StatsBar>
            {[
              ["Total", filtered.length],
              [
                "En progreso",
                filtered.filter((p) => statusOf(p) === "in_progress").length,
              ],
              [
                "Completados",
                filtered.filter((p) => statusOf(p) === "completed").length,
              ],
              [
                "Pendientes",
                filtered.filter((p) => statusOf(p) === "pending").length,
              ],
            ].map(([name, value]) => (
              <StatCard
                key={name}
                value={value}
                label={`${name} · ${filtered.length ? Math.round((Number(value) / filtered.length) * 100) : 0}%`}
              />
            ))}
          </StatsBar>
          <Toolbar
            ariaLabel="Filtrar proyectos"
            search={{
              value: query,
              onChange: (value) => {
                setQuery(value);
                setPage(1);
              },
              placeholder: "Buscar proyectos…",
              ariaLabel: "Buscar proyectos",
            }}
            filters={{
              activeCount: activeFilters,
              content: (
                <>
                  <ToolbarFilterField
                    label="Sector"
                    value={sector}
                    onChange={(v) => {
                      setSector(v);
                      setPage(1);
                    }}
                    allLabel="Todos los sectores"
                    options={["Diseño", "Comunicación", "Gestión"].map((v) => ({
                      value: v,
                      label: v,
                    }))}
                  />
                  <ToolbarFilterField
                    label="Etiqueta"
                    value={label}
                    onChange={(v) => {
                      setLabel(v);
                      setPage(1);
                    }}
                    allLabel="Todas las etiquetas"
                    options={["Web", "Campaña", "Marca", "Proceso"].map(
                      (v) => ({ value: v, label: v }),
                    )}
                  />
                  <ToolbarFilterField
                    label="Estado"
                    value={status}
                    onChange={(v) => {
                      setStatus(v);
                      setPage(1);
                    }}
                    allLabel="Todos los estados"
                    options={[
                      { value: "in_progress", label: "En progreso" },
                      { value: "completed", label: "Completados" },
                      { value: "pending", label: "Pendientes" },
                    ]}
                  />
                  <fieldset className="product-groups">
                    <legend>Grupos</legend>
                    {["Diseño", "Marketing", "Operaciones"].map((group) => (
                      <Checkbox
                        key={group}
                        label={group}
                        checked={groups.includes(group)}
                        onChange={() => {
                          setGroups(
                            groups.includes(group)
                              ? groups.filter((g) => g !== group)
                              : [...groups, group],
                          );
                          setPage(1);
                        }}
                      />
                    ))}
                  </fieldset>
                </>
              ),
            }}
            sort={{
              value: sort,
              onChange: (value) => {
                setSort(value);
                setPage(1);
              },
              ariaLabel: "Ordenar proyectos",
              options: [
                { value: "recent", label: "Más recientes" },
                { value: "name", label: "Nombre A–Z" },
                { value: "progress", label: "Mayor progreso" },
              ],
            }}
            view={{
              value: view,
              onChange: setView,
              ariaLabel: "Vista de proyectos",
              options: [
                { value: "grid", label: "Ver como grilla", icon: LayoutGrid },
                { value: "list", label: "Ver como lista", icon: List },
              ],
            }}
            count={`${filtered.length} proyectos`}
            onReset={query || activeFilters ? reset : undefined}
          />
          {!visible.length ? (
            <EmptyState
              icon={FolderOpen}
              title="Sin proyectos que coincidan con el filtro"
              description="Probá otra búsqueda o quitá los filtros seleccionados."
              action={{ label: "Limpiar filtros", onClick: reset }}
            />
          ) : view === "grid" ? (
            <div className="project-grid">
              {visible.map((p) => (
                <article key={p.id} className="project-card">
                  <div className="project-header">
                    <button
                      className="project-name"
                      style={{ "--project-color": p.color } as CSSProperties}
                      onClick={() => setDetail(p)}
                    >
                      {p.name.toUpperCase()}
                    </button>
                    <div className="card-actions">
                      <button
                        className={`product-favorite ${p.favorite ? "active" : ""}`}
                        aria-label={`${p.favorite ? "Quitar de favoritos" : "Marcar como favorito"}: ${p.name}`}
                        aria-pressed={p.favorite}
                        onClick={() => toggleFavorite(p.id)}
                      >
                        <Star size={18} />
                      </button>
                      <Menu
                        label={`Acciones: ${p.name}`}
                        items={[
                          {
                            label: "Abrir proyecto",
                            onSelect: () => setDetail(p),
                          },
                          {
                            label: p.archived ? "Desarchivar" : "Archivar",
                            onSelect: () =>
                              p.archived ? archiveProject(p) : setArchive(p),
                          },
                        ]}
                      />
                    </div>
                  </div>
                  <div className="pc-group">
                    {p.group ? `Grupo ${p.group}` : "Personal"}
                  </div>
                  <div>
                    <ColorChip color={p.color}>{p.label}</ColorChip>
                  </div>
                  {p.due && (
                    <div className="pc-due">
                      <span>
                        <Calendar size={14} /> Entrega: {p.due}
                      </span>
                      <em>{p.remaining}</em>
                    </div>
                  )}
                  <div className="pc-card-footer">
                    <ProgressBar
                      value={percentOf(p)}
                      tone="ok"
                      ariaLabel={`Progreso de ${p.name}`}
                    />
                    <span className="pc-task-count">
                      {p.total
                        ? `${p.done}/${p.total} tareas`
                        : "Sin tareas todavía"}
                    </span>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <DataTable
              caption="Proyectos"
              rows={visible}
              rowKey={(p) => p.id}
              columns={[
                {
                  key: "name",
                  header: "Proyecto",
                  render: (p) => (
                    <button
                      className="product-project-link"
                      onClick={() => setDetail(p)}
                    >
                      {p.name}
                    </button>
                  ),
                },
                {
                  key: "group",
                  header: "Grupo",
                  render: (p) => p.group || "Personal",
                },
                {
                  key: "labels",
                  header: "Etiquetas",
                  render: (p) => (
                    <ColorChip color={p.color}>{p.label}</ColorChip>
                  ),
                },
                {
                  key: "progress",
                  header: "Progreso",
                  render: (p) => `${percentOf(p)}% · ${p.done}/${p.total}`,
                },
                { key: "due", header: "Entrega", render: (p) => p.due || "—" },
                {
                  key: "days",
                  header: "Días restantes",
                  render: (p) => p.remaining || "—",
                },
                {
                  key: "status",
                  header: "Estado",
                  render: (p) =>
                    statusOf(p) === "completed"
                      ? "Completado"
                      : statusOf(p) === "pending"
                        ? "Pendiente"
                        : "En progreso",
                },
                {
                  key: "actions",
                  header: "Acciones",
                  render: (p) => (
                    <Menu
                      label={`Acciones: ${p.name}`}
                      items={[
                        {
                          label: p.archived ? "Desarchivar" : "Archivar",
                          onSelect: () =>
                            p.archived ? archiveProject(p) : setArchive(p),
                        },
                      ]}
                    />
                  ),
                },
              ]}
            />
          )}
          <Pagination
            page={page}
            totalPages={Math.max(1, Math.ceil(filtered.length / 6))}
            onChange={setPage}
          />
          <Dialog
            open={!!detail}
            onClose={() => setDetail(null)}
            title={detail?.name ?? "Proyecto"}
            description="Resumen del proyecto de demostración."
          >
            {detail && (
              <>
                <p>
                  {detail.done} de {detail.total} tareas completadas ·{" "}
                  {detail.group || "Personal"}
                </p>
                <ProgressBar value={percentOf(detail)} tone="ok" />
              </>
            )}
          </Dialog>
          <Dialog
            open={!!archive}
            onClose={() => setArchive(null)}
            title="Archivar proyecto"
          >
            <p>
              <strong>{archive?.name}</strong> pasará a la sección de
              archivados.
            </p>
            <Button
              variant="primary"
              onClick={() => archive && archiveProject(archive)}
            >
              Archivar
            </Button>
          </Dialog>
          <Dialog
            open={!!create}
            onClose={() => setCreate(null)}
            title={
              create === "template"
                ? "Nuevo proyecto desde plantilla"
                : section === "templates"
                  ? "Nueva plantilla"
                  : "Nuevo proyecto"
            }
            description="Se creará sólo en esta demostración."
          >
            <form
              className="example-form"
              onSubmit={(e) => {
                e.preventDefault();
                const data = new FormData(e.currentTarget);
                const template = projects.find(
                  (p) => p.id === data.get("template"),
                );
                const isTemplate = section === "templates";
                setProjects([
                  {
                    id: crypto.randomUUID(),
                    name: String(data.get("name")).trim(),
                    group: String(data.get("group")),
                    sector: template?.sector ?? "Gestión",
                    label: template?.label ?? "Proceso",
                    color: template?.color ?? "#0f766e",
                    done: 0,
                    total: template?.total ?? 0,
                    due: "",
                    remaining: "",
                    favorite: false,
                    archived: false,
                    mine: true,
                    template: isTemplate,
                  },
                  ...projects,
                ]);
                reset();
                setSection(isTemplate ? "templates" : "all");
                setCreate(null);
              }}
            >
              {create === "template" && (
                <Field label="Plantilla">
                  <Select
                    name="template"
                    options={projects
                      .filter((p) => p.template)
                      .map((p) => ({ value: p.id, label: p.name }))}
                  />
                </Field>
              )}
              <Field label="Nombre del proyecto">
                <Input name="name" required pattern=".*\S.*" />
              </Field>
              <Field label="Grupo">
                <Select
                  name="group"
                  options={[
                    { value: "", label: "Personal" },
                    ...["Diseño", "Marketing", "Operaciones"].map((v) => ({
                      value: v,
                      label: v,
                    })),
                  ]}
                />
              </Field>
              <Button type="submit" variant="primary">
                Crear
              </Button>
            </form>
          </Dialog>
        </PageStack>
      </AppShell>
    </GenUIProvider>
  );
}
