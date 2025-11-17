import { UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Building2, User, Mail, Phone } from "lucide-react";
import { RFPSubmission } from "@/schemas/rfp-validation";

interface RFPStep1CompanyProps {
  form: UseFormReturn<RFPSubmission>;
}

export const RFPStep1Company = ({ form }: RFPStep1CompanyProps) => {
  const { register, formState: { errors } } = form;

  return (
    <Card>
      <CardContent className="p-6 space-y-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 rounded-lg bg-primary/10">
            <Building2 className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Company Information</h2>
            <p className="text-sm text-muted-foreground">Tell us about your organization</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="company_name" className="flex items-center gap-2">
              <Building2 className="w-4 h-4" />
              Company Name *
            </Label>
            <Input
              id="company_name"
              {...register("company_name")}
              placeholder="Your Company Inc."
              className={errors.company_name ? "border-destructive" : ""}
            />
            {errors.company_name && (
              <p className="text-sm text-destructive">{errors.company_name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="contact_name" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              Contact Name *
            </Label>
            <Input
              id="contact_name"
              {...register("contact_name")}
              placeholder="John Smith"
              className={errors.contact_name ? "border-destructive" : ""}
            />
            {errors.contact_name && (
              <p className="text-sm text-destructive">{errors.contact_name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Email Address *
            </Label>
            <Input
              id="email"
              type="email"
              {...register("email")}
              placeholder="john@company.com"
              className={errors.email ? "border-destructive" : ""}
            />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="flex items-center gap-2">
              <Phone className="w-4 h-4" />
              Phone Number *
            </Label>
            <Input
              id="phone"
              {...register("phone")}
              placeholder="(647) 123-4567"
              className={errors.phone ? "border-destructive" : ""}
            />
            {errors.phone && (
              <p className="text-sm text-destructive">{errors.phone.message}</p>
            )}
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="title">
              Title / Position
            </Label>
            <Input
              id="title"
              {...register("title")}
              placeholder="Project Manager"
            />
          </div>
        </div>

        <div className="bg-muted/50 border border-border rounded-lg p-4 mt-6">
          <p className="text-sm text-muted-foreground">
            <strong className="text-foreground">Privacy Notice:</strong> Your information is secure and will only be used to respond to your RFP. We never share contact details with third parties.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
