import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronDown, Award, Shield, Clock } from "lucide-react";

export const PremiumServiceHero = () => {

  return (
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-primary/90 via-primary/80 to-primary/70" />
      
      {/* Subtle dark overlay for depth */}
      <div className="absolute inset-0 z-[2] bg-gradient-to-b from-black/10 via-transparent to-black/20" />

      {/* Hero Content */}
      <div className="relative z-20 container mx-auto px-4 text-center text-primary-foreground py-20">
        <div className="max-w-5xl mx-auto animate-fade-in">
          {/* Trust badges strip */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <div className="flex items-center gap-2 bg-primary-foreground/10 backdrop-blur-sm px-4 py-2 rounded-full border border-primary-foreground/20">
              <Award className="w-4 h-4" />
              <span className="text-sm font-medium">COR Certified</span>
            </div>
            <div className="flex items-center gap-2 bg-primary-foreground/10 backdrop-blur-sm px-4 py-2 rounded-full border border-primary-foreground/20">
              <Shield className="w-4 h-4" />
              <span className="text-sm font-medium">$10M Bonding</span>
            </div>
            <div className="flex items-center gap-2 bg-primary-foreground/10 backdrop-blur-sm px-4 py-2 rounded-full border border-primary-foreground/20">
              <Clock className="w-4 h-4" />
              <span className="text-sm font-medium">24/7 Support</span>
            </div>
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            Complete Construction <span className="text-primary-foreground/90">Solutions</span>
          </h1>
          <p className="text-xl md:text-2xl lg:text-3xl mb-10 text-primary-foreground/90 max-w-3xl mx-auto">
            From concept to completion, we deliver excellence across Ontario
          </p>

          {/* Stats display */}
          <div className="flex flex-wrap justify-center gap-8 mb-12">
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold mb-2">500+</div>
              <div className="text-sm md:text-base text-primary-foreground/80">Projects Completed</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold mb-2">98%</div>
              <div className="text-sm md:text-base text-primary-foreground/80">Client Satisfaction</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold mb-2">25+</div>
              <div className="text-sm md:text-base text-primary-foreground/80">Years Experience</div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              size="lg" 
              variant="secondary"
              asChild
              className="w-full sm:w-auto min-w-[220px] text-lg h-14 shadow-xl hover:shadow-2xl hover:scale-105 transition-all"
            >
              <Link to="/contact">Request Site Assessment</Link>
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              asChild
              className="w-full sm:w-auto min-w-[220px] text-lg h-14 border-2 border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10 hover:scale-105 transition-all"
            >
              <Link to="/projects">View Projects</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Animated Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 animate-bounce">
        <ChevronDown className="w-10 h-10 text-primary-foreground" />
      </div>
    </section>
  );
};
