import { Link } from "react-router-dom";
import { FileText, Calculator, MessageSquare, ShieldCheck, Award, HardHat } from "lucide-react";
import { cn } from "@/lib/utils";

interface StartProjectCTAProps {
  /** Optional override for the band title. */
  title?: string;
  /** Optional override for the supporting copy. */
  description?: string;
  /** Tone: dark (primary brand band) or light (muted). Defaults to dark. */
  tone?: "dark" | "light";
  className?: string;
}

const REASSURANCE = [
  { icon: HardHat,     label: "Safety First",        sub: "WSIB compliant · daily site protocols" },
  { icon: Award,       label: "Quality Workmanship", sub: "Manufacturer-approved systems & QA" },
  { icon: ShieldCheck, label: "Proven Experience",   sub: "15+ years · $2M CGL · self-performed" },
];

const PATHS = [
  { to: "/submit-rfp", icon: FileText,        title: "Submit an RFP",       sub: "Have drawings or specs ready" },
  { to: "/estimate",   icon: Calculator,      title: "Request an Estimate", sub: "Get budget-level pricing" },
  { to: "/contact",    icon: MessageSquare,   title: "Talk to Our Team",    sub: "Site assessment or questions" },
];

/**
 * StartProjectCTA — unified end-of-page conversion band shared across every
 * public page. Pairs three reassurance pillars (Safety, Quality, Experience)
 * with three clear paths to engage (RFP, Estimate, Contact).
 */
export const StartProjectCTA = ({
  title = "Start a Project With Ascent Group",
  description = "Three ways to engage — pick the path that fits where your project is today. You'll talk to the people who'll actually be on site.",
  tone = "dark",
  className,
}: StartProjectCTAProps) => {
  const isDark = tone === "dark";

  return (
    <section
      aria-label="Start a project"
      className={cn(
        "w-full",
        isDark ? "bg-primary text-primary-foreground" : "bg-muted/40 text-foreground",
        "py-16 md:py-20",
        className,
      )}
    >
      <div className="container mx-auto px-4 md:px-6 max-w-6xl">
        {/* Heading */}
        <div className="text-center mb-10 md:mb-12">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            {title}
          </h2>
          <p
            className={cn(
              "text-base md:text-lg max-w-2xl mx-auto leading-relaxed",
              isDark ? "text-primary-foreground/85" : "text-muted-foreground",
            )}
          >
            {description}
          </p>
        </div>

        {/* Reassurance pillars */}
        <ul
          className={cn(
            "grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10",
            "max-w-4xl mx-auto",
          )}
        >
          {REASSURANCE.map(({ icon: Icon, label, sub }) => (
            <li
              key={label}
              className={cn(
                "flex items-start gap-3 rounded-lg px-4 py-3 border",
                isDark
                  ? "bg-primary-foreground/5 border-primary-foreground/15"
                  : "bg-background border-border",
              )}
            >
              <Icon
                className={cn(
                  "w-5 h-5 mt-0.5 flex-shrink-0",
                  isDark ? "text-primary-foreground" : "text-primary",
                )}
                aria-hidden="true"
              />
              <div>
                <p className="text-sm font-semibold leading-tight">{label}</p>
                <p
                  className={cn(
                    "text-xs mt-1 leading-snug",
                    isDark ? "text-primary-foreground/70" : "text-muted-foreground",
                  )}
                >
                  {sub}
                </p>
              </div>
            </li>
          ))}
        </ul>

        {/* Engagement paths */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl mx-auto">
          {PATHS.map(({ to, icon: Icon, title, sub }) => (
            <Link
              key={to}
              to={to}
              className={cn(
                "group flex flex-col items-center text-center rounded-lg p-6 border transition-colors",
                isDark
                  ? "bg-primary-foreground/10 border-primary-foreground/20 hover:bg-primary-foreground/15"
                  : "bg-background border-border hover:border-primary/40 hover:shadow-sm",
              )}
            >
              <Icon
                className={cn(
                  "w-8 h-8 mb-3",
                  isDark ? "text-primary-foreground" : "text-primary",
                )}
                aria-hidden="true"
              />
              <h3 className="text-base font-semibold mb-1">{title}</h3>
              <p
                className={cn(
                  "text-xs",
                  isDark ? "text-primary-foreground/70" : "text-muted-foreground",
                )}
              >
                {sub}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StartProjectCTA;
