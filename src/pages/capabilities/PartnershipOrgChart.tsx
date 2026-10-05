import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Card } from "@/design-system/components/Card";
import { SectionHeader } from "@/design-system/components/SectionHeader";
import { Button } from "@/ui/Button";
import { ExplorerTabs } from "@/pages/redesign/ExplorerTabs";
import { partnershipModels } from "@/data/partnership-models";

type Node = {
  id: string;
  x: number;
  y: number;
  label: string;
  type?: "ascent" | "crew";
};
type Edge = {
  from: string;
  to: string;
  kind: "contract" | "direction" | "self";
  label: string;
};
const crew: Node = {
  id: "crew",
  x: 280,
  y: 310,
  label: "Ascent crews",
  type: "crew",
};
const diagrams: { nodes: Node[]; edges: Edge[] }[] = [
  {
    nodes: [
      { id: "owner", x: 280, y: 35, label: "Owner / Condo corp." },
      { id: "consultant", x: 105, y: 140, label: "Envelope consultant" },
      { id: "ascent", x: 280, y: 185, label: "Ascent Group", type: "ascent" },
      { id: "access", x: 100, y: 310, label: "Access rigging" },
      crew,
      { id: "suppliers", x: 465, y: 310, label: "Material suppliers" },
    ],
    edges: [
      {
        from: "owner",
        to: "ascent",
        kind: "contract",
        label: "Prime contract",
      },
      {
        from: "owner",
        to: "consultant",
        kind: "contract",
        label: "Consulting agreement",
      },
      {
        from: "consultant",
        to: "ascent",
        kind: "direction",
        label: "Field review · hold points",
      },
      { from: "ascent", to: "access", kind: "contract", label: "Subcontract" },
      { from: "ascent", to: "crew", kind: "self", label: "Self-performed" },
      {
        from: "ascent",
        to: "suppliers",
        kind: "contract",
        label: "Purchase orders",
      },
    ],
  },
  {
    nodes: [
      { id: "owner", x: 280, y: 35, label: "Owner / Developer" },
      { id: "gc", x: 280, y: 145, label: "General contractor" },
      { id: "ascent", x: 145, y: 260, label: "Ascent Group", type: "ascent" },
      { id: "other", x: 425, y: 260, label: "Other trades" },
    ],
    edges: [
      { from: "owner", to: "gc", kind: "contract", label: "Prime contract" },
      { from: "gc", to: "ascent", kind: "contract", label: "Subcontract" },
      { from: "gc", to: "other", kind: "contract", label: "Subcontracts" },
    ],
  },
  {
    nodes: [
      { id: "owner", x: 280, y: 35, label: "Owner / Condo corp." },
      { id: "engineer", x: 105, y: 145, label: "Engineer of record" },
      { id: "ascent", x: 280, y: 275, label: "Ascent Group", type: "ascent" },
    ],
    edges: [
      {
        from: "owner",
        to: "ascent",
        kind: "contract",
        label: "Construction contract",
      },
      {
        from: "owner",
        to: "engineer",
        kind: "contract",
        label: "Engineering agreement",
      },
      {
        from: "engineer",
        to: "ascent",
        kind: "direction",
        label: "Specifications · field reviews",
      },
    ],
  },
  {
    nodes: [
      { id: "owner", x: 280, y: 40, label: "Property owner" },
      { id: "ascent", x: 280, y: 165, label: "Ascent Group", type: "ascent" },
      { ...crew, x: 155 },
      { id: "suppliers", x: 425, y: 310, label: "Suppliers" },
    ],
    edges: [
      {
        from: "owner",
        to: "ascent",
        kind: "contract",
        label: "Written contract",
      },
      { from: "ascent", to: "crew", kind: "self", label: "Self-performed" },
      {
        from: "ascent",
        to: "suppliers",
        kind: "contract",
        label: "Purchase orders",
      },
    ],
  },
];
const colours = {
  contract: "hsl(var(--primary))",
  direction: "hsl(var(--brand-accent))",
  self: "hsl(var(--success))",
};

export default function PartnershipOrgChart() {
  const { hash } = useLocation();
  const requestedIndex = partnershipModels.findIndex(
    (model) => `#${model.id}` === hash,
  );
  const [index, setIndex] = useState(() => Math.max(0, requestedIndex));
  useEffect(() => {
    if (requestedIndex >= 0) setIndex(requestedIndex);
  }, [requestedIndex]);
  const model = partnershipModels[index],
    diagram = diagrams[index];
  return (
    <>
      <SectionHeader
        badge="Partnership models"
        title="How We Partner With You"
        description="Choose your project structure to see the contract relationships, who directs the work, and what you receive from us."
      />
      <ExplorerTabs
        label="Partnership structure"
        options={partnershipModels.map((item, i) => ({
          id: String(i),
          label: item.shortTitle,
        }))}
        value={String(index)}
        onChange={(value) => setIndex(Number(value))}
      >
        <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
          <Card className="min-w-0">
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider">
              {model.title}
            </h3>
            <svg
              viewBox="0 0 560 355"
              className="w-full"
              role="img"
              aria-label={`${model.shortTitle} contract and direction chart`}
            >
              {diagram.edges.map((edge) => {
                const a = diagram.nodes.find((node) => node.id === edge.from)!,
                  b = diagram.nodes.find((node) => node.id === edge.to)!;
                const mid = (a.y + b.y) / 2;
                return (
                  <g key={edge.from + edge.to}>
                    <path
                      d={`M${a.x} ${a.y + 21}V${mid}H${b.x}V${b.y - 21}`}
                      stroke={colours[edge.kind]}
                      strokeWidth="1.5"
                      fill="none"
                      strokeDasharray={
                        edge.kind === "contract" ? undefined : "6 4"
                      }
                    />
                    <rect
                      x={(a.x + b.x) / 2 - 68}
                      y={mid - 12}
                      width="136"
                      height="15"
                      fill="hsl(var(--card))"
                    />
                    <text
                      x={(a.x + b.x) / 2}
                      y={mid - 1}
                      textAnchor="middle"
                      fontSize="9"
                      fill="hsl(var(--primary))"
                    >
                      {edge.label}
                    </text>
                  </g>
                );
              })}
              {diagram.nodes.map((node) => (
                <g key={node.id}>
                  <rect
                    x={node.x - 80}
                    y={node.y - 21}
                    width="160"
                    height="42"
                    rx="4"
                    stroke="hsl(var(--border))"
                    fill={
                      node.type === "ascent"
                        ? "hsl(var(--primary))"
                        : "hsl(var(--muted))"
                    }
                  />
                  {node.type === "ascent" && (
                    <rect
                      x={node.x - 80}
                      y={node.y + 17}
                      width="160"
                      height="4"
                      fill="hsl(var(--brand-accent))"
                    />
                  )}
                  <text
                    x={node.x}
                    y={node.y + 4}
                    textAnchor="middle"
                    fontSize="12"
                    fontWeight="600"
                    fill={
                      node.type === "ascent"
                        ? "hsl(var(--primary-foreground))"
                        : "hsl(var(--primary))"
                    }
                  >
                    {node.label}
                  </text>
                </g>
              ))}
            </svg>
            <div className="mt-3 flex flex-wrap gap-4 text-xs">
              {(["contract", "direction", "self"] as const).map((kind) => (
                <span key={kind} className="flex items-center gap-2">
                  <svg width="24" height="8" aria-hidden="true">
                    <line
                      x1="0"
                      y1="4"
                      x2="24"
                      y2="4"
                      stroke={colours[kind]}
                      strokeWidth="2"
                      strokeDasharray={kind === "contract" ? undefined : "4 3"}
                    />
                  </svg>
                  {kind === "contract"
                    ? "Contract"
                    : kind === "direction"
                      ? "Direction / review"
                      : "Self-performed"}
                </span>
              ))}
            </div>
          </Card>
          <Card className="self-start" aria-live="polite">
            <h3 className="text-xl font-semibold">Best for</h3>
            <ul className="my-4 list-disc space-y-2 pl-5 text-sm text-muted-foreground">
              {model.bestFor.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <h4 className="font-semibold">What you receive from us</h4>
            <ul className="my-4 list-disc space-y-2 pl-5 text-sm text-muted-foreground">
              {model.valuePropositions.map((item) => (
                <li key={item}>{item}</li>
              ))}
              <li>
                Written scope, coordinated schedule and daily documentation
              </li>
              <li>
                Practical pre-construction input and related scope packaging
                where appropriate
              </li>
            </ul>
            <Button asChild size="sm">
              <Link to="/contact">Discuss this structure</Link>
            </Button>
          </Card>
        </div>
      </ExplorerTabs>
    </>
  );
}
