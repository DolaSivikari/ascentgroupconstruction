import { Shield, Users, Award } from "lucide-react";
import { ProofStrip } from "@/design-system/components";

const trustItems = [
  { icon: Shield, value: "$2M Insured", label: "CGL Coverage" },
  { icon: Users, value: "15+ Years", label: "Crew Experience" },
  { icon: Award, value: "WSIB Compliant", label: "Active Clearance" },
];

export const TrustBadgeBar = () => {
  return (
    <section className="py-6">
      <div className="container mx-auto px-4">
        <ProofStrip items={trustItems} variant="light" columns={3} />
      </div>
    </section>
  );
};
