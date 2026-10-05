import { useState } from "react";
import { Card } from "@/design-system/components/Card";
import { Button } from "@/ui/Button";

import { AccessElevation } from "./AccessElevation";
import { ACCESS_METHODS, accessLabel } from "./access-data";

export default function AccessPlanner() {
  const [storeys, setStoreys] = useState(12);
  const [selected, setSelected] = useState("stage");
  const method = ACCESS_METHODS.find((item) => item.id === selected)!;
  return (
    <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
      <Card className="min-w-0 text-foreground">
        <AccessElevation storeys={storeys} method={method} />
        <label
          htmlFor="building-storeys"
          className="mt-4 block text-sm font-semibold"
        >
          Building height: {storeys} storeys / {storeys * 3} m
        </label>
        <input
          id="building-storeys"
          type="range"
          min="1"
          max="30"
          value={storeys}
          onChange={(e) => {
            const next = Number(e.target.value);
            setStoreys(next);
            if (next < method.min) setSelected("ladder");
          }}
          className="mt-3 w-full accent-orange-600"
        />
        <p className="mt-2 text-xs text-muted-foreground">
          1–30 storeys at 3.0 m per storey.
        </p>
      </Card>
      <Card className="self-start text-foreground">
        <h3 className="mb-4 text-xl font-semibold">
          Typical methods for this building
        </h3>
        <div className="space-y-2">
          {ACCESS_METHODS.map((item) => (
            <Button
              key={item.id}
              size="sm"
              variant={selected === item.id ? "primary" : "outline"}
              disabled={storeys < item.min}
              aria-pressed={selected === item.id}
              className="h-auto w-full justify-start whitespace-normal text-left"
              onClick={() => setSelected(item.id)}
            >
              {item.name}: {accessLabel(item.id, storeys)}
            </Button>
          ))}
        </div>
        <div aria-live="polite">
          <h4 className="mt-5 font-semibold">Before we mobilize</h4>
          <p className="mt-2 text-sm text-muted-foreground">
            {method.requirements}
          </p>
        </div>
        <p className="mt-5 text-xs text-muted-foreground">
          Typical ranges. Every project gets a written access plan. Equipment,
          reach and suitability depend on engineered requirements and site
          conditions; this illustration does not imply equipment ownership.
        </p>
      </Card>
    </div>
  );
}
