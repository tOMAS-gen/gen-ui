# Procedencia de las pantallas del catálogo

El catálogo presenta una biblioteca general, con nombres funcionales y un único tema naranja `#F97316`.
Las referencias de producto que siguen documentan sólo la procedencia técnica; no son entornos del catálogo.

Referencias locales revisadas el 19 de octubre de 2026. Las demos no conectan servicios ni modifican los productos.

| Ejemplo | Referencia | Alcance |
| --- | --- | --- |
| Proyectos | `genwork/cutlassfish`, commit `333f0a34e556e195b0814f872ee397007a05ac79` | Adaptación React de la vista de proyectos, sus filtros, tarjetas y lista. |
| Panel de administración | `gen-saas`, rama `tOMAS-gen/white-theme-grays`, commit `7bc89ef` | Estructura real de navegación y secciones todavía en diseño. |
| Inventario y ventas | `genstock-inventory/petrel`, commit `8f9ac72a3e3da709533dccff205b55ad3c694d99` | Contenido Flutter extraído del sector de demostración existente. |

## genwork

Referencias: `src/app/(main)/page.tsx`, `src/components/dashboard/ProjectCard.tsx`,
`ProjectListRow.tsx`, `StatsBar.tsx`, `FilterBar.tsx` y los estilos de tarjeta de `src/app/globals.css`.
La demo conserva estadísticas de proyectos, filtros, favoritos, tarjetas/lista y archivado.
Usa los componentes compartidos `@gen/ui` y un menú limitado a las secciones demostradas.
Los proyectos son fixtures propios; crear, archivar y marcar favoritos sólo modifica estado local.
Abrir un proyecto muestra un resumen de demo, no el editor completo del producto.

## gen saas

La rama `main` local sólo contenía documentación. Se revisó la rama local más reciente con aplicación,
`white-theme-grays`. Referencias: `src/app/(panel)/layout.tsx`, `src/lib/sections.ts`,
`src/components/SectionPage.tsx` y `src/app/app.css`.
El ejemplo conserva la estructura de navegación y la adapta a secciones genéricas, con el tema UI
y un estado vacío reutilizable. No se agregaron métricas de negocio.
La sesión se reemplazó por un perfil demo y los enlaces navegan dentro del ejemplo.

## genstock Flutter

Referencia principal: `frontend/lib/features/dashboard/presentation/screens/dashboard_screen.dart`.
`inventory_dashboard.dart` conserva el cuerpo y los widgets privados; la dependencia Riverpod de sesión
se reemplazó por `DemoUser`. `inventory_support.dart` aporta un `SectorScaffold` reducido al título y contenido,
y los adaptadores de tamaño. No reproduce el shell autenticado completo.

Archivos extraídos: `KpiTile`, `StatusChip`/`StockStatusChip`, `AppInlineNotice`, contraste de color,
`InventoryColors`, los tokens de tipografía/espaciado/geometría y las constantes mock del dashboard.
Se ajustaron imports a archivos locales. El tema general del catálogo proporciona Material y fuentes;
los widgets usan una extensión de colores con el naranja UI. Montserrat y Roboto Mono se incluyen con sus licencias OFL.

**Estado en el producto:** `frontend/lib/core/navigation/app_sectors.dart` declara `kSectorDashboard`
con `enabled: false`, porque contiene cifras mock. La entrada activa es Buscador. Este ejemplo sirve para
consultar el diseño existente, no representa un dashboard activo ni conectado al negocio.

## Pantallas base

Login, registro, recuperación, clientes y configuración son ejemplos reutilizables creados para el catálogo.
No deben confundirse con copias exactas de las pantallas de los productos.

## Selección del drawer compartido

Se incorporaron a `src/styles/components/shell.css` las reglas del drawer de `gen-saas/src/app/app.css`
(commit `7bc89ef`, también presentes en `origin/main` `1f7637d`): fila de 40px, ícono de 20px,
marca exterior de 3px, hover neutro y rail de 57px. `AppShell` incluye el tooltip fuera del scroll,
adaptado de `src/components/RailTooltip.tsx`. Se mantienen los tokens de color de UI.
Estas reglas forman parte de la biblioteca; el catálogo no contiene overrides del drawer.
