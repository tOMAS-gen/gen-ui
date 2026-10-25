import { useEffect, useMemo, useState } from "react";
import {
  AppShell,
  Breadcrumbs,
  Button,
  ButtonLink,
  Card,
  EmptyState,
  Field,
  GenUIProvider,
  IconButton,
  InlineAlert,
  LinkButton,
  NavItem,
  NavSection,
  PageHeader,
  SearchInput,
  Select,
  SegmentedControl,
  SidebarNav,
  useDrawerMini,
  type LinkComponent,
} from "../../src";
import {
  BookTemplate,
  FolderOpen,
  Key,
  Layers,
  LayoutDashboard,
  Lock,
  Mail,
  Moon,
  Package,
  Settings,
  Sun,
  Users,
} from "../../src/components/icons";
import {
  examplePlatforms,
  readLocation,
  screens,
  sourceFiles,
  type PageId,
  type Platform,
} from "./catalog-data";
import "./catalog.css";

type Route = ReturnType<typeof readLocation>;

function CodeViewer({
  platform,
  selected,
}: {
  platform: Platform;
  selected: (typeof screens)[number];
}) {
  const files = sourceFiles(platform, selected);
  const [filename, setFilename] = useState(files[0].name);
  const [feedback, setFeedback] = useState("");
  const file = files.find((item) => item.name === filename) ?? files[0];
  return (
    <div className="catalog-code">
      <div className="catalog-filebar">
        <Field label="Archivo">
          <Select
            value={file.name}
            onChange={(e) => {
              setFilename(e.target.value);
              setFeedback("");
            }}
            options={files.map((item) => ({
              value: item.name,
              label: item.name,
            }))}
          />
        </Field>
        <Button
          size="sm"
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(file.code);
              setFeedback("Código copiado");
            } catch {
              setFeedback(
                "No se pudo copiar. Podés seleccionar el código manualmente.",
              );
            }
          }}
        >
          Copiar código
        </Button>
      </div>
      {feedback && (
        <p className="catalog-copy-status" role="status">
          {feedback}
        </p>
      )}
      <pre tabIndex={0} aria-label={`Código de ${file.name}`}>
        <code>{file.code}</code>
      </pre>
      <p className="catalog-code-note">
        {platform === "web"
          ? "Copiá los archivos de ejemplos en una misma carpeta. Los imports de la librería ya usan @gen/ui."
          : "Los archivos Dart van en lib/. El tema usa Montserrat y Roboto Mono: copiá también assets/fonts/ y la declaración de pubspec.yaml."}{" "}
        <ButtonLink href="?screen=start" variant="ghost" size="sm">
          Ver instalación
        </ButtonLink>
      </p>
    </div>
  );
}

function Preview({ route, screen }: { route: Route; screen: string }) {
  const [status, setStatus] = useState<"loading" | "ready" | "missing">(
    "loading",
  );
  const [attempt, setAttempt] = useState(0);
  const [device, setDevice] = useState<"desktop" | "mobile">("desktop");
  const flutter = route.platform === "flutter" && screen !== "components";
  useEffect(() => {
    if (!flutter) return;
    const controller = new AbortController();
    setStatus("loading");
    fetch(`${import.meta.env.BASE_URL}flutter/ready.json`, {
      signal: controller.signal,
      cache: "no-store",
    })
      .then((response) => (response.ok ? response.json() : Promise.reject()))
      .then((data: { engine?: string }) =>
        setStatus(data.engine === "flutter" ? "ready" : "missing"),
      )
      .catch(() => {
        if (!controller.signal.aborted) setStatus("missing");
      });
    return () => controller.abort();
  }, [flutter, attempt]);
  const query = new URLSearchParams({
    screen,
    theme: route.theme,
    preview: "1",
  });
  const url = flutter
    ? `${import.meta.env.BASE_URL}flutter/index.html?${query}`
    : `${import.meta.env.BASE_URL}?${query}`;
  return (
    <>
      <div className="catalog-preview-toolbar">
        <span className="catalog-engine">
          {flutter ? "Flutter · Dart" : "Web · React"}
        </span>
        <SegmentedControl
          ariaLabel="Ancho de vista previa"
          value={device}
          onChange={setDevice}
          options={[
            { value: "desktop", label: "Escritorio" },
            { value: "mobile", label: "Móvil" },
          ]}
        />
        {(!flutter || status === "ready") && (
          <ButtonLink
            variant="ghost"
            size="sm"
            className="catalog-open"
            href={url}
            target="_blank"
            rel="noreferrer"
          >
            Abrir ↗
          </ButtonLink>
        )}
      </div>
      <div
        className={`catalog-canvas ${device === "mobile" ? "catalog-canvas-mobile" : ""}`}
      >
        {flutter && status !== "ready" ? (
          <div className="catalog-preview-message" role="status">
            {status === "loading" ? (
              <p>Preparando la vista previa Flutter…</p>
            ) : (
              <>
                <h3>Prepará la vista previa Flutter</h3>
                <p>
                  El código Dart ya está disponible. Para ejecutar la demo
                  local, compilá los ejemplos:
                </p>
                <pre>
                  <code>npm run build:flutter</code>
                </pre>
                <Button onClick={() => setAttempt(attempt + 1)}>
                  Volver a comprobar
                </Button>
              </>
            )}
          </div>
        ) : (
          <iframe
            key={url}
            src={url}
            title={`Vista previa ${flutter ? "Flutter" : "React"}: ${screen}`}
            className={
              screen === "components" ? "catalog-gallery-frame" : undefined
            }
          />
        )}
      </div>
    </>
  );
}

function GettingStarted() {
  return (
    <article className="catalog-guide">
      <p className="catalog-eyebrow">Empezar</p>
      <h1>Una identidad. Dos plataformas.</h1>
      <p className="catalog-lead">
        Pantallas de ›gen listas para explorar, adaptar e integrar a tu
        producto.
      </p>
      <section>
        <h2>01 / Elegí una pantalla</h2>
        <p>
          Explorá ejemplos de acceso, proyectos, administración, inventario y
          ventas. Cada pantalla ofrece vista previa interactiva y código para su
          plataforma.
        </p>
      </section>
      <section>
        <h2>02 / Usar en React</h2>
        <p>
          Instalá la versión de @gen/ui publicada por tu equipo. Copiá los
          archivos de la pestaña Código en una carpeta e importá la hoja de
          estilos y el tema de UI.
        </p>
        <pre>
          <code>{`import "@gen/ui/styles.css";
import "@gen/ui/themes/ui.css";
import { GenUIProvider } from "@gen/ui";
import { ExamplesApp } from "./examples/ExamplesApp";

export default function App() {
  return <GenUIProvider>
    <ExamplesApp initialScreen="login" product="ui" />
  </GenUIProvider>;
}`}</code>
        </pre>
        <p>
          Requiere React 19 o superior. Cargá Montserrat y Roboto Mono en tu
          aplicación. En Next.js, usá un componente cliente y configurá{" "}
          <code>transpilePackages: ["@gen/ui"]</code>.
        </p>
      </section>
      <section>
        <h2>03 / Usar en Flutter</h2>
        <p>
          El proyecto ejecutable está en <code>examples/flutter</code>. Usa
          widgets de Flutter, un tema ›gen compartido y Montserrat incluida como
          asset.
        </p>
        <pre>
          <code>{`cd examples/flutter
flutter pub get
flutter run -d chrome`}</code>
        </pre>
        <p>
          Podés copiar <code>lib/</code> y <code>assets/fonts/</code> en tu app
          y agregar la declaración de fuentes de <code>pubspec.yaml</code>. Para
          Android o iOS, integrá los widgets en tu proyecto Flutter móvil. La
          vista previa de este catálogo compila Flutter para web.
        </p>
      </section>
      <section>
        <h2>04 / Desarrollo y publicación del catálogo</h2>
        <pre>
          <code>{`npm install
npm run build:flutter
npm run dev

# Sitio completo, listo para hosting estático
npm run build:catalog`}</code>
        </pre>
        <p>
          Publicá el contenido de <code>playground/dist/</code>. Para un
          subdirectorio, ejecutá{" "}
          <code>npm run build:catalog -- --base=/tu-ruta/</code>. Necesitás
          Node.js compatible con Vite 7 y Flutter 3.44 o superior.
        </p>
      </section>
      <InlineAlert tone="info" title="Ejemplos de interfaz">
        Los datos son de demostración. Conectá autenticación, persistencia y
        permisos a los servicios de tu producto.
      </InlineAlert>
    </article>
  );
}

const screenIcons = {
  login: Lock,
  signup: Users,
  recovery: Key,
  dashboard: FolderOpen,
  "admin-panel": LayoutDashboard,
  "inventory-dashboard": Package,
  records: Users,
  settings: Settings,
  email: Mail,
};

function CatalogNavigation({
  route,
  hrefFor,
}: {
  route: Route;
  hrefFor: (page: PageId) => string;
}) {
  const [search, setSearch] = useState("");
  const mini = useDrawerMini();
  const matching = screens.filter(
    (item) =>
      mini ||
      `${item.title} ${item.group} ${item.description}`
        .toLocaleLowerCase()
        .includes(search.toLocaleLowerCase()),
  );
  return (
    <SidebarNav
      ariaLabel="Documentación"
      footer={!mini && <span className="muted">React + Flutter</span>}
    >
      {!mini && (
        <NavSection>
          <SearchInput
            ariaLabel="Buscar pantallas"
            placeholder="Buscar pantallas…"
            value={search}
            onChange={setSearch}
          />
        </NavSection>
      )}
      <NavSection title="Biblioteca">
        <NavItem
          href={hrefFor("start")}
          icon={BookTemplate}
          label="Empezar"
          active={route.page === "start"}
        />
        <NavItem
          href={hrefFor("components")}
          icon={Layers}
          label="Componentes"
          active={route.page === "components"}
        />
      </NavSection>
      {(["Acceso", "Ejemplos", "Aplicación", "Correo"] as const)
        .filter((group) => matching.some((item) => item.group === group))
        .map((group) => (
          <NavSection key={group} title={group}>
            {matching
              .filter((item) => item.group === group)
              .map((item) => (
                <NavItem
                  key={item.id}
                  href={hrefFor(item.id)}
                  icon={screenIcons[item.id]}
                  label={item.title}
                  active={route.page === item.id}
                />
              ))}
          </NavSection>
        ))}
      {!matching.length && (
        <NavSection>
          <EmptyState
            icon={Layers}
            title="Sin resultados"
            description="No hay pantallas con ese nombre."
            action={{ label: "Limpiar búsqueda", onClick: () => setSearch("") }}
          />
        </NavSection>
      )}
    </SidebarNav>
  );
}

export function Catalog({
  route,
  onRoute,
}: {
  route: Route;
  onRoute: (changes: Partial<Route>) => void;
}) {
  const [view, setView] = useState<"preview" | "code">("preview");
  const fixedPlatform = examplePlatforms[route.page];
  const selected = screens.find((item) => item.id === route.page) ?? screens[0];
  const navigate = (page: PageId) => onRoute({ page });
  const hrefFor = (page: PageId) =>
    `?${new URLSearchParams({ screen: page, platform: examplePlatforms[page] ?? route.platform, theme: route.theme })}`;
  const CatalogLink = useMemo<LinkComponent>(
    () =>
      function CatalogLink({ href, onClick, ...props }) {
        return (
          <a
            {...props}
            href={href}
            onClick={(event) => {
              onClick?.(event);
              if (
                event.defaultPrevented ||
                event.button !== 0 ||
                event.metaKey ||
                event.ctrlKey ||
                event.altKey ||
                event.shiftKey ||
                props.target === "_blank" ||
                !href.startsWith("?screen=")
              )
                return;
              const page = new URLSearchParams(href.slice(1)).get("screen");
              if (
                page !== "start" &&
                page !== "components" &&
                !screens.some((item) => item.id === page)
              )
                return;
              event.preventDefault();
              onRoute({ page: page as PageId });
            }}
          />
        );
      },
    [onRoute],
  );
  useEffect(() => {
    document.title = `›gen UI · ${route.page === "start" ? "Empezar" : route.page === "components" ? "Componentes" : selected.title}`;
  }, [route.page, selected.title]);
  return (
    <GenUIProvider linkComponent={CatalogLink} storagePrefix="gen-ui-catalog:">
      <AppShell
        product="ui"
        sidebarTitle="Biblioteca de interfaces"
        topbarEnd={
          <IconButton
            label={
              route.theme === "light"
                ? "Activar tema oscuro"
                : "Activar tema claro"
            }
            onClick={() =>
              onRoute({ theme: route.theme === "light" ? "dark" : "light" })
            }
          >
            {route.theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
          </IconButton>
        }
        sidebar={<CatalogNavigation route={route} hrefFor={hrefFor} />}
      >
        <div className="catalog-main">
          {route.page === "start" ? (
            <GettingStarted />
          ) : route.page === "components" ? (
            <>
              <PageHeader
                title="Componentes"
                description="Las piezas que dan forma a las pantallas de ›gen."
              />
              <Card className="catalog-workbench">
                <Preview
                  route={{ ...route, platform: "web" }}
                  screen="components"
                />
              </Card>
            </>
          ) : (
            <>
              <Breadcrumbs
                items={[
                  { label: "Biblioteca", href: hrefFor("start") },
                  { label: selected.group },
                  { label: selected.title },
                ]}
              />
              <PageHeader
                title={selected.title}
                description={selected.description}
                actions={
                  <span className="muted">
                    {screens.indexOf(selected) + 1} / {screens.length}
                  </span>
                }
              />
              <div className="catalog-platform-row">
                {fixedPlatform ? (
                  <span className="catalog-availability">
                    {fixedPlatform === "web"
                      ? "Web / React"
                      : "Flutter / Dart"}{" "}
                  </span>
                ) : (
                  <SegmentedControl
                    ariaLabel="Plataforma"
                    value={route.platform}
                    onChange={(platform) => onRoute({ platform })}
                    options={[
                      { value: "web", label: "Web / React" },
                      { value: "flutter", label: "Flutter / Dart" },
                    ]}
                  />
                )}
                <span className="catalog-availability">
                  {screens.length} pantallas · React y Flutter · 2 temas
                </span>
              </div>
              <Card
                className="catalog-workbench"
                aria-label="Ejemplo interactivo"
              >
                <div className="catalog-workbench-tabs">
                  <SegmentedControl
                    ariaLabel="Contenido del ejemplo"
                    value={view}
                    onChange={setView}
                    options={[
                      { value: "preview", label: "Vista previa" },
                      { value: "code", label: "Código" },
                    ]}
                  />
                  <span>
                    {route.platform === "web" ? "React 19" : "Flutter"}
                  </span>
                </div>
                {view === "preview" ? (
                  <Preview route={route} screen={selected.id} />
                ) : (
                  <CodeViewer
                    key={`${route.platform}-${selected.id}`}
                    platform={route.platform}
                    selected={selected}
                  />
                )}
              </Card>
              <div className="catalog-details">
                <div>
                  <h2>
                    {route.platform === "web"
                      ? "Componentes del ejemplo"
                      : "Widgets nativos, identidad ›gen"}
                  </h2>
                  <p>
                    {route.platform === "web" || fixedPlatform
                      ? selected.parts
                      : "Material · ThemeData · LayoutBuilder · Montserrat"}
                  </p>
                </div>
                <div>
                  <h2>Listo para adaptar</h2>
                  <p>
                    Probá la pantalla, explorá el código y conectá tus datos.
                    Las acciones de la demo se restablecen al recargar.
                  </p>
                </div>
              </div>
              <footer className="catalog-page-footer">
                <span>›gen / Sistema de interfaces</span>
                <LinkButton muted onClick={() => navigate("start")}>
                  Cómo integrar las pantallas →
                </LinkButton>
              </footer>
            </>
          )}
        </div>
      </AppShell>
    </GenUIProvider>
  );
}
