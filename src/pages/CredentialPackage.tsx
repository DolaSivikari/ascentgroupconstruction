import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet-async";
import { Button } from "@/ui/Button";
import { visitorSupabase } from "@/lib/publicSettings";
import { useToast } from "@/hooks/use-toast";
import { COMPANY_NAME } from "@/constants/company";
type PackageView = {
  title: string;
  expires_at: string;
  documents: { id: string; title: string; version: string }[];
};
export default function CredentialPackage() {
  const { token } = useParams();
  const { toast } = useToast();
  const query = useQuery({
    queryKey: ["shared-credential-package", token],
    queryFn: async () => {
      if (!token || !/^[a-f0-9]{64}$/.test(token))
        throw new Error("Invalid link");
      const result = await visitorSupabase.functions.invoke(
        "credential-package",
        { body: { token, action: "view" } },
      );
      if (result.error || !result.data?.documents)
        throw new Error("This package is expired, revoked or unavailable.");
      return result.data as PackageView;
    },
    retry: false,
    refetchOnWindowFocus: false,
    staleTime: Infinity,
  });
  async function download(documentId?: string) {
    try {
      const result = await visitorSupabase.functions.invoke(
        "credential-package",
        {
          body: {
            token,
            action: documentId ? "document" : "download",
            document_id: documentId,
          },
        },
      );
      if (result.error || !result.data?.url)
        throw new Error("File unavailable");
      const url = new URL(result.data.url);
      if (
        url.origin !== new URL(import.meta.env.VITE_SUPABASE_URL).origin ||
        !url.pathname.startsWith(
          "/storage/v1/object/sign/documents-restricted/",
        )
      )
        throw new Error("Unsupported file location");
      window.open(url.href, "_blank", "noopener,noreferrer");
    } catch {
      toast({
        title: "The file could not be opened",
        description: "The link may have expired or been revoked.",
        variant: "destructive",
      });
    }
  }
  return (
    <main className="min-h-screen bg-background px-5 py-12">
      <Helmet>
        <title>Shared package | {COMPANY_NAME}</title>
        <meta name="robots" content="noindex,nofollow" />
        <meta name="referrer" content="no-referrer" />
      </Helmet>
      <div className="mx-auto max-w-2xl space-y-6">
        <p className="font-bold text-primary">{COMPANY_NAME}</p>
        {query.isPending ? (
          <p role="status">Loading shared package…</p>
        ) : query.error ? (
          <>
            <h1 className="text-2xl font-bold">Package unavailable</h1>
            <p>
              This link has expired, was revoked, or its documents need review.
            </p>
            <Button asChild variant="outline">
              <a href="/contact">Contact us</a>
            </Button>
          </>
        ) : (
          query.data && (
            <>
              <h1 className="text-3xl font-bold">{query.data.title}</h1>
              <p className="text-sm">
                Access expires{" "}
                {new Date(query.data.expires_at).toLocaleString()}. Document
                contents govern their scope and validity.
              </p>
              <Button onClick={() => void download()}>
                Download package index
              </Button>
              {query.data.documents.map((d) => (
                <article
                  key={d.id}
                  className="flex flex-wrap items-center gap-3 rounded-lg border p-4"
                >
                  <div className="flex-1">
                    <h2 className="font-semibold">{d.title}</h2>
                    <p className="text-xs">Version {d.version}</p>
                  </div>
                  <Button variant="outline" onClick={() => void download(d.id)}>
                    Download document
                  </Button>
                </article>
              ))}
            </>
          )
        )}
      </div>
    </main>
  );
}
