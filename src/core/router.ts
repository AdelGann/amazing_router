import { RouteNode } from "../types";

/**
 * RouterBuilder is the orchestrator responsible for transforming a flat array
 * of RouteNodes into a hierarchical tree structure.
 * It resolves parent-child relationships based on URL segment depth.
 */
export default class RouterBuilder {
  /**
   * Assembles a nested route tree from a flat list of nodes.
   * * @param flatNodes - The array of grouped nodes provided by the RouteParser.
   * @returns A root-level array containing the hierarchical route tree.
   */
  public buildTree(flatNodes: RouteNode[]): RouteNode[] {
    const sortedNodes = [...flatNodes].sort((a, b) => {
      const aDepth = a.path === "/" ? 0 : a.path.split("/").length;
      const bDepth = b.path === "/" ? 0 : b.path.split("/").length;
      return aDepth - bDepth;
    });

    const nodeMap = new Map<string, RouteNode>();
    const tree: RouteNode[] = [];

    for (const node of sortedNodes) {
      node.children = [];
      nodeMap.set(node.path, node);
    }

    for (const node of sortedNodes) {
      if (node.path === "/") {
        tree.push(node);
        continue;
      }

      const parentPath = this.findClosestParent(node.path, nodeMap);

      if (parentPath && nodeMap.has(parentPath)) {
        const parent = nodeMap.get(parentPath)!;
        parent.children!.push(node);
      } else {
        tree.push(node);
      }
    }

    return tree;
  }

  /**
   * Recursively trims the current URL path to find the nearest existing parent node.
   * * @example "/dashboard/settings/profile" -> matches "/dashboard/settings" or "/dashboard"
   * @param currentPath - The web path of the node looking for a parent.
   * @param nodeMap - The map containing all available RouteNodes.
   * @returns The path of the closest parent node or null if none is found.
   */
  private findClosestParent(
    currentPath: string,
    nodeMap: Map<string, RouteNode>,
  ): string | null {
    const segments = currentPath.split("/").filter(Boolean);

    while (segments.length > 0) {
      segments.pop();

      const potentialParent = "/" + segments.join("/");
      const cleanParent = potentialParent === "//" ? "/" : potentialParent;

      if (nodeMap.has(cleanParent)) {
        return cleanParent;
      }

      if (cleanParent === "/") break;
    }

    return nodeMap.has("/") ? "/" : null;
  }
}
