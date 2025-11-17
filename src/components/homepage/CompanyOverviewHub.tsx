import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle, Target } from "lucide-react";
import * as LucideIcons from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useCompanyOverview } from "@/hooks/useCompanyOverview";

// Fallback data
const fallbackApproach = [
  "Detailed site assessment and project planning",
  "Transparent pricing with no hidden costs",
  "Dedicated project manager for seamless coordination",
  "Premium materials from trusted suppliers",
  "Rigorous quality control at every phase",
  "Comprehensive warranties and ongoing support",
];

const fallbackValues = [
  { icon: "Shield", title: "Safety First", description: "Comprehensive safety protocols and training for every project, ensuring zero-incident worksites." },
  { icon: "Award", title: "Quality Craftsmanship", description: "Premium materials and skilled trades deliver results that exceed industry standards." },
  { icon: "Lightbulb", title: "Innovation", description: "Latest techniques and sustainable solutions for modern construction challenges." },
  { icon: "Heart", title: "Client Partnership", description: "Transparent communication and dedicated support throughout your project journey." },
];

const fallbackPromise = [
  { title: "On-Time Delivery", description: "We respect your schedule with efficient project management and clear timelines." },
  { title: "Budget Certainty", description: "Detailed estimates upfront with no surprise costs or change orders." },
  { title: "Quality Guarantee", description: "Comprehensive warranties backed by 15+ years of proven excellence." },
  { title: "Safety Compliance", description: "WSIB certified with strict adherence to all safety regulations." },
];

const CompanyOverviewHub = () => {
  const [activeTab, setActiveTab] = useState("approach");
  const sectionRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  useIntersectionObserver(sectionRef, { threshold: 0.2 });
  
  const { sections, items } = useCompanyOverview();
  
  const getItemsForSection = (sectionType: string) => {
    const section = sections.find(s => s.section_type === sectionType);
    if (!section) return [];
    return items.filter(item => item.section_id === section.id);
  };
  
  const approachItems = getItemsForSection("approach");
  const valuesItems = getItemsForSection("values");
  const promiseItems = getItemsForSection("promise");
  
  const OUR_APPROACH = approachItems.length > 0 ? approachItems.map(i => i.content) : fallbackApproach;
  const COMPANY_VALUES = valuesItems.length > 0 
    ? valuesItems.map(i => ({ icon: i.icon_name || "Shield", title: i.title || "", description: i.content }))
    : fallbackValues;
  const OUR_PROMISE = promiseItems.length > 0
    ? promiseItems.map(i => ({ title: i.title || "", description: i.content }))
    : fallbackPromise;

  return (
    <section
      ref={sectionRef}
      className="py-20 px-4 bg-gradient-to-b from-background to-muted/30"
    >
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className={`text-center mb-12 ${!prefersReducedMotion && 'animate-fade-in'}`}>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
            Your Complete Construction Partner Across Ontario
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            From building envelope systems to specialty restoration, we deliver comprehensive solutions 
            with the expertise, safety standards, and quality you expect from a trusted envelope & restoration contractor.
          </p>
        </div>

        {/* Interactive Tabs */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-3 mb-8 max-w-2xl mx-auto h-auto p-1">
            <TabsTrigger value="approach" className="text-sm md:text-base py-3">
              Our Approach
            </TabsTrigger>
            <TabsTrigger value="values" className="text-sm md:text-base py-3">
              Our Values
            </TabsTrigger>
            <TabsTrigger value="promise" className="text-sm md:text-base py-3">
              Our Promise
            </TabsTrigger>
          </TabsList>

          {/* Our Approach Tab */}
          <TabsContent value="approach" className={!prefersReducedMotion ? 'animate-fade-in' : ''}>
            <div className="bg-card rounded-2xl p-8 md:p-12 border">
              <div className="max-w-4xl mx-auto">
                <h3 className="text-2xl md:text-3xl font-bold mb-6 text-foreground">
                  How We Deliver Excellence
                </h3>
                <p className="text-muted-foreground mb-8 text-lg">
                  Our proven process ensures every project is completed to the highest standards, 
                  on time and within budget.
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  {OUR_APPROACH.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                    >
                      <CheckCircle className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-foreground">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Our Values Tab */}
          <TabsContent value="values" className={!prefersReducedMotion ? 'animate-fade-in' : ''}>
            <div className="bg-card rounded-2xl p-8 md:p-12 border">
              <div className="max-w-4xl mx-auto">
                <h3 className="text-2xl md:text-3xl font-bold mb-6 text-foreground text-center">
                  Built on Core Values
                </h3>
                <p className="text-muted-foreground mb-10 text-lg text-center">
                  These principles guide every decision we make and every project we undertake.
                </p>
                <div className="grid md:grid-cols-2 gap-6">
                  {COMPANY_VALUES.map((value, index) => {
                    const Icon = (LucideIcons as any)[value.icon] || LucideIcons.Shield;
                    return (
                      <div
                        key={index}
                        className="p-6 rounded-xl bg-gradient-to-br from-muted/50 to-muted border hover:border-primary/50 transition-all hover:shadow-lg group"
                      >
                        <div className="flex items-start gap-4">
                          <div className="p-3 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                            <Icon className="w-6 h-6 text-primary" />
                          </div>
                        <div className="flex-1">
                          <h4 className="text-xl font-semibold mb-2 text-foreground">
                            {value.title}
                          </h4>
                          <p className="text-muted-foreground">
                            {value.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                  })}
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Our Promise Tab */}
          <TabsContent value="promise" className={!prefersReducedMotion ? 'animate-fade-in' : ''}>
            <div className="bg-card rounded-2xl p-8 md:p-12 border">
              <div className="max-w-4xl mx-auto">
                <h3 className="text-2xl md:text-3xl font-bold mb-6 text-foreground text-center">
                  Our Commitment to You
                </h3>
                <p className="text-muted-foreground mb-10 text-lg text-center">
                  When you partner with us, you get guarantees that matter.
                </p>
                <div className="grid md:grid-cols-2 gap-6">
                  {OUR_PROMISE.map((promise, index) => (
                    <div
                      key={index}
                      className="p-6 rounded-xl bg-muted/30 border hover:border-primary/50 transition-all hover:shadow-md"
                    >
                      <div className="flex items-start gap-3 mb-3">
                        <Target className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                        <h4 className="text-xl font-semibold text-foreground">
                          {promise.title}
                        </h4>
                      </div>
                      <p className="text-muted-foreground ml-8">
                        {promise.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Smart CTAs */}
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/contact"
            className={`inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 font-semibold shadow-lg hover:shadow-xl group ${!prefersReducedMotion && 'hover-scale'}`}
            style={{ transition: prefersReducedMotion ? 'box-shadow 0.3s cubic-bezier(0.4, 0, 0.2, 1)' : 'var(--card-transition), box-shadow 0.3s cubic-bezier(0.4, 0, 0.2, 1)' }}
          >
            Start Your Project
            <ArrowRight className="h-5 w-5 hover-translate-arrow" />
          </Link>
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 px-8 py-4 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90 font-semibold"
            style={{ transition: 'var(--transition-colors)' }}
          >
            View Our Work
            <ArrowRight className="h-5 w-5" />
          </Link>
          <Link
            to="/how-we-work"
            className="inline-flex items-center gap-2 px-8 py-4 border-2 border-primary text-primary rounded-lg hover:bg-primary hover:text-primary-foreground transition-all font-semibold"
          >
            Learn Our Process
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CompanyOverviewHub;
