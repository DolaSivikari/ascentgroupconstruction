import DOMPurify from "dompurify";

export function isSafeEditorLink(value: string): boolean {
  try {
    const url = new URL(value.trim());
    if (url.protocol === "https:")
      return !!url.hostname && !url.username && !url.password;
    return url.protocol === "mailto:" && /^[^\s@]+@[^\s@]+$/.test(url.pathname);
  } catch {
    return false;
  }
}
export function plainTextToHtml(value: string): string {
  const escape = (text: string) =>
    text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  return value
    .split(/\r?\n\s*\r?\n/)
    .map((text) => `<p>${escape(text).replace(/\r?\n/g, "<br>")}</p>`)
    .join("");
}
export function sanitizeRichText(value: string): string {
  const html = /<\/?[a-z][^>]*>/i.test(value) ? value : plainTextToHtml(value);
  const clean = DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [
      "p",
      "br",
      "strong",
      "b",
      "em",
      "i",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
      "ul",
      "ol",
      "li",
      "blockquote",
      "a",
      "code",
      "pre",
      "hr",
      "img",
      "figure",
      "figcaption",
      "div",
      "span",
      "table",
      "thead",
      "tbody",
      "tr",
      "th",
      "td",
    ],
    ALLOWED_ATTR: [
      "href",
      "rel",
      "target",
      "src",
      "alt",
      "width",
      "height",
      "colspan",
      "rowspan",
    ],
  });
  const template = document.createElement("template");
  template.innerHTML = clean;
  template.content.querySelectorAll("a").forEach((link) => {
    const href = link.getAttribute("href") || "";
    if (!/^(https:\/\/|mailto:|\/(?!\/)|#)/i.test(href))
      link.removeAttribute("href");
    link.setAttribute("rel", "noopener noreferrer");
  });
  return template.innerHTML;
}
