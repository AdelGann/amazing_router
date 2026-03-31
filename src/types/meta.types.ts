/**
 * Metadata configuration for a specific route.
 * This object is extracted from the `metadata` export in page or layout files.
 */
export interface RouteMeta {
  /** The window/tab title for the route */
  title?: string;
  /** SEO description for search engines and social media */
  description?: string;
  /** Social media sharing image URL */
  image?: string;
  /** List of keywords for search engine indexing */
  keywords?: string[];
  /** Canonical URL for the route */
  canonical?: string;
  /** Friendly name for breadcrumbs or navigation menus */
  breadcrumb?: string;
  /** Icon identifier or name associated with the route */
  icon?: string;
  /** If true, this route should be hidden from automated navigation menus */
  hideInMenu?: boolean;
  /** Array of roles required to access this route */
  roles?: string[];
  /** Indicates if the route requires a previous authentication */
  requiresAuth?: boolean;
  /** Allows for any additional custom property defined by the user */
  [key: string]: any;
}
