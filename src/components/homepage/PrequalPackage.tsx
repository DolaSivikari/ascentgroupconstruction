import { FileText, Download, CheckCircle, ArrowRight, Shield, Award, Users, Building2, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";
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
import { SectionBadge } from "@/components/ui/SectionBadge";
import { Section } from "@/components/sections/Section";

const packageItems = [
  { icon: Shield, label: "Insurance & Licensing", desc: "WSIB registration in progress, business liability coverage" },
  { icon: Users, label: "Crew & Trade Capabilities", desc: "10-person self-performed crew for envelope trades" },
  { icon: Building2, label: "Project Examples", desc: "Completed envelope & restoration work in GTA" },
  { icon: CheckCircle, label: "Work Documentation", desc: "Photo logs, submittal tracking, punch-list closeout" },
  { icon: FileText, label: "Scope-Specific Qualifications", desc: "Trade certifications and manufacturer training as applicable" },
  { icon: Clock, label: "Response Standards", desc: "48-72 hour site walks, clear communication protocols" },
];

const stats = [
  { value: "15+", label: "Years Experience" },
  { value: "10", label: "Crew Members" },
  { value: "10+", label: "Projects Completed" },
  { value: "GTA", label: "Service Area" },
];

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
    <Section size="major" className="bg-gradient-to-b from-background via-muted/20 to-background">
      <div className="max-w-3xl mb-12">
        <SectionBadge icon={FileText} text="Vendor Package" />
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">Vendor Information Package</h2>
        <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed">Request our comprehensive vendor information package for qualification and RFP processes.</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        {stats.map((stat, index) => (
          <div key={index} className="text-center p-4 rounded-lg bg-muted/30 border border-border/50 hover:bg-muted/40 hover:border-border/70 transition-all duration-300">
            <div className="text-3xl md:text-4xl font-bold text-construction-orange mb-1">{stat.value}</div>
            <div className="text-sm font-medium text-muted-foreground">{stat.label}</div>
          </div>
        ))}
      </div>
      <Card className="border-2 border-construction-orange/20 shadow-xl overflow-hidden bg-gradient-to-br from-background to-muted/30">
        <div className="grid lg:grid-cols-2 gap-0">
          <div className="p-8 space-y-4">
            <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-6">Package Contents</h3>
            <div className="space-y-3">
              {packageItems.map((item, index) => {
                const Icon = item.icon;
                return (
                  <div key={index} className="flex gap-3 p-4 rounded-lg bg-muted/30 border border-border/50 hover:bg-muted/40 hover:border-border/70 transition-all duration-300">
                    <Icon className="w-5 h-5 text-construction-orange flex-shrink-0 mt-1" />
                    <div>
                      <div className="font-semibold text-foreground text-base mb-1">{item.label}</div>
                      <div className="text-sm text-muted-foreground leading-relaxed">{item.desc}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="p-8 flex flex-col justify-center items-center text-center space-y-6 lg:border-l lg:border-border/30">
            <div className="w-20 h-20 rounded-2xl bg-construction-orange/10 flex items-center justify-center mb-2 hover:bg-construction-orange/20 transition-colors duration-300">
              <FileText className="w-10 h-10 text-construction-orange" />
            </div>
            <div>
              <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-3">Request Vendor Packet</h3>
              <p className="text-base md:text-lg text-muted-foreground mb-6 leading-relaxed">Get comprehensive company information for your qualification process.</p>
            </div>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button size="lg" className="w-full sm:w-auto bg-construction-orange hover:bg-construction-orange/90 shadow-lg hover:shadow-xl transition-all duration-300">
                  <Download className="w-4 h-4 mr-2" />Request Vendor Packet
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
                  <Button type="submit" disabled={loading} className="w-full bg-construction-orange hover:bg-construction-orange/90">{loading ? "Submitting..." : "Submit Request"}</Button>
                </form>
              </DialogContent>
            </Dialog>
            <Button size="lg" variant="outline" asChild className="w-full sm:w-auto border-construction-orange/30 hover:border-construction-orange/50 transition-all duration-300">
              <Link to="/prequalification">View Detailed Information<ArrowRight className="ml-2 w-4 h-4" /></Link>
            </Button>
          </div>
        </div>
      </Card>
      <div className="mt-12 pt-12 border-t border-border/30">
        <h3 className="text-xl md:text-2xl font-bold text-foreground mb-6 text-center">Related Resources</h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[{ icon: Building2, label: "View Projects", href: "/projects" }, { icon: Shield, label: "Capabilities", href: "/capabilities" }, { icon: FileText, label: "Contact Us", href: "/contact" }, { icon: Award, label: "About Us", href: "/about" }].map((link, index) => {
            const Icon = link.icon;
            return (<Button key={index} asChild variant="outline" className="h-auto py-4 flex flex-col items-center gap-2 border-construction-orange/30 hover:border-construction-orange/50 hover:bg-construction-orange/5 transition-all duration-300"><Link to={link.href}><Icon className="w-5 h-5 text-construction-orange" /><span className="text-sm font-medium">{link.label}</span></Link></Button>);
          })}
        </div>
      </div>
    </Section>
  );
};

export default PrequalPackage;
