import { Fragment, useState } from "react";
import { Link } from "react-router-dom";
import { BUILDING_TYPES, CAPABILITY_MATRIX } from "@/data/capability-matrix";
import { SectionHeader } from "@/design-system/components/SectionHeader";
import { Button } from "@/ui/Button";

export default function CapabilityMatrix() {
  const [category, setCategory] = useState("all");
  const [building, setBuilding] = useState("all");
  const [open, setOpen] = useState<string | null>(null);
  const rows = CAPABILITY_MATRIX.filter(
    (row) =>
      (category === "all" || row.category === category) &&
      (building === "all" ||
        row.buildingTypes.some((type) => type === building)),
  );
  return (
    <>
      <SectionHeader
        badge="Self-perform capabilities"
        title="Capability Matrix"
        description="Scope references in the language of your specifications. Filter by building type, then expand a row for typical inclusions, access and project records."
      />
      <div className="mb-5 flex flex-wrap gap-4">
        <label className="text-sm font-medium">
          Scope category
          <select
            aria-label="Scope category"
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              setOpen(null);
            }}
            className="ml-2 rounded-lg border bg-background p-2"
          >
            <option value="all">All scopes</option>
            <option value="envelope">Building envelope</option>
            <option value="restoration">Restoration</option>
            <option value="interior">Interior & specialty</option>
          </select>
        </label>
        <label className="text-sm font-medium">
          Building type
          <select
            aria-label="Building type"
            value={building}
            onChange={(e) => {
              setBuilding(e.target.value);
              setOpen(null);
            }}
            className="ml-2 rounded-lg border bg-background p-2"
          >
            <option value="all">All buildings</option>
            {BUILDING_TYPES.map((item) => (
              <option key={item.id} value={item.id}>
                {item.label}
              </option>
            ))}
          </select>
        </label>
      </div>
      <p role="status" className="mb-3 text-sm text-muted-foreground">
        {rows.length} scopes shown. Scroll the table sideways on smaller
        screens.
      </p>
      <div
        role="region"
        aria-label="Capability matrix, horizontally scrollable"
        tabIndex={0}
        className="max-w-full overflow-x-auto rounded-lg border focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
      >
        <table className="w-full min-w-[860px] border-collapse text-left text-sm">
          <caption className="sr-only">
            Typical specialty scopes by MasterFormat section and building type;
            expand for scope details.
          </caption>
          <thead className="bg-primary text-primary-foreground">
            <tr>
              {[
                "Spec section",
                "Scope",
                "Delivery",
                ...BUILDING_TYPES.map((item) => item.label),
                "Details",
              ].map((heading) => (
                <th
                  key={heading}
                  scope="col"
                  className="p-3 text-xs font-semibold"
                >
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <Fragment key={row.code}>
                <tr className="border-b bg-background">
                  <th
                    scope="row"
                    className="whitespace-nowrap p-3 text-xs text-primary"
                  >
                    {row.code}
                  </th>
                  <td className="p-3 font-medium">{row.title}</td>
                  <td className="whitespace-nowrap p-3 text-xs">
                    {row.delivery}
                  </td>
                  {BUILDING_TYPES.map((item) => (
                    <td key={item.id} className="p-3 text-center">
                      <span
                        aria-label={
                          row.buildingTypes.includes(item.id)
                            ? "Typical application"
                            : "Not listed"
                        }
                      >
                        {row.buildingTypes.includes(item.id) ? "✓" : "—"}
                      </span>
                    </td>
                  ))}
                  <td className="p-3">
                    <Button
                      size="sm"
                      variant="outline"
                      aria-expanded={open === row.code}
                      aria-controls={`scope-${row.code.replace(/ /g, "")}`}
                      aria-label={`${open === row.code ? "Collapse" : "Expand"} ${row.title}`}
                      onClick={() =>
                        setOpen(open === row.code ? null : row.code)
                      }
                    >
                      {open === row.code ? "−" : "+"}
                    </Button>
                  </td>
                </tr>
                {open === row.code && (
                  <tr id={`scope-${row.code.replace(/ /g, "")}`}>
                    <td colSpan={8} className="bg-muted/30 p-6">
                      <div className="grid gap-6 md:grid-cols-3">
                        <div>
                          <h3 className="font-semibold">Typically included</h3>
                          <ul className="mt-2 list-disc space-y-1 pl-5 text-muted-foreground">
                            {row.included.map((item) => (
                              <li key={item}>{item}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h3 className="font-semibold">Access methods</h3>
                          <p className="mt-2 text-muted-foreground">
                            {row.access}
                          </p>
                        </div>
                        <div>
                          <h3 className="font-semibold">What you receive</h3>
                          <p className="mt-2 text-muted-foreground">
                            {row.deliverables}
                          </p>
                          <Link
                            to={row.serviceHref}
                            className="mt-3 inline-block font-semibold text-primary underline underline-offset-4"
                          >
                            View service details →
                          </Link>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </Fragment>
            ))}
            {!rows.length && (
              <tr>
                <td colSpan={8} className="p-6">
                  No matching scopes. Choose another building type or All
                  scopes.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <p className="mt-4 text-xs text-muted-foreground">
        Typical applications and delivery routes; suitability is confirmed for
        each project. Access and inspection requirements follow the approved
        scope, specification and manufacturer system.
      </p>
    </>
  );
}
