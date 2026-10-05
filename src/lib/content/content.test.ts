import { describe, expect, it, vi } from "vitest";
import {
  defineContent,
  resolveContentValues,
  PROTECTED_PAGES,
} from "@/content/types";
import { pageSettingsModule } from "./pageSettings";
import { structuredContent, restoreStructured } from "@/content/structured";
import { importContentDraft } from "./admin";
vi.mock("@/integrations/supabase/client", () => ({ supabase: {} }));
const module = defineContent(
  "sample",
  { heading: "Original", claim: "WSIB compliant" },
  {
    heading: { label: "Heading", section: "Hero", kind: "text", maxLength: 40 },
    claim: { label: "Claim", section: "Proof", kind: "text", locked: true },
  },
);
describe("page content publication contract", () => {
  it("applies only valid known fields, preserves protected claims and ignores malformed overrides", () => {
    expect(
      resolveContentValues(
        module,
        {
          "sample.heading": "Published",
          "sample.claim": "New claim",
          "sample.extra": "Injected",
        },
        true,
      ),
    ).toEqual({ heading: "Published", claim: "WSIB compliant" });
    expect(
      resolveContentValues(
        module,
        { "sample.heading": { html: "<script>" } },
        true,
      ).heading,
    ).toBe("Original");
  });
  it("restores exact defaults when the kill switch is off or an override is null", () => {
    expect(
      resolveContentValues(module, { "sample.heading": "Published" }, false),
    ).toEqual(module.defaults);
    expect(
      resolveContentValues(module, { "sample.heading": null }, true),
    ).toEqual(module.defaults);
  });
  it("rejects imports from other pages and imports that edit protected fields", () => {
    expect(() =>
      importContentDraft(
        module,
        JSON.stringify({
          version: 1,
          module: "other",
          values: { heading: "New" },
        }),
      ),
    ).toThrow();
    expect(() =>
      importContentDraft(
        module,
        JSON.stringify({
          version: 1,
          module: "sample",
          values: { claim: "Altered" },
        }),
      ),
    ).toThrow(/protected/);
    expect(
      importContentDraft(
        module,
        JSON.stringify({
          version: 1,
          module: "sample",
          values: { heading: "New" },
        }),
      ),
    ).toEqual({ heading: "New" });
  });
  it("keeps all key pages visible and leaves protected carousels outside the image override layer", () => {
    for (const path of PROTECTED_PAGES)
      expect(pageSettingsModule(path).meta.hidden.locked).toBe(true);
    expect(pageSettingsModule("/").meta.hero.locked).toBe(true);
    expect(pageSettingsModule("/projects/example").meta.hero.locked).toBe(true);
  });
  it("shares one resolved FAQ value between visible content and schema consumers and locks both sides of claims", () => {
    const faqs = [
      { question: "How?", answer: "Current answer" },
      { question: "Insurance?", answer: "$2M CGL" },
    ];
    const faq = structuredContent("shared-faq", faqs);
    const values = resolveContentValues(
      faq,
      {
        "shared-faq.0_answer": "Reviewed answer",
        "shared-faq.1_answer": "Changed insurance",
      },
      true,
    );
    const resolved = restoreStructured(faqs, values);
    expect(resolved).toEqual([
      { question: "How?", answer: "Reviewed answer" },
      faqs[1],
    ]);
    expect(faq.meta["1_question"].locked).toBe(true);
  });
});

it("keeps licensing claims protected even when imported metadata omitted the lock", () => {
  const claim = defineContent(
    "claim",
    { text: "Fully Licensed" },
    { text: { label: "Proof", section: "Trust", kind: "text" } },
  );
  expect(
    resolveContentValues(claim, { "claim.text": "Different claim" }, true).text,
  ).toBe("Fully Licensed");
  expect(claim.meta.text.locked).toBe(true);
});
