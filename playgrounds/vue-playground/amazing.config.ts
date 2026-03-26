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