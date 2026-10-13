import { z } from "zod";
import type { SupabaseClient } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import type { Database, Json } from "@/integrations/supabase/types";
import { projectSavePayload, type ProjectFormData } from "./projectEditor";
import { PROJECT_FIELDS } from "./projectFields";
import {
  saveProjectRelationships,
  type ProjectRelationships,
} from "./projectPersistence";

type Project = Database["public"]["Tables"]["projects"]["Row"];
type AtomicDatabase = {
  public: {
    Tables: Record<string, never>;
    Views: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
    Functions: {
      save_project_atomic: {
        Args: {
          _id: string | null;
          _expected_updated_at: string | null;
          _project: Json;
          _images: Json;
          _service_ids: string[];
        };
        Returns: Json;
      };
    };
  };
};
const resultSchema = z.object({
  project: z.object({
    id: z.string().uuid(),
    updated_at: z.string().nullable(),
  }),
  relationships: z.object({
    serviceIds: z.array(z.string().uuid()),
    images: z.array(
      z.object({
        id: z.string().uuid(),
        url: z.string(),
        category: z.enum(["before", "after", "process", "gallery"]),
        caption: z
          .string()
          .nullish()
          .transform((value) => value ?? undefined),
        altText: z
          .string()
          .nullish()
          .transform((value) => value ?? undefined),
        order: z.number().int(),
        featured: z.boolean(),
      }),
    ),
  }),
});
export function writableProject(form: ProjectFormData) {
  const payload = projectSavePayload(form);
  return Object.fromEntries(
    PROJECT_FIELDS.filter((key) => payload[key] !== undefined).map((key) => [
      key,
      payload[key],
    ]),
  ) as Database["public"]["Tables"]["projects"]["Insert"];
}
type SavedVersion = Pick<Project, "id" | "updated_at">;
export async function saveProject(input: {
  id: string | null;
  expectedUpdatedAt: string | null;
  form: ProjectFormData;
  baseline: ProjectRelationships;
  onReserved: (project: SavedVersion) => void;
}) {
  const payload = writableProject(input.form);
  const desired = {
    images: input.form.project_images,
    serviceIds: input.form.service_ids,
  };
  if (import.meta.env.VITE_ATOMIC_PROJECT_SAVE_ENABLED === "true") {
    const db = supabase as unknown as SupabaseClient<AtomicDatabase>;
    const { data, error } = await db.rpc("save_project_atomic", {
      _id: input.id,
      _expected_updated_at: input.expectedUpdatedAt,
      _project: payload as Json,
      _images: JSON.parse(JSON.stringify(desired.images)) as Json,
      _service_ids: desired.serviceIds,
    });
    if (error) {
      if (["PGRST202", "42883"].includes(error.code))
        throw new Error(
          "Atomic project saves need backend setup. Your edits are retained; no legacy save was attempted.",
        );
      if (error.code === "40001")
        throw new Error(
          "This project changed. Reload it before saving; your local draft is retained.",
        );
      throw error;
    }
    return resultSchema.parse(data);
  }
  // Compatibility during rollout. New projects remain draft until all children save.
  // Existing published relationships still require the atomic RPC for full isolation.
  const { data: auth, error: authError } = await supabase.auth.getUser();
  if (authError || !auth.user) throw new Error("Sign in again before saving.");
  let project: SavedVersion;
  if (!input.id) {
    const result = await supabase
      .from("projects")
      .insert({
        ...payload,
        publish_state: "draft",
        created_by: auth.user.id,
        updated_by: auth.user.id,
      })
      .select("id,updated_at")
      .single();
    if (result.error || !result.data)
      throw result.error || new Error("Could not create project draft.");
    project = result.data;
  } else {
    const query = supabase
      .from("projects")
      .update({
        updated_at: new Date().toISOString(),
        updated_by: auth.user.id,
      })
      .eq("id", input.id);
    const result = await (
      input.expectedUpdatedAt === null
        ? query.is("updated_at", null)
        : query.eq("updated_at", input.expectedUpdatedAt)
    )
      .select("id,updated_at")
      .maybeSingle();
    if (result.error) throw result.error;
    if (!result.data)
      throw new Error(
        "This project changed. Reload it before saving; your local draft is retained.",
      );
    project = result.data;
  }
  input.onReserved(project);
  const relationships = await saveProjectRelationships(
    project.id,
    desired,
    input.baseline,
  );
  const query = supabase
    .from("projects")
    .update({ ...payload, updated_by: auth.user.id })
    .eq("id", project.id);
  const result = await (
    project.updated_at === null
      ? query.is("updated_at", null)
      : query.eq("updated_at", project.updated_at)
  )
    .select("id,updated_at")
    .maybeSingle();
  if (result.error) throw result.error;
  if (!result.data)
    throw new Error(
      "This project changed during saving. Reload before retrying.",
    );
  return { project: result.data, relationships };
}
