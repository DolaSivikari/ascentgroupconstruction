/**
 * Design Token Preview — /dev/tokens
 *
 * Live reference for all semantic feedback tokens, brand surfaces, and the Badge
 * component variants. Use when reviewing PRs that touch colors or when designing
 * new components, to see exactly which class produces which visual.
 *
 * Gated behind DEV mode + admin role check (the route file decides exposure).
 */
import { Badge } from "@/components/ui/badge";
import { Card } from "@/design-system/components/Card";

const SEMANTIC_TOKENS = ["success", "warning", "danger", "info"] as const;
const OPACITIES = [10, 20, 50, 80, 100] as const;
const BRAND_TOKENS = [
  { name: "brand-primary", className: "bg-brand-primary text-white" },
  { name: "brand-accent",  className: "bg-brand-accent text-white" },
  { name: "primary",       className: "bg-primary text-primary-foreground" },
  { name: "secondary",     className: "bg-secondary text-secondary-foreground" },
  { name: "muted",         className: "bg-muted text-muted-foreground" },
  { name: "accent",        className: "bg-accent text-accent-foreground" },
  { name: "ink",           className: "bg-ink text-white" },
  { name: "line",          className: "bg-line text-ink" },
  { name: "bg-soft",       className: "bg-bg-soft text-ink" },
  { name: "destructive",   className: "bg-destructive text-destructive-foreground" },
];
const BADGE_VARIANTS = [
  "primary", "success", "warning", "info", "danger",
  "glass", "outline-gradient", "outline",
  "status-active", "status-pending", "status-inactive",
  "default", "secondary", "destructive",
  "new", "contacted", "resolved", "completed", "active", "inactive",
] as const;

export default function TokenPreview() {
  return (
    <div className="min-h-screen bg-background p-8 md:p-12">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <header>
          <p className="text-sm font-semibold uppercase tracking-wider text-brand-accent">
            Internal · Design System
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-ink mt-2">
            Design Token Preview
          </h1>
          <p className="text-lg text-muted-foreground mt-3 max-w-2xl">
            Canonical reference for semantic feedback colors, brand surfaces, and
            badge variants. <strong>Never</strong> use Tailwind palette utilities
            (<code className="text-danger bg-danger/10 px-1 rounded">bg-green-500</code>) —
            always use semantic tokens (<code className="text-success bg-success/10 px-1 rounded">bg-success</code>).
          </p>
        </header>

        {/* Semantic feedback tokens */}
        <section>
          <h2 className="text-2xl font-bold text-ink mb-6">Semantic Feedback Tokens</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {SEMANTIC_TOKENS.map((token) => (
              <Card key={token} className="p-6 space-y-4">
                <div>
                  <h3 className="font-bold text-lg capitalize text-ink">{token}</h3>
                  <code className="text-xs text-muted-foreground">--{token}</code>
                </div>

                {/* bg samples */}
                <div>
                  <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">
                    Background
                  </p>
                  <div className={`bg-${token} text-${token}-foreground p-3 rounded-md text-sm font-medium`}>
                    bg-{token}
                  </div>
                </div>

                {/* text sample */}
                <div>
                  <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">
                    Text
                  </p>
                  <p className={`text-${token} font-bold text-lg`}>text-{token}</p>
                </div>

                {/* border sample */}
                <div>
                  <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">
                    Border
                  </p>
                  <div className={`border-2 border-${token} bg-${token}/5 p-3 rounded-md text-sm`}>
                    border-{token}
                  </div>
                </div>

                {/* opacity ramp */}
                <div>
                  <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">
                    Opacity ramp
                  </p>
                  <div className="flex gap-1">
                    {OPACITIES.map((op) => (
                      <div
                        key={op}
                        className={`flex-1 h-10 rounded ${
                          op === 10 ? `bg-${token}/10` :
                          op === 20 ? `bg-${token}/20` :
                          op === 50 ? `bg-${token}/50` :
                          op === 80 ? `bg-${token}/80` :
                          `bg-${token}`
                        }`}
                        title={`bg-${token}/${op === 100 ? "" : op}`}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 font-mono">
                    /10 /20 /50 /80 /100
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Brand surfaces */}
        <section>
          <h2 className="text-2xl font-bold text-ink mb-6">Brand Surfaces</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {BRAND_TOKENS.map(({ name, className }) => (
              <div
                key={name}
                className={`${className} p-4 rounded-md text-center text-sm font-medium`}
              >
                {name}
              </div>
            ))}
          </div>
        </section>

        {/* Badge gallery */}
        <section>
          <h2 className="text-2xl font-bold text-ink mb-6">Badge Variants</h2>
          <Card className="p-6">
            <div className="flex flex-wrap gap-3">
              {BADGE_VARIANTS.map((v) => (
                <Badge key={v} variant={v as never} size="md">
                  {v}
                </Badge>
              ))}
            </div>
            <hr className="my-6 border-line" />
            <p className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wider">
              Sizes (success variant)
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Badge variant="success" size="xs">xs</Badge>
              <Badge variant="success" size="sm">sm</Badge>
              <Badge variant="success" size="md">md</Badge>
              <Badge variant="success" size="lg">lg</Badge>
            </div>
          </Card>
        </section>

        <footer className="text-sm text-muted-foreground border-t border-line pt-6">
          <p>
            See <code className="bg-bg-soft px-1.5 py-0.5 rounded">CONTRIBUTING.md</code> →
            "Design Tokens" for the full ruleset and code examples.
          </p>
        </footer>
      </div>
    </div>
  );
}
