import { beforeEach, describe, expect, it, vi } from "vitest";
import { loadProjectRelationships, saveProjectRelationships } from "./projectPersistence";
import type { ProjectImage } from "./projectEditor";

const mock = vi.hoisted(() => ({
  rows: {} as Record<string, Record<string, unknown>[]>,
  failures: {} as Record<string, string>, actions: [] as string[], sequence: 0,
}));
vi.mock("@/integrations/supabase/client", () => ({ supabase: {
  from: (table: string) => {
    let operation = "read"; let payload: Record<string, unknown> | Record<string, unknown>[] = {};
    const filters: Record<string, unknown> = {};
    const lists: Record<string, unknown[]> = {};
    const execute = () => {
      const key = `${table}:${operation}`;
      if (operation !== "read") mock.actions.push(key);
      if (mock.failures[key]) return { data: null, error: { message: mock.failures[key] } };
      const matches = (row: Record<string, unknown>) => Object.entries(filters).every(([key, value]) => row[key] === value) && Object.entries(lists).every(([key, values]) => values.includes(row[key]));
      if (operation === "read") return { data: (mock.rows[table] || []).filter(matches), error: null };
      if (operation === "update") {
        const rows = (mock.rows[table] || []).filter(matches); rows.forEach((row) => Object.assign(row, payload));
        return { data: rows[0] || null, error: rows.length ? null : { message: "No row" } };
      }
      if (operation === "delete") {
        const removed = (mock.rows[table] || []).filter(matches); mock.rows[table] = (mock.rows[table] || []).filter((row) => !matches(row));
        return { data: removed, error: null };
      }
      const values = Array.isArray(payload) ? payload : [payload];
      const inserted = values.filter((row) => operation !== "upsert" || !(mock.rows[table] || []).some((existing) => existing.project_id === row.project_id && existing.service_id === row.service_id)).map((row) => ({ ...row, id: `inserted-${++mock.sequence}` }));
      mock.rows[table] = [...(mock.rows[table] || []), ...inserted];
      return { data: operation === "insert" ? inserted[0] : inserted, error: null };
    };
    const query = {
      select: () => query, order: () => query,
      eq: (key: string, value: unknown) => { filters[key] = value; return query; },
      in: (key: string, values: unknown[]) => { lists[key] = values; return query; },
      insert: (value: typeof payload) => { operation = "insert"; payload = value; return query; },
      update: (value: Record<string, unknown>) => { operation = "update"; payload = value; return query; },
      upsert: (value: typeof payload) => { operation = "upsert"; payload = value; return query; },
      delete: () => { operation = "delete"; return query; },
      single: async () => execute(),
      then: (resolve: (value: unknown) => unknown) => Promise.resolve(execute()).then(resolve),
    };
    return query;
  },
} }));
const oldImage: ProjectImage = { id: "old-image", url: "https://assets.example.test/old.jpg", category: "gallery", order: 0, featured: false };
const newImage: ProjectImage = { id: "temporary-upload", url: "https://assets.example.test/new.jpg", category: "gallery", order: 0, featured: false };
const baseline = () => ({ images: [oldImage], serviceIds: ["old-service"] });
beforeEach(() => {
  mock.actions = []; mock.failures = {}; mock.sequence = 0;
  mock.rows = {
    project_images: [{ ...oldImage, project_id: "project-1", display_order: 0 }],
    project_services: [{ id: "old-join", project_id: "project-1", service_id: "old-service" }],
  };
});
describe("project relationship persistence", () => {
  it.each(["project_images", "project_services"])("rejects an incomplete %s load without mutating rows", async (table) => {
    mock.failures[`${table}:read`] = "Fixture read failure";
    await expect(loadProjectRelationships("project-1")).rejects.toThrow("Could not load project"); expect(mock.actions).toEqual([]);
  });
  it("keeps existing relationship rows unchanged when no edits were made", async () => {
    const saved = await saveProjectRelationships("project-1", baseline(), baseline());
    expect(saved.images[0].id).toBe("old-image"); expect(mock.actions).toEqual([]);
  });
  it("adds replacements before deleting explicitly removed rows and keeps unseen additions", async () => {
    mock.rows.project_images.push({ id: "unseen-image", url: "https://assets.example.test/unseen.jpg", category: "gallery", featured: false, display_order: 1, project_id: "project-1" });
    mock.rows.project_services.push({ id: "unseen-join", service_id: "unseen-service", project_id: "project-1" });
    const saved = await saveProjectRelationships("project-1", { images: [newImage], serviceIds: ["new-service"] }, baseline());
    expect(mock.actions).toEqual(["project_images:insert", "project_services:upsert", "project_images:delete", "project_services:delete"]);
    expect(mock.rows.project_images.map((row) => row.id)).toContain("unseen-image");
    expect(saved.serviceIds).toEqual(["new-service", "unseen-service"]); expect(saved.images.map((image) => image.id)).toEqual(["inserted-1", "unseen-image"]);
  });
  it("retains old relationships on an addition failure and retries without duplicating an image", async () => {
    mock.failures["project_services:upsert"] = "Fixture insert failure";
    const desired = { images: [newImage], serviceIds: ["new-service"] };
    await expect(saveProjectRelationships("project-1", desired, baseline())).rejects.toThrow("Existing relationships have not been removed");
    expect(mock.actions.some((action) => action.endsWith(":delete"))).toBe(false);
    expect(mock.rows.project_images.map((row) => row.id)).toContain("old-image");
    delete mock.failures["project_services:upsert"];
    await saveProjectRelationships("project-1", desired, baseline());
    expect(mock.rows.project_images.filter((row) => row.url === newImage.url)).toHaveLength(1);
    expect(mock.rows.project_services.map((row) => row.service_id)).toEqual(["new-service"]);
  });
  it("reports failed image updates without deleting existing rows", async () => {
    mock.failures["project_images:update"] = "Fixture update failure";
    await expect(saveProjectRelationships("project-1", { images: [{ ...oldImage, caption: "New caption" }], serviceIds: [] }, baseline())).rejects.toThrow("Could not update a project image");
    expect(mock.actions).toEqual(["project_images:update"]); expect(mock.rows.project_images[0].caption).toBeUndefined();
  });
  it("reports failed removals as an incomplete save", async () => {
    mock.failures["project_services:delete"] = "Fixture delete failure";
    await expect(saveProjectRelationships("project-1", { images: [oldImage], serviceIds: [] }, baseline())).rejects.toThrow("Some changes may already be saved");
    expect(mock.rows.project_services[0].service_id).toBe("old-service");
  });
});
