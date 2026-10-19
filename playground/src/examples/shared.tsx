import { useMemo, type ReactNode } from "react";
import {
  AppShell,
  GenUIProvider,
  NavItem,
  NavSection,
  PageHeader,
  PageStack,
  SidebarNav,
  type LinkComponent,
} from "../../../src";
import { FolderOpen, Settings, Users } from "../../../src/components/icons";

export type ExampleProps = {
  product?: string;
  onNavigate?: (screen: string) => void;
};

/** Composición de navegación para los ejemplos, con el mismo drawer de la biblioteca. */
export function ExampleShell({
  title,
  active,
  product = "ui",
  onNavigate,
  children,
}: ExampleProps & {
  title: string;
  active: string;
  children: ReactNode;
}) {
  const ExampleLink = useMemo<LinkComponent>(
    () =>
      function ExampleLink({ href, onClick, ...props }) {
        return (
          <a
            {...props}
            href={href}
            onClick={(event) => {
              onClick?.(event);
              event.preventDefault();
              onNavigate?.(href.slice(1));
            }}
          />
        );
      },
    [onNavigate],
  );
  return (
    <GenUIProvider
      linkComponent={ExampleLink}
      storagePrefix="catalog-examples:"
    >
      <AppShell
        product={product}
        sidebarTitle="Mi espacio"
        topbarEnd={<span className="muted">Demostración</span>}
        sidebar={
          <SidebarNav ariaLabel="Navegación del ejemplo">
            <NavSection title="Aplicación">
              <NavItem
                href="#dashboard"
                icon={FolderOpen}
                label="Proyectos"
                active={active === "dashboard"}
              />
              <NavItem
                href="#records"
                icon={Users}
                label="Clientes"
                active={active === "records"}
              />
              <NavItem
                href="#settings"
                icon={Settings}
                label="Configuración"
                active={active === "settings"}
              />
            </NavSection>
          </SidebarNav>
        }
      >
        <PageStack>
          <PageHeader title={title} />
          {children}
        </PageStack>
      </AppShell>
    </GenUIProvider>
  );
}
