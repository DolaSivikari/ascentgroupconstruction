export const ACCESS_METHODS = [
  {
    id: "ladder",
    name: "Ladders & platforms",
    max: 6,
    min: 1,
    requirements:
      "Stable ground, secured ladders, suitable platform and task-specific fall protection.",
  },
  {
    id: "boom",
    name: "Boom lift",
    max: 24,
    min: 1,
    requirements:
      "Ground bearing, clear setup area, operating envelope and specified fall protection.",
  },
  {
    id: "scaffold",
    name: "Frame scaffold",
    max: 30,
    min: 1,
    requirements:
      "Engineered layout where required, bases, ties, bracing, guardrails and access.",
  },
  {
    id: "mast",
    name: "Mast climber",
    max: 90,
    min: 6,
    requirements:
      "Engineered drawings, ground bearing, mast ties, installation review and platform protection.",
  },
  {
    id: "stage",
    name: "Swing stage",
    max: 90,
    min: 4,
    requirements:
      "Certified roof anchors, engineered rigging plan, pre-use inspection and independent lifelines.",
  },
] as const;
export function accessLabel(id: string, storeys: number) {
  const method = ACCESS_METHODS.find((item) => item.id === id)!;
  if (storeys < method.min) return `typically from ${method.min} storeys`;
  return storeys * 3 <= method.max
    ? "covers the full height"
    : `lower levels only, to about ${method.max} m`;
}
