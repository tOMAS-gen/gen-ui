# Biblioteca gen UI

- El propio catálogo debe consumir los componentes públicos de esta biblioteca.
- Antes de crear una pieza visual, buscar si existe en `src/components` y reutilizarla.
- No crear controles, drawers o variantes visuales exclusivos del playground ni sustituirlos con otra biblioteca.
- Si falta una capacidad reutilizable, incorporarla a la biblioteca, exportarla y documentarla; luego consumirla desde el catálogo.
- Las pantallas pueden componer componentes y tener estilos de distribución. No deben duplicar ni sobrescribir la apariencia o el comportamiento de los controles compartidos.
- El drawer se compone con `AppShell`, `SidebarNav`, `NavSection` y `NavItem`. Sus medidas, colapso, resize, foco y comportamiento móvil viven en la biblioteca.
- La identidad del catálogo es gen UI, con naranja `#F97316`. Las referencias a otros productos son procedencia técnica, no entornos del catálogo.
- Para descubrir código, preferir codebase-memory-mcp: `search_graph`, `trace_path`, `get_code_snippet`, `query_graph` y `search_code`. Indexar el proyecto si falta. Usar búsqueda de archivos como respaldo cuando el grafo sea insuficiente o para archivos de configuración/documentación.
