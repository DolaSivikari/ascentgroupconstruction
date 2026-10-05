import { useState } from "react";
import { Card } from "@/design-system/components/Card";
import { Button } from "@/ui/Button";
import { ExplorerTabs } from "@/pages/redesign/ExplorerTabs";
import { PROCESS_STEPS } from "../interactive-data";

export default function ProcessExplorer() {
  const [index, setIndex] = useState(0);
  const step = PROCESS_STEPS[index];
  return (
    <ExplorerTabs
      label="Documented project process"
      options={PROCESS_STEPS.map((s, i) => ({
        id: String(i),
        label: `${i + 1}. ${s.label}`,
      }))}
      value={String(index)}
      onChange={(value) => setIndex(Number(value))}
    >
      <Card className="grid gap-6 md:grid-cols-2" aria-live="polite">
        <div>
          <h3 className="mb-3 text-xl font-semibold">{step.title}</h3>
          <p className="text-muted-foreground">{step.body}</p>
          <p className="mt-4 text-sm">
            <strong>Tools used:</strong> {step.tools.join(" · ")}
          </p>
        </div>
        <div>
          <h4 className="mb-2 font-semibold">What you receive</h4>
          <ul className="list-disc space-y-1 pl-5 text-muted-foreground">
            {step.deliverables.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <div className="mt-5 flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={index === 0}
              onClick={() => setIndex(index - 1)}
            >
              Previous step
            </Button>
            <Button
              size="sm"
              disabled={index === 4}
              onClick={() => setIndex(index + 1)}
            >
              Next step
            </Button>
          </div>
        </div>
      </Card>
    </ExplorerTabs>
  );
}
