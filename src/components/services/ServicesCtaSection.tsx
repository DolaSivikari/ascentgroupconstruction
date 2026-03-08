import { Link } from "react-router-dom";
import { Section } from "@/components/sections/Section";
import { TYPOGRAPHY_STYLES } from "@/design-system/constants";
import { Button } from "@/ui/Button";
import { FileText, Calculator, MessageSquare } from "lucide-react";

export const ServicesCtaSection = () => {
  return (
    <Section size="major" className="bg-primary text-primary-foreground">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className={`${TYPOGRAPHY_STYLES.sectionTitle} text-primary-foreground mb-4`}>
          Ready to Scope Your Next Project?
        </h2>
        <p className="text-lg text-primary-foreground/85 mb-10 max-w-2xl mx-auto">
          Whether you have drawings ready or just an idea, we'll help you define scope, timeline, and pricing. Choose the path that fits.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
          <Link to="/submit-rfp" className="group">
            <div className="bg-primary-foreground/10 border border-primary-foreground/20 rounded-[var(--radius-lg)] p-6 hover:bg-primary-foreground/15 transition-colors h-full flex flex-col items-center text-center">
              <FileText className="w-8 h-8 text-primary-foreground mb-3" />
              <h3 className="text-base font-semibold text-primary-foreground mb-1">Submit an RFP</h3>
              <p className="text-xs text-primary-foreground/70">Have drawings or specs ready</p>
            </div>
          </Link>

          <Link to="/estimate" className="group">
            <div className="bg-primary-foreground/10 border border-primary-foreground/20 rounded-[var(--radius-lg)] p-6 hover:bg-primary-foreground/15 transition-colors h-full flex flex-col items-center text-center">
              <Calculator className="w-8 h-8 text-primary-foreground mb-3" />
              <h3 className="text-base font-semibold text-primary-foreground mb-1">Request an Estimate</h3>
              <p className="text-xs text-primary-foreground/70">Get budget-level pricing</p>
            </div>
          </Link>

          <Link to="/contact" className="group">
            <div className="bg-primary-foreground/10 border border-primary-foreground/20 rounded-[var(--radius-lg)] p-6 hover:bg-primary-foreground/15 transition-colors h-full flex flex-col items-center text-center">
              <MessageSquare className="w-8 h-8 text-primary-foreground mb-3" />
              <h3 className="text-base font-semibold text-primary-foreground mb-1">Contact Our Team</h3>
              <p className="text-xs text-primary-foreground/70">Talk to us directly</p>
            </div>
          </Link>
        </div>
      </div>
    </Section>
  );
};
