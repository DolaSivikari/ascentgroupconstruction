import { parse } from "acorn";
import { isDeepStrictEqual } from "node:util";

interface AstNode {
  type: string;
  name?: string;
  value?: unknown;
  kind?: string;
  computed?: boolean;
  body?: AstNode[];
  declarations?: AstNode[];
  id?: AstNode;
  init?: AstNode;
  properties?: AstNode[];
  elements?: AstNode[];
  key?: AstNode;
  declaration?: AstNode | null;
  source?: AstNode | null;
  specifiers?: AstNode[];
  local?: AstNode;
}

/** Prove a mapless asset JSON chunk contains only data matching its source file. */
export function isPureAssetMetadataModule(
  code: string,
  source: unknown,
): boolean {
  try {
    const tree = parse(code, {
      ecmaVersion: "latest",
      sourceType: "module",
    }) as unknown as AstNode;
    const bindings = new Map<string, unknown>();
    const exports: unknown[] = [];
    const value = (node?: AstNode): unknown => {
      if (!node) throw new Error("Missing data expression");
      if (
        node.type === "Literal" &&
        (node.value === null ||
          ["string", "number", "boolean"].includes(typeof node.value))
      )
        return node.value;
      if (node.type === "Identifier" && bindings.has(node.name!))
        return bindings.get(node.name!);
      if (node.type === "ArrayExpression") return node.elements!.map(value);
      if (node.type === "ObjectExpression")
        return Object.fromEntries(
          node.properties!.map((property) => {
            if (
              property.type !== "Property" ||
              property.kind !== "init" ||
              property.computed
            )
              throw new Error("Executable property");
            const key = property.key?.name ?? property.key?.value;
            if (typeof key !== "string" || key === "__proto__")
              throw new Error("Unsupported property");
            return [key, value(property.value as AstNode)];
          }),
        );
      throw new Error("Executable expression");
    };
    for (const node of tree.body!) {
      if (node.type === "VariableDeclaration" && node.kind === "const") {
        for (const declaration of node.declarations!) {
          if (
            declaration.id?.type !== "Identifier" ||
            bindings.has(declaration.id.name!)
          )
            return false;
          bindings.set(declaration.id.name!, value(declaration.init));
        }
      } else if (
        node.type === "ExportNamedDeclaration" &&
        !node.declaration &&
        !node.source
      ) {
        for (const specifier of node.specifiers!)
          exports.push(value(specifier.local));
      } else return false;
    }
    return exports.length === 1 && isDeepStrictEqual(exports[0], source);
  } catch {
    return false;
  }
}
