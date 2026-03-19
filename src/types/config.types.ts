/**
 * Configuration options for the Amazing Router builder.
 * This interface defines the rules for the file-system scanner, allowing users
 * to customize which directories are searched, which file types are processed,
 * and which specific folders or files should be entirely ignored.
 */
export interface BuilderConfigInterface {
  /**
   * The file extensions that the router is allowed to process.
   * Any file found with an extension not included in this list will be safely ignored.
   * Provide the extensions without the leading dot.
   * * @default ["ts", "tsx", "js", "jsx"] (Assuming you set a default later)
   * @example ["js", "ts", "tsx", "jsx"]
   * @example "tsx"
   */
  accepted_extensions?: string | string[];

  /**
   * The starting directories where the router will begin scanning for files.
   * These should be relative paths from the root of the user's project (`process.cwd()`).
   * * @example ["src/app", "src/pages"]
   * @example "src/app"
   */
  accepted_paths?: string | string[];

  /**
   * Specific paths, directories, or files to completely exclude from the routing tree.
   * If a directory is matched, the scanner will skip it entirely, significantly
   * improving performance. Paths should be relative to the project root.
   * * @example ["src/app/components", "src/app/api"]
   * @example "src/app/drafts/test-page.tsx"
   */
  excluded_paths?: string | string[];
}
