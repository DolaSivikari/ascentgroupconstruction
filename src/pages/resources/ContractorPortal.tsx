import { useState } from "react";
import { Shield, FileText, Download, Package, CheckCircle2, Award, Building2, Truck, Users, HardHat } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import SEO from "@/components/SEO";
import { supabase } from "@/integrations/supabase/client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { PremiumDocumentSuite } from "@/components/contractor/PremiumDocumentSuite";
import { InsuranceCalculator } from "@/components/calculators/InsuranceCalculator";
import { BondingCapacityVisualizer } from "@/components/calculators/BondingCapacityVisualizer";
import { ProjectTimelineEstimator } from "@/components/calculators/ProjectTimelineEstimator";
import { CertificationBadges } from "@/components/shared/CertificationBadges";
import { AnimatedCounter } from "@/components/shared/AnimatedCounter";
import heroContractorImage from "@/assets/heroes/hero-contractor-portal.jpg";

const ContractorPortal = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    projectDetails: "",
    documents: [] as string[],
    honeypot: "" // Honeypot for bot detection
  });

  const [lastSubmitTime, setLastSubmitTime] = useState<number>(0);

  const documents = [
    { name: "Certificate of Insurance", icon: Shield, size: "2MB", description: "Current liability coverage" },
    { name: "WSIB Clearance Certificate", icon: CheckCircle2, size: "1MB", description: "Valid workplace safety clearance" },
    { name: "Bonding Letter", icon: Award, size: "500KB", description: "Bonding capacity confirmation" },
    { name: "Business License", icon: FileText, size: "1MB", description: "Current business registration" },
    { name: "Company Profile & Capabilities", icon: Building2, size: "5MB", description: "Detailed company overview" },
    { name: "Safety Manual & Certifications", icon: HardHat, size: "3MB", description: "Safety policies and COR certification" },
    { name: "Project References List", icon: Users, size: "2MB", description: "Recent project references" },
    { name: "Equipment Inventory", icon: Truck, size: "2MB", description: "Available equipment and resources" },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Client-side rate limiting
    const now = Date.now();
    if (now - lastSubmitTime < 10000) {
      toast({
        title: "Slow down!",
        description: "Please wait a moment before submitting again.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Format documents list
      const documentsRequested = formData.documents.length > 0
        ? `Requested Documents:\n${formData.documents.map(doc => `• ${doc}`).join('\n')}`
        : "Complete package requested";

      // Combine project details with documents
      const fullMessage = formData.projectDetails
        ? `${formData.projectDetails}\n\n${documentsRequested}`
        : documentsRequested;

      // Submit via edge function with bot protection
      const { error } = await supabase.functions.invoke('submit-form', {
        body: {
          formType: 'prequalification',
          data: {
            contactName: formData.name,
            companyName: formData.company,
            email: formData.email,
            phone: formData.phone,
            projectType: "custom_package",
            message: fullMessage
          },
          honeypot: formData.honeypot
        }
      });

      if (error) {
        if (error.message?.includes('Rate limit exceeded')) {
          toast({
            title: "Too many submissions",
            description: "Please try again in a few minutes.",
            variant: "destructive",
          });
          return;
        }
        throw error;
      }

      toast({
        title: "Request submitted!",
        description: "We'll send your custom package within 24 hours.",
      });

      // Reset form
      setFormData({
        name: "",
        company: "",
        email: "",
        phone: "",
        projectDetails: "",
        documents: [],
        honeypot: ""
      });
      setLastSubmitTime(now);
    } catch (error) {
      console.error("Error submitting request:", error);
      toast({
        title: "Submission failed",
        description: "Please try again or contact us directly.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleDocument = (docName: string) => {
    setFormData(prev => ({
      ...prev,
      documents: prev.documents.includes(docName)
        ? prev.documents.filter(d => d !== docName)
        : [...prev.documents, docName]
    }));
  };

  return (
    <>
      <SEO 
        title="Contractor Portal | Ascent Group Construction"
        description="Access our complete contractor documentation package including insurance certificates, WSIB clearance, bonding letters, and company profile."
        keywords="contractor portal, bid documents, insurance certificates, WSIB, bonding, subcontractor"
      />
      <div className="min-h-screen bg-background relative overflow-hidden">
        {/* Background decorations */}
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
          <div className="absolute top-1/3 -right-40 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/3 -left-40 w-[600px] h-[600px] bg-secondary/5 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>

        <Navigation />
        
        <PageHeader
          title="Contractor Portal"
          description="Everything you need to bid with confidence"
          backgroundImage={heroContractorImage}
        />

        <main id="main-content" className="container mx-auto px-4 py-12 space-y-12">
          {/* Introduction */}
          <section className="text-center max-w-3xl mx-auto">
            <p className="text-lg text-muted-foreground">
              Download our complete contractor package or request specific documents for your RFP. All documentation is current and updated regularly.
            </p>
          </section>

          <PremiumDocumentSuite />

          {/* Request Custom Package Form */}
          <section className="bg-muted/30 rounded-lg p-8">
            <h2 className="text-3xl font-bold text-foreground mb-2">Request Custom Package</h2>
            <p className="text-muted-foreground mb-8">Need specific documents for your RFP? Let us know what you need.</p>
            
            <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="company">Company *</Label>
                  <Input
                    id="company"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="projectDetails">Project Details</Label>
                <Textarea
                  id="projectDetails"
                  value={formData.projectDetails}
                  onChange={(e) => setFormData({ ...formData, projectDetails: e.target.value })}
                  placeholder="Tell us about your project and timeline..."
                  rows={4}
                />
              </div>

              <div>
                <Label className="mb-3 block">Documents Needed</Label>
                <div className="grid md:grid-cols-2 gap-3">
                  {documents.map((doc) => (
                    <div key={doc.name} className="flex items-center space-x-2">
                      <Checkbox
                        id={doc.name}
                        checked={formData.documents.includes(doc.name)}
                        onCheckedChange={() => toggleDocument(doc.name)}
                      />
                      <Label htmlFor={doc.name} className="text-sm cursor-pointer">
                        {doc.name}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Honeypot field - hidden from users */}
              <div style={{ position: 'absolute', left: '-9999px' }} aria-hidden="true">
                <Input
                  type="text"
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                  value={formData.honeypot}
                  onChange={(e) => setFormData({ ...formData, honeypot: e.target.value })}
                />
              </div>

              <Button type="submit" size="lg" className="w-full md:w-auto" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit Request"}
              </Button>
            </form>
          </section>

          {/* Interactive Calculators */}
          <section className="bg-muted/30 rounded-lg p-8">
            <h2 className="text-3xl font-bold text-foreground mb-8 text-center">Project Planning Tools</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <InsuranceCalculator />
              <BondingCapacityVisualizer />
              <ProjectTimelineEstimator />
            </div>
          </section>

          {/* Certifications */}
          <section className="text-center">
            <h2 className="text-3xl font-bold mb-8">Our Credentials</h2>
            <CertificationBadges size="lg" />
          </section>

          {/* Why Partner Section */}
          <section>
            <h2 className="text-3xl font-bold text-foreground mb-8 text-center">Why Partner With Us</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group border-2 hover:border-primary/30 animate-fade-in-up">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/70 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <CheckCircle2 className="h-8 w-8 text-secondary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">Proven Track Record</h3>
                  <p className="text-muted-foreground">
                    <AnimatedCounter target={1000} suffix="+" className="font-bold text-2xl text-primary" /> units completed annually with consistent quality
                  </p>
                </CardContent>
              </Card>
              <Card className="hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group border-2 hover:border-primary/30 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/70 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Award className="h-8 w-8 text-secondary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">Financial Strength</h3>
                  <p className="text-muted-foreground">$5M liability, $10M bonding capacity per project</p>
                </CardContent>
              </Card>
              <Card className="hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group border-2 hover:border-primary/30 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/70 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Shield className="h-8 w-8 text-secondary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">Safety First</h3>
                  <p className="text-muted-foreground">COR certified with zero lost-time incidents</p>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* FAQ Section */}
          <section>
            <h2 className="text-3xl font-bold text-foreground mb-8">Frequently Asked Questions</h2>
            <Accordion type="single" collapsible className="max-w-3xl">
              <AccordionItem value="item-1">
                <AccordionTrigger>How current are these documents?</AccordionTrigger>
                <AccordionContent>
                  All documents are updated monthly. Insurance certificates and WSIB clearances are always current. We recommend downloading fresh copies for each RFP submission.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>Do you provide project-specific documentation?</AccordionTrigger>
                <AccordionContent>
                  Yes! Use the custom package request form to specify your project requirements. We can provide tailored documentation including project-specific references, equipment lists, and safety plans.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger>What's your typical response time for RFPs?</AccordionTrigger>
                <AccordionContent>
                  We typically respond to RFPs within 3-5 business days. For urgent bids, we can accommodate faster turnarounds with advance notice.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-4">
                <AccordionTrigger>Do you offer design-build services?</AccordionTrigger>
                <AccordionContent>
                  Yes, we provide full design-build services for painting, restoration, and building envelope projects. Our team can work with your specifications or develop complete solutions from concept to completion.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default ContractorPortal;
