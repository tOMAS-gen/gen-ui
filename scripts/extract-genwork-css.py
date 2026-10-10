"""Extracción única (v0.1.0) del CSS genérico de genwork a gen-ui.

Copia rangos de líneas de `genwork/src/app/globals.css` a `src/styles/components/`
aplicando la nomenclatura común (ver NOMENCLATURA.md) y los tokens de marca.
Se conserva como registro de origen; los archivos generados se editan a mano.
"""
import re, sys, pathlib

SRC = pathlib.Path(sys.argv[1])
OUT = pathlib.Path(__file__).resolve().parent.parent / "src/styles/components"
lines = SRC.read_text().splitlines()

def rng(a, b):
    return "\n".join(lines[a - 1 : b])

FILES = {
    "button.css": [(281, 358), (1012, 1060)],
    "card.css": [(360, 365), (2799, 2862)],
    "form.css": [(367, 409), (1005, 1010), (3568, 3585), (5550, 5563), (2032, 2075)],
    "shell.css": [(411, 561), (1289, 1362), (1807, 1910), (4064, 4179), (5311, 5371)],
    "tag.css": [(938, 969), (2103, 2133), (2652, 2690), (3301, 3325), (5096, 5131)],
    "auth.css": [(972, 1003)],
    "dialog.css": [(1062, 1137)],
    "menu.css": [(1139, 1203)],
    "toast.css": [(1482, 1670)],
    "theme-toggle.css": [(1911, 1930), (1953, 1999)],
    "combobox.css": [(2278, 2362)],
    "filter.css": [(2485, 2601), (5841, 5910)],
    "progress.css": [(2603, 2637), (3719, 3777), (3493, 3531)],
    "stats.css": [(2692, 2733)],
    "pagination.css": [(3142, 3180)],
    "table.css": [(3212, 3299)],
    "feedback.css": [(3333, 3430)],
    "tabs.css": [(3457, 3491), (4495, 4520)],
    "layout.css": [(5373, 5482), (5504, 5549), (5585, 5591), (5612, 5642), (5722, 5731)],
    "color-picker.css": [(4180, 4493)],
}

RENAMES = [
    (r"\.project-table", ".data-table"),
    (r"\.project-tabs", ".tabs"),
    (r"\.project-grid", ".card-grid"),
    (r"\.project-card-link", ".card-link"),
    (r"\.project-card-actions", ".card-actions"),
    (r"\.project-card", ".card-interactive"),
    (r"\.member-search", ".combobox"),
    (r"\.project-toolbar-main", ".toolbar-main"),
    (r"\.project-toolbar-summary", ".toolbar-summary"),
    (r"\.project-toolbar", ".toolbar"),
    (r"\.project-search", ".search-input"),
    (r"\.project-filter-", ".toolbar-filter-"),
    (r"\.project-sort", ".toolbar-sort"),
    (r"\.project-view-switch", ".view-switch"),
    (r"\.project-result-count", ".toolbar-count"),
    (r"\.project-active-filters", ".toolbar-chips"),
    (r"\.project-filters-reset", ".toolbar-reset"),
    (r"\.sector-section-toggle", ".section-toggle"),
    (r"\.sector-grid", ".card-grid-sm"),
    (r"\.board-card \.card-header,?\n?", ""),
]

for name, ranges in FILES.items():
    css = "\n\n".join(rng(a, b) for a, b in ranges)
    for pat, rep in RENAMES:
        css = re.sub(pat, rep, css)
    css = re.sub(r"(?<![-\w])color: var\(--accent\);", "color: var(--accent-text);", css)
    css = css.replace("rgba(0, 0, 0, 0.45)", "var(--scrim)")
    (OUT / name).write_text(f"/* gen-ui — {name[:-4]} (origen: genwork globals.css) */\n\n{css.strip()}\n")
    print(name, len(css.splitlines()))
