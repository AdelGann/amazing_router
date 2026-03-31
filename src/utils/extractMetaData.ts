import ts from 'typescript';
import fs from 'fs';

export function extractMetadata(filePath: string): any {
  if (!fs.existsSync(filePath)) return {};

  const fileContent = fs.readFileSync(filePath, 'utf8');
  const sourceFile = ts.createSourceFile(filePath, fileContent, ts.ScriptTarget.Latest, true);

  let metadata: Record<string, any> = {};

  const visit = (node: ts.Node) => {
    if (
      ts.isVariableDeclaration(node) &&
      ts.isIdentifier(node.name) &&
      node.name.text === 'metadata' &&
      node.initializer &&
      ts.isObjectLiteralExpression(node.initializer)
    ) {
      node.initializer.properties.forEach((prop) => {
        if (ts.isPropertyAssignment(prop) && ts.isIdentifier(prop.name)) {
          const key = prop.name.text;
          const valueNode = prop.initializer;

          if (ts.isStringLiteral(valueNode)) {
            metadata[key] = valueNode.text;
          } else if (valueNode.kind === ts.SyntaxKind.TrueKeyword) {
            metadata[key] = true;
          } else if (valueNode.kind === ts.SyntaxKind.FalseKeyword) {
            metadata[key] = false;
          } else if (ts.isArrayLiteralExpression(valueNode)) {
            metadata[key] = valueNode.elements
              .filter(ts.isStringLiteral)
              .map(el => el.text);
          }
        }
      });
    }
    ts.forEachChild(node, visit);
  };

  visit(sourceFile);
  return metadata;
}
