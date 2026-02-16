import { FileText, Download, ArrowRight } from "lucide-react";
import { Button } from "@/ui/Button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";

const PrequalPackage = () => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    companyName: "", contactName: "", email: "", phone: "",
    projectType: "", projectValueRange: "", message: "", honeypot: ""
  });
  const [lastSubmitTime, setLastSubmitTime] = useState<number>(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const now = Date.now();
    if (now - lastSubmitTime < 10000) {
      toast({ title: "Slow down!", description: "Please wait a moment before submitting again.", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.functions.invoke('submit-form', {
        body: { formType: 'prequalification', data: { companyName: formData.companyName, contactName: formData.contactName, email: formData.email, phone: formData.phone, projectType: formData.projectType, projectValueRange: formData.projectValueRange, message: formData.message }, honeypot: formData.honeypot }
      });
      if (error) {
        if (error.message?.includes('Rate limit exceeded')) {
          toast({ title: "Too many submissions", description: "Please try again in a few minutes.", variant: "destructive" });
          return;
        }
        throw error;
      }
      toast({ title: "Request Submitted", description: "We'll send the vendor information package to your email within 1-2 business days." });
      setOpen(false);
      setFormData({ companyName: "", contactName: "", email: "", phone: "", projectType: "", projectValueRange: "", message: "", honeypot: "" });
      setLastSubmitTime(now);
    } catch (error) {
      toast({ title: "Submission Failed", description: "Please try again or contact us directly.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-16 md:py-20 border-t border-border/30">
      <div className="container mx-auto px-6 md:px-8 max-w-5xl">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="max-w-xl">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
              Vendor Information Package
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Request our comprehensive vendor packet for qualification and RFP processes.
            </p>
          </div>
          
          <div className="flex items-center gap-4 flex-shrink-0">
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button size="lg" variant="primary">
                  <Download className="w-4 h-4 mr-2" />
                  Request Packet
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Request Vendor Information Package</DialogTitle>
                  <DialogDescription>Fill out the form below and we'll send the vendor packet to your email within 1-2 business days.</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div><Label htmlFor="companyName">Company Name *</Label><Input id="companyName" required value={formData.companyName} onChange={(e) => setFormData({ ...formData, companyName: e.target.value })} /></div>
                  <div><Label htmlFor="contactName">Contact Name *</Label><Input id="contactName" required value={formData.contactName} onChange={(e) => setFormData({ ...formData, contactName: e.target.value })} /></div>
                  <div><Label htmlFor="email">Email *</Label><Input id="email" type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} /></div>
                  <div><Label htmlFor="phone">Phone</Label><Input id="phone" type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} /></div>
                  <div><Label htmlFor="projectType">Project Type</Label><Select value={formData.projectType} onValueChange={(value) => setFormData({ ...formData, projectType: value })}><SelectTrigger><SelectValue placeholder="Select project type" /></SelectTrigger><SelectContent><SelectItem value="commercial">Commercial</SelectItem><SelectItem value="residential">Residential</SelectItem><SelectItem value="industrial">Industrial</SelectItem><SelectItem value="institutional">Institutional</SelectItem></SelectContent></Select></div>
                  <div><Label htmlFor="projectValueRange">Estimated Project Value</Label><Select value={formData.projectValueRange} onValueChange={(value) => setFormData({ ...formData, projectValueRange: value })}><SelectTrigger><SelectValue placeholder="Select value range" /></SelectTrigger><SelectContent><SelectItem value="under-50k">Under $50,000</SelectItem><SelectItem value="50k-100k">$50,000 - $100,000</SelectItem><SelectItem value="100k-250k">$100,000 - $250,000</SelectItem><SelectItem value="250k-500k">$250,000 - $500,000</SelectItem><SelectItem value="over-500k">Over $500,000</SelectItem></SelectContent></Select></div>
                  <div><Label htmlFor="message">Additional Information</Label><Textarea id="message" rows={3} value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} placeholder="Any specific requirements or questions?" /></div>
                  <input type="text" name="honeypot" value={formData.honeypot} onChange={(e) => setFormData({ ...formData, honeypot: e.target.value })} className="hidden" tabIndex={-1} autoComplete="off" />
                  <Button type="submit" disabled={loading} className="w-full" variant="primary">{loading ? "Submitting..." : "Submit Request"}</Button>
                </form>
              </DialogContent>
            </Dialog>
            
            <Button asChild variant="outline" size="lg">
              <Link to="/prequalification">
                Learn More
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PrequalPackage;
