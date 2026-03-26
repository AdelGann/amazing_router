import fs from "node:fs";
import path from "node:path";
import { logger, detectFramework, getTemplateForFramework } from "../utils";

/**
 * Logic to initialize the amazing-router configuration.
 */
export const initializeProject = (): void => {
  const configPath = path.resolve(process.cwd(), "amazing.config.ts");
  const dotDir = path.resolve(process.cwd(), ".amazing-router");
  const appDir = path.resolve(process.cwd(), "src/app");

  if (!fs.existsSync(dotDir)) {
    fs.mkdirSync(dotDir, { recursive: true });
    fs.writeFileSync(path.join(dotDir, ".gitignore"), "*\n!.gitignore");
  }

  if (fs.existsSync(configPath)) {
    logger.warn("amazing.config.ts already exists in this directory.");
    return;
  }

  const template = `
import { BuilderConfigInterface } from "@amazing-router/core";

/**
 * Amazing Router Configuration
 * Edit this file to customize how your routes are scanned and generated.
 */
export const config: BuilderConfigInterface = {
  /** Directories to scan for routing files */
  accepted_paths: ["src/app"],
  
  /** Allowed file extensions */
  accepted_extensions: ["tsx", "ts", "vue"],
};

export default config;
  `.trim();

  try {
    fs.writeFileSync(configPath, template);

    if (!fs.existsSync(appDir)) {
      fs.mkdirSync(appDir, { recursive: true });
    }

    const framework = detectFramework();
    const { extension, content: pageContent } = getTemplateForFramework(framework, "page", "page");
    const dynamicPagePath = path.resolve(process.cwd(), `src/app/page${extension}`);

    if (!fs.existsSync(dynamicPagePath)) {
      fs.writeFileSync(dynamicPagePath, pageContent);
      logger.info(`Created: src/app/page${extension}`);
    }

    logger.success("✨ Project initialized successfully!");
    logger.info("Created: amazing.config.ts");
    logger.info("Created: .amazing-router/ (Internal cache)");
  } catch (error) {
    logger.error("Failed to initialize project.");
    console.error(error);
  }
};
