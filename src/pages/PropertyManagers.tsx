import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import PageHeader from "@/components/PageHeader";
import { UnifiedCard } from "@/components/shared/UnifiedCard";
import { Section } from "@/components/sections/Section";
import { Button } from "@/ui/Button";
import { Link } from "react-router-dom";
import { Building2, TrendingUp, Users, Calendar, ShieldCheck, Timer, CheckCircle, CreditCard } from "lucide-react";
import { CTA_TEXT } from "@/design-system/constants";
import heroImage from "@/assets/heroes/hero-multi-family.jpg";

const PropertyManagers = () => {
  const benefits = [
    {
      icon: CreditCard,
      title: "Maximize ROI",
      description: "Quality work that increases property value and reduces long-term maintenance costs"
    },
    {
      icon: Calendar,
      title: "Flexible Scheduling",
      description: "We work around your tenants' schedules with minimal disruption to operations"
    },
    {
      icon: Users,
      title: "Volume Pricing",
      description: "Competitive rates for multi-unit projects and ongoing maintenance programs"
    },
    {
      icon: ShieldCheck,
      title: "Full Insurance",
      description: "$5M liability coverage and WSIB compliance for your protection"
    },
    {
      icon: Timer,
      title: "Fast Turnarounds",
      description: "3-day unit turnover process keeps your vacancy rates low"
    }
  ];

  const services = [
    {
      title: "Unit Renovations",
      description: "Fast, efficient unit renovations between tenants",
      roi: "Reduce vacancy time by 40%"
    },
    {
      title: "Common Area Maintenance",
      description: "Keep lobbies, hallways, and amenities looking their best",
      roi: "Increase tenant retention 25%"
    },
    {
      title: "Exterior Restoration",
      description: "Stucco, EIFS, and facade maintenance",
      roi: "Extend building life 15+ years"
    },
    {
      title: "Parking Garage Coatings",
      description: "Protective coatings and line striping",
      roi: "Prevent $50K+ in repairs"
    }
  ];

  return (
    <div className="min-h-screen">
      <SEO 
        title="Services for Property Managers - Multi-Unit Construction Specialists"
        description="Trusted property management construction services across the GTA. Volume pricing, fast turnarounds, and minimal disruption for condos, apartments, and commercial properties."
        keywords="property management, condo construction, multi-unit construction, property maintenance, GTA"
      />
      <Navigation />
      
      <PageHeader
        title="Your Trusted Property Maintenance Partner"
        description="Maximize property value and tenant satisfaction with our specialized multi-unit construction and restoration services. We understand the unique challenges of property management."
        backgroundImage={heroImage}
        cta={{ label: CTA_TEXT.project, href: "/estimate" }}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Property Managers" }
        ]}
      />
      
      <main>

        {/* ROI Focus */}
        <Section size="major">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Built for Property Management Success</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We help you maximize value, minimize downtime, and keep tenants happy
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {benefits.map((benefit, index) => (
              <UnifiedCard key={index} variant="interactive">
                <div className="w-14 h-14 bg-gradient-to-br from-primary to-primary/70 rounded-xl flex items-center justify-center mb-4 shadow-lg">
                  <benefit.icon className="w-7 h-7 text-secondary" />
                </div>
                <h3 className="text-xl font-bold mb-2">{benefit.title}</h3>
                <p className="text-muted-foreground">{benefit.description}</p>
              </UnifiedCard>
            ))}
          </div>

          {/* Stats */}
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">120+</div>
              <div className="text-muted-foreground">Units Managed Monthly</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">3-Day</div>
              <div className="text-muted-foreground">Average Turnover Time</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">98%</div>
              <div className="text-muted-foreground">Tenant Satisfaction</div>
            </div>
          </div>
        </Section>

        {/* Services with ROI */}
        <Section size="major" className="bg-muted/30">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Services That Deliver ROI</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Every service designed to increase property value and tenant satisfaction
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {services.map((service, index) => (
              <UnifiedCard key={index} variant="elevated" className="border-l-4 border-l-primary">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-2xl font-bold text-primary">{service.title}</h3>
                  <TrendingUp className="w-6 h-6 text-secondary flex-shrink-0" />
                </div>
                <p className="text-muted-foreground mb-4">{service.description}</p>
                <div className="inline-block px-4 py-2 bg-secondary/10 rounded-lg">
                  <span className="text-sm font-bold text-primary">{service.roi}</span>
                </div>
              </UnifiedCard>
            ))}
          </div>
        </Section>

        {/* Process for Property Managers */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Streamlined Process</h2>
            </div>

            <div className="grid md:grid-cols-4 gap-6 max-w-6xl mx-auto">
              {[
                { step: "1", title: "Site Assessment", desc: "We inspect and provide detailed quote" },
                { step: "2", title: "Scheduling", desc: "Flexible timing around your tenants" },
                { step: "3", title: "Execution", desc: "Professional work with daily updates" },
                { step: "4", title: "Completion", desc: "Final inspection and documentation" }
              ].map((item, index) => (
                <UnifiedCard key={index} variant="elevated" className="text-center">
                  <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                    {item.step}
                  </div>
                  <h3 className="font-bold mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </UnifiedCard>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <Section size="major" className="bg-primary text-primary-foreground">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Let's Discuss Your Property Needs</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
              Volume pricing available for multi-unit properties and ongoing maintenance contracts
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" asChild>
                <Link to="/estimate">{CTA_TEXT.project}</Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                <Link to="/contact">Contact Us</Link>
              </Button>
            </div>
          </div>
        </Section>
      </main>
      
      <Footer />
    </div>
  );
};

export default PropertyManagers;
