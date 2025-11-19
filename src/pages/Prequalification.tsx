import { useState, useEffect } from "react";
import { Download, FileText, Shield, CheckCircle2, ArrowRight, Award, Building2, TrendingUp, Users, Calendar, DollarSign, MapPin, Phone, Mail, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";
import { EmailLink } from "@/components/EmailLink";
import { Button } from "@/ui/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SEO from "@/components/SEO";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import heroImage from "@/assets/heroes/hero-certifications.jpg";

interface Document {
  id: string;
  title: string;
  description: string | null;
  category: string;
  file_url: string;
  file_name: string;
  version: string;
}

const categoryLabels: Record<string, string> = {
  prequalification: "Pre-Qualification",
  insurance: "Insurance",
  "capability-statement": "Capability Statement",
  safety: "Safety",
  certifications: "Certifications",
  other: "Other"
};

const categoryIcons: Record<string, any> = {
  prequalification: FileText,
  insurance: Shield,
  "capability-statement": FileText,
  safety: CheckCircle2,
  certifications: Shield,
  other: FileText
};

const companyHighlights = [
  { icon: Calendar, label: "Team Experience", value: "15+ Years", desc: "Combined hands-on experience in GTA market" },
  { icon: Building2, label: "Company Status", value: "Est. 2025", desc: "New incorporation, experienced crew" },
  { icon: Shield, label: "Insurance Coverage", value: "$2M CGL", desc: "General liability + WSIB compliant" },
  { icon: Award, label: "Safety Commitment", value: "COR-Ready", desc: "Working toward COR certification" },
  { icon: DollarSign, label: "Project Range", value: "$25K-$500K", desc: "Building portfolio of specialty work" },
  { icon: Users, label: "Core Crew", value: "10 Skilled", desc: "Self-perform team + trusted partners" },
];

const capabilities = [
  { category: "Primary Service Delivery", items: ["Lead Specialty Contractor (Building Envelope & Interior Trades)", "Self-Performed Envelope Restoration & Waterproofing", "Subcontractor to General Contractors", "Direct-to-Owner Trade Execution"] },
  { category: "Core Self-Perform Trades", items: ["EIFS & Stucco Installation/Repair", "Masonry Restoration & Tuckpointing", "Caulking/Sealant Replacement", "Exterior Cladding Systems", "Interior Painting & Finishing", "Tile & Flooring Installation", "Drywall & Finishing"] },
  { category: "Target Markets", items: ["Commercial Building Envelope (Subcontractor Role)", "Multi-Family Restoration (Property Managers)", "Residential Renovations (Homeowners)", "Institutional Maintenance (Through GCs)"] },
  { category: "Current Project Capacity", items: ["$25K - $500K single project value", "Multiple small-to-mid projects concurrent", "Building portfolio + client relationships", "Emergency response for existing clients"] },
];

const recentProjects = [
  {
    name: "Multi-Unit EIFS Repair",
    client: "Private Property Manager",
    sector: "Multi-Family Residential",
    value: "$85K",
    year: "2024 (Pre-Incorporation)",
    scope: "EIFS damage repair, caulking replacement, color-matched finishing"
  },
  {
    name: "Commercial Storefront Renovation",
    client: "Retail Business Owner",
    sector: "Commercial",
    value: "$45K",
    year: "2024 (Pre-Incorporation)",
    scope: "Interior painting, drywall repair, ceiling finishing, floor prep"
  },
  {
    name: "Condo Balcony Waterproofing",
    client: "Condo Corporation (Through GC)",
    sector: "Multi-Family",
    value: "$35K",
    year: "2023 (Team Experience)",
    scope: "Balcony membrane replacement, railing refinishing, drainage correction"
  },
];

function DownloadableDocuments() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const { data, error } = await supabase
        .from('documents_library')
        .select('id, title, description, category, file_url, file_name, version')
        .eq('is_active', true)
        .eq('requires_authentication', false)
        .order('category')
        .order('display_order');

      if (error) throw error;
      setDocuments(data || []);
    } catch (error: any) {
      console.error('Error fetching documents:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (doc: Document) => {
    try {
      // Log download
      await supabase.from('document_access_log').insert({
        document_id: doc.id,
        ip_address: null,
        user_agent: navigator.userAgent
      });

      // Increment download count
      const { data: currentDoc } = await supabase
        .from('documents_library')
        .select('download_count')
        .eq('id', doc.id)
        .single();

      if (currentDoc) {
        await supabase
          .from('documents_library')
          .update({ download_count: (currentDoc.download_count || 0) + 1 })
          .eq('id', doc.id);
      }

      // Open file
      window.open(doc.file_url, '_blank');
    } catch (error: any) {
      toast({ title: "Error", description: "Failed to download document", variant: "destructive" });
    }
  };

  const groupedDocuments = documents.reduce((acc, doc) => {
    if (!acc[doc.category]) {
      acc[doc.category] = [];
    }
    acc[doc.category].push(doc);
    return acc;
  }, {} as Record<string, Document[]>);

  return (
    <div className="space-y-6">
      {loading ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading documents...</p>
        </div>
      ) : documents.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">
              Documents are being prepared. Please contact us for immediate access.
            </p>
            <Button asChild>
              <Link to="/contact">Contact Us</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        Object.entries(groupedDocuments).map(([category, docs]) => {
          const Icon = categoryIcons[category] || FileText;
          return (
            <div key={category}>
              <div className="flex items-center gap-2 mb-4">
                <Icon className="w-5 h-5 text-primary" />
                <h3 className="text-xl font-semibold text-foreground">{categoryLabels[category]}</h3>
              </div>
              <div className="grid gap-4">
                {docs.map((doc) => (
                  <Card key={doc.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-semibold text-foreground">{doc.title}</h4>
                            <Badge variant="outline" className="text-xs">v{doc.version}</Badge>
                          </div>
                          {doc.description && (
                            <p className="text-sm text-muted-foreground mb-2">{doc.description}</p>
                          )}
                          <p className="text-xs text-muted-foreground">{doc.file_name}</p>
                        </div>
                        <Button size="sm" onClick={() => handleDownload(doc)}>
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}

const Prequalification = () => {
  return (
    <div className="min-h-screen">
      <SEO
        title="Vendor Pre-Qualification Package - Main Specialty Contractor | Ascent Group Construction"
        description="Pre-qualification package for Ascent Group Construction - 15+ years team experience in building envelope, EIFS, masonry, interior trades. WSIB compliant, $2M CGL coverage. Serving GCs, property managers, and building owners in Ontario."
        keywords="specialty contractor prequalification, building envelope contractor Ontario, EIFS contractor GTA, masonry restoration Toronto, vendor prequalification package, subcontractor services"
      />
      <Navigation />
      
      <PageHeader
        title="Vendor Pre-Qualification Package"
        description="15+ Years Combined Team Experience • Building Envelope & Interior Trades Specialist • WSIB Compliant • $2M CGL Coverage • Serving Commercial, Multi-Family & Residential Markets"
        backgroundImage={heroImage}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Pre-Qualification" }
        ]}
        variant="standard"
      />

      <main className="py-16">
        <div className="container mx-auto px-4 max-w-7xl">
          {/* Company Status Transparency Banner */}
          <div className="mb-12">
            <Card className="border-primary/20 bg-primary/5">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Company Status: New Incorporation, Experienced Team</h3>
                    <p className="text-muted-foreground mb-4">
                      Ascent Group Construction was incorporated in 2025, but our team brings <strong>15+ years of combined hands-on experience</strong> from building envelope and interior trades work on commercial and multi-family projects throughout the Greater Toronto Area.
                    </p>
                    <p className="text-muted-foreground">
                      We founded Ascent Group to provide <strong>direct, accountable specialty trade execution</strong> for property managers, building owners, consultants, and general contractors who need reliable partners for envelope restoration, waterproofing, EIFS, masonry, and interior finishing work.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-16">
            {companyHighlights.map((highlight, index) => {
              const Icon = highlight.icon;
              return (
                <Card key={index} className="border-primary/20">
                  <CardContent className="p-6 text-center">
                    <Icon className="w-8 h-8 text-primary mx-auto mb-3" />
                    <p className="text-2xl font-bold text-primary mb-1">{highlight.value}</p>
                    <p className="text-sm font-semibold text-foreground mb-1">{highlight.label}</p>
                    <p className="text-xs text-muted-foreground">{highlight.desc}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <Tabs defaultValue="overview" className="space-y-8">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 lg:w-auto">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
              <TabsTrigger value="projects">Projects</TabsTrigger>
              <TabsTrigger value="contact">Contact</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-8">
              {/* Company Capabilities */}
              <section>
                <h2 className="text-3xl font-bold mb-6">Company Capabilities</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  {capabilities.map((cap, index) => (
                    <Card key={index}>
                      <CardHeader>
                        <CardTitle className="text-xl">{cap.category}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {cap.items.map((item, idx) => (
                            <li key={idx} className="flex items-center gap-2">
                              <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
                              <span className="text-muted-foreground">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>

              {/* Key Differentiators */}
              <section>
                <h2 className="text-3xl font-bold mb-6">Why Choose Ascent Group</h2>
                <div className="grid md:grid-cols-3 gap-6">
                  <Card className="border-primary/20">
                    <CardContent className="p-6">
                      <Shield className="w-12 h-12 text-primary mb-4" />
                      <h3 className="font-bold text-lg mb-2">Safety Excellence</h3>
                      <p className="text-muted-foreground text-sm">
                        Working toward COR certification with comprehensive safety protocols and training across all projects.
                      </p>
                    </CardContent>
                  </Card>
                  <Card className="border-primary/20">
                    <CardContent className="p-6">
                      <Award className="w-12 h-12 text-primary mb-4" />
                      <h3 className="font-bold text-lg mb-2">Quality Workmanship</h3>
                      <p className="text-muted-foreground text-sm">
                        ISO-compliant quality management systems. Every project backed by comprehensive warranties and guarantees.
                      </p>
                    </CardContent>
                  </Card>
                  <Card className="border-primary/20">
                    <CardContent className="p-6">
                      <TrendingUp className="w-12 h-12 text-primary mb-4" />
                      <h3 className="font-bold text-lg mb-2">Financial Stability</h3>
                      <p className="text-muted-foreground text-sm">
                        Strong credit references and financial documentation available upon request. Payment and performance bonds can be arranged through surety partners for projects requiring them.
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </section>
            </TabsContent>

            <TabsContent value="documents" className="space-y-6">
              <div className="mb-6">
                <h2 className="text-3xl font-bold mb-2">Downloadable Documents</h2>
                <p className="text-muted-foreground">
                  All required documentation for contractor pre-qualification and RFP submissions
                </p>
              </div>
              <DownloadableDocuments />
            </TabsContent>

            <TabsContent value="projects" className="space-y-6">
              <div className="mb-6">
                <h2 className="text-3xl font-bold mb-2">Recent Project Performance</h2>
                <p className="text-muted-foreground">
                  Representative projects demonstrating our capabilities and experience
                </p>
              </div>

              <div className="space-y-4">
                {recentProjects.map((project, index) => (
                  <Card key={index} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="grid md:grid-cols-4 gap-6">
                        <div className="md:col-span-2">
                          <div className="flex items-start gap-3 mb-3">
                            <Building2 className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                            <div>
                              <h3 className="font-bold text-lg mb-1">{project.name}</h3>
                              <p className="text-sm text-muted-foreground">{project.client}</p>
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground">{project.scope}</p>
                        </div>
                        <div className="space-y-2">
                          <div>
                            <p className="text-xs text-muted-foreground">Sector</p>
                            <Badge variant="outline">{project.sector}</Badge>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Year</p>
                            <p className="font-semibold">{project.year}</p>
                          </div>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Project Value</p>
                          <p className="text-2xl font-bold text-primary">{project.value}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="text-center pt-6">
                <Button asChild size="lg" variant="outline">
                  <Link to="/projects">
                    View All Projects
                    <ExternalLink className="ml-2 w-4 h-4" />
                  </Link>
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="contact" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h2 className="text-3xl font-bold mb-6">Get in Touch</h2>
                  <div className="space-y-4">
                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <Phone className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-semibold mb-1">Phone</p>
                            <a href="tel:647-528-6804" className="text-muted-foreground hover:text-primary transition-colors">
                              647-528-6804
                            </a>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <Mail className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-semibold mb-1">Email</p>
                            <EmailLink 
                              encoded={btoa('info@ascentgroup.ca')} 
                              className="text-muted-foreground hover:text-primary transition-colors inline" 
                              showIcon={false} 
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <MapPin className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-semibold mb-1">Service Area</p>
                            <p className="text-muted-foreground">Greater Toronto Area</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                <Card className="border-primary/20">
                  <CardHeader>
                    <CardTitle>Submit Your RFP</CardTitle>
                    <CardDescription>
                      We respond to all requests for proposals within 48 hours
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <CheckCircle2 className="h-8 w-8 text-primary mx-auto mb-2" />
                        <p className="font-semibold text-sm">Fast Response</p>
                        <p className="text-xs text-muted-foreground">48-hour turnaround</p>
                      </div>
                      <div>
                        <CheckCircle2 className="h-8 w-8 text-primary mx-auto mb-2" />
                        <p className="font-semibold text-sm">Detailed Proposals</p>
                        <p className="text-xs text-muted-foreground">Itemized estimates</p>
                      </div>
                      <div>
                        <CheckCircle2 className="h-8 w-8 text-primary mx-auto mb-2" />
                        <p className="font-semibold text-sm">Value Engineering</p>
                        <p className="text-xs text-muted-foreground">Cost optimization</p>
                      </div>
                    </div>
                    
                    <Button asChild size="lg" className="w-full">
                      <Link to="/submit-rfp">
                        Submit RFP Now
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>

                    <div className="text-center">
                      <Button asChild variant="ghost" size="sm">
                        <Link to="/contact">
                          Or contact us directly
                          <ArrowRight className="ml-2 w-4 h-4" />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Prequalification;
