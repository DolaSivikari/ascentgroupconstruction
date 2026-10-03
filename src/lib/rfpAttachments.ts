/** Reuse successful uploads when a later file or the submission fails. */
export async function uploadRfpAttachments(
  files: File[],
  uploaded: Map<File, string>,
  upload: (path: string, file: File) => Promise<{ error: unknown }>,
): Promise<string[]> {
  const paths: string[] = [];
  for (const file of files) {
    let path = uploaded.get(file);
    if (!path) {
      path = `${crypto.randomUUID()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
      const { error } = await upload(path, file);
      if (error)
        throw new Error(
          `Could not upload "${file.name}". Your request has not been submitted. Please retry or remove this file.`,
        );
      uploaded.set(file, path);
    }
    paths.push(path);
  }
  return paths;
}
