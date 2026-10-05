import { useState } from "react";
import { Card } from "@/design-system/components/Card";
import { Button } from "@/ui/Button";

import { ACCESS_METHODS, accessLabel } from "./access-data";

function Worker({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <circle cy="-17" r="3.5" fill="hsl(var(--primary))" />
      <path
        d="M-4-20h8M0-13v10m0-8-6 5m6-5 6 5M0-3-4 4m4-7 4 7"
        stroke="hsl(var(--primary))"
        fill="none"
        strokeWidth="2"
      />
      <path
        d="M-2-12 2-7-2-7 2-12"
        fill="none"
        stroke="hsl(var(--brand-accent))"
        strokeWidth="1.5"
      />
    </g>
  );
}

export default function AccessPlanner() {
  const [storeys, setStoreys] = useState(12);
  const [selected, setSelected] = useState("stage");
  const method = ACCESS_METHODS.find((item) => item.id === selected)!;
  const ground = 340,
    roof = ground - storeys * 9;
  const platform = ground - Math.min(storeys * 9, method.max * 3) * 0.65;
  return (
    <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
      <Card className="min-w-0 text-foreground">
        <svg
          viewBox="0 0 560 400"
          className="w-full bg-muted/30"
          role="img"
          aria-label={`Sample ${storeys}-storey building, ${storeys * 3} metres, showing ${method.name}`}
        >
          <defs>
            <pattern
              id="access-sheet-grid"
              width="24"
              height="24"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M24 0H0V24"
                fill="none"
                stroke="hsl(var(--border))"
                strokeWidth="0.5"
              />
            </pattern>
          </defs>
          <rect width="560" height="400" fill="url(#access-sheet-grid)" />
          <path d={`M70 ${ground}H495`} stroke="hsl(var(--muted-foreground))" />
          <rect
            x="195"
            y={roof}
            width="200"
            height={storeys * 9}
            fill="hsl(var(--primary) / .08)"
            stroke="hsl(var(--primary))"
          />
          {Array.from({ length: storeys }, (_, floor) => (
            <g key={floor}>
              <line
                x1="195"
                x2="395"
                y1={ground - floor * 9}
                y2={ground - floor * 9}
                stroke="hsl(var(--primary) / .3)"
              />
              {[215, 252, 289, 326, 363].map((x) => (
                <rect
                  key={x}
                  x={x}
                  y={ground - (floor + 1) * 9 + 2}
                  width="16"
                  height="5"
                  fill="hsl(var(--primary) / .45)"
                />
              ))}
            </g>
          ))}
          <line
            x1="455"
            y1={ground}
            x2="455"
            y2="70"
            stroke="hsl(var(--primary))"
          />
          {Array.from({ length: 10 }, (_, i) => (
            <g key={i}>
              <path
                d={`M450 ${ground - i * 30}h10`}
                stroke="hsl(var(--primary))"
              />
              <text
                x="467"
                y={ground - i * 30 + 4}
                fontSize="10"
                fill="hsl(var(--primary))"
              >
                {i * 10} m
              </text>
            </g>
          ))}
          <g stroke="hsl(var(--brand-accent))" fill="none" strokeWidth="2">
            {selected === "stage" && (
              <>
                <path
                  d={`M270 ${roof}v-12h55v12M270 ${roof - 12}V${platform}M325 ${roof - 12}V${platform}`}
                />
                <rect x="259" y={platform} width="78" height="12" />
                <path
                  d={`M250 ${roof}V${platform + 2}`}
                  strokeDasharray="3 2"
                />
                <Worker x={292} y={platform - 3} />
                <path d={`M250 ${platform - 13}h42`} strokeDasharray="3 2" />
                <text
                  x="258"
                  y={roof - 20}
                  stroke="none"
                  fill="hsl(var(--primary))"
                  fontSize="10"
                >
                  Roof anchors
                </text>
              </>
            )}
            {selected === "boom" && (
              <>
                <rect x="100" y={ground - 14} width="65" height="14" />
                <circle cx="112" cy={ground} r="5" />
                <circle cx="152" cy={ground} r="5" />
                <path
                  d={`M130 ${ground - 14}L100 ${platform + 45}L174 ${platform}`}
                  strokeWidth="5"
                />
                <rect x="164" y={platform - 12} width="28" height="20" />
                <Worker x={178} y={platform - 13} />
              </>
            )}
            {selected === "scaffold" &&
              Array.from({ length: Math.min(storeys, 10) }, (_, i) => (
                <g key={i}>
                  <rect
                    x="147"
                    y={ground - (i + 1) * 9}
                    width="38"
                    height="9"
                  />
                  <path
                    d={`M147 ${ground - i * 9}l38-9m-38 0 38 9M185 ${ground - (i + 1) * 9}h10`}
                  />
                </g>
              ))}
            {selected === "mast" && (
              <>
                <path
                  d={`M170 ${ground}V${roof}m12 ${ground - roof}V${roof}`}
                />
                {Array.from({ length: storeys }, (_, i) => (
                  <path
                    key={i}
                    d={`M170 ${ground - i * 9}l12-9m-12 0 12 9M182 ${ground - i * 9}h13`}
                  />
                ))}
                <rect x="162" y={platform} width="90" height="12" />
                <path d={`M162 ${platform}v-20h90v20`} />
                <Worker x={221} y={platform - 3} />
              </>
            )}
            {selected === "ladder" && (
              <>
                <path
                  d={`M155 ${ground}L185 ${ground - Math.min(18, storeys * 9)}m-20 18 30-18`}
                />
                {[1, 2, 3, 4].map((i) => (
                  <path key={i} d={`M${155 + i * 6} ${ground - i * 3.6}h10`} />
                ))}
                <path d={`M150 ${ground - 20}h40v20`} />
              </>
            )}
          </g>
          <text
            x="24"
            y="25"
            fontSize="11"
            fontWeight="600"
            fill="hsl(var(--primary))"
          >
            ACCESS PLANNING · ILLUSTRATIVE ELEVATION
          </text>
          <text x="195" y="375" fontSize="12" fill="hsl(var(--primary))">
            {storeys} storeys · {storeys * 3} m · {method.name}
          </text>
        </svg>
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
