import { useState, type ReactNode, type MouseEvent } from "react";
import { Card } from "@/design-system/components/Card";
import { Button } from "@/ui/Button";
import { ExplorerTabs } from "@/pages/redesign/ExplorerTabs";
import { SAMPLE_JOB } from "../interactive-data";
import {
  DailyReport,
  DocumentFrame,
  DocumentTable,
  SampleLabel,
  SitePhoto,
} from "./SampleDocuments";
import { Elevation } from "./Drawings";

import { measureShape, type Point } from "../takeoff";

function RedactedPrice() {
  return <span className="tech-redaction" role="img" aria-label="Sample price redacted" />;
}

const BID_SECTIONS = [
  "Cover letter",
  "Bid form",
  "Scope: inclusions & exclusions",
  "Unit price schedule",
  "Schedule & manpower",
  "Prequalification documents",
  "Addenda acknowledgement",
];

function BidDocument({ index }: { index: number }) {
  return (
    <DocumentFrame title={BID_SECTIONS[index]} code={`BID-0${index + 1}`}>
      <DocumentTable
        headings={["Project", "General contractor", "Consultant"]}
        rows={[[SAMPLE_JOB.name, SAMPLE_JOB.gc, SAMPLE_JOB.consultant]]}
      />
      {index === 0 && (
        <>
          <p>To the estimating team,</p>
          <p>
            We submit this sample proposal for joint sealant replacement and
            EIFS repair. The included scope, quantities and project assumptions
            are recorded in the following sections.
          </p>
          <p>
            Acceptance period: 60 days from the bid closing date. All prices in
            this demonstration are redacted.
          </p>
          <p>Authorized signatory: __________________</p>
        </>
      )}
      {index === 1 && (
        <>
          <DocumentTable
            headings={["Bid closing", "Documents"]}
            rows={[
              [
                "2026-05-07 · 14:00 (Toronto)",
                "A-101–A-501 Rev 2 · 07 24 00, 07 92 00 · Addendum 1",
              ],
            ]}
          />
          <DocumentTable
            headings={["Item", "Description", "Amount (excl. HST)"]}
            rows={[
              [
                "Base bid",
                "Remove and replace joint sealants; EIFS repairs and recoat",
                <RedactedPrice />,
              ],
              [
                "Alternate 1",
                "Full EIFS recoat, north elevation",
                <RedactedPrice />,
              ],
              [
                "Separate price",
                "Roof/wall flashing allowance",
                <RedactedPrice />,
              ],
              [
                "Bid security",
                "As required by bid documents",
                <RedactedPrice />,
              ],
            ]}
          />
        </>
      )}
      {index === 2 && (
        <>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <h5 className="font-semibold">Included</h5>
              <ul className="list-disc pl-4">
                <li>
                  07 92 00 · joint removal, preparation, primer, backer rod and
                  new sealant
                </li>
                <li>07 24 00 · EIFS repairs, mesh, base coat and finish</li>
                <li>Access setups, daily reports and digital closeout</li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold">Excluded</h5>
              <ul className="list-disc pl-4">
                <li>Window replacement</li>
                <li>Hazardous material abatement</li>
                <li>Engineering fees and permits</li>
                <li>Concrete repairs unless separately agreed</li>
              </ul>
            </div>
          </div>
          <p>
            <strong>Clarifications:</strong> Quantities tied to TK-101;
            variations reviewed in writing. Roof-anchor availability and work
            hours confirmed before mobilization.
          </p>
        </>
      )}
      {index === 3 && (
        <DocumentTable
          headings={["Item", "Unit", "Rate"]}
          rows={[
            ["Sealant replacement", "m", <RedactedPrice />],
            ["EIFS localized repairs", "m²", <RedactedPrice />],
            ["Additional access move", "ea", <RedactedPrice />],
          ]}
        />
      )}
      {index === 4 && (
        <>
          <p>
            Illustrative eight-week sequence; subject to access and approved
            scope.
          </p>
          <DocumentTable
            headings={["Elevation / activity", "Weeks 1–8", "Crew / stage"]}
            rows={[
              [
                "North: preparation + sealants",
                "■■■□□□□□",
                "3 installers · SS-2",
              ],
              [
                "East: sealants + EIFS repairs",
                "□□■■■□□□",
                "3 installers · SS-1",
              ],
              [
                "South: repairs + recoat",
                "□□□□■■■□",
                "6 installers · staged access",
              ],
              ["Walk-through and closeout", "□□□□□□□■", "Foreman / consultant"],
            ]}
          />
        </>
      )}
      {index === 5 && (
        <ul className="space-y-3">
          {[
            "Capability statement",
            "Insurance certificate",
            "WSIB clearance",
            "Safety program",
            "Relevant references",
            "Manufacturer system documentation",
          ].map((title) => (
            <li key={title}>☐ {title} — document title only</li>
          ))}
        </ul>
      )}
      {index === 6 && (
        <>
          <DocumentTable
            headings={["Addendum", "Date", "Acknowledged"]}
            rows={[
              [
                "1 · revised drawing A-501",
                "2026-04-10",
                "✓ Sample acknowledgement",
              ],
              [
                "2 · scope clarification",
                "2026-04-12",
                "✓ Sample acknowledgement",
              ],
            ]}
          />
          <p>Signed: __________________ · Date: __________________</p>
        </>
      )}
    </DocumentFrame>
  );
}

interface Markup {
  mode: string;
  points: Point[];
  value: number;
  label: string;
}

function DigitalTakeoff() {
  const [mode, setMode] = useState("length");
  const [points, setPoints] = useState<Point[]>([]);
  const [markups, setMarkups] = useState<Markup[]>([]);
  const finish = () => {
    if (points.length < (mode === "area" ? 3 : 2)) return;
    setMarkups((items) => [
      ...items,
      {
        mode,
        points,
        value: measureShape(mode, points),
        label: mode === "area" ? "Measured area" : "Measured joint",
      },
    ]);
    setPoints([]);
  };
  const addPoint = (event: MouseEvent<SVGSVGElement>) => {
    const svg = event.currentTarget,
      screen = svg.getScreenCTM();
    if (!screen) return;
    const p = new DOMPoint(event.clientX, event.clientY).matrixTransform(
      screen.inverse(),
    );
    let point = {
      x: Math.max(95, Math.min(645, p.x)),
      y: Math.max(75, Math.min(350, p.y)),
    };
    if (mode === "length" && points.length) {
      const previous = points[points.length - 1];
      point =
        Math.abs(point.x - previous.x) > Math.abs(point.y - previous.y)
          ? { x: point.x, y: previous.y }
          : { x: previous.x, y: point.y };
    }
    if (mode === "count")
      setMarkups((items) => [
        ...items,
        { mode, points: [point], value: 1, label: "Count marker" },
      ]);
    else setPoints((items) => [...items, point]);
  };
  const total = markups.reduce(
    (sum, item) => sum + (item.mode === mode ? item.value : 0),
    0,
  );
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {["length", "area", "count"].map((item) => (
          <Button
            key={item}
            size="sm"
            variant={item === mode ? "primary" : "outline"}
            aria-pressed={item === mode}
            onClick={() => {
              setMode(item);
              setPoints([]);
            }}
          >
            {item[0].toUpperCase() + item.slice(1)}
          </Button>
        ))}
        <Button
          size="sm"
          variant="outline"
          disabled={points.length < (mode === "area" ? 3 : 2)}
          onClick={finish}
        >
          Finish shape
        </Button>
        <Button
          size="sm"
          variant="outline"
          disabled={!points.length && !markups.length}
          onClick={() =>
            points.length
              ? setPoints((items) => items.slice(0, -1))
              : setMarkups((items) => items.slice(0, -1))
          }
        >
          Undo
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => {
            setPoints([]);
            setMarkups([]);
          }}
        >
          Clear
        </Button>
      </div>
      <p className="text-xs">
        Scale 1:100 · calibrated on grid A–B = 10.000 m. Length snaps
        horizontally or vertically; click vertices, then Finish shape.
      </p>
      <div className="border border-border">
        <Elevation onClick={addPoint}>
          {[
            ...markups,
            ...(points.length
              ? [{ mode, points, value: 0, label: "In progress" }]
              : []),
          ].map((item, i) =>
            item.mode === "count" ? (
              <g key={i}>
                <circle
                  cx={item.points[0].x}
                  cy={item.points[0].y}
                  r="9"
                  fill="hsl(var(--brand-accent))"
                />
                <text
                  x={item.points[0].x}
                  y={item.points[0].y + 4}
                  textAnchor="middle"
                  fontSize="10"
                  fill="white"
                >
                  {i + 1}
                </text>
              </g>
            ) : item.mode === "area" ? (
              <polygon
                key={i}
                points={item.points.map((p) => `${p.x},${p.y}`).join(" ")}
                fill="hsl(var(--primary) / .25)"
                stroke="hsl(var(--brand-accent))"
                strokeWidth="3"
              />
            ) : (
              <polyline
                key={i}
                points={item.points.map((p) => `${p.x},${p.y}`).join(" ")}
                fill="none"
                stroke="hsl(var(--brand-accent))"
                strokeWidth="3"
              />
            ),
          )}
        </Elevation>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button
          size="sm"
          onClick={() => {
            setMarkups([
              {
                mode: "length",
                points: [
                  { x: 95, y: 80 },
                  { x: 645, y: 80 },
                ],
                value: 146,
                label: "Joints — sample takeoff",
              },
              {
                mode: "count",
                points: [{ x: 127, y: 112 }],
                value: 36,
                label: "Windows — sample takeoff",
              },
              {
                mode: "area",
                points: [
                  { x: 95, y: 75 },
                  { x: 645, y: 75 },
                  { x: 645, y: 350 },
                  { x: 95, y: 350 },
                ],
                value: 282,
                label: "EIFS net — sample takeoff",
              },
            ]);
            setPoints([]);
          }}
        >
          Quick sample takeoff
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => {
            setMode("length");
            setMarkups((items) => [
              ...items,
              {
                mode: "length",
                points: [
                  { x: 112, y: 91 },
                  { x: 142, y: 91 },
                  { x: 142, y: 131 },
                  { x: 112, y: 131 },
                  { x: 112, y: 91 },
                ],
                value: 36 * 7,
                label: "Window perimeters: 36 × 7.0 m",
              },
            ]);
          }}
        >
          Measure window perimeters
        </Button>
      </div>
      <p className="text-sm" role="status">
        {mode === "count" ? "Count" : mode === "area" ? "Area" : "Length"}:{" "}
        {total.toFixed(mode === "count" ? 0 : 1)}{" "}
        {mode === "count" ? "ea" : mode === "area" ? "m²" : "m"}
      </p>
      <DocumentTable
        headings={["#", "Subject", "Label", "Measurement", "Page"]}
        rows={markups.map((item, i) => [
          i + 1,
          item.mode,
          item.label,
          `${item.value.toFixed(1)} ${item.mode === "area" ? "m²" : item.mode === "count" ? "ea" : "m"}`,
          "A-301",
        ])}
      />
      <SampleLabel />
    </div>
  );
}

const CLOSEOUT = [
  "Warranty certificates",
  "Product data",
  "As-built elevation",
  "Photo record",
  "Deficiency list",
  "Statutory declaration",
];

function CloseoutDocument({ index }: { index: number }) {
  return (
    <DocumentFrame title={CLOSEOUT[index]} code="CO-900">
      {index === 0 && (
        <>
          <h5 className="text-center text-lg font-bold">
            Certificate of Workmanship Warranty — SAMPLE
          </h5>
          <p>Project scope: joint sealants and EIFS repairs, all elevations.</p>
          <p>
            Warranty period and terms: per the project contract and manufacturer
            certificate.
          </p>
          <p>
            Authorized signatory: __________________ · Date: __________________
          </p>
        </>
      )}
      {index === 1 && (
        <DocumentTable
          headings={["Product data", "Requirement"]}
          rows={[
            ["Product / system", "Per approved submittal"],
            ["Application temperature", "Per manufacturer"],
            ["Thickness / cure", "Per manufacturer"],
            ["Compatibility / substrate", "Per manufacturer and drawings"],
          ]}
        />
      )}
      {index === 2 && (
        <Elevation>
          <path
            d="M278 156q-15-10-12-25q12-13 25-4q12-12 22 2q18-1 18 13q13 15-3 22q-5 14-20 9q-16 12-24-4q-19 2-18-13"
            fill="none"
            stroke="hsl(var(--destructive))"
            strokeWidth="2"
          />
          <text x="350" y="145" fontSize="12" fill="hsl(var(--destructive))">
            △ Joint relocated 300 mm · sample markup
          </text>
          <text x="410" y="400" fontSize="16" fill="hsl(var(--destructive))">
            AS-BUILT · SAMPLE
          </text>
        </Elevation>
      )}
      {index === 3 && (
        <div className="grid grid-cols-2 gap-3">
          <SitePhoto
            id="CO-01"
            location="North · final"
            time="10:20"
            caption="Final joint finish"
          />
          <SitePhoto
            id="CO-02"
            location="East · final"
            time="11:15"
            caption="Final EIFS repair"
          />
        </div>
      )}
      {index === 4 && (
        <DocumentTable
          headings={["Item", "Action", "Status"]}
          rows={[
            ["D-01 · finish touch-up", "Completed and reviewed", "Closed"],
            ["D-02 · sealant return", "Completed and reviewed", "Closed"],
          ]}
        />
      )}
      {index === 5 && (
        <>
          <h5 className="font-semibold">
            Statutory declaration — sample layout
          </h5>
          <p>
            Project: {SAMPLE_JOB.name}. Declaration and supporting lien
            documentation to follow the contract requirements.
          </p>
          <p>Declarant: __________________</p>
          <p>Commissioner / date: __________________</p>
          <p className="text-xs">
            Illustrative layout only. This sample has no legal effect.
          </p>
        </>
      )}
    </DocumentFrame>
  );
}

function PdfFrame({
  name,
  pages,
  children,
}: {
  name: string;
  pages: number;
  children: ReactNode;
}) {
  const [zoom, setZoom] = useState(100);
  return (
    <div className="min-w-0 rounded-lg border border-border bg-muted p-3">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2 text-xs">
        <span className="break-all font-medium">
          {SAMPLE_JOB.number}_{name}.pdf · {pages}{" "}
          {pages === 1 ? "page" : "pages"}
        </span>
        <label className="flex items-center gap-2">
          Zoom
          <select
            aria-label="Document zoom"
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            className="rounded border bg-background p-1"
          >
            {[80, 100, 125].map((value) => (
              <option key={value} value={value}>
                {value}%
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="max-h-[650px] overflow-auto focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" tabIndex={0} role="region" aria-label="Sample document viewer">
        <div style={{ zoom: zoom / 100 }}>{children}</div>
      </div>
    </div>
  );
}

export default function ClientDeliverables() {
  const [demo, setDemo] = useState("bid");
  const [bid, setBid] = useState(1);
  const [closeout, setCloseout] = useState(0);
  const [reportPage, setReportPage] = useState(1);
  return (
    <ExplorerTabs
      label="Sample client deliverables"
      options={[
        { id: "bid", label: "Bid package" },
        { id: "takeoff", label: "Digital takeoff" },
        { id: "report", label: "Daily field report" },
        { id: "closeout", label: "Closeout package" },
      ]}
      value={demo}
      onChange={setDemo}
    >
      {demo === "takeoff" ? (
        <Card>
          <DigitalTakeoff />
        </Card>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[.8fr_1.7fr]">
          <Card className="min-w-0 self-start">
            <h3 className="mb-4 text-xl font-semibold">
              {demo === "bid"
                ? "What a GC receives from us"
                : demo === "report"
                  ? "A record of the working day"
                  : "An organized handover"}
            </h3>
            {demo === "bid" && (
              <ol className="space-y-2">
                {BID_SECTIONS.map((item, i) => (
                  <li key={item}>
                    <Button
                      variant={bid === i ? "primary" : "outline"}
                      size="sm"
                      className="h-auto w-full justify-start whitespace-normal text-left"
                      aria-pressed={bid === i}
                      onClick={() => setBid(i)}
                    >
                      {i + 1}. {item} ·{" "}
                      {i === 5 ? 6 : i === 1 || i === 2 ? 2 : 1} p
                    </Button>
                  </li>
                ))}
              </ol>
            )}
            {demo === "closeout" && (
              <ol className="space-y-2">
                {CLOSEOUT.map((item, i) => (
                  <li key={item}>
                    <Button
                      variant={closeout === i ? "primary" : "outline"}
                      size="sm"
                      className="h-auto w-full justify-start whitespace-normal text-left"
                      aria-pressed={closeout === i}
                      onClick={() => setCloseout(i)}
                    >
                      {i + 1}. {item}
                    </Button>
                  </li>
                ))}
              </ol>
            )}
            {demo === "report" && (
              <>
                <p className="text-muted-foreground">
                  Manpower and hours, weather, work by elevation, inspections,
                  issues and time-stamped photos.
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {[1, 2].map((page) => (
                    <Button
                      key={page}
                      size="sm"
                      variant={reportPage === page ? "primary" : "outline"}
                      aria-pressed={reportPage === page}
                      onClick={() => setReportPage(page)}
                    >
                      Page {page}: {page === 1 ? "Summary" : "Photos & issues"}
                    </Button>
                  ))}
                </div>
              </>
            )}
            <SampleLabel />
          </Card>
          <div aria-live="polite" className="min-w-0">
            <PdfFrame
              name={
                demo === "bid" ? BID_SECTIONS[bid].replace(/ /g, "-") : demo
              }
              pages={
                demo === "report"
                  ? 2
                  : demo === "bid" && [1, 2].includes(bid)
                    ? 2
                    : 1
              }
            >
              {demo === "bid" && <BidDocument index={bid} />}
              {demo === "report" && (
                <DocumentFrame
                  title={`Daily field report · page ${reportPage} of 2`}
                  code="DR-0412"
                >
                  {reportPage === 1 ? (
                    <DailyReport detailed />
                  ) : (
                    <>
                      <div className="grid grid-cols-2 gap-3">
                        {["North N-5", "East E-3", "North N-4", "East E-2"].map(
                          (location, i) => (
                            <SitePhoto
                              key={location}
                              id={`0412-0${i + 1}`}
                              location={location}
                              time={`${9 + i}:15`}
                              caption="Progress and existing conditions, sample frame"
                            />
                          ),
                        )}
                      </div>
                      <DocumentTable
                        headings={["Issue", "Action", "Status"]}
                        rows={[
                          [
                            "I-07 · spalled slab edge",
                            "Consultant notified; awaiting instruction",
                            "Open",
                          ],
                        ]}
                      />
                      <p>
                        Foreman signature: __________________ · Reviewed by:
                        __________________
                      </p>
                    </>
                  )}
                </DocumentFrame>
              )}
              {demo === "closeout" && <CloseoutDocument index={closeout} />}
            </PdfFrame>
          </div>
        </div>
      )}
    </ExplorerTabs>
  );
}
