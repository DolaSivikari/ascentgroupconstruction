import {
  defineContent,
  isCredentialClaim,
  type ContentModule,
  type FieldMeta,
} from "./types";
const pathKey = (path: string[]) =>
  path.map((part) => part.toLowerCase().replace(/[^a-z0-9_-]/g, "-")).join("_");
/** Generate metadata from typed presentation data, never by scanning JSX at runtime. */
export function structuredContent(id: string, value: unknown): ContentModule {
  const defaults: Record<string, string> = {};
  const meta: Record<string, FieldMeta> = {};
  function visit(current: unknown, path: string[]) {
    if (typeof current === "string") {
      const key = pathKey(path);
      const field = path[path.length - 1];
      const locked =
        isCredentialClaim(current) ||
        [
          "slug",
          "canonical",
          "id",
          "href",
          "url",
          "region",
          "name",
          "schemaType",
        ].includes(field) ||
        /^https?:|^\/|^#/.test(current);
      defaults[key] = current;
      meta[key] = {
        label: path.join(" → "),
        section: path[0] || "Content",
        kind: "text",
        maxLength: Math.max(300, current.length * 3),
        locked,
      };
    } else if (Array.isArray(current))
      current.forEach((item, index) => visit(item, [...path, String(index)]));
    else if (current && typeof current === "object")
      Object.entries(current).forEach(([key, item]) =>
        visit(item, [...path, key]),
      );
  }
  visit(value, []);
  // Keep question/answer pairs locked together when either contains a claim.
  for (const [key, field] of Object.entries(meta))
    if (field.locked && /_(question|answer)$/.test(key)) {
      const sibling = key.replace(
        /_(question|answer)$/,
        key.endsWith("_question") ? "_answer" : "_question",
      );
      if (meta[sibling]) meta[sibling].locked = true;
    }
  return defineContent(id, defaults, meta);
}
export function restoreStructured<T>(
  value: T,
  flat: Record<string, unknown>,
  path: string[] = [],
): T {
  if (typeof value === "string") return (flat[pathKey(path)] ?? value) as T;
  if (Array.isArray(value))
    return value.map((v, i) =>
      restoreStructured(v, flat, [...path, String(i)]),
    ) as T;
  if (value && typeof value === "object")
    return Object.fromEntries(
      Object.entries(value).map(([k, v]) => [
        k,
        restoreStructured(v, flat, [...path, k]),
      ]),
    ) as T;
  return value;
}
