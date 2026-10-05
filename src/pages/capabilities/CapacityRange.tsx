import { Link } from "react-router-dom";
import { Card } from "@/design-system/components/Card";
import { SectionHeader } from "@/design-system/components/SectionHeader";
import { Button } from "@/ui/Button";

export default function CapacityRange() {
  return (
    <>
      <SectionHeader
        badge="Project capacity"
        title="Project size and capacity"
        description="We're structured to handle projects across a broad range — from emergency repairs to multi-phase restoration programs."
        align="left"
      />
      <Card className="mb-6">
        <p className="mb-4 text-sm font-semibold">
          Current project range · $25K – $500K
        </p>
        <div
          aria-hidden="true"
          className="h-2 rounded-full bg-[hsl(var(--brand-accent))]"
        />
        <div className="mt-4 grid grid-cols-3 gap-4 text-xs">
          <div>
            <strong>$25K</strong>
            <p className="mt-2">Emergency & spot repairs</p>
          </div>
          <div className="text-center">
            <strong>Mid-range</strong>
            <p className="mt-2">Sealant replacement & envelope scopes</p>
          </div>
          <div className="text-right">
            <strong>$500K</strong>
            <p className="mt-2">Multi-phase restoration programs</p>
          </div>
        </div>
        <p className="mt-4 text-sm text-muted-foreground">
          Emergency repairs through multi-phase restoration programs. Sweet spot
          is mid-range envelope and interior scopes for property managers and
          GCs.
        </p>
      </Card>
      <div className="mb-6 grid gap-6 md:grid-cols-3">
        <Card>
          <p className="mb-3 text-xs uppercase tracking-wider text-primary">
            Team
          </p>
          <h3 className="text-xl font-semibold">15+ Years</h3>
          <p className="mt-1 text-sm font-medium">Combined Crew Experience</p>
          <p className="mt-3 text-sm text-muted-foreground">
            Prior roles on major GTA developments and restoration projects. Our
            crew brings the experience of larger firms to every job.
          </p>
        </Card>
        <Card>
          <p className="mb-3 text-xs uppercase tracking-wider text-primary">
            Coverage
          </p>
          <h3 className="text-xl font-semibold">$2M CGL</h3>
          <p className="mt-1 text-sm font-medium">Liability Coverage</p>
          <p className="mt-3 text-sm text-muted-foreground">
            WSIB active clearance, $2M commercial general liability. All
            documentation available on request.
          </p>
        </Card>
        <Card>
          <p className="mb-3 text-xs uppercase tracking-wider text-primary">
            Bonding
          </p>
          <h3 className="text-xl font-semibold">Growing bonding capacity</h3>
          <p className="mt-3 text-sm text-muted-foreground">
            All documentation available on request.
          </p>
        </Card>
      </div>
      <Button asChild variant="outline">
        <Link to="/prequalification">View Pre-Qualification Package →</Link>
      </Button>
    </>
  );
}
