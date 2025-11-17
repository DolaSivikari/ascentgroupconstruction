import { useState } from "react";
import { Search, Sparkles, TrendingUp, MessageCircle } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import PageHeader from "@/components/PageHeader";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { generateFAQSchema, generateHowToSchema } from "@/utils/faq-schema";
import { CTA_TEXT } from "@/design-system/constants";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import heroImage from "@/assets/heroes/hero-about-company.jpg";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQ = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const faqCategories = [
    {
      category: "General Questions",
      icon: "💼",
      count: 8,
      questions: [
        {
          question: "How long has Ascent Group Construction been in business?",
          answer: "Ascent Group Construction was founded in 2009 and has been providing expert construction services across the Greater Toronto Area for over 15 years. We've successfully completed over 500 projects ranging from residential homes to large commercial properties."
        },
        {
          question: "What areas do you serve in Ontario?",
          answer: "We serve the entire Greater Toronto Area (GTA) including Toronto, Mississauga, Brampton, Vaughan, Markham, Richmond Hill, Oakville, Burlington, and surrounding municipalities. We're equipped to handle projects throughout Southern Ontario."
        },
        {
          question: "Are you licensed and insured?",
          answer: "Yes, we are fully licensed, bonded, and insured with comprehensive liability coverage ($5M), workers' compensation (WSIB), and bonding capacity up to $10M per project. We can provide proof of insurance upon request and maintain all Ontario construction certifications."
        },
        {
          question: "How do I know if you're the right contractor for my project?",
          answer: "We specialize in general contracting, commercial construction, multi-family construction, design-build, stucco/EIFS systems, masonry restoration, and building envelope work. If your project involves construction management, exterior or interior finishing, waterproofing, or building systems in the GTA, we're likely a perfect fit. Schedule a free consultation to discuss your specific needs."
        },
      ],
    },
    {
      category: "Pricing & Estimates",
      icon: "💰",
      count: 12,
      questions: [
        {
          question: "How much does commercial construction cost in Toronto?",
          answer: "Commercial construction in Toronto varies widely by project scope. Tenant improvements range from $50-$200 per square foot, while new construction can exceed $250-$500 per square foot depending on complexity, finishes, and building systems. A 10,000 sq ft buildout averages $500,000-$1.5M. We provide detailed free estimates with line-item breakdowns."
        },
        {
          question: "What's included in your construction estimates?",
          answer: "Our estimates include all materials, labor, equipment, permits, project management, insurance, and warranty. We break down costs by scope so you understand exactly what you're paying for. No hidden fees."
        },
        {
          question: "Do you offer free estimates?",
          answer: "Yes! We provide free, no-obligation estimates for all projects. For residential projects, we can often provide ballpark quotes with photos. For commercial projects, we conduct on-site visits to provide accurate, detailed estimates within 3-5 business days."
        },
        {
          question: "How much does it cost to renovate a condo unit in Mississauga?",
          answer: "A typical 2-bedroom condo unit (800-1000 sq ft) renovation in Mississauga costs $15,000-$35,000 for cosmetic updates (paint, flooring, fixtures). 3-bedroom units (1200+ sq ft) range from $25,000-$60,000. Full gut renovations can exceed $80,000-$150,000. Price varies based on finishes, scope, and structural changes."
        },
        {
          question: "What payment methods do you accept?",
          answer: "We accept checks, bank transfers (EFT), credit cards (Visa, Mastercard, Amex), and e-transfers. For projects over $10,000, we work with payment schedules: 25% deposit, 50% at midpoint, 25% on completion. No payment is due until you're completely satisfied."
        },
        {
          question: "Can I get volume pricing for multiple units?",
          answer: "Absolutely! Property managers and developers receive volume discounts for multi-unit projects. For 10+ units, expect 15-20% savings. For 50+ units, up to 30% savings. We also offer preferred pricing for annual maintenance contracts."
        },
      ],
    },
    {
      category: "Project Timeline & Process",
      icon: "⏱️",
      count: 11,
      questions: [
        {
          question: "How long does a typical residential construction project take?",
          answer: "Interior renovations: 2-6 weeks for a 2000 sq ft home. Exterior renovations: 4-10 weeks depending on weather and scope. Condo unit renovations: 1-3 weeks. Major additions or new construction: 3-12 months. We provide detailed timelines during estimates and communicate daily updates throughout the project."
        },
        {
          question: "What's the best time of year for exterior construction in Ontario?",
          answer: "May through October is ideal for exterior construction in Ontario. We need suitable weather for concrete work, masonry, and exterior finishes. Late spring (May-June) and early fall (September) offer the best conditions. Some projects can proceed in winter with proper planning and temporary enclosures."
        },
        {
          question: "How long does EIFS or stucco repair take?",
          answer: "Small repairs (under 100 sq ft): 3-5 days. Medium repairs (100-500 sq ft): 1-2 weeks. Large-scale restoration: 3-6 weeks. EIFS requires proper curing time between coats (24-48 hours per layer), so timeline depends on weather and project size."
        },
        {
          question: "Can you work evenings or weekends to avoid disrupting my business?",
          answer: "Yes! We offer flexible scheduling for commercial clients including after-hours (6PM-6AM), weekends, and holiday work. After-hours work incurs a 20-30% premium but ensures zero disruption to your operations. We've painted hundreds of businesses without impacting their hours."
        },
        {
          question: "Do I need to move furniture before you start?",
          answer: "We handle furniture protection and minor moving. For residential projects, please remove small valuables, wall decorations, and fragile items. We'll cover and protect all furniture and flooring with drop cloths, plastic, and padding. For complete furniture removal, we can arrange moving services at additional cost."
        },
        {
          question: "What happens if weather delays my exterior project?",
          answer: "Weather delays don't extend your contract price. We monitor forecasts closely and only work in suitable conditions (10°C+, no rain/snow, low humidity). If weather causes delays, we'll communicate immediately and reschedule to the next available window at no extra cost."
        },
      ],
    },
    {
      category: "Materials & Quality",
      icon: "🎨",
      count: 10,
      questions: [
        {
          question: "What brands and materials do you use?",
          answer: "We use commercial-grade materials from trusted suppliers including Benjamin Moore paints, Sherwin-Williams coatings, Dryvit EIFS systems, Hardie siding, and industry-leading building envelope products. We select materials based on your project requirements, durability needs, and budget. All products meet or exceed Ontario Building Code standards."
        },
        {
          question: "Can I choose my own paint colors?",
          answer: "Absolutely! We offer complimentary color consultation to help you select from 3,500+ colors across our partner brands. Our team can provide sample boards, digital mockups, and expert advice on color psychology, trends, and complementary palettes."
        },
        {
          question: "Do you use eco-friendly paints?",
          answer: "Yes, sustainability is a priority. We use low-VOC (under 50g/L) and zero-VOC paints by default. We also offer Green Seal certified products, Greenguard Gold certified options for sensitive environments, and recycled paint programs. All meet or exceed Canadian environmental standards."
        },
        {
          question: "What's the difference between paint grades?",
          answer: "Contractor grade ($30-40/gallon): Basic coverage, 3-5 year lifespan, good for rentals. Mid-grade ($45-60/gallon): Better coverage, 5-8 years, recommended for homes. Premium ($60-85/gallon): Superior coverage, 10-15 years, best for high-traffic commercial. We recommend mid-grade or premium for most projects."
        },
        {
          question: "How long will my construction project last in Ontario weather?",
          answer: "With proper construction: Building envelope systems 20-30 years, roofing 15-25 years, exterior finishes 10-20 years, interior finishes 15-30 years. Ontario's freeze-thaw cycles are harsh, so we use weather-resistant materials with proper installation. Quality construction and regular maintenance maximize lifespan."
        },
        {
          question: "What warranty do you provide on workmanship?",
          answer: "We provide a 2-year workmanship warranty on all projects covering peeling, blistering, and application defects. Materials carry manufacturer warranties (typically 5-25 years). If issues arise within warranty period, we'll return to fix at no cost. Commercial projects can extend to 5-year warranties."
        },
      ],
    },
    {
      category: "Specific Services",
      icon: "🏗️",
      count: 13,
      questions: [
        {
          question: "Do you repair stucco cracks before painting?",
          answer: "Yes, proper surface prep is critical. We repair all cracks, holes, and damaged stucco before painting using premium patching compounds and mesh. Small cracks (under 1/4\"): included in painting. Large cracks or water damage: quoted separately. All stucco repairs come with 2-year warranty."
        },
        {
          question: "Can you paint brick or do you only cover it?",
          answer: "We can both paint brick and restore it. Options include: 1) Paint (permanent, good for curb appeal), 2) Limewash (breathable, traditional look), 3) Stain (enhances natural color), 4) Brick restoration (cleaning, repointing). Each has pros/cons - we'll recommend best approach for your brick type and goals."
        },
        {
          question: "What's involved in parking garage restoration?",
          answer: "Comprehensive parking garage restoration includes: concrete repair, expansion joint sealing, waterproofing membrane, traffic coating system, line striping, and bollard painting. Projects typically take 4-8 weeks depending on size. We work overnight/weekends to minimize disruption."
        },
        {
          question: "Do you install or just repair EIFS?",
          answer: "We do both! EIFS installation includes: moisture barrier, foam insulation board, base coat with mesh, finish coat, and trim details. We're certified EIFS installers with 15+ years experience. We also specialize in EIFS repairs, water damage remediation, and system upgrades."
        },
        {
          question: "Can you paint kitchen cabinets?",
          answer: "Yes! Cabinet refinishing is a specialty. Process: 1) Remove doors/hardware, 2) Clean and degrease, 3) Primer (bonding coat), 4) Two coats premium cabinet paint (Benjamin Moore Advance or Sherwin-Williams Emerald Urethane), 5) Reassemble with new hardware. Average kitchen: $3,500-$6,500, 5-7 days."
        },
        {
          question: "Do you do drywall repair and installation?",
          answer: "Yes, our team handles full drywall services: patching holes, water damage repair, texture matching, new installation, mudding, taping, and sanding. We can match any texture (orange peel, knockdown, skip trowel). Drywall services are often bundled with painting projects."
        },
        {
          question: "Can you paint high ceilings or multiple-story buildings?",
          answer: "Absolutely. We have scaffolding, boom lifts, swing stages, and specialized equipment for buildings up to 12 stories. Our team is trained and certified for high-access work with full fall protection. We've painted churches with 40-foot ceilings and 10-story condo buildings."
        },
      ],
    },
    {
      category: "Property Management",
      icon: "🏢",
      count: 9,
      questions: [
        {
          question: "What's your typical unit turnover time for condos?",
          answer: "Standard 2-bedroom condo unit: 3 days (paint walls, ceiling, trim). With minor repairs and cleaning: 4-5 days. We coordinate with your cleaning crew and can work weekends to minimize vacancy. For 10+ unit buildings, we maintain dedicated crews for fast turnarounds."
        },
        {
          question: "Do you offer maintenance contracts for property managers?",
          answer: "Yes! Annual maintenance contracts include: quarterly inspections, priority scheduling, volume pricing (15-25% discount), dedicated account manager, 48-hour emergency response, and monthly invoicing. Perfect for condos, apartments, and commercial property portfolios."
        },
        {
          question: "Can you coordinate with tenants for interior work?",
          answer: "Absolutely. We handle all tenant communication including: access scheduling, pre-work walkthroughs, daily updates, and completion inspections. We're respectful, professional, and minimize disruption. Many property managers have us work directly with tenants to reduce their workload."
        },
        {
          question: "What's included in common area painting?",
          answer: "Common area painting includes: hallways, stairwells, lobbies, amenity rooms, elevators, parkades, and exterior common spaces. We work evenings/weekends to avoid resident disruption, use low-VOC paints for occupied buildings, and clean daily. Typical condo (100 units): 2-3 weeks."
        },
      ],
    },
    {
      category: "Safety & Compliance",
      icon: "⚠️",
      count: 7,
      questions: [
        {
          question: "Do you have WSIB coverage?",
          answer: "Yes, we maintain full WSIB (Workplace Safety & Insurance Board) clearance for all employees and subcontractors. We provide updated clearance certificates with every project proposal. Our WSIB account is in good standing with zero outstanding claims."
        },
        {
          question: "What safety certifications does your team have?",
          answer: "Our team holds: COR (Certificate of Recognition), JHSC (Joint Health & Safety Committee) certification, Working at Heights certification, WHMIS 2015, Fall Protection, Confined Space Entry, and First Aid/CPR. We conduct monthly safety training and maintain perfect safety record."
        },
        {
          question: "How do you handle lead paint in older buildings?",
          answer: "For pre-1980 buildings, we conduct lead testing ($150-300). If lead is present: 1) Containment with sealed barriers, 2) HEPA vacuums and air scrubbers, 3) Wet sanding to minimize dust, 4) Proper disposal, 5) Clearance testing. We're certified in lead-safe practices per Ontario regulations."
        },
        {
          question: "Do you need building permits for painting projects?",
          answer: "Generally no for standard repainting. However, permits may be required for: structural changes, heritage buildings, exterior color changes in some municipalities, or commercial buildings over 3 stories. We'll advise on permit requirements and handle applications if needed."
        },
      ],
    },
    {
      category: "Toronto & GTA Specific",
      icon: "🗺️",
      count: 8,
      questions: [
        {
          question: "How much does it cost to paint a house in Toronto vs suburbs?",
          answer: "Toronto proper: 10-15% higher due to parking, permits, and access challenges. Mississauga/Brampton: baseline pricing. York Region: 5-10% lower. Downtown condo projects include costs for elevator booking, security deposits, and parking permits. Suburban houses have easier access."
        },
        {
          question: "Do Toronto condo buildings have painting restrictions?",
          answer: "Most Toronto condos require: 1) Insurance certificates for contractors, 2) Elevator booking/fees ($100-500), 3) Move-in/out permits ($50-200), 4) Work hour restrictions (usually 8AM-6PM weekdays), 5) Parking passes. We handle all paperwork and coordination with property management."
        },
        {
          question: "What neighborhoods do you serve most frequently?",
          answer: "Most projects are in: Downtown Toronto, North York, Etobicoke, Scarborough, Mississauga (Port Credit, Streetsville, Erin Mills), Brampton (Bramalea, Heart Lake), Vaughan (Woodbridge, Maple), Markham (Unionville, Thornhill), and Richmond Hill. We serve all of GTA and beyond."
        },
        {
          question: "How do you handle winter painting in Ontario?",
          answer: "Exterior painting requires 10°C+ temperatures. In winter (November-March), we focus on: 1) Interior projects, 2) Heated parkades, 3) Emergency repairs with specialty cold-weather products, 4) Planning and estimates for spring. For urgent exterior needs, we use heated tents (additional cost)."
        },
      ],
    },
  ];

  const filteredFAQs = faqCategories.map(category => ({
    ...category,
    questions: category.questions.filter(
      q => 
        q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.answer.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.questions.length > 0);

  // Popular questions based on search trends
  const popularQuestions = [
    "How much does commercial painting cost in Toronto?",
    "What's the best time of year to paint exterior in Ontario?",
    "Do you offer volume pricing for multiple units?",
    "How long does a typical commercial construction project take?"
  ];

  // Create FAQ schema from all questions
  const allFAQs = faqCategories.flatMap(cat => 
    cat.questions.map(q => ({
      question: q.question,
      answer: q.answer
    }))
  );

  // Add HowTo schema for "How to Choose a Contractor"
  const howToSchema = generateHowToSchema({
    name: "How to Choose a Painting Contractor in Ontario",
    description: "Complete guide to selecting a qualified painting contractor for your project",
    steps: [
      { name: "Verify Insurance", text: "Check for WSIB clearance, liability insurance, and proper licensing" },
      { name: "Review Portfolio", text: "Examine completed projects similar to yours with photo documentation" },
      { name: "Check References", text: "Contact recent clients and verify satisfaction, timeline, and quality" },
      { name: "Compare Quotes", text: "Get 3+ detailed estimates with material and labor breakdowns" },
      { name: "Review Contract", text: "Ensure written agreement includes timeline, payment schedule, and warranty" }
    ],
    totalTime: "P3D"
  });

  return (
    <>
      <SEO
        title="Frequently Asked Questions - Painting & Construction | Ascent Group"
        description="Get answers to 85+ questions about construction costs, timelines, processes, and services in Toronto and the GTA. Expert guidance for property owners and managers."
        keywords="painting FAQ Toronto, construction questions GTA, painting costs Ontario, EIFS repair, property management painting, commercial painting questions"
        structuredData={[generateFAQSchema(allFAQs), howToSchema]}
      />
      
      <Navigation />

      <PageHeader
        title="Frequently Asked Questions"
        description="Everything you need to know about construction, painting, EIFS, stucco, and restoration services across the GTA."
        backgroundImage={heroImage}
        cta={{ label: CTA_TEXT.contact, href: "/contact" }}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "FAQ" }
        ]}
      />

      <main className="pb-20">
        <div className="container mx-auto px-4">
          
          {/* Search Section */}
          <div className="max-w-7xl mx-auto mb-12">
            <div className="relative mb-8">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search 85+ questions about costs, timelines, materials..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-14 text-lg border-2 focus:border-primary"
              />
            </div>

            {/* Popular Questions */}
            {!searchQuery && (
              <div className="mb-12">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  <h2 className="text-lg font-semibold">Popular Questions</h2>
                </div>
                <div className="flex flex-wrap gap-2">
                  {popularQuestions.map((q, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSearchQuery(q)}
                      className="px-4 py-2 bg-primary/10 hover:bg-primary/20 rounded-full text-sm transition-colors"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Category Overview */}
            {!searchQuery && (
              <ScrollReveal direction="up">
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
                {faqCategories.map((cat, idx) => (
                  <Card key={idx} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => document.getElementById(`category-${idx}`)?.scrollIntoView({ behavior: 'smooth' })}>
                    <CardContent className="p-6 text-center">
                      <div className="text-4xl mb-3">{cat.icon}</div>
                      <h3 className="font-semibold mb-1">{cat.category}</h3>
                      <Badge variant="secondary">{cat.count} questions</Badge>
                    </CardContent>
                  </Card>
                ))}
              </div>
              </ScrollReveal>
            )}
          </div>

          {/* FAQ Categories */}
          <div className="max-w-7xl mx-auto space-y-8">
            {filteredFAQs.map((category, idx) => (
              <div key={idx} id={`category-${idx}`} className="scroll-mt-8">
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-4xl">{category.icon}</span>
                  <div>
                    <h2 className="text-3xl font-bold text-foreground">
                      {category.category}
                    </h2>
                    <p className="text-sm text-muted-foreground">{category.count} questions answered</p>
                  </div>
                </div>
                
                <Card className="border-2">
                  <CardContent className="p-6">
                    <Accordion type="single" collapsible className="space-y-4">
                      {category.questions.map((faq, qIdx) => (
                        <AccordionItem
                          key={qIdx}
                          value={`${idx}-${qIdx}`}
                          className="border-b last:border-b-0 pb-4 last:pb-0"
                        >
                          <AccordionTrigger className="text-left font-semibold text-base hover:no-underline hover:text-primary transition-colors">
                            {faq.question}
                          </AccordionTrigger>
                          <AccordionContent className="text-muted-foreground pt-3 text-base leading-relaxed">
                            {faq.answer}
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </CardContent>
                </Card>
              </div>
            ))}

            {filteredFAQs.length === 0 && (
              <div className="text-center py-16">
                <MessageCircle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground text-xl mb-2">
                  No questions found matching "{searchQuery}"
                </p>
                <p className="text-sm text-muted-foreground">
                  Try different keywords or browse categories above
                </p>
              </div>
            )}
          </div>

          {/* Contact CTA */}
          <div className="mt-16 max-w-7xl mx-auto">
            <Card className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground border-0">
              <CardContent className="p-12 text-center">
                <Sparkles className="w-12 h-12 mx-auto mb-4 text-secondary" />
                <h3 className="text-3xl font-bold mb-3">
                  Still have questions?
                </h3>
                <p className="text-primary-foreground/90 mb-8 text-lg">
                  Our team is here to help. Get personalized answers from construction experts.
                </p>
                <div className="flex gap-4 justify-center flex-wrap">
                  <a
                    href="/contact"
                    className="inline-flex items-center justify-center px-8 py-4 bg-secondary text-primary rounded-lg font-semibold hover:bg-secondary/90 transition-colors shadow-lg text-lg"
                  >
                    Contact Us
                  </a>
                  <a
                    href="tel:647-528-6804"
                    className="inline-flex items-center justify-center px-8 py-4 bg-primary-foreground/20 backdrop-blur-sm text-primary-foreground rounded-lg font-semibold hover:bg-primary-foreground/30 transition-colors text-lg"
                  >
                    Call 647-528-6804
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      <Footer />
    </>
  );
};

export default FAQ;