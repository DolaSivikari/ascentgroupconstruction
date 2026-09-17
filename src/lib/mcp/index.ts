import { auth, defineMcp } from "@lovable.dev/mcp-js";
import listProjectsTool from "./tools/list-projects";
import getProjectTool from "./tools/get-project";
import listServicesTool from "./tools/list-services";
import listBlogPostsTool from "./tools/list-blog-posts";
import listRfpSubmissionsTool from "./tools/list-rfp-submissions";
import listContactSubmissionsTool from "./tools/list-contact-submissions";

// Built from the project ref so the issuer always matches the direct Supabase
// auth host published by OAuth discovery. Never derive it from SUPABASE_URL.
const projectRef = import.meta.env.VITE_SUPABASE_PROJECT_ID ?? "project-ref-unset";

export default defineMcp({
  name: "ascentgroupwebsitev1-47",
  title: "AscentGroupWebsiteV1 (47)",
  version: "0.1.0",
  instructions:
    "Tools for the Ascent Group Construction website. Read projects, services and articles, and review RFP and contact enquiries received through the site. Every tool acts as the signed-in account, so results respect that account's permissions.",
  auth: auth.oauth.issuer({
    issuer: `https://${projectRef}.supabase.co/auth/v1`,
    acceptedAudiences: "authenticated",
  }),
  tools: [
    listProjectsTool,
    getProjectTool,
    listServicesTool,
    listBlogPostsTool,
    listRfpSubmissionsTool,
    listContactSubmissionsTool,
  ],
});
