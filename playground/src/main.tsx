import { StrictMode, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import "../../src/styles/index.css";
import "../../src/gallery/gallery.css";
import genwork from "../../src/themes/genwork.css?inline";
import gensaas from "../../src/themes/gensaas.css?inline";
import genstock from "../../src/themes/genstock.css?inline";
import { GenUIProvider, SegmentedControl, ToastProvider } from "../../src";
import { Gallery } from "../../src/gallery/Gallery";

const BRANDS = { genwork, gensaas, genstock } as const;
type Brand = keyof typeof BRANDS;

/** Inyecta la hoja de la marca elegida (en producción se importa una sola). */
function useBrand(brand: Brand) {
  useEffect(() => {
    let el = document.getElementById("brand-theme") as HTMLStyleElement | null;
    if (!el) {
      el = document.createElement("style");
      el.id = "brand-theme";
      document.head.appendChild(el);
    }
    el.textContent = BRANDS[brand];
  }, [brand]);
}

function App() {
  const initial = (new URLSearchParams(location.search).get("brand") as Brand) || "gensaas";
  const [brand, setBrand] = useState<Brand>(initial in BRANDS ? initial : "gensaas");
  useBrand(brand);
  return (
    <GenUIProvider storagePrefix="gen-ui:">
      <ToastProvider>
        <div style={{ padding: 16 }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
            <SegmentedControl
              ariaLabel="Marca"
              value={brand}
              onChange={(b) => {
                setBrand(b);
                history.replaceState(null, "", `?brand=${b}`);
              }}
              options={[
                { value: "genwork", label: "genwork" },
                { value: "gensaas", label: "gen saas" },
                { value: "genstock", label: "genstock" },
              ]}
            />
          </div>
          <Gallery heading={`Componentes · ${brand}`} />
        </div>
      </ToastProvider>
    </GenUIProvider>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
