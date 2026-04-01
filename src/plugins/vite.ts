import { Plugin, ViteDevServer } from "vite";
import { BuilderConfigInterface } from "../types";
import fs from "node:fs";
import path from "node:path";
import BuildRouter from "@amazing_router/core/builder";
import { generateRouteFilesSource } from "../utils/generateRouteFiles";

/**
 * Vite plugin for Amazing Router.
 * It automates the generation of the route tree during the build process
 * and watches for file changes during development.
 */
export function amazingRouterPlugin(options?: BuilderConfigInterface): Plugin {
  const router = new BuildRouter(options);
  const outputPath = path.resolve(process.cwd(), ".amazing-router/routes.json");

  const generate = () => {
    const tree = router.build();
    if (!fs.existsSync(path.dirname(outputPath))) {
      fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    }
    fs.writeFileSync(outputPath, JSON.stringify(tree, null, 2));

    const routeFilesPath = path.resolve(path.dirname(outputPath), "routeFiles.ts");
    fs.writeFileSync(routeFilesPath, generateRouteFilesSource(tree, path.dirname(outputPath)));
  };

  return {
    name: "vite-plugin-amazing-router",

    buildStart() {
      generate();
    },

    configureServer(server: ViteDevServer): void {
      const isRouteFile = (f: string) => /page\.[tj]sx?$/.test(f) || /layout\.[tj]sx?$/.test(f) || /middleware\.[tj]sx?$/.test(f);

      server.watcher.on("add", (file: string) => {
        if (isRouteFile(file)) {
          generate();
          server.ws.send({ type: "full-reload" });
        }
      });

      server.watcher.on("change", (file: string) => {
        if (isRouteFile(file)) {
          generate();
          // No full-reload needed — Vite's HMR handles the component update.
          // But routes.json needs refreshing so meta is up to date.
        }
      });

      server.watcher.on("unlink", (file: string) => {
        if (isRouteFile(file)) {
          generate();
          server.ws.send({ type: "full-reload" });
        }
      });
    },
  };
}
