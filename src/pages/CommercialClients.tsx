import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import PageHeader from "@/components/PageHeader";
import BenefitsSection from "@/components/sections/BenefitsSection";
import CTASection from "@/components/sections/CTASection";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Timer, ShieldCheck, Users, Moon, CheckCircle, Building2, Zap } from "lucide-react";
import { CTA_TEXT } from "@/design-system/constants";
import heroImage from "@/assets/heroes/hero-commercial.jpg";

const CommercialClients = () => {
  const benefits = [
    {
      icon: Moon,
      title: "After-Hours Work",
      description: "Night and weekend scheduling available to avoid disrupting your business operations"
    },
    {
      icon: Timer,
      title: "Fast-Track Scheduling",
      description: "Accelerated timelines when you need to meet tight deadlines"
    },
    {
      icon: ShieldCheck,
      title: "Fully Insured",
      description: "$5M liability coverage and WSIB compliance - your business is protected"
    },
    {
      icon: Users,
      title: "Minimal Disruption",
      description: "Strategic planning and execution that keeps your business running smoothly"
    },
    {
      icon: Zap,
      title: "Low-VOC Materials",
      description: "Zero-odor, environmentally friendly products safe for occupied spaces"
    }
  ];

  const industries = [
    {
      title: "Office Buildings",
      description: "Professional finishes that create productive, attractive workspaces",
      features: ["After-hours scheduling", "Floor-by-floor coordination", "Common area refresh", "Conference room upgrades"]
    },
    {
      title: "Retail & Hospitality",
      description: "Fast turnarounds that minimize impact on customer-facing operations",
      features: ["Quick rebrands", "Night-shift work", "Storefront painting", "Seasonal updates"]
    },
    {
      title: "Industrial & Warehouses",
      description: "Durable coatings and safety markings for high-traffic environments",
      features: ["Epoxy floor coatings", "Safety line striping", "Machinery areas", "Loading docks"]
    },
    {
      title: "Healthcare & Education",
      description: "Specialized finishes meeting strict regulatory and safety standards",
      features: ["Antimicrobial coatings", "Low-VOC products", "School break scheduling", "Patient area coordination"]
    }
  ];

  return (
    <div className="min-h-screen">
      <SEO 
        title="Commercial Construction Services - Business & Industrial"
        description="Professional commercial construction services for offices, retail, industrial, and institutional facilities. After-hours scheduling, minimal disruption, and quality results."
        keywords="commercial construction, office construction, retail construction, industrial construction, business construction, GTA"
      />
      <Navigation />
      
      <PageHeader
        eyebrow="For Commercial Clients"
        title="Keep Your Business Running While We Work"
        description="Professional commercial construction and project management services designed around your operations. We deliver quality results with minimal disruption to your business."
        backgroundImage={heroImage}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Commercial Clients" }
        ]}
        variant="with-cta"
        cta={{
          label: "Request Commercial Quote",
          href: "/estimate"
        }}
      />
      
      <main>

        <BenefitsSection
          title="Why Businesses Choose Ascent"
          description="We understand that downtime costs money. Our commercial services are built for efficiency."
          benefits={benefits.map(b => ({ icon: b.icon, title: b.title, description: b.description }))}
        />

        {/* Commercial Stats */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">45K+</div>
                <div className="text-muted-foreground">Sq Ft Completed</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">Zero</div>
                <div className="text-muted-foreground">Business Disruptions</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">98%</div>
                <div className="text-muted-foreground">On-Time Completion</div>
              </div>
            </div>
          </div>
        </section>

        {/* Industries */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Industries We Serve</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Specialized solutions for every commercial sector
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {industries.map((industry, index) => (
                <Card key={index} className="hover:shadow-xl transition-all">
                  <CardContent className="p-8">
                    <div className="flex items-start gap-3 mb-3">
                      <Building2 className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                      <h3 className="text-2xl font-bold text-primary">{industry.title}</h3>
                    </div>
                    <p className="text-muted-foreground mb-4">{industry.description}</p>
                    <ul className="space-y-2">
                      {industry.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Process Overview */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Our Commercial Approach</h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              We follow a proven 6-step process to ensure your commercial project is completed on time, within budget, and to the highest standards.
            </p>
            <Link to="/our-process" className="inline-flex items-center gap-2 text-primary font-semibold hover:underline">
              View Our Detailed Process <CheckCircle className="w-4 h-4" />
            </Link>
          </div>
        </section>

        <CTASection
          title="Ready to Elevate Your Facility?"
          description="Get a comprehensive commercial quote with flexible scheduling options"
          primaryCTA={{ label: CTA_TEXT.primary, href: "/estimate" }}
          secondaryCTA={{ label: "Schedule Consultation", href: "/contact" }}
        />
      </main>
      
      <Footer />
    </div>
  );
};

export default CommercialClients;
