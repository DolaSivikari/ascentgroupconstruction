import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser } from "../supabase";

export default defineTool({
  name: "list_rfp_submissions",
  title: "List RFP submissions",
  description:
    "List tender and RFP submissions received through the website. Only returns rows the signed-in account is allowed to read.",
  inputSchema: {
    status: z.string().nullable().describe("Optional status filter, for example 'new'."),
    limit: z
      .number()
      .int()
      .nullable()
      .describe("Maximum number of submissions to return (default 20, max 100)."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ status, limit }, ctx) => {
    if (!ctx.isAuthenticated()) {
      return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    }
    const take = Math.min(Math.max(limit ?? 20, 1), 100);
    let query = supabaseForUser(ctx)
      .from("rfp_submissions")
      .select(
        "id, project_name, company_name, contact_name, email, phone, project_type, project_location, estimated_value_range, estimated_timeline, status, created_at",
      )
      .order("created_at", { ascending: false })
      .limit(take);

    if (status) query = query.eq("status", status);

    const { data, error } = await query;
    if (error) {
      return { content: [{ type: "text", text: error.message }], isError: true };
    }
    return {
      content: [{ type: "text", text: JSON.stringify(data ?? []) }],
      structuredContent: { submissions: data ?? [] },
    };
  },
});
