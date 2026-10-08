import {
  AdminSectionWorkspace,
  AdminSectionScreen,
} from "@/components/admin/AdminSectionWorkspace";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { AdminPageLayout } from "@/components/admin/AdminPageLayout";
import { Button } from "@/ui/Button";
import { Input } from "@/ui/Input";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { useToast } from "@/hooks/use-toast";
import {
  loadCredentials,
  loadCredentialPackages,
  credentialExpiry,
  createCredentialPackage,
  revokeCredentialPackage,
} from "@/lib/admin/credentials";
import { openDocumentUrl } from "@/utils/documentUrl";
import { SITE_URL } from "@/constants/company";
export default function CredentialsVault() {
  const docs = useQuery({
    queryKey: ["credentials-vault"],
    queryFn: loadCredentials,
  });
  const packages = useQuery({
    queryKey: ["credential-packages"],
    queryFn: loadCredentialPackages,
    retry: false,
  });
  const [selected, setSelected] = useState<string[]>([]);
  const [title, setTitle] = useState("Prequalification package");
  const [days, setDays] = useState(3);
  const [acknowledge, setAcknowledge] = useState(false);
  const [busy, setBusy] = useState(false);
  const [share, setShare] = useState<string | null>(null);
  const [revoke, setRevoke] = useState<string | null>(null);
  const { toast } = useToast();
  const expiry = new Date(Date.now() + days * 86400000).toISOString();
  const chosen = (docs.data || []).filter((d) => selected.includes(d.id));
  const act = async (fn: () => Promise<void>, success: string) => {
    setBusy(true);
    try {
      await fn();
      toast({ title: success });
      void packages.refetch();
    } catch (e) {
      toast({
        title: "Action was not completed",
        description: e instanceof Error ? e.message : "Please retry.",
        variant: "destructive",
      });
    } finally {
      setBusy(false);
    }
  };
  return (
    <AdminPageLayout
      title="Credentials vault"
      description="Review private evidence, upcoming expiry and explicitly shared prequalification packages."
      actions={
        <Button asChild variant="outline">
          <Link to="/admin/documents-library">Manage documents</Link>
        </Button>
      }
    >
      <p className="rounded border p-4 text-sm">
        Public credential wording remains unchanged. Upload and verify your
        actual documents in Documents before sharing. Expiry reminders below are
        based on recorded dates; no scheduled email reminders are active yet.
      </p>
      {(docs.error || packages.error) && (
        <p role="alert">
          Some vault data could not be loaded.{" "}
          <Button
            onClick={() => {
              void docs.refetch();
              void packages.refetch();
            }}
          >
            Retry
          </Button>
        </p>
      )}
      <AdminSectionWorkspace
        label="Credentials sections"
        items={[
          { id: "documents", title: "Documents & expiry" },
          { id: "builder", title: "Package builder" },
          { id: "shared", title: "Shared packages" },
        ]}
      >
        <AdminSectionScreen id="documents" title="Documents & expiry">
          <section className="space-y-3">
            <h2 className="text-xl font-bold">
              Documents and expiry reminders
            </h2>
            {docs.isPending ? (
              <p>Loading documents…</p>
            ) : !docs.data?.length ? (
              <p>
                No credential documents have been added. Use Manage documents to
                add verified private files.
              </p>
            ) : (
              docs.data.map((d) => {
                const expiry = credentialExpiry(d.expiry_date);
                const eligible =
                  d.is_active &&
                  d.requires_authentication &&
                  d.file_url.startsWith("restricted:") &&
                  expiry.state !== "expired";
                return (
                  <article
                    key={d.id}
                    className="flex flex-wrap items-center gap-3 rounded-xl border p-4"
                  >
                    <label className="flex flex-1 items-start gap-3">
                      <input
                        type="checkbox"
                        checked={selected.includes(d.id)}
                        disabled={!eligible || busy}
                        onChange={(e) =>
                          setSelected((old) =>
                            e.target.checked
                              ? [...old, d.id]
                              : old.filter((id) => id !== d.id),
                          )
                        }
                      />
                      <span>
                        <strong>{d.title}</strong>
                        <span className="block text-xs text-muted-foreground">
                          {d.category} · version {d.version} ·{" "}
                          {expiry.state === "unknown"
                            ? "Expiry not recorded"
                            : `${expiry.state}: ${d.expiry_date}`}
                          {expiry.days !== null && expiry.days >= 0
                            ? ` (${expiry.days} days)`
                            : ""}
                          {!eligible
                            ? " · Not eligible for a private package"
                            : ""}
                        </span>
                      </span>
                    </label>
                    <Button
                      variant="outline"
                      disabled={busy}
                      onClick={() =>
                        void act(async () => {
                          await openDocumentUrl(d.file_url);
                        }, "Document opened")
                      }
                    >
                      View document
                    </Button>
                  </article>
                );
              })
            )}
          </section>
        </AdminSectionScreen>
        <AdminSectionScreen id="builder" title="Package builder">
          <section className="space-y-4 rounded-xl border p-5">
            <h2 className="text-xl font-bold">
              Prequalification package builder
            </h2>
            <p className="text-sm text-muted-foreground">
              Creates a branded PDF index with links to the selected private
              documents. Access expires and can be revoked. The original
              document PDFs retain their contents.
            </p>
            <label className="block space-y-1 text-sm">
              Package title
              <Input
                value={title}
                maxLength={200}
                onChange={(e) => setTitle(e.target.value)}
              />
            </label>
            <label className="block space-y-1 text-sm">
              Link expiry
              <select
                className="block rounded border bg-background p-2"
                value={days}
                onChange={(e) => setDays(Number(e.target.value))}
              >
                {[1, 3, 7].map((n) => (
                  <option key={n} value={n}>
                    {n} day{n > 1 ? "s" : ""}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex gap-2 text-sm">
              <input
                type="checkbox"
                checked={acknowledge}
                onChange={(e) => setAcknowledge(e.target.checked)}
              />
              I verified these documents and approve sharing them with anyone
              who has the expiring link.
            </label>
            <div className="flex flex-wrap gap-3">
              <Button
                variant="outline"
                disabled={busy || !chosen.length}
                onClick={() =>
                  void act(async () => {
                    const { renderCredentialPackage } = await import(
                      "@/components/admin/content/CredentialPackagePdf"
                    );
                    const blob = await renderCredentialPackage(
                      `${title} — PREVIEW`,
                      expiry,
                      chosen.map((document) => ({ document, url: null })),
                    );
                    const url = URL.createObjectURL(blob);
                    const link = document.createElement("a");
                    link.href = url;
                    link.download = "prequalification-preview.pdf";
                    link.click();
                    URL.revokeObjectURL(url);
                  }, "Preview PDF downloaded. It contains no document access links.")
                }
              >
                Download local preview
              </Button>
              <Button
                disabled={
                  busy ||
                  !chosen.length ||
                  !acknowledge ||
                  !packages.data?.available
                }
                onClick={() =>
                  void act(async () => {
                    const { renderCredentialPackage } = await import(
                      "@/components/admin/content/CredentialPackagePdf"
                    );
                    const result = await createCredentialPackage(
                      title,
                      chosen,
                      expiry,
                      (links) => renderCredentialPackage(title, expiry, links),
                    );
                    setShare(`${SITE_URL}/prequal-package/${result.token}`);
                  }, "Private package created")
                }
              >
                Create expiring share link
              </Button>
            </div>
            {packages.data && !packages.data.available && (
              <p className="text-sm">
                Sharing awaits the reviewed credentials-package schema and
                download function. Local PDF previews work now.
              </p>
            )}
            {share && (
              <div role="status" className="space-y-2 rounded border p-3">
                <p className="text-sm">
                  Copy this link now; the token is not stored in the admin list.
                </p>
                <Input
                  aria-label="New package share URL"
                  readOnly
                  value={share}
                />
                <Button
                  variant="outline"
                  onClick={() =>
                    void act(
                      () => navigator.clipboard.writeText(share),
                      "Share link copied",
                    )
                  }
                >
                  Copy link
                </Button>
              </div>
            )}
          </section>
        </AdminSectionScreen>
        <AdminSectionScreen id="shared" title="Shared packages">
          <section className="space-y-3">
            <h2 className="text-xl font-bold">Shared packages</h2>
            {packages.data?.rows.map((p) => (
              <div
                key={p.id}
                className="flex flex-wrap items-center gap-3 rounded border p-3"
              >
                <div className="flex-1">
                  <strong>{p.title}</strong>
                  <p className="text-xs text-muted-foreground">
                    Expires {new Date(p.expires_at).toLocaleString()} ·{" "}
                    {p.open_count} opens ·{" "}
                    {p.revoked_at
                      ? "Revoked"
                      : Date.parse(p.expires_at) < Date.now()
                        ? "Expired"
                        : "Active"}
                  </p>
                </div>
                <Button
                  variant="outline"
                  disabled={busy || !!p.revoked_at}
                  onClick={() => setRevoke(p.id)}
                >
                  Revoke link
                </Button>
              </div>
            ))}
          </section>
        </AdminSectionScreen>
      </AdminSectionWorkspace>
      <ConfirmDialog
        open={!!revoke}
        onOpenChange={(open) => {
          if (!open) setRevoke(null);
        }}
        title="Revoke this package link?"
        description="New access stops immediately. Already issued download URLs expire within 60 seconds. The private files are retained."
        variant="destructive"
        onConfirm={() => {
          if (revoke)
            void act(
              () => revokeCredentialPackage(revoke),
              "Package access revoked",
            );
        }}
      />
    </AdminPageLayout>
  );
}
