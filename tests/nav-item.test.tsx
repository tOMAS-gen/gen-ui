import { cleanup, render, screen } from "@testing-library/react";
import type { AnchorHTMLAttributes } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { AppShell, GenUIProvider, NavItem, SidebarNav } from "../src";
import { Boxes } from "../src/components/icons";

let storage: Map<string, string>;
beforeEach(() => {
  storage = new Map<string, string>();
  vi.stubGlobal("localStorage", {
    getItem: (key: string) => storage.get(key) ?? null,
    setItem: (key: string, value: string) => storage.set(key, value),
    removeItem: (key: string) => storage.delete(key),
    clear: () => storage.clear(),
  });
  vi.stubGlobal("matchMedia", (query: string) => ({
    matches: false,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  }));
});
afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe("NavItem", () => {
  it("sin newTab navega en la misma pestaña", () => {
    render(<NavItem href="/genstock" icon={Boxes} label="›genstock" />);
    const link = screen.getByRole("link", { name: "›genstock" });
    expect(link.getAttribute("target")).toBeNull();
    expect(link.getAttribute("rel")).toBeNull();
    expect(link.querySelector(".nav-external")).toBeNull();
  });

  it("con newTab abre otra pestaña, sin opener, y lo anuncia", () => {
    render(<NavItem href="/genstock" icon={Boxes} label="›genstock" newTab />);
    const link = screen.getByRole("link", { name: "›genstock (se abre en otra pestaña)" });
    expect(link.getAttribute("href")).toBe("/genstock");
    expect(link.getAttribute("target")).toBe("_blank");
    expect(link.getAttribute("rel")).toBe("noopener noreferrer");
    const icono = link.querySelector("svg.nav-external");
    expect(icono).not.toBeNull();
    expect(icono?.getAttribute("aria-hidden")).toBe("true");
  });

  it("pasa target y rel al Link del provider (el del router del producto)", () => {
    const recibidos: AnchorHTMLAttributes<HTMLAnchorElement>[] = [];
    const Link = (props: AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) => {
      recibidos.push(props);
      return <a {...props} />;
    };
    render(
      <GenUIProvider linkComponent={Link} labels={{ opensInNewTab: "opens in a new tab" }}>
        <NavItem href="/genstock" icon={Boxes} label="›genstock" newTab />
      </GenUIProvider>,
    );
    expect(recibidos.at(-1)).toMatchObject({ href: "/genstock", target: "_blank", rel: "noopener noreferrer" });
    expect(screen.getByRole("link", { name: "›genstock (opens in a new tab)" })).toBeTruthy();
  });

  it("contraído (rail) también abre otra pestaña y lo dice en el aria-label", () => {
    storage.set("gen:drawer-collapsed", "1");
    render(
      <AppShell
        sidebar={
          <SidebarNav>
            <NavItem href="/genstock" icon={Boxes} label="›genstock" newTab />
            <NavItem href="/menuweb" icon={Boxes} label="menuweb" />
          </SidebarNav>
        }
      >
        <p>contenido</p>
      </AppShell>,
    );
    const externo = screen.getByRole("link", { name: "›genstock (se abre en otra pestaña)" });
    expect(externo.classList.contains("rail-link")).toBe(true);
    expect(externo.getAttribute("target")).toBe("_blank");
    expect(externo.getAttribute("rel")).toBe("noopener noreferrer");
    expect(externo.getAttribute("data-tooltip")).toBe("›genstock (se abre en otra pestaña)");
    expect(screen.getByRole("link", { name: "menuweb" }).getAttribute("data-tooltip")).toBe("menuweb");
    const interno = screen.getByRole("link", { name: "menuweb" });
    expect(interno.classList.contains("rail-link")).toBe(true);
    expect(interno.getAttribute("target")).toBeNull();
  });
});
