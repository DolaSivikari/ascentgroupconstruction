import type { MouseEventHandler, ReactNode } from "react";
import { useId } from "react";
import { WALL_ASSEMBLIES } from "../interactive-data";

const footprint =
  "110,90 410,90 410,180 490,180 490,340 360,340 360,220 110,220";

export function FloorPlan() {
  const hatch = useId().replace(/:/g, "");
  return (
    <svg
      viewBox="0 0 620 460"
      aria-label="Sample L-shaped ground floor plan A-101"
      className="tech-floor-plan"
    >
      <defs>
        <pattern
          id={hatch}
          width="4"
          height="4"
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(45)"
        >
          <line x1="0" x2="0" y2="4" stroke="currentColor" strokeWidth="1" />
        </pattern>
      </defs>
      <rect width="620" height="460" fill="hsl(var(--primary))" />
      <g fill="none" stroke="currentColor" strokeWidth="0.8">
        {[110, 210, 310, 410, 490].map((x, i) => (
          <g key={x}>
            <line
              x1={x}
              y1="48"
              x2={x}
              y2="363"
              strokeDasharray="8 5"
              opacity="0.4"
            />
            <circle cx={x} cy="40" r="10" />
            <text
              x={x}
              y="44"
              textAnchor="middle"
              fill="currentColor"
              stroke="none"
              fontSize="11"
            >
              {"ABCDE"[i]}
            </text>
          </g>
        ))}
        {[90, 180, 220, 340].map((y, i) => (
          <g key={y}>
            <line
              x1="65"
              y1={y}
              x2="525"
              y2={y}
              strokeDasharray="8 5"
              opacity="0.4"
            />
            <circle cx="55" cy={y} r="10" />
            <text
              x="55"
              y={y + 4}
              textAnchor="middle"
              fill="currentColor"
              stroke="none"
              fontSize="11"
            >
              {i + 1}
            </text>
          </g>
        ))}
        <polygon points={footprint} fill={`url(#${hatch})`} strokeWidth="5" />
        <polygon
          points={footprint}
          fill="hsl(var(--primary))"
          strokeWidth="1.5"
        />
        <path
          d="M113 150H407 M113 170H360 M190 93V150 M280 93V150 M190 170V217 M275 170V217 M363 265H487"
          strokeWidth="2"
        />
        {[135, 175, 235, 275, 335, 375].map((x) => (
          <g key={x}>
            <rect
              x={x - 10}
              y="86"
              width="20"
              height="8"
              fill="hsl(var(--primary))"
              stroke="none"
            />
            <path d={`M${x - 10} 88h20m-20 4h20`} />
          </g>
        ))}
        {[210, 260, 310].map((y) => (
          <g key={y}>
            <rect
              x="486"
              y={y - 10}
              width="8"
              height="20"
              fill="hsl(var(--primary))"
              stroke="none"
            />
            <path d={`M488 ${y - 10}v20m4-20v20`} />
          </g>
        ))}
        {[135, 220, 310].map((x) => (
          <g key={x}>
            <path d={`M${x} 150v-14m0 0a14 14 0 0 1 14 14`} />
            <path d={`M${x} 170v14m0 0a14 14 0 0 0 14-14`} />
          </g>
        ))}
        <path d="M300 220v18a18 18 0 0 0 18-18m18 0v18a18 18 0 0 1-18-18" />
        <rect x="363" y="185" width="43" height="32" />
        {Array.from({ length: 7 }, (_, i) => (
          <line key={i} x1={366 + i * 5} y1="188" x2={366 + i * 5} y2="204" />
        ))}
        <path d="M368 196h30l-5-3m5 3-5 3M391 206l12 9m0-9-12 9" />
        <rect x="391" y="206" width="12" height="9" />
        <path d="M110 385h380m-380-6v12m100-12v12m100-12v12m100-12v12m80-12v12" />
        <path d="M540 90v250m-5-250h10m-10 130h10m-10 120h10" />
        <path d="M561 65v-30l-6 10m6-10 6 10" />
        <text x="561" y="27" fill="currentColor" stroke="none" fontSize="10">
          N
        </text>
        <path d="M100 420h60m-60-4v8m30-8v8m30-8v8" />
      </g>
      <g fill="currentColor" fontSize="10" textAnchor="middle">
        {[
          [150, 120, "UNIT 101", "74 m²"],
          [235, 120, "UNIT 102", "52 m²"],
          [345, 120, "UNIT 103", "55 m²"],
          [150, 195, "AMENITY", "40 m²"],
          [235, 195, "MAIL", "18 m²"],
          [320, 195, "LOBBY", "46 m²"],
          [435, 240, "UNIT 104", "68 m²"],
          [425, 300, "UNIT 105", "81 m²"],
        ].map(([x, y, name, area]) => (
          <text key={name} x={x} y={y}>
            {name}
            <tspan x={x} dy="12" fontSize="9">
              {area}
            </tspan>
          </text>
        ))}
        {[160, 260, 360].map((x) => (
          <text key={x} x={x} y="379">
            10 000
          </text>
        ))}
        <text x="450" y="379">
          8 000
        </text>
        <text x="553" y="205" transform="rotate(90 553 205)">
          25 000
        </text>
        <text x="130" y="436">
          0 — 6 m
        </text>
      </g>
      <rect
        x="260"
        y="408"
        width="325"
        height="40"
        fill="none"
        stroke="currentColor"
      />
      <text x="270" y="422" fill="currentColor" fontSize="10">
        ASCENT · SAMPLE MULTI-RESIDENTIAL
      </text>
      <text x="270" y="438" fill="currentColor" fontSize="11">
        A-101 · FLOOR PLAN · 1:100 · REV 2 · SAMPLE
      </text>
    </svg>
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
