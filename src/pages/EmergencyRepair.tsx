import SEO from "@/components/SEO";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { PageHero } from "@/components/shared/PageHero";
import { Section } from "@/components/sections/Section";
import { COMPANY_PHONE, COMPANY_PHONE_TEL } from "@/constants/company";
import { SectionHeader } from "@/design-system/components/SectionHeader";
import { CapabilityCard } from "@/design-system/components/CapabilityCard";
import { CTABand } from "@/design-system/components/CTABand";
import { Card } from "@/design-system/components/Card";
import { Button } from "@/ui/Button";
import { PhoneLink } from "@/components/shared/PhoneLink";
import { Link } from "react-router-dom";
import {
  Phone,
  Droplets,
  Wind,
  AlertTriangle,
  Building2,
  Clock,
  ClipboardCheck,
  Wrench,
  Shield,
  CheckCircle,
  ArrowRight,
  MapPin,
  Zap,
} from "lucide-react";
import { serviceHeroes } from "@/data/hero-images";
import { serviceAreaCities, primaryServiceCities } from "@/data/service-area-cities";

const emergencyServices = [
  {
    icon: Droplets,
    title: "Water Infiltration",
    description: "Active leaks through walls, windows, balconies, or parking decks. Temporary containment and permanent envelope repair.",
  },
  {
    icon: Building2,
    title: "Façade Failure",
    description: "Loose cladding, falling masonry, EIFS delamination, or spalling concrete. Emergency stabilization and safe access.",
  },
  {
    icon: Wind,
    title: "Storm Damage",
    description: "Wind-driven rain damage, displaced siding or panels, compromised sealant joints, and membrane blow-offs.",
  },
  {
    icon: AlertTriangle,
    title: "Sealant & Joint Failure",
    description: "Failed caulking, expansion joint leaks, window perimeter failures. Emergency re-sealing to prevent interior damage.",
  },
];

const responseProcess = [
  {
    step: "1",
    title: "Call Us",
    description: `Call ${COMPANY_PHONE} directly. Describe the issue, location, and urgency. We triage immediately.`,
    icon: Phone,
  },
  {
    step: "2",
    title: "Same-Day Site Assessment",
    description: "A crew lead arrives on-site to assess the damage, document conditions, and determine temporary containment needs.",
    icon: ClipboardCheck,
  },
  {
    step: "3",
    title: "Temporary Measures",
    description: "Immediate containment — tarping, temporary sealant, water diversion, or shoring — to stop further damage.",
    icon: Wrench,
  },
  {
    step: "4",
    title: "Permanent Repair",
    description: "Scope, price, and schedule the permanent fix. We handle the full restoration — from envelope diagnosis to final coating.",
    icon: Shield,
  },
];

const EmergencyRepair = () => {
  return (
    <div className="min-h-screen">
      <SEO
        title="Emergency Building Repair | 24/7 Façade & Envelope Response | Ascent Group"
        description={`Emergency water infiltration, facade failure, and storm damage repair across the GTA. Same-day site assessment. Call ${COMPANY_PHONE} for immediate response.`}
        keywords="emergency water infiltration Toronto, emergency facade repair GTA, storm damage building repair, emergency building envelope contractor, urgent leak repair Ontario"
      />
      <Navigation />

      <PageHero
        eyebrow="Emergency Response"
        title="Emergency Building Repair"
        description="Same-day site assessment for active leaks, façade failures, and storm damage — GTA-wide."
        image={serviceHeroes["waterproofing-systems"]}
        imageAlt="Emergency building envelope repair"
        height="medium"
        primaryCta={{ text: `Call ${COMPANY_PHONE}`, href: COMPANY_PHONE_TEL }}
        secondaryCta={{ text: "Contact Form", href: "/contact" }}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Emergency Repair" },
        ]}
        badges={[
          { icon: Clock, text: "Same-Day Assessment" },
          { icon: Zap, text: "24/7 Available" },
          { icon: MapPin, text: "GTA-Wide" },
        ]}
      />

      {/* Urgent Phone Banner */}
      <div className="bg-destructive text-destructive-foreground">
        <div className="container mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-center gap-4 text-center">
          <Phone className="w-6 h-6 animate-pulse" />
          <span className="text-lg font-semibold">
            Need immediate help? Call now:{" "}
            <a href={COMPANY_PHONE_TEL} className="underline font-bold">
              {COMPANY_PHONE}
            </a>
          </span>
        </div>
      </div>

      {/* Emergency Services */}
      <Section size="major">
        <SectionHeader
          badge="What We Respond To"
          title="Emergency Envelope Services"
          description="Our crews respond to urgent building envelope failures across the Greater Toronto Area."
        />
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {emergencyServices.map((service) => (
            <CapabilityCard
              key={service.title}
              icon={service.icon}
              title={service.title}
              description={service.description}
            />
          ))}
        </div>
      </Section>

      {/* Response Process */}
      <Section size="major" className="bg-muted/30">
        <SectionHeader
          badge="Our Process"
          title="How We Respond"
          description="From your first call to permanent repair — here's what to expect."
        />
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {responseProcess.map((item) => (
            <Card key={item.step} variant="elevated" size="md" className="relative">
              <span className="text-5xl font-bold text-primary/10 absolute top-4 right-4">
                {item.step}
              </span>
              <item.icon className="w-8 h-8 text-primary mb-3" />
              <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {item.description}
              </p>
            </Card>
          ))}
        </div>
      </Section>

      {/* Service Area */}
      <Section size="major">
        <SectionHeader
          badge="Coverage"
          title="GTA-Wide Emergency Coverage"
          description="Same-day response available across the Greater Toronto Area for active envelope failures."
        />
        <div className="max-w-4xl mx-auto">
          <Card variant="elevated" size="lg">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {serviceAreaCities.map((city) => (
                <div key={city} className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
                  <span className={`text-sm ${primaryServiceCities.includes(city) ? "font-semibold" : ""}`}>
                    {city}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </Section>

      {/* Why Call Ascent */}
      <Section size="major" className="bg-muted/30">
        <SectionHeader
          badge="Why Ascent"
          title="Why Call Us for Emergencies"
        />
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <Card variant="elevated" size="md" hover>
            <Clock className="w-10 h-10 text-primary mb-4" />
            <h3 className="font-semibold mb-2">Same-Day Response</h3>
            <p className="text-sm text-muted-foreground">
              Call in the morning, crew on-site by afternoon. We prioritize active failures that risk interior damage or occupant safety.
            </p>
          </Card>
          <Card variant="elevated" size="md" hover>
            <Wrench className="w-10 h-10 text-primary mb-4" />
            <h3 className="font-semibold mb-2">Self-Performed Crews</h3>
            <p className="text-sm text-muted-foreground">
              No waiting for sub-tiers. Our own 10-person crew handles containment and permanent repair — EIFS, masonry, sealant, coatings.
            </p>
          </Card>
          <Card variant="elevated" size="md" hover>
            <Shield className="w-10 h-10 text-primary mb-4" />
            <h3 className="font-semibold mb-2">WSIB & $2M Insured</h3>
            <p className="text-sm text-muted-foreground">
              Fully compliant for commercial and multi-family properties. Certificate of insurance available within 24 hours of your request.
            </p>
          </Card>
        </div>
      </Section>

      {/* CTA */}
      <Section size="major">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Don't Wait — Active Leaks Get Worse
          </h2>
          <p className="text-lg text-muted-foreground mb-4">
            Every hour of water infiltration increases repair costs and damage scope.
            Call us now for a same-day site assessment.
          </p>
          <p className="text-muted-foreground mb-8">
            Direct line: <PhoneLink className="text-primary font-bold text-lg" />
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg">
              <a href={COMPANY_PHONE_TEL}>
                <Phone className="mr-2 w-4 h-4" />
                Call Now: {COMPANY_PHONE}
              </a>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/contact">
                Submit Details Online
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
          </div>
        </div>
      </Section>

      <Footer />
    </div>
  );
};

export default EmergencyRepair;
