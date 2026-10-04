import { useQuery } from "@tanstack/react-query";
import { Button } from "@/ui/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/ui/Card";
import { adminErrorMessage } from "@/lib/admin/editorValues";
import { readCrawlerFile, summarizeSitemap } from "@/lib/admin/crawlerFiles";

export const SEODashboardSettingsTab = () => {
  const robots = useQuery({
    queryKey: ["served-robots"],
    queryFn: () => readCrawlerFile("/robots.txt"),
    retry: false,
  });
  const sitemap = useQuery({
    queryKey: ["served-sitemap"],
    queryFn: async () =>
      summarizeSitemap(await readCrawlerFile("/sitemap.xml")),
    retry: false,
  });
  return (
    <Card>
      <CardHeader>
        <CardTitle>What crawlers see</CardTitle>
        <CardDescription>
          The files served by the current website. This panel is read-only;
          database settings do not replace these files.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5 min-w-0">
        <section className="space-y-2">
          <h3 className="font-semibold">
            <a
              href="/robots.txt"
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              /robots.txt
            </a>
          </h3>
          {robots.error ? (
            <p role="alert">{adminErrorMessage(robots.error)}</p>
          ) : robots.isLoading ? (
            <p>Reading robots.txt…</p>
          ) : (
            <pre className="whitespace-pre-wrap break-all rounded-lg border p-3 text-xs">
              {robots.data}
            </pre>
          )}
        </section>
        <section className="space-y-2">
          <h3 className="font-semibold">
            <a
              href="/sitemap.xml"
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              /sitemap.xml
            </a>
          </h3>
          {sitemap.error ? (
            <p role="alert">{adminErrorMessage(sitemap.error)}</p>
          ) : sitemap.isLoading ? (
            <p>Reading sitemap…</p>
          ) : (
            <p>
              {sitemap.data?.kind === "urlset"
                ? `URL count: ${sitemap.data.count}`
                : `Sitemap index: ${sitemap.data?.count} child sitemaps. URL count is unavailable from the index alone.`}
            </p>
          )}
        </section>
        <Button
          variant="outline"
          onClick={() => {
            void robots.refetch();
            void sitemap.refetch();
          }}
          disabled={robots.isFetching || sitemap.isFetching}
        >
          Refresh served files
        </Button>
      </CardContent>
    </Card>
  );
};
