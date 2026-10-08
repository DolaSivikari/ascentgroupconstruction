import type { NavigateFunction } from "react-router-dom";

/** Native validation covers every mounted screen, including currently hidden fields. */
export function validateSectionForm(
  form: HTMLFormElement | null,
  navigate: NavigateFunction,
): boolean {
  if (!form || form.checkValidity()) return true;
  const field = form.querySelector<
    HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
  >("input:invalid, textarea:invalid, select:invalid");
  const section = field?.closest<HTMLElement>("[data-editor-section-href]");
  const href = field?.closest<HTMLElement>("[data-editor-section-href]")
    ?.dataset.editorSectionHref;
  if (href && section?.hidden) navigate(href);
  window.setTimeout(() => {
    const editor = field
      ?.closest(".admin-rich-editor")
      ?.querySelector<HTMLElement>('[contenteditable="true"]');
    (editor || field)?.focus();
  }, 0);
  return false;
}
