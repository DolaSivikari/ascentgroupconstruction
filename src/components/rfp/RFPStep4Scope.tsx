import { UseFormReturn } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, Clipboard, Eye, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { RFPSubmission } from "@/schemas/rfp-validation";

interface RFPStep4ScopeProps {
  form: UseFormReturn<RFPSubmission>;
}

export const RFPStep4Scope = ({ form }: RFPStep4ScopeProps) => {
  const { register, setValue, watch, formState: { errors } } = form;
  
  const plansAvailable = watch("plans_available");
  const siteVisitRequired = watch("site_visit_required");
  const consent = watch("consent");

  return (
    <Card>
      <CardContent className="p-6 space-y-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 rounded-lg bg-accent/10">
            <Clipboard className="w-6 h-6 text-accent" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Scope of Work</h2>
            <p className="text-sm text-muted-foreground">Describe the project requirements in detail</p>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="scope_of_work" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Detailed Scope of Work *
          </Label>
          <Textarea
            id="scope_of_work"
            {...register("scope_of_work")}
            placeholder="Please provide a detailed description of the work to be performed including:
• Key project objectives
• Major deliverables
• Technical specifications (if available)
• Any unique requirements or challenges
• Preferred materials or systems (if applicable)"
            rows={10}
            className={errors.scope_of_work ? "border-destructive" : ""}
          />
          {errors.scope_of_work && (
            <p className="text-sm text-destructive">{errors.scope_of_work.message}</p>
          )}
          <p className="text-xs text-muted-foreground">
            Minimum 50 characters. The more detail you provide, the more accurate our proposal will be.
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="additional_requirements">
            Additional Requirements or Notes
          </Label>
          <Textarea
            id="additional_requirements"
            {...register("additional_requirements")}
            placeholder="Any other information that would help us prepare an accurate proposal:
• Sustainability requirements (LEED, etc.)
• Union/Non-union preferences
• Safety requirements
• Access limitations
• Coordination with other contractors"
            rows={6}
          />
          {errors.additional_requirements && (
            <p className="text-sm text-destructive">{errors.additional_requirements.message}</p>
          )}
        </div>

        <div className="space-y-4 pt-4 border-t">
          <div className="flex items-start gap-3">
            <Checkbox 
              id="plans_available"
              checked={plansAvailable}
              onCheckedChange={(checked) => setValue("plans_available", checked as boolean)}
            />
            <div className="flex-1">
              <Label 
                htmlFor="plans_available" 
                className="text-base font-medium cursor-pointer flex items-center gap-2"
              >
                <FileText className="w-4 h-4" />
                Architectural/Engineering Plans Available
              </Label>
              <p className="text-sm text-muted-foreground mt-1">
                Check if you have drawings, specifications, or plans to share
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Checkbox 
              id="site_visit_required"
              checked={siteVisitRequired}
              onCheckedChange={(checked) => setValue("site_visit_required", checked as boolean)}
            />
            <div className="flex-1">
              <Label 
                htmlFor="site_visit_required" 
                className="text-base font-medium cursor-pointer flex items-center gap-2"
              >
                <MapPin className="w-4 h-4" />
                Site Visit Required
              </Label>
              <p className="text-sm text-muted-foreground mt-1">
                Check if a site inspection is needed before providing proposal
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4 pt-6 border-t">
          <div className="flex items-start gap-3">
            <Checkbox 
              id="consent"
              checked={consent}
              onCheckedChange={(checked) => setValue("consent", checked as boolean)}
              required
            />
            <div className="flex-1">
              <Label 
                htmlFor="consent" 
                className="text-base font-medium cursor-pointer"
              >
                I consent to Ascent Group Construction contacting me about this RFP *
              </Label>
              <p className="text-sm text-muted-foreground mt-1">
                We'll use your information only to prepare and deliver your proposal. <Link to="/privacy" className="text-primary underline hover:no-underline">Privacy Policy</Link>
              </p>
            </div>
          </div>
          {errors.consent && (
            <p className="text-sm text-destructive">{errors.consent.message}</p>
          )}
        </div>

        <div className="bg-accent/10 border border-accent/20 rounded-lg p-4 mt-6">
          <p className="text-sm text-foreground font-medium mb-2">
            💡 Tips for a Better Proposal
          </p>
          <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
            <li>Include specific square footage and dimensions if known</li>
            <li>Mention any critical deadlines or milestones</li>
            <li>Note if project is phased or single contract</li>
            <li>Specify if owner-supplied materials/equipment</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};
