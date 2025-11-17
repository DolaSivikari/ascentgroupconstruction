import { Card } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";
import { formatCurrency, EstimateResult } from "@/utils/estimator";

interface Step4Props {
  estimate: EstimateResult;
  formData: any;
}

const EstimatorStep4 = ({ estimate, formData }: Step4Props) => {
  const serviceLabels = {
    commercial_construction: "Commercial Construction",
    multi_family_construction: "Multi-Family Construction",
    institutional_construction: "Institutional Construction",
    stucco_eifs: "Stucco / EIFS",
  };

  const finishLabels = {
    standard: "Standard",
    premium: "Premium",
    luxury: "Luxury",
  };

  return (
    <div className="space-y-6">
      <Card className="p-8 bg-gradient-to-br from-primary to-slate-800 text-primary-foreground border-0">
        <div className="text-center">
          <h3 className="text-2xl font-heading font-bold mb-2">Estimated Project Cost</h3>
          <div className="text-5xl md:text-6xl font-bold font-heading text-secondary my-6">
            {formatCurrency(estimate.min)} — {formatCurrency(estimate.max)}
          </div>
          <p className="text-sm opacity-90">
            {estimate.currency} · Taxes not included
          </p>
        </div>
      </Card>

      <Card className="p-6">
        <h4 className="font-heading font-bold text-lg mb-4 text-primary">
          Estimate Breakdown
        </h4>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between py-2 border-b border-border">
            <span className="text-muted-foreground">Service</span>
            <span className="font-medium">{serviceLabels[formData.service as keyof typeof serviceLabels]}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-border">
            <span className="text-muted-foreground">Area</span>
            <span className="font-medium">{formData.sqft} sq ft</span>
          </div>
          <div className="flex justify-between py-2 border-b border-border">
            <span className="text-muted-foreground">Stories</span>
            <span className="font-medium">{formData.stories.replace('_', '+')} story</span>
          </div>
          <div className="flex justify-between py-2 border-b border-border">
            <span className="text-muted-foreground">Finish Quality</span>
            <span className="font-medium">{finishLabels[formData.finishQuality as keyof typeof finishLabels]}</span>
          </div>
          {formData.scaffolding && (
            <div className="flex justify-between py-2 border-b border-border">
              <span className="text-muted-foreground">Scaffolding</span>
              <span className="font-medium">{formData.scaffolding} level</span>
            </div>
          )}
        </div>
      </Card>

      <Card className="p-6 bg-muted/50">
        <h4 className="font-heading font-bold text-lg mb-3 text-primary">
          What's Included
        </h4>
        <ul className="space-y-2">
          {[
            "Professional materials and equipment",
            "Experienced, licensed contractors",
            "Surface preparation and finishing",
            "Quality assurance inspection",
            "Standard warranty coverage",
            "Site cleanup",
          ].map((item) => (
            <li key={item} className="flex items-start gap-2">
              <CheckCircle2 className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
              <span className="text-sm">{item}</span>
            </li>
          ))}
        </ul>
      </Card>

      <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <p className="text-sm text-foreground/80">
          <strong>Note:</strong> {estimate.explanation} This is an estimated range. Final pricing will be determined after an on-site inspection.
        </p>
      </div>
    </div>
  );
};

export default EstimatorStep4;
