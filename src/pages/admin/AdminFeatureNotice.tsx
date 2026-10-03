import { Link } from "react-router-dom";
import { AdminPageLayout } from "@/components/admin/AdminPageLayout";
import { Button } from "@/ui/Button";

const features = {
  navigation: {
    title: "Navigation management",
    description: "Public navigation is managed in the website code.",
    message: "A menu editor is not connected to the live navigation. Changes to menu links and structure need a reviewed website change; this page cannot publish menu changes.",
    links: [{ label: "View website", to: "/" }, { label: "Site settings", to: "/admin/settings" }],
  },
  redirects: {
    title: "URL redirects",
    description: "Public page routes and redirects are managed in the website code.",
    message: "A redirect editor is not connected to the live website. Add or change redirect destinations through a reviewed website change.",
    links: [{ label: "SEO dashboard", to: "/admin/seo-dashboard" }, { label: "View website", to: "/" }],
  },
  versions: {
    title: "Content version history",
    description: "Version restore is not available in this admin panel.",
    message: "This panel does not currently provide a version history browser or a restore action. Open the relevant content editor to review the current saved content.",
    links: [{ label: "Projects", to: "/admin/projects" }, { label: "Services", to: "/admin/services-manager" }, { label: "Blog posts", to: "/admin/blog" }],
  },
} as const;

export default function AdminFeatureNotice({ feature }: { feature: keyof typeof features }) {
  const content = features[feature];
  return (
    <AdminPageLayout title={content.title} description={content.description}>
      <div className="rounded-lg border border-border bg-card p-6 space-y-4">
        <h2 className="text-lg font-semibold">No editor available</h2>
        <p className="text-muted-foreground max-w-3xl">{content.message}</p>
        <div className="flex flex-wrap gap-3">
          {content.links.map(link => <Button key={link.to} asChild variant="outline"><Link to={link.to}>{link.label}</Link></Button>)}
        </div>
      </div>
    </AdminPageLayout>
  );
}
