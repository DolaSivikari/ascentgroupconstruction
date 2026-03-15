import { useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { PageHero } from "@/components/shared/PageHero";
import { Card, CardContent } from "@/design-system/components/Card";
import { Button } from "@/ui/Button";
import { Link } from "react-router-dom";
import ResumeSubmissionDialog from "@/components/ResumeSubmissionDialog";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { mainPageHeroes } from "@/data/hero-images";
import { Section } from "@/components/sections/Section";
import { 
  Shield,
  Target, 
  HardHat, 
  TrendingUp,
  ArrowRight,
  Paintbrush,
  Wrench,
  ClipboardList,
  Calculator
} from "lucide-react";

const Careers = () => {
  const [dialogOpen, setDialogOpen] = useState(false);

  const values = [
    {
      icon: Shield,
      title: "Safety",
      description: "Every crew member goes home safe. We invest in proper training, equipment, and protocols because there is no shortcut to safety."
    },
    {
      icon: Target,
      title: "Quality",
      description: "We self-perform the work, so our name is on every detail. Consistent execution and pride in craftsmanship define how we operate."
    },
    {
      icon: HardHat,
      title: "Accountability",
      description: "One crew, one point of contact, direct responsibility. We own the work from start to finish and stand behind it."
    },
    {
      icon: TrendingUp,
      title: "Growth",
      description: "We're building something. Team members who want to grow with a company—not just fill a seat—find real opportunity here."
    }
  ];

  const tradeCategories = [
    {
      icon: Paintbrush,
      title: "Envelope & Coatings Installers",
      description: "EIFS, stucco, sealant, waterproofing membrane, and protective coating application. Experience with Dryvit, Parex, or Sto systems is valued."
    },
    {
      icon: Wrench,
      title: "Restoration & Masonry Trades",
      description: "Brick and block repair, tuckpointing, concrete restoration, and balcony waterproofing. Skilled hands-on tradespeople who take pride in quality."
    },
    {
      icon: HardHat,
      title: "Painters & Interior Finishers",
      description: "Commercial and residential painting, epoxy and urethane coatings, drywall finishing, and tile installation. Detail-oriented professionals."
    },
    {
      icon: ClipboardList,
      title: "Project Coordination",
      description: "Field coordination, scheduling, documentation, and client communication. Construction background with strong organizational skills."
    },
    {
      icon: Calculator,
      title: "Estimating & Pre-Construction",
      description: "Quantity takeoffs, bid preparation, and scope analysis for envelope and interior trade projects. Experience with estimating software is an asset."
    }
  ];

  return (
    <div className="min-h-screen">
      <SEO 
        title="Work With Ascent | Careers in Envelope Restoration & Interior Trades"
        description="Join Ascent Group Construction — a growing specialty contractor focused on building envelope restoration and interior trades across the GTA. We're looking for skilled tradespeople and coordinators who value quality, safety, and accountability."
        keywords="construction careers GTA, envelope restoration jobs, specialty contractor careers, painting jobs toronto, construction trades ontario, masonry jobs GTA"
      />
      <Navigation />

      <PageHero
        title="Work With Ascent"
        description="We're a growing specialty contractor focused on building envelope and interior trades across the GTA. We're always interested in hearing from skilled, accountable people."
        image={mainPageHeroes.careers}
        imageAlt="Ascent Group Construction team at work"
        height="medium"
        primaryCta={{ text: "Introduce Yourself", href: "#connect" }}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Careers" }
        ]}
      />
      
      <main>
        {/* Who We Are */}
        <Section>
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Who We Are</h2>
            <div className="space-y-4 text-lg text-muted-foreground">
              <p>
                Ascent Group is a specialty contractor with a focused crew delivering building envelope restoration, 
                coatings, and interior trades across Ontario's Greater Toronto Area. We self-perform the majority of 
                our work — which means our people are the product.
              </p>
              <p>
                We're not a large company. We're a disciplined, growing team that values doing the work right, 
                communicating clearly, and building a reputation project by project.
              </p>
            </div>
          </div>
        </Section>

        {/* What We Value */}
        <Section className="bg-muted/30">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">What We Value</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              These aren't corporate buzzwords — they're how we actually operate
            </p>
          </div>

          <ScrollReveal direction="up">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
              {values.map((value, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow p-0">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                      <value.icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">{value.title}</h3>
                    <p className="text-muted-foreground text-sm">{value.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollReveal>
        </Section>

        {/* Trades & Roles */}
        <Section>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Trades & Roles We're Looking For</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We don't always have formal openings posted — but we're always open to hearing from the right people
            </p>
          </div>

          <div className="max-w-7xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tradeCategories.map((category, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow p-0">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <category.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">{category.title}</h3>
                  <p className="text-muted-foreground text-sm">{category.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </Section>

        {/* How to Connect */}
        <div id="connect">
          <Section className="bg-muted/30">
            <div className="max-w-4xl mx-auto">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <h2 className="text-3xl font-bold mb-6">How to Connect</h2>
                  <div className="space-y-4 text-muted-foreground">
                    <p>
                      If you're a skilled tradesperson, coordinator, or estimator looking for a company that 
                      values quality work and treats people with respect — we'd like to hear from you.
                    </p>
                    <p>
                      Send us your resume and a brief note about your experience. We review every submission 
                      and will reach out if there's a fit — now or in the future.
                    </p>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        Valid Working at Heights certification is an asset
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        Valid Ontario driver's license preferred for field roles
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        All experience levels considered — willingness to learn matters
                      </li>
                    </ul>
                  </div>
                </div>
                
                <Card className="bg-primary text-primary-foreground p-0">
                  <CardContent className="p-8">
                    <HardHat className="w-12 h-12 mb-6 text-secondary" />
                    <h3 className="text-2xl font-bold mb-4">Introduce Yourself</h3>
                    <p className="mb-6 opacity-90">
                      Submit your resume and we'll keep you on file. When the right opportunity comes up, 
                      we'll reach out directly.
                    </p>
                    <Button 
                      size="lg" 
                      className="w-full"
                      onClick={() => setDialogOpen(true)}
                    >
                      Submit Your Resume
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </Section>
        </div>
      </main>
      
      <ResumeSubmissionDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        jobTitle="General Application"
      />
      
      <Footer />
    </div>
  );
};

export default Careers;
