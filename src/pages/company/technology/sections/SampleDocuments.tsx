import { Camera } from "lucide-react";
import type { ReactNode } from "react";
import {
  RECORD_SHEETS,
  SAMPLE_JOB,
  SITE_PHOTOS,
  type SheetId,
} from "../interactive-data";
import { Elevation, WallDetail } from "./Drawings";

export function SampleLabel() {
  return <p className="tech-sample-label">Sample, not a real project</p>;
}

export function SitePhoto({
  id,
  location,
  time,
  caption,
}: {
  id: string;
  location: string;
  time: string;
  caption: string;
}) {
  const photo = SITE_PHOTOS.find((item) => item.id === id);
  return (
    <figure className="min-w-0">
      <div className="tech-photo-frame">
        {photo ? (
          <img src={photo.src} alt={photo.alt} />
        ) : (
          <>
            <Camera aria-hidden="true" className="h-7 w-7" />
            <span>Site photo placeholder</span>
          </>
        )}
        <small>
          IMG_{id} · {time} · {location}
        </small>
      </div>
      <figcaption className="mt-1 text-xs">{caption}</figcaption>
    </figure>
  );
}

export function DocumentTable({
  headings,
  rows,
}: {
  headings: string[];
  rows: ReactNode[][];
}) {
  return (
    <div className="overflow-x-auto">
      <table className="tech-document-table">
        <thead>
          <tr>
            {headings.map((h) => (
              <th key={h} scope="col">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              {row.map((cell, j) => (
                <td key={j}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function DocumentFrame({
  title,
  code,
  children,
  scale = "NTS",
}: {
  title: string;
  code: string;
  children: ReactNode;
  scale?: string;
}) {
  return (
    <article className="tech-document">
      <header className="flex flex-wrap items-start justify-between gap-3 border-b-2 border-primary pb-3">
        <div className="font-bold tracking-widest text-primary">
          ASCENT
          <small className="block text-[10px] tracking-wider">
            GROUP CONSTRUCTION
          </small>
        </div>
        <div className="text-right">
          <h4 className="font-bold text-primary">{title}</h4>
          <p className="text-xs">
            {SAMPLE_JOB.name} · {SAMPLE_JOB.number}
          </p>
        </div>
      </header>
      <div className="my-4 space-y-4">{children}</div>
      <footer className="tech-title-block">
        <div>
          <strong>{code}</strong>
          <span>{title}</span>
        </div>
        <div>
          Scale: {scale}
          <br />
          Date: {SAMPLE_JOB.date} · Drawn: AGC · Rev: 2
        </div>
      </footer>
      <SampleLabel />
    </article>
  );
}

export function DailyReport({ detailed = false }: { detailed?: boolean }) {
  return (
    <>
      <DocumentTable
        headings={["Project", "Job no.", "Date / location"]}
        rows={[
          [
            SAMPLE_JOB.name,
            SAMPLE_JOB.number,
            "2026-04-14 · North N-5 / East E-3",
          ],
        ]}
      />
      <DocumentTable
        headings={["Weather", "AM", "PM", "Product suitability"]}
        rows={[
          [
            "Conditions",
            "10°C, dry",
            "14°C, cloudy",
            "Verify limits per manufacturer",
          ],
        ]}
      />
      <DocumentTable
        headings={["Manpower", "Crew", "Hours"]}
        rows={[
          ["Foreman", "1", "8"],
          ["Sealant installers", "3", "24"],
          ["EIFS installers", "2", "16"],
          ["Total", "6", "48"],
        ]}
      />
      <DocumentTable
        headings={["Work / elevation", "Today", "To date", "Progress"]}
        rows={[
          ["Sealant removal · North N-5", "92 m", "486 m", "38%"],
          ["Backer rod / primer · North N-5", "94 m", "470 m", "37%"],
          ["Sealant tooled · East E-3", "186 m", "420 m", "33%"],
        ]}
      />
      {detailed && (
        <>
          <DocumentTable
            headings={["Equipment", "Location / inspection"]}
            rows={[
              ["Swing stage SS-1", "East E-3 · pre-use inspection recorded"],
              ["Swing stage SS-2", "North N-5 · pre-use inspection recorded"],
            ]}
          />
          <DocumentTable
            headings={["Materials", "Ticket", "Received"]}
            rows={[
              ["Sealant / backer rod", "SAMPLE-042", "Per delivery docket"],
            ]}
          />
          <p className="text-sm">
            <strong>Safety:</strong> Toolbox talk and stage inspections
            recorded. Visitors: sample consultant, 10:15.
          </p>
          <DocumentTable
            headings={["Issue", "Action", "Status"]}
            rows={[
              [
                "I-07 · spalled slab edge",
                "Photograph and refer to consultant; protect area",
                "Open — await instruction",
              ],
            ]}
          />
        </>
      )}
      <div className="grid grid-cols-2 gap-3">
        {["North N-5", "East E-3"].map((location, i) => (
          <SitePhoto
            key={location}
            id={`0412-0${i + 1}`}
            location={location}
            time={i ? "13:40" : "07:42"}
            caption={
              i
                ? "Existing slab condition referred for review"
                : "Joint preparation before sealant installation"
            }
          />
        ))}
      </div>
      <p className="text-xs">
        Foreman: __________________ · Submitted 16:30 · Reviewed:
        __________________
      </p>
    </>
  );
}

export function SampleDocument({
  sheet,
  compact = false,
}: {
  sheet: SheetId;
  compact?: boolean;
}) {
  const record = RECORD_SHEETS.find((item) => item.id === sheet)!;
  return (
    <DocumentFrame
      title={record.label}
      code={record.code}
      scale={
        sheet === "details" ? "1:5" : sheet === "takeoff" ? "1:100" : "NTS"
      }
    >
      {sheet === "photos" && (
        <div className="grid grid-cols-2 gap-3">
          {Array.from({ length: compact ? 2 : 6 }, (_, i) => (
            <SitePhoto
              key={i}
              id={`001-0${i + 1}`}
              time={`${9 + i}:15`}
              location={`East · L${i + 1}`}
              caption={`P-${i + 1} · Existing condition, sample frame`}
            />
          ))}
        </div>
      )}
      {sheet === "takeoff" && (
        <>
          <Elevation>
            <path
              d="M278 75V350M461 75V350"
              stroke="hsl(var(--brand-accent))"
              strokeWidth="3"
            />
          </Elevation>
          <DocumentTable
            headings={["Quantity", "Unit", "Sample"]}
            rows={[
              ["Joint sealants", "m", "146.0"],
              ["Window perimeters", "ea", "36"],
              ["EIFS net area", "m²", "282.0"],
            ]}
          />
        </>
      )}
      {sheet === "details" && (
        <>
          <WallDetail />
          <p className="text-xs">
            Window jamb: backer rod and sealant joint to approved detail.
            Confirm substrate, flashing continuity and manufacturer
            requirements.
          </p>
          <p className="border border-dashed border-destructive p-2 text-xs">
            △ Rev 2 · Confirm existing conditions; report damaged sheathing
            before covering.
          </p>
        </>
      )}
      {sheet === "report" && <DailyReport />}
      {sheet === "closeout" && (
        <>
          <ol className="space-y-2 text-sm">
            {[
              "Warranty certificates",
              "Product data",
              "As-built markups",
              "Photos by phase",
              "Daily reports",
              "Closed deficiency list",
              "Lien documents",
            ].map((item, i) => (
              <li key={item} className="border-b pb-1">
                {i + 1}. {item}
              </li>
            ))}
          </ol>
          <div className="border-2 border-primary p-4 text-center">
            <strong>WARRANTY CERTIFICATE — SAMPLE</strong>
            <p className="mt-2 text-xs">
              Period and terms per the project contract and manufacturer
              certificate.
            </p>
            <p className="mt-2 text-xs">
              Authorized signature: __________________
            </p>
          </div>
        </>
      )}
    </DocumentFrame>
  );
}
