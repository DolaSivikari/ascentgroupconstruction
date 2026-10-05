import type { SupabaseClient } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import type { RowTable } from "./optionalDatabase";
import { missingOptionalSchema } from "./optionalDatabase";
export type CredentialDocument = {
  id: string;
  title: string;
  description: string | null;
  category: string;
  file_url: string;
  file_name: string;
  expiry_date: string | null;
  is_active: boolean;
  requires_authentication: boolean;
  version: string;
};
export type CredentialPackage = {
  id: string;
  title: string;
  document_ids: string[];
  file_path: string;
  expires_at: string;
  created_at: string;
  created_by: string | null;
  revoked_at: string | null;
  open_count: number;
  last_opened_at: string | null;
};
type PackageDatabase = {
  public: {
    Tables: { credential_packages: RowTable<CredentialPackage> };
    Views: Record<string, never>;
    Functions: {
      register_credential_package: {
        Args: {
          _id: string;
          _title: string;
          _document_ids: string[];
          _file_path: string;
          _token_hash: string;
          _expires_at: string;
        };
        Returns: string;
      };
      revoke_credential_package: { Args: { _id: string }; Returns: undefined };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
const db = supabase as unknown as SupabaseClient<PackageDatabase>;
export function credentialExpiry(date: string | null, now = new Date()) {
  if (!date) return { state: "unknown" as const, days: null };
  const today = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Toronto",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
  const days = Math.ceil(
    (Date.parse(`${date}T00:00:00Z`) - Date.parse(`${today}T00:00:00Z`)) /
      86400000,
  );
  return {
    state:
      days < 0
        ? ("expired" as const)
        : days <= 30
          ? ("expiring" as const)
          : ("current" as const),
    days,
  };
}
export async function loadCredentials() {
  const { data, error } = await supabase
    .from("documents_library")
    .select(
      "id,title,description,category,file_url,file_name,expiry_date,is_active,requires_authentication,version",
    )
    .in("category", [
      "insurance",
      "safety",
      "certifications",
      "prequalification",
    ])
    .order("title");
  if (error) throw error;
  return data || [];
}
export async function loadCredentialPackages() {
  const { data, error } = await db
    .from("credential_packages")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(100);
  if (missingOptionalSchema(error))
    return { available: false as const, rows: [] };
  if (error) throw error;
  return { available: true as const, rows: data || [] };
}
export function validatePackageDocuments(documents: CredentialDocument[]) {
  if (!documents.length || documents.length > 20)
    throw new Error("Choose between 1 and 20 vault documents.");
  for (const doc of documents)
    if (
      !doc.is_active ||
      !doc.requires_authentication ||
      !doc.file_url.startsWith("restricted:") ||
      credentialExpiry(doc.expiry_date).state === "expired"
    )
      throw new Error(
        `${doc.title} must be active, private, and not expired before sharing.`,
      );
}
export async function createCredentialPackage(
  title: string,
  documents: CredentialDocument[],
  expiresAt: string,
  renderPdf: (
    links: { document: CredentialDocument; url: string }[],
  ) => Promise<Blob>,
) {
  validatePackageDocuments(documents);
  const expiry = Date.parse(expiresAt);
  if (
    !Number.isFinite(expiry) ||
    expiry <= Date.now() ||
    expiry > Date.now() + 7 * 86400000
  )
    throw new Error("Choose an expiry within 7 days.");
  if (!title.trim() || title.trim().length > 200)
    throw new Error("Use a title between 1 and 200 characters.");
  const bytes = crypto.getRandomValues(new Uint8Array(32));
  const token = [...bytes].map((v) => v.toString(16).padStart(2, "0")).join("");
  const hashed = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(token),
  );
  const tokenHash = [...new Uint8Array(hashed)]
    .map((v) => v.toString(16).padStart(2, "0"))
    .join("");
  const id = crypto.randomUUID();
  const path = `packages/${id}/package.pdf`;
  const endpoint = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/credential-package`;
  const blob = await renderPdf(
    documents.map((document) => ({
      document,
      url: `${endpoint}?token=${token}&document=${encodeURIComponent(document.id)}`,
    })),
  );
  const upload = await supabase.storage
    .from("documents-restricted")
    .upload(path, blob, { contentType: "application/pdf", upsert: false });
  if (upload.error) throw upload.error;
  const registered = await db.rpc("register_credential_package", {
    _id: id,
    _title: title.trim(),
    _document_ids: documents.map((d) => d.id),
    _file_path: path,
    _token_hash: tokenHash,
    _expires_at: expiresAt,
  });
  if (registered.error) {
    const cleanup = await supabase.storage
      .from("documents-restricted")
      .remove([path]);
    if (cleanup.error)
      throw new Error(
        "Package registration failed. An unshared private PDF remains in storage; remove it from Documents after checking the upload.",
      );
    throw registered.error;
  }
  return { token, id };
}
export async function revokeCredentialPackage(id: string) {
  const { error } = await db.rpc("revoke_credential_package", { _id: id });
  if (error) throw error;
}
