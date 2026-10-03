import { supabase } from "@/integrations/supabase/client";
import { projectImageCategory, type ProjectImage } from "./projectEditor";

export interface ProjectRelationships {
  images: ProjectImage[];
  serviceIds: string[];
}

export async function loadProjectRelationships(projectId: string): Promise<ProjectRelationships> {
  const [images, services] = await Promise.all([
    supabase.from("project_images").select("*").eq("project_id", projectId).order("display_order"),
    supabase.from("project_services").select("service_id").eq("project_id", projectId),
  ]);
  if (images.error || !Array.isArray(images.data)) throw new Error("Could not load project images. Existing relationships have not been changed.");
  if (services.error || !Array.isArray(services.data)) throw new Error("Could not load project services. Existing relationships have not been changed.");
  return {
    images: images.data.map((image) => ({ id: image.id, url: image.url, category: projectImageCategory(image.category), caption: image.caption ?? undefined, order: image.display_order, featured: image.featured ?? false })),
    serviceIds: services.data.map((service) => service.service_id).filter((id): id is string => !!id),
  };
}

/** Separate REST operations: preserve existing rows until additions/updates succeed. */
export async function saveProjectRelationships(
  projectId: string,
  desired: ProjectRelationships,
  baseline: ProjectRelationships,
): Promise<ProjectRelationships> {
  // Re-read before writing, so a partial retry can reuse already inserted rows.
  const current = await loadProjectRelationships(projectId);
  const keptImageIds = new Set<string>();
  const savedImages: ProjectImage[] = [];
  for (const [order, image] of desired.images.entries()) {
    const existing = current.images.find((candidate) => candidate.id === image.id)
      || current.images.find((candidate) => candidate.url === image.url && !keptImageIds.has(candidate.id));
    const payload = { url: image.url, category: image.category, caption: image.caption || null, display_order: order, featured: image.featured };
    let savedId: string;
    if (existing) {
      savedId = existing.id;
      if (existing.url !== image.url || existing.category !== image.category || (existing.caption || null) !== payload.caption || existing.order !== order || existing.featured !== image.featured) {
        const { error } = await supabase.from("project_images").update(payload).eq("id", existing.id).eq("project_id", projectId).select("id").single();
        if (error) throw new Error("Could not update a project image. Your unsaved changes are retained; retry saving.");
      }
    } else {
      const { data, error } = await supabase.from("project_images").insert({ ...payload, project_id: projectId }).select("id").single();
      if (error || !data) throw new Error("Could not add a project image. Existing image rows have not been removed; retry saving.");
      savedId = data.id;
    }
    keptImageIds.add(savedId);
    savedImages.push({ ...image, id: savedId, order });
  }
  const desiredServices = [...new Set(desired.serviceIds)];
  const newServices = desiredServices.filter((id) => !current.serviceIds.includes(id));
  if (newServices.length) {
    const { error } = await supabase.from("project_services").upsert(
      newServices.map((service_id) => ({ project_id: projectId, service_id })),
      { onConflict: "project_id,service_id", ignoreDuplicates: true },
    ).select("id");
    if (error) throw new Error("Could not add project services. Existing relationships have not been removed; retry saving.");
  }
  // Remove only items the editor originally loaded and the owner then removed.
  const imageIdsToRemove = baseline.images.filter((image) => !keptImageIds.has(image.id)).map((image) => image.id);
  if (imageIdsToRemove.length) {
    const { data, error } = await supabase.from("project_images").delete().eq("project_id", projectId).in("id", imageIdsToRemove).select("id");
    const expectedIds = current.images.filter((image) => imageIdsToRemove.includes(image.id)).map((image) => image.id);
    if (error || expectedIds.some((id) => !data?.some((row) => row.id === id))) throw new Error("Could not remove project images. Some changes may already be saved; retry saving.");
  }
  const serviceIdsToRemove = baseline.serviceIds.filter((id) => !desiredServices.includes(id));
  if (serviceIdsToRemove.length) {
    const { data, error } = await supabase.from("project_services").delete().eq("project_id", projectId).in("service_id", serviceIdsToRemove).select("service_id");
    const expectedIds = current.serviceIds.filter((id) => serviceIdsToRemove.includes(id));
    if (error || expectedIds.some((id) => !data?.some((row) => row.service_id === id))) throw new Error("Could not remove project services. Some changes may already be saved; retry saving.");
  }
  return {
    images: [...savedImages, ...current.images.filter((image) => !baseline.images.some((loaded) => loaded.id === image.id) && !keptImageIds.has(image.id))],
    serviceIds: [...new Set([...desiredServices, ...current.serviceIds.filter((id) => !baseline.serviceIds.includes(id))])],
  };
}
