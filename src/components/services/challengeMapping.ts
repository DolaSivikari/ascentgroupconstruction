import { TrendingUp, Home, Building2, Leaf } from "lucide-react";

export interface Challenge {
  id: string;
  label: string;
  icon: typeof Home;
  description: string;
  color: string;
  tags: string[];
  metricName?: string; // Links to industry_pulse_metrics.metric_name
}

export const CHALLENGES: Challenge[] = [
  {
    id: "housing",
    label: "Housing Shortage",
    icon: Home,
    description: "Addressing Ontario's residential construction needs",
    color: "hsl(var(--primary))",
    tags: ["housing"],
    metricName: "Residential Construction Investment"
  },
  {
    id: "envelope",
    label: "Building Envelope",
    icon: Building2,
    description: "Solving the building envelope crisis",
    color: "hsl(var(--accent))",
    tags: ["envelope"],
    metricName: "Building Envelope Market"
  },
  {
    id: "infrastructure",
    label: "Infrastructure Gap",
    icon: TrendingUp,
    description: "Bridging commercial & institutional needs",
    color: "hsl(var(--chart-2))",
    tags: ["infrastructure"],
    metricName: "Infrastructure Investment"
  },
  {
    id: "sustainability",
    label: "Sustainable Solutions",
    icon: Leaf,
    description: "Green building & efficiency services",
    color: "hsl(var(--chart-3))",
    tags: ["sustainability"],
    metricName: "Green Building Market"
  }
];

export const getChallengeById = (id: string) => 
  CHALLENGES.find(c => c.id === id);

export const getChallengeColor = (tag: string): string => {
  const challenge = CHALLENGES.find(c => c.tags.includes(tag));
  return challenge?.color || "hsl(var(--muted))";
};
