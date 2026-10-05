import { useState } from "react";
import { Card } from "@/design-system/components/Card";
import { SectionHeader } from "@/design-system/components/SectionHeader";
import { Button } from "@/ui/Button";

export const ITP_STEPS = [
  {
    title: "Substrate & existing conditions review",
    kind: "H",
    reference: "Contract field review",
    reason:
      "Review the substrate before repair materials conceal existing conditions.",
  },
  {
    title: "Mock-up of each system and colour",
    kind: "H",
    reference: "Specification / Part 1",
    reason:
      "Agree on appearance and workmanship before production work proceeds.",
  },
  {
    title: "Joint preparation & primer",
    kind: "W",
    reference: "Manufacturer instructions",
    reason:
      "Review joint preparation, primer compatibility and backer rod before sealing.",
  },
  {
    title: "Sealant field adhesion test",
    kind: "H",
    reference: "ASTM C1521",
    reason:
      "Field adhesion testing checks bond to the actual project substrate.",
  },
  {
    title: "EIFS mesh embedment & base coat",
    kind: "W",
    reference: "Manufacturer instructions",
    reason:
      "Review reinforcement, laps and terminations before the finish covers them.",
  },
  {
    title: "Coating wet film thickness",
    kind: "R",
    reference: "ASTM D4414",
    reason:
      "Record wet film thickness against the specified coating requirements.",
  },
  {
    title: "Final walk-through & deficiency list",
    kind: "H",
    reference: "Contract / substantial performance",
    reason:
      "Review completion, resolve deficiencies and assemble the handover record.",
  },
] as const;
const kinds = { H: "Hold point", W: "Witness point", R: "Record" };
const classes = {
  H: "bg-destructive text-destructive-foreground",
  W: "bg-amber-100 text-amber-900",
  R: "bg-primary text-primary-foreground",
};

export default function InspectionTestPlan() {
  const [index, setIndex] = useState(3);
  const [decision, setDecision] = useState("");
  const step = ITP_STEPS[index];
  const select = (next: number) => {
    setIndex(next);
    setDecision("");
  };
  return (
    <>
      <SectionHeader
        badge="Quality control"
        title="Inspection & Test Plan"
        description="An illustrative sequence of reviews, hold points and records. The project’s approved specification sets the actual inspection requirements."
      />
      <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <Card className="min-w-0">
          <h3 className="text-xl font-semibold">
            Typical ITP, sample · ITP-07
          </h3>
          <div className="my-4 flex flex-wrap gap-3 text-xs">
            {Object.entries(kinds).map(([kind, label]) => (
              <span key={kind}>
                <b
                  className={`mr-1 rounded px-2 py-1 ${classes[kind as keyof typeof classes]}`}
                >
                  {kind}
                </b>
                {label}
              </span>
            ))}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[420px] text-left text-sm">
              <thead>
                <tr className="border-y">
                  <th className="p-2" scope="col">
                    Step / activity
                  </th>
                  <th className="p-2" scope="col">
                    Type
                  </th>
                  <th className="p-2" scope="col">
                    Reference
                  </th>
                </tr>
              </thead>
              <tbody>
                {ITP_STEPS.map((item, i) => (
                  <tr key={item.title} className="border-b">
                    <th className="p-2" scope="row">
                      <button
                        type="button"
                        aria-pressed={index === i}
                        className={`rounded p-2 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary ${index === i ? "bg-primary/10 text-primary" : ""}`}
                        onClick={() => select(i)}
                      >
                        {i + 1}. {item.title}
                      </button>
                    </th>
                    <td className="p-2">
                      <span
                        className={`rounded px-2 py-1 text-xs ${classes[item.kind]}`}
                      >
                        {item.kind}
                      </span>
                    </td>
                    <td className="p-2 text-xs text-muted-foreground">
                      {item.reference}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-xs text-muted-foreground">
            Hold points require the designated reviewer’s written release.
            Sample only; not a completed inspection or an assertion of a
            universal project procedure.
          </p>
        </Card>
        <Card className="self-start" aria-live="polite">
          <p className="mb-3 text-xs uppercase tracking-wider">
            Step {index + 1} of 7 · {kinds[step.kind]}
          </p>
          <h3 className="text-xl font-semibold">{step.title}</h3>
          <p className="my-4 text-sm text-muted-foreground">{step.reason}</p>
          {step.kind === "H" && (
            <fieldset className="space-y-2 rounded border p-3">
              <legend className="px-1 text-xs font-semibold">
                Sample release form
              </legend>
              <label className="block text-xs">
                Inspected by
                <input
                  className="mt-1 block w-full rounded border p-2 text-sm"
                  placeholder="Sample reviewer"
                />
              </label>
              {["Accepted", "Accepted with comments", "Rejected"].map(
                (value) => (
                  <label
                    key={value}
                    className="flex items-center gap-2 text-xs"
                  >
                    <input
                      type="radio"
                      name="sample-itp-release"
                      value={value}
                      checked={decision === value}
                      onChange={() => setDecision(value)}
                    />
                    {value}
                  </label>
                ),
              )}
              <p className="text-xs text-muted-foreground">
                Demonstration only. Entries are not saved or submitted.
              </p>
            </fieldset>
          )}
          <div className="mt-5 flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={index === 0}
              onClick={() => select(index - 1)}
            >
              Previous inspection
            </Button>
            <Button
              size="sm"
              disabled={index === 6}
              onClick={() => select(index + 1)}
            >
              Next inspection
            </Button>
          </div>
        </Card>
      </div>
    </>
  );
}
