import pc from "picocolors";

const PREFIX = pc.dim("[Amazing Router]");

/**
 * Internal logging utility for the Amazing Router CLI and build process.
 * Provides formatted, color-coded console outputs to ensure a consistent
 * and readable Developer Experience (DX) across the terminal.
 */
export const logger = {
  /**
   * Logs a general informational message to the console.
   * Useful for indicating the start of a process, scanning phases, or general state.
   * * @param message - The informational text to display.
   */
  info(message: string) {
    console.log(`${PREFIX} ${pc.blue("ℹ")} ${message}`);
  },

  /**
   * Logs a success message to the console.
   * Used to indicate that a task, such as the route tree generation, completed perfectly.
   * * @param message - The success text to display.
   */
  success(message: string) {
    console.log(`${PREFIX} ${pc.green("✔")} ${message}`);
  },

  /**
   * Logs a warning message to the console.
   * Used for non-critical issues (e.g., ignored folders, missing optional configs)
   * that require the user's attention but do not stop the build process.
   * * @param message - The warning text to display.
   */
  warn(message: string) {
    console.warn(`${PREFIX} ${pc.yellow("⚠")} ${pc.yellow(message)}`);
  },

  /**
   * Logs a critical error message to the console.
   * If an Error object is provided, its stack trace will be printed in a dimmed color
   * for easier debugging without visually overwhelming the terminal output.
   * * @param message - A clear description of the error.
   * @param error - (Optional) The caught error object or unknown thrown value.
   */
  error(message: string, error?: unknown) {
    console.error(`${PREFIX} ${pc.red("✖")} ${pc.red(message)}`);
    if (error instanceof Error && error.stack) {
      console.error(pc.dim(error.stack));
    }
  },
};
