import type { MouseEventHandler, ReactNode } from "react";
import { useId } from "react";
import { WALL_ASSEMBLIES } from "../interactive-data";

import groundFloorPlan from "../ground-floor-plan.svg";

export function FloorPlan() {
  return (
    <img
      src={groundFloorPlan}
      alt="Sample L-shaped ground floor plan A-101"
      className="tech-floor-plan"
      draggable={false}
    />
  );
}

export function Elevation({
  children,
  onClick,
}: {
  children?: ReactNode;
  onClick?: MouseEventHandler<SVGSVGElement>;
}) {
  return (
    <svg
      viewBox="0 0 760 430"
      className="tech-drawing w-full"
      aria-label="Sample south elevation, A-301, scale 1:100"
      onClick={onClick}
    >
      <rect width="760" height="430" fill="white" />
      <g fill="none" stroke="hsl(var(--primary))" strokeWidth="1">
        <rect
          x="95"
          y="75"
          width="550"
          height="275"
          fill="hsl(var(--primary) / .06)"
        />
        {Array.from({ length: 6 }, (_, i) => (
          <g key={i}>
            <line
              x1="65"
              y1={350 - i * 55}
              x2="677"
              y2={350 - i * 55}
              strokeDasharray="5 4"
            />
            <text
              x="680"
              y={354 - i * 55}
              fill="hsl(var(--primary))"
              stroke="none"
              fontSize="9"
            >
              {i === 5 ? "ROOF" : `L${i + 1}`} +{(i * 3).toFixed(3)}
            </text>
          </g>
        ))}
        {[95, 278, 461, 645].map((x, i) => (
          <g key={x}>
            <line x1={x} y1="45" x2={x} y2="370" strokeDasharray="8 6" />
            <circle cx={x} cy="32" r="11" fill="white" />
            <text
              x={x}
              y="36"
              fill="hsl(var(--primary))"
              stroke="none"
              fontSize="12"
              textAnchor="middle"
            >
              {"ABCD"[i]}
            </text>
          </g>
        ))}
        {Array.from({ length: 4 }, (_, row) =>
          Array.from({ length: 9 }, (_, col) => (
            <g key={`${row}-${col}`}>
              <rect
                x={112 + col * 59}
                y={91 + row * 55}
                width="30"
                height="40"
                fill="hsl(var(--primary) / .15)"
              />
              <line
                x1={127 + col * 59}
                y1={91 + row * 55}
                x2={127 + col * 59}
                y2={131 + row * 55}
              />
              <line
                x1={109 + col * 59}
                y1={133 + row * 55}
                x2={145 + col * 59}
                y2={133 + row * 55}
              />
            </g>
          )),
        )}
        {Array.from({ length: 9 }, (_, col) => (
          <rect
            key={col}
            x={112 + col * 59}
            y="301"
            width="45"
            height="49"
            fill="hsl(var(--primary) / .12)"
          />
        ))}
        <path d="M278 75V350m183-275v275M95 382H645m-550-5v10m183-10v10m183-10v10m184-10v10" />
      </g>
      <g fill="hsl(var(--primary))" fontSize="10">
        <text x="150" y="375">
          10 000
        </text>
        <text x="340" y="375">
          10 000
        </text>
        <text x="523" y="375">
          10 000
        </text>
        <text x="95" y="410">
          A-301 · SOUTH ELEVATION · 1:100 · REV 2 · SAMPLE
        </text>
        <text x="105" y="65">
          EIFS-1 · SL-1 · WD-1
        </text>
      </g>
      {children}
    </svg>
  );
}

export function WallDetail({
  assembly = "eifs",
  selected = -1,
  onSelect,
}: {
  assembly?: string;
  selected?: number;
  onSelect?: (index: number) => void;
}) {
  const uid = useId().replace(/:/g, "");
  const layers = WALL_ASSEMBLIES[assembly].layers;
  let x = 28;
  return (
    <svg
      viewBox="0 0 440 290"
      className="tech-drawing w-full"
      aria-label={`Sample ${WALL_ASSEMBLIES[assembly].name} wall section, detail 3/A-501`}
    >
      <defs>
        {layers.map((layer, i) => (
          <pattern
            key={layer.name}
            id={`${uid}-${i}`}
            width={i === 1 ? 16 : 6}
            height="8"
            patternUnits="userSpaceOnUse"
          >
            <rect width="16" height="8" fill="white" />
            <path
              d={
                i === 1 ? "M0 4Q4-4 8 4T16 4" : i % 2 ? "M0 0L6 8" : "M0 8L6 0"
              }
              fill="none"
              stroke="hsl(var(--primary) / .5)"
              strokeWidth="0.7"
            />
          </pattern>
        ))}
      </defs>
      <rect width="440" height="290" fill="white" />
      <text x="16" y="18" fontSize="11" fill="hsl(var(--primary))">
        TYPICAL {assembly === "eifs" ? "EIFS" : "STUCCO"} WALL SECTION
      </text>
      <text x="16" y="32" fontSize="9">
        3/A-501 · 1:5 · SAMPLE, NOT FOR CONSTRUCTION
      </text>
      {layers.map((layer, i) => {
        const width = Math.max(6, layer.mm * 0.75),
          start = x;
        x += width;
        return (
          <g key={layer.name}>
            <rect
              x={start}
              y="60"
              width={width}
              height="155"
              fill={`url(#${uid}-${i})`}
              stroke={
                i === selected
                  ? "hsl(var(--brand-accent))"
                  : "hsl(var(--primary))"
              }
              strokeWidth={i === selected ? 2 : 0.8}
            />
            <path
              d={`M${start + width / 2} ${68 + i * 17}H280L300 ${60 + i * 22}`}
              fill="none"
              stroke="hsl(var(--primary))"
              strokeWidth="0.7"
            />
            <g
              role={onSelect ? "button" : undefined}
              tabIndex={onSelect ? 0 : undefined}
              aria-label={`${i + 1}. ${layer.name}, ${layer.mm} mm`}
              onClick={() => onSelect?.(i)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onSelect?.(i);
                }
              }}
              className="cursor-pointer outline-none focus-visible:stroke-orange-600"
            >
              <circle
                cx="313"
                cy={60 + i * 22}
                r="9"
                fill={selected === i ? "hsl(var(--brand-accent))" : "white"}
                stroke="hsl(var(--primary))"
              />
              <text
                x="313"
                y={63 + i * 22}
                fontSize="10"
                textAnchor="middle"
                fill={selected === i ? "white" : "hsl(var(--primary))"}
              >
                {i + 1}
              </text>
            </g>
          </g>
        );
      })}
      <text x="28" y="236" fontSize="9">
        INTERIOR
      </text>
      <text x={x} y="236" textAnchor="end" fontSize="9">
        EXTERIOR
      </text>
      <path
        d={`M28 250H${x}m-0-4v8M28 246v8`}
        fill="none"
        stroke="hsl(var(--primary))"
      />
      <text x={28 + (x - 28) / 2} y="268" textAnchor="middle" fontSize="10">
        {layers.reduce((sum, layer) => sum + layer.mm, 0)} mm overall ·
        illustrative
      </text>
    </svg>
  );
}
