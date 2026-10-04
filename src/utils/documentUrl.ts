import { supabase } from "@/integrations/supabase/client";

/**
 * Documents that require sign-in live in the private `documents-restricted`
 * bucket. Their stored file_url is a marker (`restricted:<path>`) rather than a
 * public URL, so the file can only be fetched through a short-lived signed URL
 * issued to an authenticated user.
 */
export const RESTRICTED_BUCKET = "documents-restricted";
export const RESTRICTED_PREFIX = "restricted:";

export const isRestrictedDocument = (fileUrl: string | null | undefined) =>
  !!fileUrl && fileUrl.startsWith(RESTRICTED_PREFIX);

export const restrictedPath = (fileUrl: string) =>
  fileUrl.slice(RESTRICTED_PREFIX.length);

/** Resolve a stored file_url into a URL the browser can open. */
export const resolveDocumentUrl = async (
  fileUrl: string,
): Promise<string | null> => {
  if (!isRestrictedDocument(fileUrl)) return fileUrl;

  const { data, error } = await supabase.storage
    .from(RESTRICTED_BUCKET)
    .createSignedUrl(restrictedPath(fileUrl), 300);

  if (error || !data?.signedUrl) return null;
  return data.signedUrl;
};

/** Open a document in a new tab, signing restricted files first. */
export const openDocumentUrl = async (fileUrl: string): Promise<boolean> => {
  const url = await resolveDocumentUrl(fileUrl);
  if (!url) {
    throw new Error("You don't have access to this document. Please contact us to request it.");
  }
  window.open(url, "_blank", "noopener,noreferrer");
  return true;
};
