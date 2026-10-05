import { useEffect, useRef, useState } from "react";
import { Card } from "@/design-system/components/Card";
import { Button } from "@/ui/Button";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const CHAINS = {
  ascent: [
    { label: "Owner / property manager" },
    { label: "General contractor", note: "when there is one" },
    {
      label: "Ascent Group",
      note: "Estimator, foreman and crew · one company",
    },
    { label: "Ascent crew", note: "ON YOUR SITE" },
  ],
  broker: [
    { label: "Owner / property manager" },
    { label: "General contractor" },
    { label: "Specialty contractor", note: "Markup layer" },
    { label: "Sub-trade", note: "Markup layer" },
    { label: "Installer crew", note: "ON YOUR SITE" },
  ],
};

export default function WhoIsOnSite() {
  const [model, setModel] = useState<keyof typeof CHAINS>("ascent");
  const [hop, setHop] = useState(-1);
  const [playing, setPlaying] = useState(false);
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const chain = CHAINS[model];
  useEffect(() => {
    if (!playing) return;
    if (reduced || hop >= chain.length - 1) {
      setHop(chain.length - 1);
      setPlaying(false);
      return;
    }
    const timer = window.setTimeout(() => setHop((value) => value + 1), 450);
    return () => clearTimeout(timer);
  }, [playing, hop, chain.length, reduced]);
  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) setPlaying(false);
    });
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return (
    <Card ref={ref} className="mt-10 text-foreground">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h3 className="text-xl font-semibold">Who is actually on your site</h3>
        <div className="flex flex-wrap gap-2">
          {(["ascent", "broker"] as const).map((value) => (
            <Button
              key={value}
              size="sm"
              variant={model === value ? "primary" : "outline"}
              aria-pressed={model === value}
              onClick={() => {
                setModel(value);
                setHop(-1);
                setPlaying(false);
              }}
            >
              {value === "ascent" ? "Ascent model" : "Typical broker model"}
            </Button>
          ))}
        </div>
      </div>
      <div className="mt-6 grid items-center gap-6 md:grid-cols-[1.4fr_1fr]">
        <svg
          viewBox={`0 0 560 ${chain.length * 66 + 20}`}
          className="mx-auto max-h-80 w-full"
          role="img"
          aria-label={`${model === "ascent" ? "Ascent" : "Broker"} chain: ${chain.map((node) => node.label).join(" to ")}`}
        >
          {chain.map((node, i) => (
            <g key={node.label}>
              {i > 0 && (
                <path
                  d={`M280 ${i * 66 - 12}V${i * 66 + 12}`}
                  stroke="hsl(var(--primary))"
                  strokeWidth="1.5"
                />
              )}
              <rect
                x="100"
                y={i * 66 + 12}
                width="360"
                height="42"
                rx="4"
                fill={
                  node.label === "Ascent Group"
                    ? "hsl(var(--primary))"
                    : "hsl(var(--muted))"
                }
                stroke="hsl(var(--border))"
              />
              <text
                x="280"
                y={i * 66 + 30}
                textAnchor="middle"
                fontSize="13"
                fontWeight="600"
                fill={
                  node.label === "Ascent Group"
                    ? "hsl(var(--primary-foreground))"
                    : "hsl(var(--primary))"
                }
              >
                {node.label}
              </text>
              {node.note && (
                <text
                  x="280"
                  y={i * 66 + 46}
                  textAnchor="middle"
                  fontSize="10"
                  fill={
                    node.label === "Ascent Group"
                      ? "hsl(var(--primary-foreground))"
                      : "hsl(var(--primary))"
                  }
                >
                  {node.note}
                </text>
              )}
              {i === hop && (
                <circle
                  cx="80"
                  cy={i * 66 + 32}
                  r="7"
                  fill="hsl(var(--brand-accent))"
                />
              )}
            </g>
          ))}
        </svg>
        <div>
          <dl className="grid grid-cols-3 gap-4 border-y py-4">
            {[
              [chain.length - 1, "Hand-offs"],
              [model === "ascent" ? 0 : 2, "Markup layers"],
              [
                model === "ascent" ? 1 : 3,
                "Companies between you and the work",
              ],
            ].map(([value, label]) => (
              <div key={label}>
                <dt className="text-xs text-muted-foreground">{label}</dt>
                <dd className="text-3xl font-bold text-primary">{value}</dd>
              </div>
            ))}
          </dl>
          <p className="my-4 text-xs text-muted-foreground">
            Structural comparison only. A general contractor is included when
            the project has one. Specialized sub-trades remain under our
            oversight.
          </p>
          <Button
            size="sm"
            disabled={playing}
            onClick={() => {
              setHop(reduced ? chain.length - 1 : 0);
              setPlaying(!reduced);
            }}
          >
            Show how a site question travels
          </Button>
          <p role="status" className="mt-3 text-sm">
            {hop < 0
              ? "Choose a model to compare the hand-offs."
              : `Site question ${playing ? "at" : "reached"} ${chain[hop].label}.`}
          </p>
        </div>
      </div>
    </Card>
  );
}
