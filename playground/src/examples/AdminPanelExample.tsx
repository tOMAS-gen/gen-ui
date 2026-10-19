import { useCallback, useMemo, useState } from "react";
import {
  AppShell,
  EmptyState,
  GenUIProvider,
  NavItem,
  NavSection,
  PageHeader,
  PageStack,
  SectionPanel,
  SidebarNav,
  SidebarProfile,
  type LinkComponent,
} from "../../../src";
import {
  Boxes,
  Cpu,
  Globe,
  LayoutDashboard,
  Network,
  Package,
  Server,
  Utensils,
} from "../../../src/components/icons";
import { Gallery } from "../../../src/gallery/Gallery";
import "../../../src/gallery/gallery.css";
import "./dashboards.css";

// Ejemplo de navegación administrativa. Referencias en docs/catalog-sources.md.
const sections = [
  {
    id: "panel",
    label: "Panel",
    icon: LayoutDashboard,
    group: "general",
    description: "Estado general de servidores y servicios.",
  },
  {
    id: "servidores",
    label: "Servidores",
    icon: Server,
    group: "infraestructura",
    description: "Los equipos donde corre todo y cuánto ocupa cada uno.",
  },
  {
    id: "servicios",
    label: "Servicios",
    icon: Package,
    group: "infraestructura",
    description: "Levantar, actualizar y dar de baja cualquier servicio.",
  },
  {
    id: "sitios",
    label: "Sitios web",
    icon: Globe,
    group: "infraestructura",
    description: "Sitios publicados y espacios de clientes.",
  },
  {
    id: "dominios",
    label: "Dominios",
    icon: Network,
    group: "infraestructura",
    description: "Dominios, proxy y certificados.",
  },
  {
    id: "recursos",
    label: "Recursos",
    icon: Cpu,
    group: "infraestructura",
    description: "Almacenamiento, memoria y procesador por servicio.",
  },
  {
    id: "licencias",
    label: "Licencias",
    icon: Boxes,
    group: "productos",
    description: "Administración de licencias y sus instancias.",
  },
  {
    id: "aplicaciones",
    label: "Aplicaciones",
    icon: Utensils,
    group: "productos",
    description: "Aplicaciones y espacios publicados.",
  },
];

/** Estructura de navegación con un estado vacío reutilizable. */
export function AdminPanelExample() {
  const [selected, setSelected] = useState("panel");
  const navigate = useCallback((id: string) => setSelected(id), []);
  const DemoLink = useMemo<LinkComponent>(
    () =>
      function DemoLink({ href, onClick, ...props }) {
        return (
          <a
            {...props}
            href={href}
            onClick={(e) => {
              onClick?.(e);
              e.preventDefault();
              navigate(href.slice(1));
            }}
          />
        );
      },
    [navigate],
  );
  const section = sections.find((s) => s.id === selected) ?? sections[0];
  return (
    <div className="admin-panel">
      <GenUIProvider linkComponent={DemoLink} storagePrefix="catalog-admin:">
        <AppShell
          product="ui"
          sidebarTitle="Panel maestro"
          topbarEnd={<span className="product-demo-label">Demostración</span>}
          sidebar={
            <SidebarNav
              footer={
                <SidebarProfile name="Usuario demo" email="demo@gen.example" />
              }
            >
              {(["general", "infraestructura", "productos"] as const).map(
                (group) => (
                  <NavSection
                    key={group}
                    title={
                      group === "general"
                        ? undefined
                        : group === "infraestructura"
                          ? "Infraestructura"
                          : "Productos"
                    }
                  >
                    {sections
                      .filter((s) => s.group === group)
                      .map((s) => (
                        <NavItem
                          key={s.id}
                          href={`#${s.id}`}
                          icon={s.icon}
                          label={s.label}
                          active={selected === s.id}
                        />
                      ))}
                  </NavSection>
                ),
              )}
            </SidebarNav>
          }
        >
          {selected === "ui" ? (
            <Gallery showThemeToggle={false} />
          ) : (
            <PageStack>
              <PageHeader
                title={section.label}
                description={section.description}
                icon={section.icon}
              />
              <SectionPanel>
                <EmptyState
                  icon={section.icon}
                  title="Tu próxima sección"
                  description={`Usá esta estructura para organizar ${section.label.toLowerCase()} y agregá los componentes que necesites.`}
                  action={{
                    label: "Ver componentes",
                    onClick: () => setSelected("ui"),
                  }}
                />
              </SectionPanel>
            </PageStack>
          )}
        </AppShell>
      </GenUIProvider>
    </div>
  );
}
