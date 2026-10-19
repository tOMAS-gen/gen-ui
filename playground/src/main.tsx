import { StrictMode, useEffect, useLayoutEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import "../../src/styles/index.css";
import "../../src/gallery/gallery.css";
import "../../src/themes/ui.css";
import { GenUIProvider, ToastProvider } from "../../src";
import { Gallery } from "../../src/gallery/Gallery";
import { Catalog } from "./Catalog";
import { examplePlatforms, readLocation } from "./catalog-data";
import { ExamplesApp } from "./examples/ExamplesApp";

function App() {
  const [route, setRoute] = useState(readLocation);
  useLayoutEffect(() => {
    document.documentElement.dataset.theme = route.theme;
  }, [route.theme]);
  useEffect(() => {
    const onPopState = () => setRoute(readLocation());
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);
  function navigate(changes: Partial<typeof route>) {
    const next = { ...route, ...changes };
    const platform = examplePlatforms[next.page];
    if (platform) next.platform = platform;
    const query = new URLSearchParams({
      screen: next.page,
      platform: next.platform,
      theme: next.theme,
    });
    history.pushState(null, "", `${location.pathname}?${query}`);
    setRoute(next);
  }
  return (
    <GenUIProvider storagePrefix="gen-ui:">
      <ToastProvider>
        {route.preview ? (
          route.page === "components" ? (
            <div style={{ padding: 16 }}>
              <Gallery showThemeToggle={false} />
            </div>
          ) : (
            <ExamplesApp
              key={route.page}
              initialScreen={route.page}
              product="ui"
            />
          )
        ) : (
          <Catalog route={route} onRoute={navigate} />
        )}
      </ToastProvider>
    </GenUIProvider>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
