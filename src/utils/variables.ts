/**
 * A whitelist of recognized file names (excluding extensions) that have special
 * meaning within the file-system router. The scanner will strictly process files
 * that match these names and ignore everything else (like test files, styles, or utils).
 */
export const ADMIT_FILE_NAME = [
  /** * The primary UI component for a route.
   * Renders the main content for the specific URL path.
   */
  "page",

  /** * A wrapper component that preserves state across navigations.
   * Useful for persistent UI elements like sidebars or navigation bars.
   */
  "layout",

  /** * Route guard or interceptor logic executed before rendering the page.
   * Typically used for authentication checks, redirects, or data validation.
   */
  "middleware",

  /** * A fallback UI component displayed while the main page is loading asynchronously.
   * Often mapped to React's <Suspense> fallback.
   */
  "loader",

  /** * An error boundary component.
   * Renders automatically if the page component crashes or throws an exception.
   */
  "error",
];

/**
 * Regular expressions used to identify and parse special folder routing conventions.
 * These patterns define how the router interprets folder names to build dynamic URLs.
 */
export const FOLDER_PATTERNS = {
  /**
   * Matches dynamic route segments.
   * Extracts the parameter name to be used in the final URL.
   * @example "[id]" -> Parses as a parameter (e.g., "/:id")
   * @example "[slug]" -> Parses as a parameter (e.g., "/:slug")
   */
  dynamic: /^\[.+\]$/,

  /**
   * Matches invisible route groups.
   * Folders matching this pattern are used for logical organization and layouts,
   * but their names are completely omitted from the final URL path.
   * @example "(admin)" -> Ignored in the URL structure.
   * @example "(marketing)" -> Ignored in the URL structure.
   */
  group: /^\(.+\)$/,

  /**
   * Matches catch-all dynamic route segments.
   * Captures all subsequent URL segments into a single array parameter.
   * @example "[...slug]" -> Matches "/docs/api/v1"
   */
  catchAll: /^\[\.\.\..+\]$/,
};
