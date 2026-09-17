import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser } from "../supabase";

export default defineTool({
  name: "list_contact_submissions",
  title: "List contact enquiries",
  description:
    "List contact-form enquiries received through the website. Only returns rows the signed-in account is allowed to read.",
  inputSchema: {
    status: z.string().nullable().describe("Optional status filter, for example 'new'."),
    limit: z
      .number()
      .int()
      .nullable()
      .describe("Maximum number of enquiries to return (default 20, max 100)."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ status, limit }, ctx) => {
    if (!ctx.isAuthenticated()) {
      return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    }
    const take = Math.min(Math.max(limit ?? 20, 1), 100);
    let query = supabaseForUser(ctx)
      .from("contact_submissions")
      .select(
        "id, name, company, email, phone, submission_type, service_origin, message, status, created_at",
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
      structuredContent: { enquiries: data ?? [] },
    };
  },
});
