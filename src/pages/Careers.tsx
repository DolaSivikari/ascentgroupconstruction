import { useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import PageHeader from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/ui/Button";
import { Link } from "react-router-dom";
import ResumeSubmissionDialog from "@/components/ResumeSubmissionDialog";
import { CTA_TEXT } from "@/design-system/constants";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import heroImage from "@/assets/heroes/hero-team.jpg";
import { 
  Heart,
  Award, 
  HardHat, 
  GraduationCap,
  Shield,
  Calendar,
  MapPin,
  ArrowRight,
  Briefcase
} from "lucide-react";

const Careers = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedJobTitle, setSelectedJobTitle] = useState("");

  const handleApply = (jobTitle: string) => {
    setSelectedJobTitle(jobTitle);
    setDialogOpen(true);
  };

  const benefits = [
    {
      icon: Heart,
      title: "Health & Wellness",
      description: "Comprehensive health, dental, and vision coverage for you and your family"
    },
    {
      icon: Award,
      title: "Career Growth",
      description: "Clear advancement paths with ongoing training and certification opportunities"
    },
    {
      icon: GraduationCap,
      title: "Continuous Learning",
      description: "Paid training, certifications, and attendance at industry conferences"
    },
    {
      icon: Shield,
      title: "Safety First",
      description: "Industry-leading safety equipment, training, and protocols to protect our team"
    },
    {
      icon: Calendar,
      title: "Work-Life Balance",
      description: "Competitive PTO, flexible scheduling, and paid holidays"
    },
    {
      icon: HardHat,
      title: "Competitive Pay",
      description: "Industry-leading wages with performance bonuses and profit sharing"
    }
  ];

  const openPositions = [
    {
      title: "Project Superintendent",
      location: "Greater Toronto Area",
      type: "Full-time",
      description: "Lead on-site construction operations for commercial and multi-family projects. Coordinate trades, manage schedules, ensure quality and safety compliance.",
      requirements: ["5+ years construction supervision experience", "Strong leadership and communication skills", "Knowledge of Ontario Building Code and safety regulations", "Experience with commercial or multi-family projects", "OSHA/COR certification preferred"]
    },
    {
      title: "Construction Project Coordinator",
      location: "Mississauga Office",
      type: "Full-time",
      description: "Support project management team with scheduling, documentation, and client communication. Ideal for career growth into project management.",
      requirements: ["1-3 years construction industry experience", "Strong organizational and computer skills", "Proficiency in MS Office and project management software", "Excellent communication skills", "Post-secondary education in construction management or related field preferred"]
    },
    {
      title: "Construction Estimator",
      location: "Hybrid - GTA",
      type: "Full-time",
      description: "Prepare detailed cost estimates for commercial and multi-family construction projects. Analyze plans, specifications, and scopes of work.",
      requirements: ["3+ years construction estimating experience", "Proficiency in estimating software (ProEst, PlanSwift, or similar)", "Strong analytical and mathematical skills", "Knowledge of construction methods and materials", "Diploma or degree in construction management, engineering, or related field"]
    },
    {
      title: "Site Foreman - Multi-Family",
      location: "Greater Toronto Area",
      type: "Full-time",
      description: "Supervise daily field operations for multi-family construction projects. Direct trade crews, ensure quality workmanship, and maintain safety standards.",
      requirements: ["5+ years field supervision experience in construction", "Trade certification or equivalent experience", "Strong leadership and problem-solving skills", "Working at Heights and Fall Protection certified", "Valid Ontario driver's license"]
    }
  ];

  return (
    <div className="min-h-screen">
      <SEO 
        title="Careers | Join Our Envelope Restoration Team"
        description="Join Ascent Group Construction and build your career in building envelope restoration. Project managers, superintendents, estimators, and skilled trades positions across the GTA. Competitive pay and growth opportunities."
        keywords="construction careers GTA, project manager jobs toronto, construction superintendent, estimator jobs ontario, envelope restoration careers, specialty contractor jobs, construction jobs toronto"
      />
      <Navigation />

      <PageHeader
        title="Join Our Team"
        description="Build your career with a company that values quality, safety, and professional growth across the Greater Toronto Area."
        backgroundImage={heroImage}
        cta={{ label: "View Open Positions", href: "#open-positions" }}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Careers" }
        ]}
      />
      
      <main>

        {/* Why Join Us */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">Why Choose Ascent Group?</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                We invest in our people because they're the foundation of our success
              </p>
            </div>

            <ScrollReveal direction="up">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
              {benefits.map((benefit, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                      <benefit.icon className="w-7 h-7 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">{benefit.title}</h3>
                    <p className="text-muted-foreground">{benefit.description}</p>
                  </CardContent>
                </Card>
                ))}
            </div>
            </ScrollReveal>
          </div>
        </section>

        {/* Open Positions */}
        <section className="py-20 bg-muted">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">Current Openings</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Explore opportunities to join our growing team
              </p>
            </div>

            <div className="max-w-7xl mx-auto space-y-6">
              {openPositions.map((position, index) => (
                <Card key={index} className="hover:shadow-lg transition-all hover:border-primary/30">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                      <div>
                        <h3 className="text-2xl font-bold text-primary mb-2">{position.title}</h3>
                        <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                        {position.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Briefcase className="w-4 h-4" />
                        {position.type}
                      </span>
                    </div>
                  </div>
                  <Button 
                    variant="primary"
                    onClick={() => handleApply(position.title)}
                  >
                    Apply Now
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                    </div>
                    
                    <p className="text-muted-foreground mb-4">{position.description}</p>
                    
                    <div className="border-t pt-4">
                      <p className="text-sm font-semibold mb-2">Requirements:</p>
                      <ul className="space-y-1">
                        {position.requirements.map((req, idx) => (
                          <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                            <span className="text-primary mt-1">•</span>
                            {req}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Culture Section */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-7xl mx-auto">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <h2 className="text-4xl font-bold mb-6">Our Culture</h2>
                  <div className="space-y-4 text-muted-foreground">
                    <p>
                      At Ascent Group Construction, we believe that great work comes from great teams. 
                      We foster a culture of respect, collaboration, and continuous improvement.
                    </p>
                    <p>
                      Every team member, from apprentices to senior craftsmen, plays a vital role in 
                      our success. We celebrate achievements, support each other through challenges, 
                      and maintain a safe, inclusive environment where everyone can thrive.
                    </p>
                    <p>
                      Our commitment to excellence extends beyond our projects—it's reflected in how 
                      we treat our people and invest in their futures.
                    </p>
                  </div>
                </div>
                
                <Card className="bg-primary text-primary-foreground">
                  <CardContent className="p-8">
                    <HardHat className="w-16 h-16 mb-6 text-secondary" />
                    <h3 className="text-2xl font-bold mb-4">Join Our Team Today</h3>
                    <p className="mb-6 opacity-90">
                      Don't see the perfect position? We're always interested in connecting with 
                      talented professionals. Send us your resume and let's talk about your future.
                    </p>
                    <Button 
                      size="lg" 
                      className="w-full"
                      onClick={() => handleApply("General Application")}
                    >
                      Submit Your Resume
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <ResumeSubmissionDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        jobTitle={selectedJobTitle}
      />
      
      <Footer />
    </div>
  );
};

export default Careers;
