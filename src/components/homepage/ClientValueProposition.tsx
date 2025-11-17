import { Building2, Home, CheckCircle2, Award } from "lucide-react";
import { Button } from "@/ui/Button";
import { Link } from "react-router-dom";
import ClientSegmentCard from "./ClientSegmentCard";
import { SectionBadge } from "@/components/ui/SectionBadge";
import { Section } from "@/components/sections/Section";

const ClientValueProposition = () => {

  return (
    <Section size="major" className="bg-background">
      <div className="max-w-4xl mb-12">
        <SectionBadge icon={Award} text="Why Choose Us" />
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
          Why Clients Choose Us
        </h2>
        <p className="text-xl md:text-2xl text-foreground font-semibold mb-6">
          Building envelope performance is non‑negotiable—and <span className="text-construction-orange">accountability</span> is everything.
        </p>
        
        <div className="space-y-4 mb-8">
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
              Developers, general contractors, property managers, and asset owners choose <span className="text-foreground font-semibold">Ascent Group Construction</span> for <span className="text-foreground font-semibold">specialized envelope & restoration</span> delivery across Toronto (GTA) and the Golden Horseshoe. We act as the <span className="text-foreground font-semibold">lead contractor</span> for façade remediation, waterproofing, sealants/caulking, EIFS/stucco, masonry restoration, concrete and <span className="text-foreground font-semibold">parking‑garage repair</span>—coordinating access and safety, <span className="text-foreground font-semibold">self‑performing key trades</span>, and communicating clearly from <span className="text-foreground font-semibold">site walk to closeout</span>.
            </p>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
              We follow consultant/engineer‑of‑record (EOR) details, document work with <span className="text-foreground font-semibold">photo logs/ITPs</span>, and provide <span className="text-foreground font-semibold">applicable manufacturer and workmanship warranties</span>.
            </p>
          </div>

          {/* Benefit Bullets */}
          <div className="grid md:grid-cols-2 gap-4 mb-8">
            {[
              { title: "Prime accountability for envelope scopes", desc: "One team, one contract, one responsible point of contact." },
              { title: "Self‑performed core trades", desc: "Sealants/caulking, EIFS & stucco, masonry repairs, waterproofing & protective coatings, concrete and parking‑garage rehabilitation." },
              { title: "Consultant/EOR‑aligned execution", desc: "We build to drawings and specs, submit materials, and document compliance." },
              { title: "Documented QA/QC", desc: "Photo logs, inspection records (ITPs when requested), clear punch‑list closeout." },
              { title: "Occupied‑building expertise", desc: "Safe access, phasing, tenant coordination, off‑hours where needed." },
              { title: "Responsive by design", desc: "48–72‑hour site walks, fast submittals, and unit pricing for GC trade packages." },
          { title: "Local coverage", desc: "Toronto, Mississauga, Brampton, Vaughan/Markham, Oakville/Burlington, Hamilton." },
            ].map((benefit, index) => (
              <div key={index} className="flex gap-3 p-4 rounded-lg bg-muted/30 border border-border/50 hover:bg-muted/40 hover:border-border/70 transition-all duration-300">
                <CheckCircle2 className="w-5 h-5 text-construction-orange flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-foreground text-base mb-1">{benefit.title}</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">{benefit.desc}</p>
                </div>
              </div>
            ))}
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row flex-wrap gap-4">
            <Button asChild size="lg" className="bg-construction-orange hover:bg-construction-orange/90">
              <Link to="/contact">Request Site Assessment</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/services">View Services</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
            <Link to="/contact">For GCs: Request Unit Pricing</Link>
          </Button>
        </div>
      </div>

      {/* Who We Serve Section */}
      <div className="mt-16 pt-12 border-t border-border/50">
        <div className="max-w-3xl mb-8">
          <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 leading-tight">
            Who We Serve
          </h3>
          <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
            Specialized envelope solutions tailored to your project requirements.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
            <ClientSegmentCard
              icon={Building2}
              title="Developers & Building Owners"
              services={[
                "New‑build envelope systems (EIFS, cladding, waterproofing)",
                "Multi‑family & commercial façade installation",
                "Warranty‑backed envelope delivery",
                "Unit pricing for GC trade packages",
              ]}
              ctaText="View Services"
              ctaUrl="/services"
            />

            <ClientSegmentCard
              icon={Home}
              title="Property Managers & Asset Owners"
              services={[
                "Façade restoration & parking‑garage repair",
                "Emergency water intrusion response (48–72h)",
                "Capital planning & phased rehabilitation",
                "Occupied‑building expertise",
              ]}
              ctaText="Request Site Assessment"
            ctaUrl="/contact"
          />
        </div>
      </div>
    </Section>
  );
};

export default ClientValueProposition;
