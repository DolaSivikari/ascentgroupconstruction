import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { PageHero } from "@/components/shared/PageHero";
import { Button } from "@/ui/Button";
import { Badge } from "@/components/ui/badge";
import { CTA_TEXT } from "@/design-system/constants";
import { 
  ClipboardCheck, 
  Ruler, 
  Hammer, 
  ShieldCheck, 
  Award, 
  ArrowRight,
  Calendar,
  HardHat
} from "lucide-react";
import { Link } from "react-router-dom";
import { generateHowToSchema } from "@/utils/faq-schema";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import AnimatedProcessTimeline from "@/components/timeline/AnimatedProcessTimeline";
import { companyHeroes } from "@/data/hero-images";

const processSteps = [
  {
    step: 1,
    title: "Consultation & Assessment",
    duration: "1-2 days",
    description: "We visit your site to understand your needs, assess the scope, and provide a detailed quote.",
    details: [
      "Comprehensive site inspection and measurement",
      "Surface condition assessment and material identification",
      "Discussion of your goals, timeline, and budget",
      "Identification of any potential challenges or special requirements",
      "Review of color options and material recommendations"
    ],
    deliverables: ["Detailed Quote", "Project Timeline", "Material Samples"],
    image: "/src/assets/team-work.jpg"
  },
  {
    step: 2,
    title: "Preparation & Planning",
    duration: "1-3 days",
    description: "Our team prepares the site and surfaces to ensure the highest quality finish.",
    details: [
      "Complete surface cleaning and preparation",
      "Repair of cracks, holes, and surface imperfections",
      "Priming and sealing as needed",
      "Protection of surrounding areas and property",
      "Setup of equipment and safety measures"
    ],
    deliverables: ["Site Protection", "Surface Repairs", "Quality Primer"],
    image: "/src/assets/project-commercial.jpg"
  },
  {
    step: 3,
    title: "Professional Application",
    duration: "3-10 days",
    description: "Expert application using premium materials and proven techniques for lasting results.",
    details: [
      "Application of high-quality coatings using professional techniques",
      "Multiple coats applied with proper drying time between each",
      "Attention to detail on edges, corners, and transitions",
      "Regular quality checks throughout the process",
      "Daily cleanup and site maintenance"
    ],
    deliverables: ["Premium Finish", "Progress Updates", "Clean Worksite"],
    image: "/src/assets/project-institutional.jpg"
  },
  {
    step: 4,
    title: "Final Inspection & Warranty",
    duration: "1 day",
    description: "We ensure everything meets our high standards and provide comprehensive warranty coverage.",
    details: [
      "Thorough final inspection with you present",
      "Touch-ups and corrections as needed",
      "Complete site cleanup and debris removal",
      "Walkthrough of maintenance recommendations",
      "Provision of warranty documentation and care instructions"
    ],
    deliverables: ["Final Walkthrough", "Warranty Certificate", "Care Guide"]
  }
];

const qualityStandards = [
  {
    icon: ShieldCheck,
    title: "WSIB Compliant & $2M CGL",
    description: "Active WSIB registration since incorporation, $2M general liability coverage, all crew members fully insured"
  },
  {
    icon: Award,
    title: "Manufacturer-Backed Warranties",
    description: "2-10 year warranties depending on scope—EIFS systems carry full manufacturer warranty when installed per specifications"
  },
  {
    icon: HardHat,
    title: "15+ Years Combined Experience",
    description: "Core crew has worked together 5+ years, individual team members 15+ years in envelope and restoration trades"
  }
];

const contractTypes = [
  {
    name: "Stipulated Price (Lump Sum)",
    description: "Fixed price for the entire project scope. Best for well-defined projects with complete specifications.",
    pros: ["Predictable budget", "Client assumes less risk", "Clear scope from start"],
    cons: ["Change orders can be costly", "Less flexibility", "Requires detailed upfront planning"],
    bestFor: "Standard painting, stucco repair, defined restoration work"
  },
  {
    name: "Cost-Plus",
    description: "Client pays actual costs plus a fixed fee or percentage. Provides transparency on all expenses.",
    pros: ["Flexible scope", "Real-time cost visibility", "Easier to accommodate changes"],
    cons: ["Less budget certainty", "Requires trust and oversight", "Final cost may vary"],
    bestFor: "Complex renovations, phased projects, design-build"
  },
  {
    name: "Unit Price",
    description: "Pricing based on measured units (e.g., $/sqft, $/linear foot). Common for repetitive work.",
    pros: ["Easy to scale", "Fair pricing", "Clear cost per unit"],
    cons: ["Quantity variations affect total", "Requires accurate measurement", "May not capture all complexity"],
    bestFor: "Sealant replacement, window installation, floor coatings"
  },
  {
    name: "Time & Materials (T&M)",
    description: "Hourly labor rates plus material costs. Best for small or exploratory scopes where full scope isn't known upfront.",
    pros: ["Flexible scope", "No upfront scope commitment", "Pay for actual work done"],
    cons: ["Less budget certainty", "Requires trust and oversight", "Can be more expensive if scope grows"],
    bestFor: "Investigation work, small repairs, emergency response, exploratory scopes"
  }
];

const qualityControlSafety = {
  preConstruction: [
    "Site safety audit & hazard identification",
    "WSIB compliance verification for all workers",
    "Material testing & quality certification review",
    "Mock-ups for client approval (when applicable)",
    "Traffic & access management plan"
  ],
  duringConstruction: [
    "Daily toolbox talks on safety protocols",
    "Weekly quality inspections by project manager",
    "Third-party testing for critical work (waterproofing, coatings)",
    "Photo documentation of all work stages",
    "Real-time issue resolution & change order tracking"
  ],
  postConstruction: [
    "Final walkthrough with punch list",
    "Quality assurance inspection",
    "Warranty documentation & care instructions",
    "As-built drawings (when applicable)",
    "Post-project review & feedback collection"
  ]
};

const communicationReporting = [
  {
    title: "Dedicated Project Manager",
    description: "Single point of contact from start to finish. Direct phone & email access.",
    icon: "👤"
  },
  {
    title: "Weekly Progress Reports",
    description: "Detailed updates every Friday covering completed work, upcoming tasks, and any issues.",
    icon: "📊"
  },
  {
    title: "Photo Documentation",
    description: "Daily photos uploaded to shared cloud folder. Before/during/after documentation.",
    icon: "📸"
  },
  {
    title: "Project Documentation",
    description: "Project documents shared via secure cloud folders—schedules, invoices, change orders, and reports.",
    icon: "💻"
  },
  {
    title: "Emergency Contact",
    description: "Emergency contact available for urgent issues (water infiltration, safety concerns).",
    icon: "🚨"
  }
];

const warrantyCloseout = {
  warranties: [
    {
      tier: "Standard Workmanship Warranty",
      coverage: "2 years on all labor and installation",
      includes: "Defects in workmanship, improper installation, material application errors"
    },
    {
      tier: "Premium Materials Warranty",
      coverage: "5-10 years (manufacturer-backed)",
      includes: "Paint failure, coating delamination, sealant degradation (varies by product)"
    },
    {
      tier: "Structural Warranty (when applicable)",
      coverage: "10 years on structural envelope work",
      includes: "Water infiltration due to flashing/waterproofing failure, structural defects"
    }
  ],
  closeoutProcess: [
    "1. Substantial Completion Walkthrough (client sign-off on 95%+ completion)",
    "2. Punch List Creation (list of minor items to address)",
    "3. Punch List Completion (typically 5-10 business days)",
    "4. Final Inspection & Sign-Off",
    "5. Warranty Documents & Care Instructions Delivered",
    "6. Final Payment & Project Close (lien releases provided)"
  ]
};

const faqs = [
  {
    question: "How long does a typical painting project take in the GTA?",
    answer: "Timeline varies by project size and complexity. Residential interiors (2000 sq ft): 3-7 days. Residential exteriors: 5-10 days weather permitting. Condo units: 2-4 days. Commercial projects: 1-4 weeks depending on scope. We provide detailed timelines during consultation and send daily progress updates."
  },
  {
    question: "Can you work evenings or weekends for commercial projects?",
    answer: "Absolutely! We offer flexible scheduling including after-hours (6PM-6AM), weekends, and holiday work for commercial clients to minimize business disruption. After-hours work incurs a 20-30% premium but ensures zero impact on your operations. Our team members bring experience from a wide range of commercial after-hours projects across the GTA."
  },
  {
    question: "What happens if I'm not satisfied with the work?",
    answer: "Your satisfaction is our priority. We conduct a thorough final walkthrough with you, and if anything doesn't meet your expectations, we'll address it immediately at no extra cost. All work comes with our satisfaction guarantee plus written warranties ranging from 2-10 years depending on the service."
  },
  {
    question: "How do you handle weather delays for exterior projects?",
    answer: "For exterior painting, we require temperatures above 10°C and dry conditions for 48 hours before and after application. We monitor forecasts closely and adjust schedules proactively. Weather delays don't extend your contract price - we reschedule to the next suitable window at no extra cost to you."
  },
  {
    question: "What's included in your estimates?",
    answer: "Our detailed estimates include: all materials (primer, paint, supplies), labor, surface preparation, furniture protection, daily cleanup, project management, insurance, and warranty. We provide line-item breakdowns so you understand exactly what you're paying for. No hidden fees, no surprises."
  }
];

const OurProcess = () => {
  // Generate HowTo schema for SEO
  const howToSchema = generateHowToSchema({
    name: "How Ascent Group Construction Delivers Your Project",
    description: "Our proven 4-step construction and painting process ensures quality results from consultation to warranty",
    steps: processSteps.map((step, idx) => ({
      name: step.title,
      text: step.description + " " + step.details.join(". ")
    })),
    totalTime: "P14D"
  });

  return (
    <div className="min-h-screen relative overflow-hidden">
      <SEO
        title="Our Process - 4 Steps to Perfect Results | Ascent Group Construction"
        description="Discover our proven 4-step process for painting and construction projects in the GTA. From consultation to warranty, we ensure quality at every stage with transparent communication."
        keywords="construction process, painting process Toronto, how we work, project timeline, quality assurance"
        structuredData={howToSchema}
      />
      
      {/* Background decorations */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-20 -right-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 -left-20 w-96 h-96 bg-secondary/5 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <Navigation />

      <PageHero
        eyebrow="Our Process"
        title="4 Steps to Exceptional Results"
        description="Our proven process ensures quality, transparency, and complete satisfaction from initial consultation to final warranty"
        image={companyHeroes["our-process"]}
        imageAlt="Professional construction process"
        primaryCta={{ text: "Start Your Project", href: "/estimate" }}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "How We Work" }
        ]}
      />

      {/* Trust Badges */}
      <section className="py-12 bg-gradient-to-b from-muted/30 to-transparent relative">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-8 max-w-4xl mx-auto">
            {qualityStandards.map((standard, idx) => (
              <div 
                key={idx} 
                className="flex items-center gap-3 animate-fade-in-up hover-scale"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-lg">
                  <standard.icon className="w-6 h-6 text-secondary" />
                </div>
                <div>
                  <div className="font-semibold text-sm">{standard.title}</div>
                  <div className="text-xs text-muted-foreground">{standard.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Animated Timeline Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">Step-by-Step Excellence</Badge>
            <h2 className="text-4xl font-bold mb-4">Our Proven Process</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Every project follows our proven methodology, delivering professional execution with clear accountability
            </p>
          </div>

          <AnimatedProcessTimeline steps={processSteps} />
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4">Common Questions</Badge>
            <h2 className="text-4xl font-bold mb-4">Process FAQs</h2>
            <p className="text-muted-foreground text-lg">
              Everything you need to know about working with us
            </p>
          </div>

          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`} 
                className="bg-muted/30 rounded-lg px-6 border-2 border-transparent hover:border-primary/20 transition-colors"
              >
                <AccordionTrigger className="text-left font-semibold hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed pt-2">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold mb-4">
              Ready to Experience the Ascent Difference?
            </h2>
            <p className="text-muted-foreground mb-8 text-lg">
              Request a consultation and detailed proposal. No pressure, just honest advice and transparent pricing.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="gap-2">
                <Link to="/estimate">
                  {CTA_TEXT.project}
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/blog">View Our Work</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default OurProcess;