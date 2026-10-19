# Reglas de diseño — gen-ui

Heredadas de genwork (`DESIGN.md`, `design-system/genwork/MASTER.md`, `GENSTOCK_PARITY.md`). Valen para todos
los productos; sólo cambia la marca.

## Identidad

- Montserrat para la interfaz; Roboto Mono para códigos, IPs, rutas y valores técnicos.
- Cuerpo 14px/1.6 (13px en mobile). Título de pantalla 24/700. Título de ítem 14/600. Acciones 13/600 en
  sentence case. Rótulo de sección 11/700 en mayúsculas con 1.2px de tracking.
- La marca aparece sólo en selección, interacción, foco y logotipo; nunca en superficies.
- Oscuro con neutros acromáticos (R=G=B): `#0c0c0c`, `#151515`, `#1c1c1c`, `#262626`, borde `#272727`.
- Claro: página `#f4f5f8`, panel `#ffffff`, campo `#f1f3f6`, borde `#d2d6de`, outline de campo `#e3e6eb`.
- Colores de etiquetas y estados conservan su significado y no dependen de la marca.
- Si la marca se parece a un color semántico (gen saas es rojo), el estado se distingue además por forma o
  ícono: botón de peligro con borde, avisos de error siempre con ícono.

## Forma y profundidad

- Radios por rol: chip/badge/tooltip 4px, botón/campo/ítem de nav 6px, card/panel 8px, overlay 12px.
- Círculos y píldoras sólo para avatares, contadores y progreso.
- Profundidad por escalones de superficie. Cards, filas y chips sin sombra; sombras sólo en diálogos, menús y
  popovers.
- Cards planas: en hover cambia sólo el borde, sin elevar ni desplazar.
- Sin gradientes, glassmorphism, ruido ni secciones de marketing.

## Estructura

- Barra superior 40px (48 en mobile), sidebar 240px redimensionable hasta 400, rail de íconos 57px.
- Padding de página y de card 16px. Ritmo 4/8: 4, 8, 12, 16, 24, 32, 48.
- Estado activo con lengüeta de 3px: nav, tabs, orden activo.
- Filas de tabla de 44px; controles con etiqueta de al menos 44–48px de área táctil.
- En mobile, filtros y barras pasan a varias filas; tablas, tabs y bloques de código scrollean en su propio
  contenedor. Sin scroll horizontal de página entre 320 y 1280px.

## Interacción y accesibilidad

- Foco visible de 2px en el accent.
- Transiciones de 150–200ms; respetar `prefers-reduced-motion`.
- Navegación por teclado completa, nombres accesibles, y estados de vacío, carga y error en toda vista.
- Contraste AA: el texto sobre la marca usa `--on-accent` (oscuro cuando el accent es claro).

## La biblioteca se usa a sí misma

El catálogo es consumidor de los componentes públicos de `src/`. No tiene una segunda versión visual
de botones, campos o navegación. Sus estilos locales sólo distribuyen contenido y vistas previas.
Una capacidad ausente se implementa como parte reutilizable de la biblioteca antes de usarla.
No se incorporan controles de otra biblioteca para resolver necesidades exclusivas del catálogo.

El drawer usa `AppShell`, `SidebarNav`, `NavSection` y `NavItem`, tanto en el catálogo como en las apps.
En escritorio mide 240–400 px y colapsa a un rail de 57 px; conserva ancho y colapso.
En móvil abre sobre el contenido, con overlay, cierre por Escape o navegación, control del foco y retorno
al disparador. Cualquier corrección de este comportamiento pertenece al componente compartido.

Selección del drawer: fila de 40px e ícono de 20px con mouse, margen lateral de 8px y separación de 4px.
La marca activa de 3px queda fuera del recuadro, pegada al borde del menú. Hover neutro y selección con
el color principal; foco interior visible. En táctil las filas conservan al menos 48px. Los tooltips del
rail se dibujan fuera del scroll y pertenecen a `AppShell`, sin adaptaciones por aplicación.
