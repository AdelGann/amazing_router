/**
 * Represents a single node in the file-system routing tree.
 * This object acts as a container, grouping all specialized routing files
 * (page, layout, middleware) that belong to a specific URL path.
 */
export interface RouteNode {
  /**
   * A unique identifier for the route.
   * Typically generated from the normalized path (e.g., "users-id" for "/users/:id").
   * Extremely useful for rendering lists (like React keys) or internal caching.
   */
  id: string;

  /**
   * The parsed, web-ready URL path for this route.
   * Dynamic segments are normalized to use the standard colon syntax.
   * @example "/users/:id"
   * @example "/"
   */
  path: string;

  /**
   * The absolute file-system path to the main page component.
   * This file is responsible for rendering the primary UI of the route.
   * @example "C:/project/src/app/users/[id]/page.tsx"
   */
  pagePath?: string;

  /**
   * The absolute file-system path to the layout component.
   * Layouts wrap the page component and preserve their state across navigations.
   * @example "C:/project/src/app/users/layout.tsx"
   */
  layoutPath?: string;

  /**
   * The absolute file-system path to the middleware or guard file.
   * This logic is executed before rendering the route, typically used for
   * authentication checks, data pre-fetching, or server-side redirects.
   * @example "C:/project/src/app/users/middleware.ts"
   */
  middlewarePath?: string;

  /**
   * An array of nested child routes.
   * These children will inherit and render inside this route's layout.
   * Note: This array is populated during the tree-building phase, not the initial parse.
   */
  children?: RouteNode[];
}
