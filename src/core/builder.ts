import path from "node:path";
import fs from "node:fs";
import { logger } from "@amazing_router/utils";
import BuilderConfig from "@amazing_router/config/builder.config";
import { BuilderConfigInterface, RouteNode } from "@amazing_router/types";

import { Walker } from "./walker";
import RouteParser from "./parser";
import RouterBuilder from "./router";

/**
 * Main orchestrator for the Amazing Router framework.
 * Coordinates the scanning, parsing, and tree assembly processes to
 * generate the final routing structure.
 */
class BuildRouter {
  private config: BuilderConfig;
  private filesFound: string[] = [];
  private routeTree: RouteNode[] = [];

  constructor(userOptions?: BuilderConfigInterface) {
    this.config = new BuilderConfig(userOptions);
  }

  /**
   * Executes the complete build pipeline: Scan -> Parse -> Build Tree.
   * @returns The final generated routing structure as a JSON string (or the tree itself).
   */
  public build(): RouteNode[] {
    logger.info("Initializing router build process...");

    try {
      this.scanner();

      if (this.filesFound.length === 0) {
        logger.warn("No valid routing files found during scan.");
        return [];
      }

      const baseDir = path.resolve(process.cwd(), this.config.paths[0]);
      const parser = new RouteParser(baseDir);
      const flatNodes = parser.parse(this.filesFound);

      const builder = new RouterBuilder();
      this.routeTree = builder.buildTree(flatNodes);

      logger.success("Router built successfully!");
      logger.info(`Routes detected: ${flatNodes.length} unique endpoints.`);

      return this.routeTree;
    } catch (e) {
      logger.error("Build failed due to an internal error:", e);
      throw e;
    }
  }

  /**
   * Iterates through configured paths and collects all valid files using the Walker.
   */
  private scanner(): void {
    this.filesFound = [];
    for (const folderPath of this.config.paths) {
      const absolutePath = path.resolve(process.cwd(), folderPath);

      if (fs.existsSync(absolutePath)) {
        const result = Walker(absolutePath, this.config);
        this.filesFound.push(...result);
      } else {
        logger.warn(`Configured directory does not exist: ${folderPath}`);
      }
    }
  }
}

export default BuildRouter;
