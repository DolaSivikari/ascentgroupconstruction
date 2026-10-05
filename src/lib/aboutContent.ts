import { founderBio } from "@/data/enriched-company-content";
export interface AboutContent {
  hero_headline: string;
  hero_intro: string;
  story_headline: string;
  story_content: string[];
  founder_name: string;
  founder_title: string;
  founder_bio: string;
  founder_quote: string;
  founder_image_url: string;
  stats: { value: string; label: string }[];
}
export const ABOUT_DEFAULTS: AboutContent = {
  hero_headline: "15 Years of Experience. One Clear Mission.",
  hero_intro:
    "Specialty contractor for building envelope, restoration & interior trades across the GTA — self-performed work, direct accountability, professional closeout.",
  story_headline: "Proven Expertise.\nNew Name.",
  story_content: [
    "Ascent Group Construction represents 15+ years of combined experience in building envelope and interior trades — formalized under a new company name in 2025.",
    "Our team brings hands-on experience from envelope restoration, EIFS installation, masonry repair, waterproofing, and interior finishing on buildings ranging from 3-storey walk-ups to 30-storey towers. We've delivered results for general contractors, property managers, building consultants, and institutional clients who demand professional execution.",
    "We founded Ascent Group to bring this proven capability directly to clients — without the complexity of layered subcontracting or inflated middleman margins.",
  ],
  founder_name: founderBio.name,
  founder_title: founderBio.title,
  founder_bio:
    "Hebun founded Ascent Group Construction in 2025 after graduating from George Brown College's Construction Engineering Technology program — with the goal of building a reliable, quality-focused specialty contractor for the Ontario market.\n\nAscent is backed by a crew with 15+ years of combined experience in building envelope and interior trades — including EIFS, masonry restoration, waterproofing, and interior finishing across the GTA.",
  founder_quote:
    '"We\'re building Ascent Group methodically — professional systems, quality execution, and honest client relationships. Our focus is on being the most reliable envelope and interior trade specialist in the GTA."',
  founder_image_url: "",
  stats: [
    { value: "15+", label: "Years Experience" },
    { value: "85%", label: "Self-Performed" },
    { value: "$2M", label: "CGL Coverage" },
    { value: "100%", label: "WSIB Compliant" },
  ],
};
export function resolveAboutContent(
  row?: Partial<AboutContent> | null,
): AboutContent {
  const content = { ...ABOUT_DEFAULTS };
  for (const key of Object.keys(content) as (keyof AboutContent)[]) {
    const value = row?.[key];
    if (typeof value === "string" && value.trim())
      Object.assign(content, { [key]: value });
  }
  if (
    Array.isArray(row?.story_content) &&
    row.story_content.some((value) => typeof value === "string" && value.trim())
  )
    content.story_content = row.story_content.filter(
      (value) => typeof value === "string" && value.trim(),
    );
  if (
    Array.isArray(row?.stats) &&
    row.stats.some(
      (item) =>
        item &&
        typeof item.value === "string" &&
        item.value.trim() &&
        typeof item.label === "string" &&
        item.label.trim(),
    )
  ) {
    content.stats = row.stats
      .slice(0, 6)
      .filter(
        (item) =>
          item &&
          typeof item.value === "string" &&
          typeof item.label === "string" &&
          item.value.trim() &&
          item.label.trim(),
      );
    // Credential wording remains owned by the current protected defaults.
    content.stats = content.stats.filter(
      (item) =>
        !/\b(wsib|cgl|cor|insurance|insured|bond(?:ing|ed)?|sto)\b/i.test(
          item.label,
        ),
    );
    content.stats.push(
      ...ABOUT_DEFAULTS.stats.filter((item) => /wsib|cgl/i.test(item.label)),
    );
    content.stats = content.stats.slice(0, 6);
  }
  if (
    content.founder_image_url &&
    !/^(https:\/\/|\/(?!\/))/i.test(content.founder_image_url)
  )
    content.founder_image_url = "";
  return content;
}
