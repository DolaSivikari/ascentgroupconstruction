import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser } from "../supabase";

export default defineTool({
  name: "list_projects",
  title: "List projects",
  description:
    "List Ascent Group construction projects with their status, location, category and publish state.",
  inputSchema: {
    search: z
      .string()
      .nullable()
      .describe("Optional text to match against the project title or location."),
    featured_only: z
      .boolean()
      .nullable()
      .describe("When true, return only projects flagged as featured."),
    limit: z
      .number()
      .int()
      .nullable()
      .describe("Maximum number of projects to return (default 20, max 100)."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ search, featured_only, limit }, ctx) => {
    if (!ctx.isAuthenticated()) {
      return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    }
    const take = Math.min(Math.max(limit ?? 20, 1), 100);
    let query = supabaseForUser(ctx)
      .from("projects")
      .select(
        "id, title, slug, category, location, client_type, project_status, publish_state, featured, completion_date, description",
      )
      .order("completion_date", { ascending: false, nullsFirst: false })
      .limit(take);

    if (featured_only) query = query.eq("featured", true);
    if (search) query = query.or(`title.ilike.%${search}%,location.ilike.%${search}%`);

    const { data, error } = await query;
    if (error) {
      return { content: [{ type: "text", text: error.message }], isError: true };
    }
    return {
      content: [{ type: "text", text: JSON.stringify(data ?? []) }],
      structuredContent: { projects: data ?? [] },
    };
  },
});
