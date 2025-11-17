import PageHeader from "@/components/PageHeader";
import { Section } from "@/components/sections/Section";
import SEO from "@/components/SEO";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/ui/Button";
import { Link } from "react-router-dom";
import { CTA_TEXT } from "@/design-system/constants";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { specialtyContractorComparison } from "@/data/specialty-contractor-comparison";
import { 
  Building2, 
  Car, 
  Layers, 
  AlertTriangle, 
  Building, 
  Landmark,
  CheckCircle2,
  XCircle,
  ArrowRight,
  ArrowDown,
  TrendingDown,
  TrendingUp
} from "lucide-react";
import { generateFAQSchema } from "@/utils/faq-schema";
import heroImage from "@/assets/heroes/hero-general-contracting.jpg";

const iconMap = {
  Building2,
  Car,
  Layers,
  AlertTriangle,
  Building,
  Landmark
};

const WhySpecialtyContractor = () => {
  const { hero, introduction, comparisonTable, scenarios, costBreakdown, projectOutcomes, faqs, testimonials, finalCTA } = specialtyContractorComparison;

  const faqSchema = generateFAQSchema(faqs);

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://ascentgroupconstruction.com"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Why Specialty Contractor",
        "item": "https://ascentgroupconstruction.com/why-specialty-contractor"
      }
    ]
  };

  return (
    <div>
      <SEO
        title="Specialty Contractor vs General Contractor | Building Envelope & Restoration"
        description="Understand why building envelope & restoration projects require specialty contractors, not general contractors. Compare costs, quality, warranties, and project outcomes. Serving Ontario & GTA."
        keywords="specialty contractor, general contractor comparison, building envelope contractor, specialty vs general contractor, construction contractor differences, self-performed construction, Ontario specialty contractor, GTA building envelope, façade contractor vs general contractor"
        structuredData={[faqSchema, breadcrumbSchema]}
      />

      <Navigation />

      <PageHeader
        title={hero.title}
        description={hero.subtitle}
        backgroundImage={heroImage}
        cta={{ label: CTA_TEXT.contact, href: "/contact" }}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Why Specialty Contractor" }
        ]}
      />

      {/* Introduction Section */}
      <Section>
        <div className="max-w-7xl mx-auto">
          <h2 className="text-center mb-8">{introduction.title}</h2>
          <div className="space-y-6 text-lg leading-relaxed">
            {introduction.content.map((paragraph, index) => (
              <p key={index} className="text-muted-foreground">{paragraph}</p>
            ))}
          </div>
        </div>
      </Section>

      {/* Comparison Table Section */}
      <Section>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="mb-4">{comparisonTable.title}</h2>
            <p className="text-xl text-muted-foreground">{comparisonTable.subtitle}</p>
          </div>

          {/* Desktop Table View */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full border-collapse bg-background rounded-lg overflow-hidden shadow-lg">
              <thead>
                <tr className="border-b-2 border-border">
                  <th className="p-4 text-left font-bold">Factor</th>
                  <th className="p-4 text-left font-bold bg-primary/5">Specialty Contractor (Ascent)</th>
                  <th className="p-4 text-left font-bold">General Contractor</th>
                </tr>
              </thead>
              <tbody>
                {comparisonTable.factors.map((factor, index) => (
                  <tr key={index} className="border-b border-border hover:bg-muted/30 transition-colors">
                    <td className="p-4 font-semibold">{factor.category}</td>
                    <td className="p-4 bg-primary/5">
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                        <span>{factor.specialtyContractor}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-start gap-2">
                        <XCircle className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                        <span className="text-muted-foreground">{factor.generalContractor}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="lg:hidden space-y-4">
            {comparisonTable.factors.map((factor, index) => (
              <Card key={index} className="p-6">
                <h3 className="text-lg font-bold mb-4">{factor.category}</h3>
                <div className="space-y-4">
                  <div className="p-4 bg-primary/5 rounded-lg">
                    <div className="flex items-start gap-2 mb-2">
                      <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="font-semibold text-sm">Specialty Contractor</span>
                    </div>
                    <p className="text-sm ml-7">{factor.specialtyContractor}</p>
                  </div>
                  <div className="p-4 bg-muted/30 rounded-lg">
                    <div className="flex items-start gap-2 mb-2">
                      <XCircle className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                      <span className="font-semibold text-sm text-muted-foreground">General Contractor</span>
                    </div>
                    <p className="text-sm text-muted-foreground ml-7">{factor.generalContractor}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </Section>

      {/* Scenarios Section */}
      <Section>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="mb-4">When You Need a Specialty Contractor</h2>
            <p className="text-xl text-muted-foreground">Project types that require specialized building envelope expertise</p>
          </div>

          <ScrollReveal direction="up">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {scenarios.map((scenario, index) => {
              const IconComponent = iconMap[scenario.icon as keyof typeof iconMap];
              return (
                <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <IconComponent className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{scenario.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{scenario.description}</p>
                  <div className="space-y-3">
                    <div className="p-3 bg-primary/5 rounded-lg">
                      <p className="text-xs font-semibold text-primary mb-1">Why Specialty Contractor:</p>
                      <p className="text-xs">{scenario.whySpecialty}</p>
                    </div>
                    <div className="p-3 bg-destructive/5 rounded-lg">
                      <p className="text-xs font-semibold text-destructive mb-1">General Contractor Risk:</p>
                      <p className="text-xs text-muted-foreground">{scenario.generalContractorRisk}</p>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
          </ScrollReveal>
        </div>
      </Section>

      {/* Cost Breakdown Section */}
      <Section>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="mb-4">{costBreakdown.title}</h2>
            <p className="text-xl text-muted-foreground">{costBreakdown.subtitle}</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            {/* General Contractor Model */}
            <Card className="p-8">
              <h3 className="text-xl font-bold mb-6 text-center">{costBreakdown.generalContractorModel.title}</h3>
              <div className="space-y-4 mb-8">
                {costBreakdown.generalContractorModel.steps.map((step, index) => (
                  <div key={index} className="relative">
                    <div className={`p-4 rounded-lg border-2 ${step.highlight ? 'border-destructive bg-destructive/5' : 'border-border'}`}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold">{step.layer}</span>
                        <span className={`text-2xl font-bold ${step.highlight ? 'text-destructive' : ''}`}>
                          {step.percentage}%
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">{step.description}</p>
                    </div>
                    {index < costBreakdown.generalContractorModel.steps.length - 1 && (
                      <div className="flex justify-center py-2">
                        <ArrowDown className="w-6 h-6 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <div className="p-4 bg-destructive/10 rounded-lg">
                <p className="font-semibold mb-3 flex items-center gap-2">
                  <TrendingDown className="w-5 h-5 text-destructive" />
                  Problems with this model:
                </p>
                <ul className="space-y-2">
                  {costBreakdown.generalContractorModel.problems.map((problem, index) => (
                    <li key={index} className="text-sm flex items-start gap-2">
                      <XCircle className="w-4 h-4 text-destructive flex-shrink-0 mt-0.5" />
                      <span>{problem}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Card>

            {/* Specialty Contractor Model */}
            <Card className="p-8 border-2 border-primary">
              <h3 className="text-xl font-bold mb-6 text-center">{costBreakdown.specialtyContractorModel.title}</h3>
              <div className="space-y-4 mb-8">
                {costBreakdown.specialtyContractorModel.steps.map((step, index) => (
                  <div key={index} className="relative">
                    <div className={`p-4 rounded-lg border-2 ${step.highlight ? 'border-primary bg-primary/5' : 'border-border'}`}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold">{step.layer}</span>
                        <span className={`text-2xl font-bold ${step.highlight ? 'text-primary' : ''}`}>
                          {step.percentage}%
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">{step.description}</p>
                    </div>
                    {index < costBreakdown.specialtyContractorModel.steps.length - 1 && (
                      <div className="flex justify-center py-2">
                        <ArrowDown className="w-6 h-6 text-primary" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <div className="p-4 bg-primary/10 rounded-lg">
                <p className="font-semibold mb-3 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  Benefits of this model:
                </p>
                <ul className="space-y-2">
                  {costBreakdown.specialtyContractorModel.benefits.map((benefit, index) => (
                    <li key={index} className="text-sm flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Card>
          </div>

          <div className="text-center p-6 bg-primary/10 rounded-lg">
            <p className="text-xl font-bold text-primary">
              Result: 25-30% more value delivered per construction dollar with specialty contractor model
            </p>
          </div>
        </div>
      </Section>

      {/* Project Outcomes Section */}
      <Section>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="mb-4">Real Project Outcomes</h2>
            <p className="text-xl text-muted-foreground">Side-by-side comparison of actual projects</p>
          </div>

          <div className="space-y-12">
            {projectOutcomes.map((project, index) => (
              <Card key={index} className="p-8">
                <h3 className="text-2xl font-bold mb-3">{project.title}</h3>
                <p className="text-muted-foreground mb-8">{project.scenario}</p>
                
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  {/* Specialty Contractor */}
                  <div className="p-6 bg-primary/5 rounded-lg border-2 border-primary">
                    <div className="flex items-center gap-2 mb-4">
                      <CheckCircle2 className="w-6 h-6 text-primary" />
                      <h4 className="font-bold">Specialty Contractor Approach</h4>
                    </div>
                    <div className="space-y-3 text-sm">
                      <div>
                        <span className="font-semibold">Timeline:</span> {project.specialtyContractor.timeline}
                      </div>
                      <div>
                        <span className="font-semibold">Cost:</span> {project.specialtyContractor.cost}
                      </div>
                      <div>
                        <span className="font-semibold">Warranty:</span> {project.specialtyContractor.warranty}
                      </div>
                      <div>
                        <span className="font-semibold">Outcome:</span> {project.specialtyContractor.outcome}
                      </div>
                    </div>
                  </div>

                  {/* General Contractor */}
                  <div className="p-6 bg-muted/30 rounded-lg border-2 border-border">
                    <div className="flex items-center gap-2 mb-4">
                      <XCircle className="w-6 h-6 text-muted-foreground" />
                      <h4 className="font-bold text-muted-foreground">General Contractor Approach</h4>
                    </div>
                    <div className="space-y-3 text-sm text-muted-foreground">
                      <div>
                        <span className="font-semibold">Timeline:</span> {project.generalContractor.timeline}
                      </div>
                      <div>
                        <span className="font-semibold">Cost:</span> {project.generalContractor.cost}
                      </div>
                      <div>
                        <span className="font-semibold">Warranty:</span> {project.generalContractor.warranty}
                      </div>
                      <div>
                        <span className="font-semibold">Outcome:</span> {project.generalContractor.outcome}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-primary/10 rounded-lg">
                  <p className="font-semibold text-primary">{project.difference}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </Section>

      {/* FAQ Section */}
      <Section>
        <div className="max-w-7xl mx-auto">
          <h2 className="text-center mb-12">Frequently Asked Questions</h2>
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <Card key={index} className="p-6">
                <h3 className="text-lg font-bold mb-3">{faq.question}</h3>
                <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
              </Card>
            ))}
          </div>
        </div>
      </Section>

      {/* Testimonials Section */}
      <Section>
        <div className="max-w-7xl mx-auto">
          <h2 className="text-center mb-12">What Our Clients Say</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="p-6">
                <p className="text-sm italic mb-4 leading-relaxed">"{testimonial.quote}"</p>
                <div className="border-t pt-4">
                  <p className="font-bold">{testimonial.client}</p>
                  <p className="text-sm text-muted-foreground mb-2">{testimonial.role}</p>
                  <p className="text-xs text-primary">{testimonial.project}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </Section>

      {/* Final CTA Section */}
      <Section>
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="mb-4">{finalCTA.title}</h2>
          <p className="text-xl text-muted-foreground mb-8">{finalCTA.description}</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button asChild size="lg">
              <Link to={finalCTA.primaryCTA.href}>
                {finalCTA.primaryCTA.label}
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
            <Button asChild variant="secondary" size="lg">
              <Link to={finalCTA.secondaryCTA.href}>
                {finalCTA.secondaryCTA.label}
              </Link>
            </Button>
            <Button asChild variant="ghost" size="lg">
              <Link to={finalCTA.tertiaryCTA.href}>
                {finalCTA.tertiaryCTA.label}
              </Link>
            </Button>
          </div>
        </div>
      </Section>

      <Footer />
    </div>
  );
};

export default WhySpecialtyContractor;
