import type { Database } from "@/integrations/supabase/types";

type ProjectInsert = Database["public"]["Tables"]["projects"]["Insert"];
export interface ProjectImage {
  id: string;
  url: string;
  category: "before" | "after" | "process" | "gallery";
  caption?: string;
  order: number;
  featured: boolean;
}
export type ProjectFormData = Omit<ProjectInsert, "trades_coordinated" | "peak_workforce" | "safety_incidents"> & {
  trades_coordinated?: string | number | null;
  peak_workforce?: string | number | null;
  safety_incidents?: string | number | null;
  project_images: ProjectImage[];
  service_ids: string[];
};

const numericMetric = (value: string | number | null | undefined, label: string): number | null => {
  if (value == null || (typeof value === "string" && !value.trim())) return null;
  const parsed = Number(value);
  if (!Number.isSafeInteger(parsed) || parsed < 0) throw new Error(`${label} must be a non-negative whole number.`);
  return parsed;
};

export function projectSavePayload(form: ProjectFormData): ProjectInsert {
  const { project_images: _images, service_ids: _services, ...project } = form;
  return {
    ...project,
    trades_coordinated: numericMetric(form.trades_coordinated, "Trades coordinated"),
    peak_workforce: numericMetric(form.peak_workforce, "Peak workforce"),
    safety_incidents: numericMetric(form.safety_incidents, "Safety incidents"),
  };
}

export function projectImageCategory(value: string): ProjectImage["category"] {
  return value === "before" || value === "after" || value === "process" ? value : "gallery";
}
