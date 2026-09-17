import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser } from "../supabase";

export default defineTool({
  name: "get_project",
  title: "Get project",
  description:
    "Get the full detail of one Ascent Group project by its slug, including scope, results and SEO fields.",
  inputSchema: {
    slug: z.string().describe("The project slug, for example 'queen-street-facade-restoration'."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ slug }, ctx) => {
    if (!ctx.isAuthenticated()) {
      return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    }
    const { data, error } = await supabaseForUser(ctx)
      .from("projects")
      .select(
        "id, title, slug, category, description, location, client_name, client_type, project_status, project_value, project_size, duration, completion_date, delivery_method, scope_of_work, challenge, results, featured, publish_state, seo_title, seo_description",
      )
      .eq("slug", slug)
      .maybeSingle();

    if (error) {
      return { content: [{ type: "text", text: error.message }], isError: true };
    }
    if (!data) {
      return {
        content: [{ type: "text", text: `No project found with slug '${slug}'.` }],
        isError: true,
      };
    }
    return {
      content: [{ type: "text", text: JSON.stringify(data) }],
      structuredContent: { project: data },
    };
  },
});
