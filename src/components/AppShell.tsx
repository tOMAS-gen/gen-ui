"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ComponentType,
  type ReactNode,
  type RefObject,
} from "react";
import { createPortal } from "react-dom";
import { cx } from "../lib/cx";
import { Avatar } from "./Alert";
import { BrandLogo } from "./BrandLogo";
import { ChevronRight, LogOut, Menu, PanelLeft, PanelLeftClose, X, type IconProps } from "./icons";
import { useGenUI } from "./Provider";
import { ThemeToggle } from "./Theme";

const MIN_W = 240;
const MAX_W = 400;
const DEFAULT_W = 240;
const MINI_W = 57; // 8px de margen + 40px de fila + 8px + 1px de borde.
const MOBILE_QUERY = "(max-width: 767px)";

const MobileDrawerContext = createContext<() => void>(() => {});

export function useCloseMobileDrawer() {
  return useContext(MobileDrawerContext);
}

/** Modo rail: sidebar colapsado a solo íconos con tooltip (no en mobile, que usa el drawer completo deslizable). */
const DrawerMiniContext = createContext(false);

export function useDrawerMini() {
  return useContext(DrawerMiniContext);
}

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  // useLayoutEffect (no useEffect): corre antes del primer paint, así el arranque
  // en `false` nunca llega a pintarse como un frame de layout desktop en mobile.
  useLayoutEffect(() => {
    const mql = window.matchMedia(MOBILE_QUERY);
    setIsMobile(mql.matches);
    const onChange = () => setIsMobile(mql.matches);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);
  return isMobile;
}

/**
 * Estructura de la app: barra superior de 40px (48 en mobile), menú lateral
 * redimensionable (240–400px) que colapsa a un rail de íconos de 57px, y en
 * mobile un drawer con foco atrapado. Ancho y colapso se recuerdan en
 * localStorage con el prefijo del `GenUIProvider`.
 */
export function AppShell({
  sidebar,
  children,
  product,
  brand,
  topbarEnd,
  sidebarTitle = "Espacio de trabajo",
}: {
  /** Contenido del menú lateral (`SidebarNav`, `NavItem`, `SidebarFooter`…). */
  sidebar: ReactNode;
  children: ReactNode;
  /** Producto del logotipo (›gen + product). Ignorado si se pasa `brand`. */
  product?: string;
  brand?: ReactNode;
  /** Extremo derecho de la barra superior (por defecto, el selector de tema). */
  topbarEnd?: ReactNode;
  sidebarTitle?: string;
}) {
  const { storagePrefix, labels } = useGenUI();
  const STORAGE_KEY = `${storagePrefix}drawer-collapsed`;
  const WIDTH_KEY = `${storagePrefix}drawer-width`;
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const mobileTriggerRef = useRef<HTMLButtonElement>(null);
  const [width, setWidth] = useState(DEFAULT_W);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "1") setCollapsed(true);
    const w = parseInt(window.localStorage.getItem(WIDTH_KEY) ?? "", 10);
    if (Number.isFinite(w)) setWidth(Math.min(MAX_W, Math.max(MIN_W, w)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const dragging = useRef(false);

  const collapse = useCallback(() => {
    setCollapsed(true);
    try { window.localStorage.setItem(STORAGE_KEY, "1"); } catch { /* */ }
  }, [STORAGE_KEY]);

  const expand = useCallback(() => {
    setCollapsed(false);
    try { window.localStorage.setItem(STORAGE_KEY, "0"); } catch { /* */ }
  }, [STORAGE_KEY]);

  const openMobile = useCallback(() => setMobileOpen(true), []);
  const closeMobile = useCallback(() => {
    setMobileOpen(false);
    mobileTriggerRef.current?.focus();
  }, []);

  const onResizeStart = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    dragging.current = true;
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
  }, []);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!dragging.current) return;
      const next = Math.min(MAX_W, Math.max(MIN_W, e.clientX));
      setWidth(next);
    };
    const onUp = () => {
      if (!dragging.current) return;
      dragging.current = false;
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
      setWidth((w) => {
        try { window.localStorage.setItem(WIDTH_KEY, String(w)); } catch { /* */ }
        return w;
      });
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, [WIDTH_KEY]);

  // Teclado: flechas izquierda/derecha redimensionan de a 16px.
  const onResizeKey = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
      e.preventDefault();
      setWidth((w) => {
        const next = Math.min(MAX_W, Math.max(MIN_W, w + (e.key === "ArrowRight" ? 16 : -16)));
        try { window.localStorage.setItem(WIDTH_KEY, String(next)); } catch { /* */ }
        return next;
      });
    },
    [WIDTH_KEY],
  );

  const isMobile = useIsMobile();
  const mini = collapsed && !isMobile;
  const asideWidth = mini ? MINI_W : width;
  const asideRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!isMobile) setMobileOpen(false);
  }, [isMobile]);

  // Foco atrapado + Escape mientras el drawer mobile está abierto (hallazgo
  // Crítico de accesibilidad: sin esto, Tab se escapa al contenido de atrás
  // y no hay forma de cerrar por teclado).
  useEffect(() => {
    if (!mobileOpen || !isMobile) return;
    const aside = asideRef.current;
    if (!aside) return;
    // El contenido puede cambiar al filtrar o navegar. Sólo participan los
    // controles visibles y habilitados en el momento de pulsar Tab.
    const getFocusable = () => Array.from(aside.querySelectorAll<HTMLElement>(
      'a[href], button, input, select, textarea, [tabindex]',
    )).filter((node) => node.tabIndex >= 0 && !node.matches(':disabled') && node.getClientRects().length > 0);
    getFocusable()[0]?.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        closeMobile();
        return;
      }
      if (e.key !== "Tab") return;
      const focusable = getFocusable();
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (!first || !last) {
        e.preventDefault();
        return;
      }
      if (!focusable.includes(document.activeElement as HTMLElement)) {
        e.preventDefault();
        (e.shiftKey ? last : first).focus();
        return;
      }
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last?.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first?.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [mobileOpen, isMobile, closeMobile]);

  return (
    <MobileDrawerContext.Provider value={closeMobile}>
      <DrawerMiniContext.Provider value={mini}>
        <div className="shell" style={{ gridTemplateColumns: `${asideWidth}px minmax(0, 1fr)` }}>
          <header className="shell-topbar">
            <button
              ref={mobileTriggerRef}
              type="button"
              className="icon-btn mobile-menu-btn"
              aria-label={labels.openMenu}
              onClick={openMobile}
            >
              <Menu size={20} />
            </button>
            {brand ?? <BrandLogo product={product} />}
            <div className="shell-topbar-end">{topbarEnd ?? <ThemeToggle mini />}</div>
          </header>
          <button
            type="button"
            className={`sidebar-overlay ${mobileOpen ? "open" : ""}`}
            onClick={closeMobile}
            aria-label={labels.closeMenu}
            tabIndex={mobileOpen ? 0 : -1}
          />
          <aside
            ref={asideRef}
            inert={isMobile && !mobileOpen}
            className={`sidebar ${mini ? "mini" : ""} ${mobileOpen ? "mobile-open" : ""}`}
            style={{ width: asideWidth }}
            role={isMobile && mobileOpen ? "dialog" : undefined}
            aria-modal={isMobile && mobileOpen ? true : undefined}
            aria-label={labels.menu}
          >
            <div className="sidebar-header">
              {!mini && <span className="section-label">{sidebarTitle}</span>}
              <button
                type="button"
                className="icon-btn drawer-close-mobile"
                aria-label={labels.closeMenu}
                onClick={closeMobile}
              >
                <X size={18} />
              </button>
              <button
                type="button"
                className="icon-btn drawer-collapse-desktop"
                aria-label={collapsed ? labels.showMenu : labels.hideMenu}
                title={collapsed ? labels.showMenu : labels.hideMenu}
                onClick={collapsed ? expand : collapse}
              >
                {collapsed ? <PanelLeft size={18} /> : <PanelLeftClose size={18} />}
              </button>
            </div>
            {sidebar}
            {!mini && (
              <div
                className="sidebar-resize-handle"
                onMouseDown={onResizeStart}
                onKeyDown={onResizeKey}
                role="separator"
                aria-orientation="vertical"
                aria-valuemin={MIN_W}
                aria-valuemax={MAX_W}
                aria-valuenow={width}
                aria-label={labels.resizeMenu}
                tabIndex={0}
              />
            )}
          </aside>
          <main className="main" inert={isMobile && mobileOpen}>{children}</main>
        </div>
        {mini && <RailTooltip rootRef={asideRef} />}
      </DrawerMiniContext.Provider>
    </MobileDrawerContext.Provider>
  );
}

/** Tooltip del rail compartido, adaptado del panel de referencia. */
function RailTooltip({ rootRef }: { rootRef: RefObject<HTMLElement | null> }) {
  const [tip, setTip] = useState<{ label: string; top: number; left: number } | null>(null);
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const show = (event: Event) => {
      const target = (event.target as Element | null)?.closest<HTMLElement>("[data-tooltip]");
      if (!target || !root.contains(target)) return;
      const rect = target.getBoundingClientRect();
      setTip({ label: target.dataset.tooltip ?? "", top: rect.top + rect.height / 2, left: rect.right + 10 });
    };
    const hide = () => setTip(null);
    const leave = (event: Event) => {
      const target = (event.target as Element | null)?.closest<HTMLElement>("[data-tooltip]");
      const next = (event as MouseEvent | FocusEvent).relatedTarget;
      if (target && next instanceof Node && target.contains(next)) return;
      hide();
    };
    const onKey = (event: KeyboardEvent) => { if (event.key === "Escape") hide(); };
    root.addEventListener("pointerover", show);
    root.addEventListener("focusin", show);
    root.addEventListener("pointerout", leave);
    root.addEventListener("focusout", leave);
    document.addEventListener("keydown", onKey);
    window.addEventListener("scroll", hide, true);
    window.addEventListener("resize", hide);
    return () => {
      root.removeEventListener("pointerover", show);
      root.removeEventListener("focusin", show);
      root.removeEventListener("pointerout", leave);
      root.removeEventListener("focusout", leave);
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("scroll", hide, true);
      window.removeEventListener("resize", hide);
    };
  }, [rootRef]);
  if (!tip) return null;
  return createPortal(<div className="rail-tooltip" role="presentation" aria-hidden="true" style={{ top: tip.top, left: tip.left }}>{tip.label}</div>, document.body);
}

/* ------------------------------------------------------------------------ */
/* Piezas del menú lateral                                                   */
/* ------------------------------------------------------------------------ */

/** Contenedor del menú: zona con scroll + pie fijo. */
export function SidebarNav({ children, footer, ariaLabel = "Principal" }: { children: ReactNode; footer?: ReactNode; ariaLabel?: string }) {
  const mini = useDrawerMini();
  return (
    <nav className={mini ? "sidebar-nav sidebar-nav-mini" : "sidebar-nav"} aria-label={ariaLabel}>
      <div className="sidebar-scroll">{children}</div>
      {footer && <div className="sidebar-footer">{footer}</div>}
    </nav>
  );
}

/** Grupo de links con rótulo de sección (oculto en el rail). */
export function NavSection({ title, children }: { title?: string; children: ReactNode }) {
  const mini = useDrawerMini();
  if (mini) return <>{children}</>;
  return (
    <div className="nav-section" role="group" aria-label={title}>
      {title && <span className="section-label nav-section-title">{title}</span>}
      {children}
    </div>
  );
}

/** Link del menú: fila con ícono (expandido) o ícono con tooltip (rail). */
export function NavItem({
  href,
  icon: Icon,
  label,
  active,
  badge,
}: {
  href: string;
  icon: ComponentType<IconProps>;
  label: string;
  active?: boolean;
  badge?: ReactNode;
}) {
  const { Link } = useGenUI();
  const mini = useDrawerMini();
  const close = useCloseMobileDrawer();
  if (mini) {
    return (
      <Link
        href={href}
        onClick={close}
        className={cx("rail-link", active && "nav-active")}
        aria-current={active ? "page" : undefined}
        aria-label={label}
        data-tooltip={label}
      >
        <Icon size={20} />
      </Link>
    );
  }
  return (
    <Link href={href} onClick={close} className={cx("nav", active && "nav-active")} aria-current={active ? "page" : undefined}>
      <Icon size={20} />
      <span className="nav-label">{label}</span>
      {badge}
    </Link>
  );
}

/** Grupo plegable con sublista (patrón "Proyectos ›" de genwork). */
export function NavGroup({
  label,
  icon: Icon,
  open,
  onOpenChange,
  badge,
  seeAll,
  children,
}: {
  label: string;
  icon: ComponentType<IconProps>;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  badge?: ReactNode;
  /** Link "ver todos" junto al grupo. */
  seeAll?: { href: string; label?: string };
  children: ReactNode;
}) {
  const { Link } = useGenUI();
  const close = useCloseMobileDrawer();
  const sublistId = `nav-sublist-${label.replace(/\W/g, "")}`;
  return (
    <div>
      <div className={cx("nav-group", open && "open")}>
        <button type="button" className="nav-group-toggle" aria-expanded={open} aria-controls={sublistId} onClick={() => onOpenChange(!open)}>
          <ChevronRight size={15} className="chev" />
          <Icon size={16} className="muted" />
          <span style={{ flex: 1, textAlign: "left" }}>{label}</span>
          {badge}
        </button>
        {seeAll && (
          <Link href={seeAll.href} onClick={close} className="muted" style={{ fontSize: "var(--text-xs)", marginLeft: 6 }}>
            {seeAll.label ?? "ver todos"}
          </Link>
        )}
      </div>
      {open && (
        <div className="nav-sublist" id={sublistId} role="group" aria-label={label}>
          {children}
        </div>
      )}
    </div>
  );
}

/** Link de una sublista de `NavGroup`. */
export function NavSubItem({ href, active, children }: { href: string; active?: boolean; children: ReactNode }) {
  const { Link } = useGenUI();
  const close = useCloseMobileDrawer();
  return (
    <Link href={href} onClick={close} className={active ? "nav-active" : undefined} aria-current={active ? "page" : undefined}>
      {children}
    </Link>
  );
}

/** Perfil del usuario (avatar + nombre + email); en el rail, sólo avatar. */
export function SidebarProfile({ name, email, image }: { name: string; email?: string; image?: string | null }) {
  const mini = useDrawerMini();
  if (mini) {
    return (
      <div className="rail-avatar" data-tooltip={name} aria-label={name}>
        <Avatar name={name} src={image} size={28} className="sidebar-avatar" />
      </div>
    );
  }
  return (
    <div className="sidebar-profile">
      <Avatar name={name} src={image} size={32} className="sidebar-avatar" />
      <div className="sidebar-user-info">
        <span className="sidebar-user-name">{name}</span>
        {email && <span className="sidebar-user-email">{email}</span>}
      </div>
    </div>
  );
}

/** Botón "Cerrar sesión" del pie del menú. */
export function SidebarLogout({ onClick, label = "Cerrar sesión" }: { onClick?: () => void; label?: string }) {
  const mini = useDrawerMini();
  return (
    <button
      type={onClick ? "button" : "submit"}
      className="btn btn-ghost sidebar-logout-btn"
      onClick={onClick}
      aria-label={mini ? label : undefined}
      data-tooltip={mini ? label : undefined}
    >
      <LogOut size={16} />
      <span className="sidebar-logout-label">{label}</span>
    </button>
  );
}
