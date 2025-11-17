import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Link } from "react-router-dom";

interface Step5Props {
  data: {
    name: string;
    email: string;
    phone: string;
    address: string;
    preferredContact: string;
    notes: string;
    consent: boolean;
  };
  onChange: (field: string, value: string | boolean) => void;
}

const EstimatorStep5 = ({ data, onChange }: Step5Props) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-heading font-bold mb-2 text-primary">
          Almost Done!
        </h3>
        <p className="text-muted-foreground">
          Provide your contact information to receive your detailed estimate and schedule a site visit.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="name" className="text-base font-medium mb-2 block">
            Full Name *
          </Label>
          <Input
            id="name"
            placeholder="John Smith"
            value={data.name}
            onChange={(e) => onChange("name", e.target.value)}
            className="h-12"
            required
          />
        </div>

        <div>
          <Label htmlFor="email" className="text-base font-medium mb-2 block">
            Email Address *
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="john@example.com"
            value={data.email}
            onChange={(e) => onChange("email", e.target.value)}
            className="h-12"
            required
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="phone" className="text-base font-medium mb-2 block">
            Phone Number *
          </Label>
          <Input
            id="phone"
            type="tel"
            placeholder="(905) 555-0100"
            value={data.phone}
            onChange={(e) => onChange("phone", e.target.value)}
            className="h-12"
            required
          />
        </div>

        <div>
          <Label htmlFor="preferredContact" className="text-base font-medium mb-2 block">
            Preferred Contact Time
          </Label>
          <Input
            id="preferredContact"
            placeholder="Morning, Afternoon, Evening"
            value={data.preferredContact}
            onChange={(e) => onChange("preferredContact", e.target.value)}
            className="h-12"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="address" className="text-base font-medium mb-2 block">
          Project Address
        </Label>
        <Input
          id="address"
          placeholder="123 Main Street, Mississauga, ON"
          value={data.address}
          onChange={(e) => onChange("address", e.target.value)}
          className="h-12"
        />
      </div>

      <div>
        <Label htmlFor="notes" className="text-base font-medium mb-2 block">
          Additional Notes or Questions
        </Label>
        <Textarea
          id="notes"
          placeholder="Tell us more about your project, preferred timeline, or any specific requirements..."
          value={data.notes}
          onChange={(e) => onChange("notes", e.target.value)}
          className="min-h-[120px]"
        />
      </div>

      <div className="flex items-start gap-3 pt-2">
        <input
          type="checkbox"
          id="consent"
          checked={data.consent}
          onChange={(e) => onChange("consent", e.target.checked)}
          required
          className="mt-1"
        />
        <Label htmlFor="consent" className="text-sm leading-relaxed cursor-pointer">
          I consent to Ascent Group Construction contacting me regarding my project estimate. * <Link to="/privacy" className="text-primary underline hover:no-underline">Privacy Policy</Link>
        </Label>
      </div>

      <div className="bg-muted/50 rounded-lg p-4 text-sm text-muted-foreground">
        <p>
          We respect your privacy and will never share your information with third parties. Your information is only used to provide you with an accurate project estimate.
        </p>
      </div>
    </div>
  );
};

export default EstimatorStep5;
