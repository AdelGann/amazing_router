// test-walker.ts
import BuilderConfig from "@amazing_router/config/builder.config";
import { Walker } from "@amazing_router/core";
import { logger } from "@amazing_router/utils";
import path from "node:path";

const mockConfig = {
  accepted_paths: ["./src"],
  accepted_extensions: ["ts", "tsx", "js"],
  excluded_paths: ["src/utils"],
};

const config = new BuilderConfig(mockConfig);

const startPath = path.resolve(process.cwd(), "./src");

logger.info(`Scanning at: ${startPath}`);
logger.info(
  "Active Filters: Ignoring 'src/utils' | Searching: .ts, .tsx, .js\n",
);

const resultados = Walker(startPath, config);

logger.info("✅ Files Found:");
resultados.forEach((item) => {
  logger.info(item);
});
logger.info(`Total: ${resultados.length} files.`);
