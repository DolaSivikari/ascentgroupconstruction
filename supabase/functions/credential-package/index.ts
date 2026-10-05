import { createClient } from "npm:@supabase/supabase-js@2";
import {
  handleCors,
  jsonResponse as baseJsonResponse,
  corsHeaders,
} from "../_shared/http.ts";
import {
  checkRateLimit,
  getClientIdentifier,
  createRateLimitResponse,
} from "../_shared/rateLimiter.ts";
const jsonResponse = (body: unknown, status = 200) => {
  const response = baseJsonResponse(body, status);
  response.headers.set("Cache-Control", "no-store");
  response.headers.set("Referrer-Policy", "no-referrer");
  return response;
};
const pathSafe = (path: string) =>
  !!path &&
  !path.startsWith("/") &&
  !path.split("/").some((p) => !p || p === ".." || p === ".") &&
  !/[\\?#]/.test(path);
Deno.serve(async (req) => {
  const cors = handleCors(req);
  if (cors) return cors;
  const url = Deno.env.get("SUPABASE_URL");
  const key = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!url || !key) return jsonResponse({ error: "unavailable" }, 503);
  const db = createClient(url, key);
  const rate = await checkRateLimit(
    db,
    getClientIdentifier(req),
    "credential-package",
    30,
    15,
  );
  if (!rate.allowed)
    return createRateLimitResponse(
      rate.retry_after_seconds || 900,
      corsHeaders,
    );
  try {
    const query = new URL(req.url).searchParams;
    const body = req.method === "POST" ? await req.json() : {};
    const token = query.get("token") || body.token;
    const documentId = query.get("document") || body.document_id;
    const action =
      body.action ||
      (documentId ? "document" : query.has("download") ? "download" : "view");
    if (
      typeof token !== "string" ||
      !/^[a-f0-9]{64}$/.test(token) ||
      !["view", "document", "download"].includes(action)
    )
      return jsonResponse({ error: "invalid_link" }, 400);
    const bytes = await crypto.subtle.digest(
      "SHA-256",
      new TextEncoder().encode(token),
    );
    const hash = [...new Uint8Array(bytes)]
      .map((v) => v.toString(16).padStart(2, "0"))
      .join("");
    const result = await db
      .from("credential_packages")
      .select("*")
      .eq("token_hash", hash)
      .is("revoked_at", null)
      .gt("expires_at", new Date().toISOString())
      .maybeSingle();
    if (result.error || !result.data)
      return jsonResponse({ error: "expired_or_unavailable" }, 410);
    const pack = result.data;
    const selected = await db
      .from("documents_library")
      .select(
        "id,title,version,file_url,is_active,requires_authentication,expiry_date",
      )
      .in("id", pack.document_ids);
    const today = new Intl.DateTimeFormat("en-CA", {
      timeZone: "America/Toronto",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(new Date());
    // Fail closed if any linked evidence was removed, made public or expired.
    if (
      selected.error ||
      selected.data?.length !== pack.document_ids.length ||
      selected.data.some(
        (d) =>
          !d.is_active ||
          !d.requires_authentication ||
          !d.file_url?.startsWith("restricted:") ||
          (d.expiry_date && d.expiry_date < today),
      )
    )
      return jsonResponse({ error: "package_needs_review" }, 410);
    if (action === "view") {
      const tracked = await db.rpc("record_credential_package_open", {
        _id: pack.id,
      });
      if (tracked.error)
        console.warn("Package open count unavailable", {
          code: tracked.error.code,
        });
      return jsonResponse({
        title: pack.title,
        expires_at: pack.expires_at,
        documents: selected.data.map((d) => ({
          id: d.id,
          title: d.title,
          version: d.version,
        })),
      });
    }
    let path = pack.file_path;
    if (action === "document") {
      const document = selected.data.find((d) => d.id === documentId);
      if (!document)
        return jsonResponse({ error: "document_not_in_package" }, 404);
      path = document.file_url.slice("restricted:".length);
    }
    if (
      !pathSafe(path) ||
      (action === "download" && path !== `packages/${pack.id}/package.pdf`)
    )
      return jsonResponse({ error: "invalid_file" }, 400);
    const seconds = Math.min(
      60,
      Math.floor((Date.parse(pack.expires_at) - Date.now()) / 1000),
    );
    if (seconds < 1)
      return jsonResponse({ error: "expired_or_unavailable" }, 410);
    const signed = await db.storage
      .from("documents-restricted")
      .createSignedUrl(path, seconds, { download: true });
    if (signed.error) return jsonResponse({ error: "file_unavailable" }, 404);
    if (req.method === "GET")
      return new Response(null, {
        status: 302,
        headers: {
          Location: signed.data.signedUrl,
          "Cache-Control": "no-store",
          "Referrer-Policy": "no-referrer",
        },
      });
    return jsonResponse({ url: signed.data.signedUrl });
  } catch {
    return jsonResponse({ error: "unavailable" }, 500);
  }
});
