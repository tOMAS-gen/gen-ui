import { spawnSync } from "node:child_process";
import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const project = fileURLToPath(new URL("../examples/flutter/", import.meta.url));
const destination = new URL("../playground/public/flutter/", import.meta.url);
const command = process.platform === "win32" ? "flutter.bat" : "flutter";
const result = spawnSync(
  command,
  ["build", "web", "--release", "--no-web-resources-cdn"],
  { cwd: project, stdio: "inherit", shell: process.platform === "win32" },
);
if (result.error || result.status !== 0) {
  console.error(
    result.error?.message ?? "No se pudo compilar la vista previa Flutter.",
  );
  process.exit(result.status || 1);
}
await rm(destination, { recursive: true, force: true });
await mkdir(destination, { recursive: true });
await cp(
  new URL("../examples/flutter/build/web/", import.meta.url),
  destination,
  { recursive: true },
);
// Recursos relativos: funciona tanto en / como en un subdirectorio del hosting.
const htmlPath = new URL("index.html", destination);
await writeFile(
  htmlPath,
  (await readFile(htmlPath, "utf8")).replace(
    '<base href="/">',
    '<base href="./">',
  ),
);
await writeFile(
  new URL("ready.json", destination),
  JSON.stringify({ engine: "flutter" }),
);
console.log("Vista previa Flutter disponible en playground/public/flutter/.");
