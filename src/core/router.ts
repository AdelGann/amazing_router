import { RouteNode } from "../types";

/**
 * RouterBuilder is the orchestrator responsible for transforming a flat array
 * of RouteNodes into a hierarchical tree structure.
 * It resolves parent-child relationships based on URL segment depth.
 */
export default class RouterBuilder {
  /**
   * Assembles a nested route tree from a flat list of nodes.
   * Processes each node to find its correct parent or marks it as a new root.
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

      const absolutePath = node.layoutPath || node.pagePath;
      const parentPath = this.findClosestParent(
        node.path,
        nodeMap,
        absolutePath,
      );

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
   * Determines if a file represents the root of a Route Group.
   * A node is a group root if it is a layout file located immediately inside
   * a directory wrapped in parentheses.
   * * @param filePath - The absolute system path of the file.
   * @returns True if the file is the entry point of an independent route group.
   */
  private isGroupRoot(filePath: string): boolean {
    const normalizedPath = filePath.replace(/\\/g, "/");
    const parts = normalizedPath.split("/");

    const fileName = parts.pop();
    const folderName = parts.pop();

    return (
      (fileName?.startsWith("layout") &&
        folderName?.startsWith("(") &&
        folderName?.endsWith(")")) ||
      false
    );
  }

  /**
   * Recursively trims the current URL path to find the nearest existing parent node.
   * Implements "Layout Bypassing": if a node is identified as a Group Root,
   * it returns null to force the node to become an independent tree root.
   * * @param currentPath - The normalized web URL path.
   * @param nodeMap - The map containing all available RouteNodes.
   * @param absoluteFilePath - The physical file path used to detect Route Groups.
   * @returns The path of the closest parent node or null if the node is independent.
   */
  private findClosestParent(
    currentPath: string,
    nodeMap: Map<string, RouteNode>,
    absoluteFilePath?: string,
  ): string | null {
    if (absoluteFilePath && absoluteFilePath.includes("(")) {
      if (this.isGroupRoot(absoluteFilePath)) {
        return null;
      }
    }

    const segments = currentPath.split("/").filter(Boolean);
    while (segments.length > 0) {
      segments.pop();
      const potentialParent = "/" + segments.join("/");
      const cleanParent = potentialParent === "//" ? "/" : potentialParent;

      if (nodeMap.has(cleanParent)) return cleanParent;
    }

    return nodeMap.has("/") ? "/" : null;
  }
}
