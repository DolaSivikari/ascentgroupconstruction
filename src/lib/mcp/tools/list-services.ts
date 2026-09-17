import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser } from "../supabase";

export default defineTool({
  name: "list_services",
  title: "List services",
  description:
    "List the services Ascent Group offers, with category, tier, short description and publish state.",
  inputSchema: {
    category: z.string().nullable().describe("Optional category to filter on."),
    featured_only: z.boolean().nullable().describe("When true, return only featured services."),
    limit: z
      .number()
      .int()
      .nullable()
      .describe("Maximum number of services to return (default 50, max 100)."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ category, featured_only, limit }, ctx) => {
    if (!ctx.isAuthenticated()) {
      return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    }
    const take = Math.min(Math.max(limit ?? 50, 1), 100);
    let query = supabaseForUser(ctx)
      .from("services")
      .select(
        "id, name, slug, category, service_tier, short_description, typical_timeline, featured, publish_state",
      )
      .order("name")
      .limit(take);

    if (category) query = query.eq("category", category);
    if (featured_only) query = query.eq("featured", true);

    const { data, error } = await query;
    if (error) {
      return { content: [{ type: "text", text: error.message }], isError: true };
    }
    return {
      content: [{ type: "text", text: JSON.stringify(data ?? []) }],
      structuredContent: { services: data ?? [] },
    };
  },
});
