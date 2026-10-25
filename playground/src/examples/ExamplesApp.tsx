import { useState } from "react";
import { AuthExample } from "./AuthExamples";
import { ProjectsExample } from "./ProjectsExample";
import { AdminPanelExample } from "./AdminPanelExample";
import { RecordsExample } from "./RecordsExample";
import { SettingsExample } from "./SettingsExample";
import { EmailExamples } from "./EmailExamples";
import "./examples.css";

/** Montar dentro de GenUIProvider, con styles.css y el tema UI importados. */
export function ExamplesApp({
  initialScreen = "login",
  product = "ui",
}: {
  initialScreen?: string;
  product?: string;
}) {
  const [screen, setScreen] = useState(initialScreen);
  const props = { product, onNavigate: setScreen };
  switch (screen) {
    case "dashboard":
      return <ProjectsExample {...props} />;
    case "admin-panel":
      return <AdminPanelExample />;
    case "records":
      return <RecordsExample {...props} />;
    case "settings":
      return <SettingsExample {...props} />;
    case "email":
      return <EmailExamples />;
    case "signup":
    case "recovery":
    case "login":
      return <AuthExample key={screen} {...props} mode={screen} />;
    default:
      return <AuthExample {...props} />;
  }
}
