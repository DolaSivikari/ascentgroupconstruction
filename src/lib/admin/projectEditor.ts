import type { Database } from "@/integrations/supabase/types";
import { normalizeSlug, nullableDate, nullableInteger } from "./editorValues";

type ProjectInsert = Database["public"]["Tables"]["projects"]["Insert"];
export interface ProjectImage {
  id: string;
  url: string;
  category: "before" | "after" | "process" | "gallery";
  caption?: string;
  altText?: string;
  order: number;
  featured: boolean;
}
export type ProjectFormData = Omit<
  ProjectInsert,
  "trades_coordinated" | "peak_workforce" | "safety_incidents"
> & {
  trades_coordinated?: string | number | null;
  peak_workforce?: string | number | null;
  safety_incidents?: string | number | null;
  project_images: ProjectImage[];
  service_ids: string[];
};

export function projectSavePayload(form: ProjectFormData): ProjectInsert {
  const {
    project_images: _images,
    service_ids: _services,
    process_notes: _unusedNotes,
    ...project
  } = form;
  return {
    ...project,
    slug: normalizeSlug(form.slug),
    tags: form.tags?.map((tag) => tag.trim()).filter(Boolean),
    // start_date/completion_date are dates; the three metrics are integer columns.
    // project_value, square_footage and year are text columns in the existing schema.
    start_date: nullableDate(form.start_date),
    completion_date: nullableDate(form.completion_date),
    trades_coordinated: nullableInteger(
      form.trades_coordinated,
      "Trades coordinated",
    ),
    peak_workforce: nullableInteger(form.peak_workforce, "Peak workforce"),
    safety_incidents: nullableInteger(
      form.safety_incidents,
      "Safety incidents",
    ),
  };
}

export function projectImageCategory(value: string): ProjectImage["category"] {
  return value === "before" || value === "after" || value === "process"
    ? value
    : "gallery";
}
