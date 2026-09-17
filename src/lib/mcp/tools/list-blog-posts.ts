import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser } from "../supabase";

export default defineTool({
  name: "list_blog_posts",
  title: "List blog posts",
  description:
    "List blog and insight articles with their title, slug, category, publish state and publish date.",
  inputSchema: {
    search: z.string().nullable().describe("Optional text to match against the post title."),
    publish_state: z
      .string()
      .nullable()
      .describe("Optional publish state filter: draft, scheduled, published, archived or review."),
    limit: z
      .number()
      .int()
      .nullable()
      .describe("Maximum number of posts to return (default 20, max 100)."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ search, publish_state, limit }, ctx) => {
    if (!ctx.isAuthenticated()) {
      return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    }
    const take = Math.min(Math.max(limit ?? 20, 1), 100);
    let query = supabaseForUser(ctx)
      .from("blog_posts")
      .select(
        "id, title, slug, category, sector, content_type, summary, publish_state, published_at, read_time_minutes",
      )
      .order("published_at", { ascending: false, nullsFirst: false })
      .limit(take);

    if (search) query = query.ilike("title", `%${search}%`);
    if (publish_state) {
      query = query.eq(
        "publish_state",
        publish_state as "draft" | "scheduled" | "published" | "archived" | "review",
      );
    }

    const { data, error } = await query;
    if (error) {
      return { content: [{ type: "text", text: error.message }], isError: true };
    }
    return {
      content: [{ type: "text", text: JSON.stringify(data ?? []) }],
      structuredContent: { posts: data ?? [] },
    };
  },
});
