import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { AlertCircle, CheckCircle2 } from "lucide-react";

interface QuoteRequestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  serviceName: string;
  serviceMessage: {
    title: string;
    description: string;
    ballparkRange?: string;
  };
}

const quoteSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().email("Invalid email").max(255),
  phone: z.string().trim().min(1, "Phone is required").max(20),
  projectDescription: z.string().trim().min(10, "Please provide at least 10 characters").max(2000),
});

export const QuoteRequestDialog = ({
  open,
  onOpenChange,
  serviceName,
  serviceMessage,
}: QuoteRequestDialogProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    projectDescription: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const validatedData = quoteSchema.parse(formData);

      const message = `
Quote Request: ${serviceName}

Project Description:
${validatedData.projectDescription}

Ballpark Range: ${serviceMessage.ballparkRange || "Custom pricing"}
      `.trim();

      const { error } = await supabase.from("contact_submissions").insert({
        name: validatedData.name,
        email: validatedData.email,
        phone: validatedData.phone,
        message: message,
        submission_type: "quote_request",
      });

      if (error) throw error;

      toast({
        title: "Quote Request Submitted!",
        description: "We'll contact you within 24 hours to schedule a consultation.",
      });

      setTimeout(() => {
        onOpenChange(false);
        navigate("/");
      }, 2000);
    } catch (error) {
      console.error("Error submitting quote request:", error);
      
      if (error instanceof z.ZodError) {
        toast({
          title: "Validation Error",
          description: error.errors[0].message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Submission Error",
          description: "Please try again or call us directly.",
          variant: "destructive",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
            {serviceMessage.title}
          </DialogTitle>
          <DialogDescription className="text-left pt-2">
            {serviceMessage.description}
            {serviceMessage.ballparkRange && (
              <div className="mt-3 p-3 bg-muted rounded-md">
                <strong className="text-foreground">Typical Range:</strong>{" "}
                {serviceMessage.ballparkRange}
              </div>
            )}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div>
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="John Doe"
              required
            />
          </div>

          <div>
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="john@example.com"
              required
            />
          </div>

          <div>
            <Label htmlFor="phone">Phone *</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="(647) 123-4567"
              required
            />
          </div>

          <div>
            <Label htmlFor="projectDescription">Project Description *</Label>
            <Textarea
              id="projectDescription"
              value={formData.projectDescription}
              onChange={(e) =>
                setFormData({ ...formData, projectDescription: e.target.value })
              }
              placeholder="Tell us about your project: location, size, timeline, special requirements..."
              rows={4}
              required
              className="resize-none"
            />
            <p className="text-sm text-muted-foreground mt-1">
              Minimum 10 characters
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-secondary hover:bg-secondary/90"
            >
              {isSubmitting ? (
                "Submitting..."
              ) : (
                <>
                  Request Quote
                  <CheckCircle2 className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
