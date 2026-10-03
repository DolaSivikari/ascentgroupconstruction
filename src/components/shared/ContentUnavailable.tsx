import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { Button } from "@/ui/Button";

interface ContentUnavailableProps {
  kind: "Article" | "Project";
  failed?: boolean;
  backTo: string;
  backLabel: string;
}

/** Keep an unknown slug at its own URL so it cannot masquerade as a content hub. */
export function ContentUnavailable({
  kind,
  failed = false,
  backTo,
  backLabel,
}: ContentUnavailableProps) {
  const title = `${kind} ${failed ? "Unavailable" : "Not Found"}`;
  const description = failed
    ? "We couldn't load this page. Please try again."
    : `The requested ${kind.toLowerCase()} could not be found.`;

  return (
    <div className="min-h-screen">
      <SEO title={title} description={description} noindex />
      <Navigation />
      <main
        id="main-content"
        className="container mx-auto px-4 py-24 text-center"
      >
        <h1 className="text-4xl font-bold mb-4">{title}</h1>
        <p className="text-muted-foreground mb-8">{description}</p>
        <div className="flex flex-wrap justify-center gap-4">
          <Button asChild>
            <Link to={backTo}>{backLabel}</Link>
          </Button>
          {failed && (
            <Button variant="outline" onClick={() => window.location.reload()}>
              Try Again
            </Button>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
