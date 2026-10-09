import { usePageContent } from "@/hooks/usePageContent";
import contentModule from "@/content/pages/faq";
import { useState } from "react";
import {
  Search,
  Sparkles,
  TrendingUp,
  MessageCircle,
  Briefcase,
  DollarSign,
  Clock,
  Palette,
  HardHat,
  Building2,
  Shield,
  MapPin,
} from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { PageHero } from "@/components/shared/PageHero";
import { Section } from "@/components/sections/Section";
import { Input } from "@/ui/Input";
import { Card, CardContent } from "@/design-system/components/Card";
import { Badge } from "@/components/ui/badge";
import { generateFAQSchema, generateHowToSchema } from "@/utils/faq-schema";
import { CTA_TEXT } from "@/design-system/constants";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { mainPageHeroes } from "@/data/hero-images";
import VoiceFAQ from "@/components/seo/VoiceFAQ";
import { formatPhoneDisplay } from "@/utils/formatPhone";
import { SITE_URL } from "@/constants/company";
import { PhoneLink } from "@/components/shared/PhoneLink";
import { VOICE_OPTIMIZED_FAQS } from "@/utils/seo/ai-content";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQ = () => {
  const c = usePageContent(contentModule);

  const [searchQuery, setSearchQuery] = useState("");

  const faqCategories = [
    {
      category: "General Questions",
      iconComponent: Briefcase,
      count: 8,
      questions: [
        {
          question: c.f001,
          answer: c.f002,
        },
        {
          question: c.f003,
          answer: c.f004,
        },
        {
          question: c.f005,
          answer: c.f006,
        },
        {
          question: c.f007,
          answer: c.f008,
        },
      ],
    },
    {
      category: "Pricing & Estimates",
      iconComponent: DollarSign,
      count: 12,
      questions: [
        {
          question: c.f009,
          answer: c.f010,
        },
        {
          question: c.f011,
          answer: c.f012,
        },
        {
          question: c.f013,
          answer: c.f014,
        },
        {
          question: c.f015,
          answer: c.f016,
        },
        {
          question: c.f017,
          answer: c.f018,
        },
        {
          question: c.f019,
          answer: c.f020,
        },
      ],
    },
    {
      category: "Project Timeline & Process",
      iconComponent: Clock,
      count: 11,
      questions: [
        {
          question: c.f021,
          answer: c.f022,
        },
        {
          question: c.f023,
          answer: c.f024,
        },
        {
          question: c.f025,
          answer: c.f026,
        },
        {
          question: c.f027,
          answer: c.f028,
        },
        {
          question: c.f029,
          answer: c.f030,
        },
        {
          question: c.f031,
          answer: c.f032,
        },
      ],
    },
    {
      category: "Materials & Quality",
      iconComponent: Palette,
      count: 10,
      questions: [
        {
          question: c.f033,
          answer: c.f034,
        },
        {
          question: c.f035,
          answer: c.f036,
        },
        {
          question: c.f037,
          answer: c.f038,
        },
        {
          question: c.f039,
          answer: c.f040,
        },
        {
          question: c.f041,
          answer: c.f042,
        },
        {
          question: c.f043,
          answer: c.f044,
        },
      ],
    },
    {
      category: "Specific Services",
      iconComponent: HardHat,
      count: 13,
      questions: [
        {
          question: c.f045,
          answer: c.f046,
        },
        {
          question: c.f047,
          answer: c.f048,
        },
        {
          question: c.f049,
          answer: c.f050,
        },
        {
          question: c.f051,
          answer: c.f052,
        },
        {
          question: c.f053,
          answer: c.f054,
        },
        {
          question: c.f055,
          answer: c.f056,
        },
        {
          question: c.f057,
          answer: c.f058,
        },
      ],
    },
    {
      category: "Property Management",
      iconComponent: Building2,
      count: 9,
      questions: [
        {
          question: c.f059,
          answer: c.f060,
        },
        {
          question: c.f061,
          answer: c.f062,
        },
        {
          question: c.f063,
          answer: c.f064,
        },
        {
          question: c.f065,
          answer: c.f066,
        },
      ],
    },
    {
      category: "Safety & Compliance",
      iconComponent: Shield,
      count: 7,
      questions: [
        {
          question: c.f067,
          answer: c.f068,
        },
        {
          question: c.f069,
          answer: c.f070,
        },
        {
          question: c.f071,
          answer: c.f072,
        },
        {
          question: c.f073,
          answer: c.f074,
        },
      ],
    },
    {
      category: "Toronto & GTA Specific",
      iconComponent: MapPin,
      count: 8,
      questions: [
        {
          question: c.f075,
          answer: c.f076,
        },
        {
          question: c.f077,
          answer: c.f078,
        },
        {
          question: c.f079,
          answer: c.f080,
        },
        {
          question: c.f081,
          answer: c.f082,
        },
      ],
    },
  ];

  const filteredFAQs = faqCategories
    .map((category) => ({
      ...category,
      questions: category.questions.filter(
        (q) =>
          q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
          q.answer.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
    }))
    .filter((category) => category.questions.length > 0);

  // Popular questions based on search trends
  const popularQuestions = [c.f083, c.f084, c.f085, c.f086];

  // Create FAQ schema from all questions
  const allFAQs = faqCategories.flatMap((cat) =>
    cat.questions.map((q) => ({
      question: q.question,
      answer: q.answer,
    })),
  );

  // Include voice FAQs in schema
  const voiceFaqsForSchema = VOICE_OPTIMIZED_FAQS.map((faq) => ({
    question: faq.question,
    answer: faq.answer,
  }));

  // Add HowTo schema for "How to Choose a Contractor"
  const howToSchema = generateHowToSchema({
    name: c.f087,
    description: c.f088,
    steps: [
      { name: c.f089, text: c.f090 },
      { name: c.f091, text: c.f092 },
      { name: c.f093, text: c.f094 },
      { name: c.f095, text: c.f096 },
      { name: c.f097, text: c.f098 },
    ],
    totalTime: "P3D",
  });

  return (
    <>
      <SEO
        title={c.f099}
        description={c.f100}
        keywords="construction FAQ Toronto, building envelope questions GTA, restoration costs Ontario, EIFS repair, commercial construction questions"
        canonical={`${SITE_URL}/faq`}
        structuredData={[
          generateFAQSchema([...allFAQs, ...voiceFaqsForSchema]),
          howToSchema,
        ]}
      />

      <Navigation />

      <PageHero
        title={c.f101}
        description={c.f102}
        image={mainPageHeroes.faq}
        imageAlt={c.f103}
        height="medium"
        variant="centered"
        primaryCta={{ text: CTA_TEXT.contact, href: "/contact" }}
        breadcrumbs={[{ label: c.f104, href: "/" }, { label: c.f105 }]}
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
                  <h2 className="text-lg font-semibold">{c.f106}</h2>
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
                  {faqCategories.map((cat, idx) => {
                    const IconComponent = cat.iconComponent;
                    return (
                      <Card
                        key={idx}
                        className="hover:shadow-md transition-shadow cursor-pointer"
                        onClick={() =>
                          document
                            .getElementById(`category-${idx}`)
                            ?.scrollIntoView({ behavior: "smooth" })
                        }
                      >
                        <CardContent className="p-6 text-center">
                          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                            <IconComponent className="w-6 h-6 text-primary" />
                          </div>
                          <h3 className="font-semibold mb-1">{cat.category}</h3>
                          <Badge variant="secondary">
                            {cat.count} {c.f107}
                          </Badge>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </ScrollReveal>
            )}
          </div>

          {/* FAQ Categories */}
          <div className="max-w-7xl mx-auto space-y-8">
            {filteredFAQs.map((category, idx) => {
              const IconComponent = category.iconComponent;
              return (
                <div key={idx} id={`category-${idx}`} className="scroll-mt-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <IconComponent className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-foreground">
                        {category.category}
                      </h2>
                      <p className="text-sm text-muted-foreground">
                        {category.count} {c.f108}
                      </p>
                    </div>
                  </div>

                  <Card className="border-2">
                    <CardContent className="p-6">
                      <Accordion
                        type="single"
                        collapsible
                        className="space-y-4"
                      >
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
              );
            })}

            {filteredFAQs.length === 0 && (
              <div className="text-center py-16">
                <MessageCircle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground text-xl mb-2">
                  {c.f109}
                  {searchQuery}"
                </p>
                <p className="text-sm text-muted-foreground">{c.f110}</p>
              </div>
            )}
          </div>

          {/* Voice-Optimized FAQs for AI/Voice Search */}
          <div className="mt-12 max-w-7xl mx-auto">
            <VoiceFAQ limit={10} className="mb-12" />
          </div>

          {/* Contact CTA */}
          <div className="mt-16 max-w-7xl mx-auto">
            <Card className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground border-0">
              <CardContent className="p-12 text-center">
                <Sparkles className="w-12 h-12 mx-auto mb-4 text-secondary" />
                <h3 className="text-3xl font-bold mb-3">{c.f111}</h3>
                <p className="text-primary-foreground/90 mb-8 text-lg">
                  {c.f112}
                </p>
                <div className="flex gap-4 justify-center flex-wrap">
                  <a
                    href="/contact"
                    className="inline-flex items-center justify-center px-8 py-4 bg-secondary text-secondary-foreground rounded-lg font-semibold hover:bg-secondary/90 transition-colors shadow-lg text-lg"
                  >
                    {c.f113}
                  </a>
                  <PhoneLink
                    showIcon={false}
                    className="inline-flex items-center justify-center px-8 py-4 bg-primary-foreground/20 backdrop-blur-sm text-primary-foreground rounded-lg font-semibold hover:bg-primary-foreground/30 transition-colors text-lg"
                  >
                    {c.f114}
                    {formatPhoneDisplay()}
                  </PhoneLink>
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
