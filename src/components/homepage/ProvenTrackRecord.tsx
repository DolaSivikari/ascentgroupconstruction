import { Building, MapPin, HardHat, Award } from "lucide-react";
import MarketChallenge from "./MarketChallenge";
import CompanyResponse from "./CompanyResponse";

const ProvenTrackRecord = () => {
  return (
    <section className="py-12 md:py-16 bg-background">
      <div className="container mx-auto px-4 md:px-6 max-w-7xl">
        
        {/* Section Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Our Track Record
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Proven performance on Ontario's construction landscape and our commitment to quality
          </p>
          <div className="h-1 w-16 bg-construction-orange mx-auto mt-6"></div>
        </div>

        {/* Market Overview - Simplified */}
        <div className="mb-12">
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold text-foreground mb-3">
              Market Overview
            </h3>
            <p className="text-muted-foreground">
              Understanding Ontario's construction sector and building needs
            </p>
          </div>
          
          {/* Static Overview Cards - Construction Context */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-card border-l-4 border-l-construction-orange rounded-r-lg p-6 shadow-md">
              <Award className="text-construction-orange mb-3 h-6 w-6" />
              <div className="text-4xl font-bold text-foreground mb-2">15+</div>
              <div className="text-base font-semibold text-foreground/90 mb-1">Years Experience</div>
              <div className="text-sm text-muted-foreground">Founder's Background</div>
            </div>

            <div className="bg-card border-l-4 border-l-steel-blue rounded-r-lg p-6 shadow-md">
              <Building className="text-steel-blue mb-3 h-6 w-6" />
              <div className="text-4xl font-bold text-foreground mb-2">10+</div>
              <div className="text-base font-semibold text-foreground/90 mb-1">Projects Completed</div>
              <div className="text-sm text-muted-foreground">Since Launch</div>
            </div>

            <div className="bg-card border-l-4 border-l-construction-orange rounded-r-lg p-6 shadow-md">
              <HardHat className="text-construction-orange mb-3 h-6 w-6" />
              <div className="text-4xl font-bold text-foreground mb-2">85%</div>
              <div className="text-base font-semibold text-foreground/90 mb-1">Self-Performed</div>
              <div className="text-sm text-muted-foreground">10-Person Crew</div>
            </div>

            <div className="bg-card border-l-4 border-l-steel-blue rounded-r-lg p-6 shadow-md">
              <MapPin className="text-steel-blue mb-3 h-6 w-6" />
              <div className="text-4xl font-bold text-foreground mb-2">GTA</div>
              <div className="text-base font-semibold text-foreground/90 mb-1">Service Area</div>
              <div className="text-sm text-muted-foreground">Across Ontario</div>
            </div>
          </div>
        </div>

        {/* Challenge + Response Grid */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-10">
          {/* Left: Market Challenge */}
          <MarketChallenge />

          {/* Right: Company Response */}
          <CompanyResponse />
        </div>

      </div>
    </section>
  );
};

export default ProvenTrackRecord;
