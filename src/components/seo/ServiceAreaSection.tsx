import { MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface ServiceAreaSectionProps {
  cities: string[];
  radius?: string;
  className?: string;
}

const ServiceAreaSection = ({ 
  cities, 
  radius = "100km", 
  className = "" 
}: ServiceAreaSectionProps) => {
  return (
    <section className={className}>
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold mb-6">Service Area</h2>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start gap-4 mb-4">
              <MapPin className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-semibold mb-2">
                  Serving the Greater Toronto Area
                </h3>
                <p className="text-muted-foreground mb-4">
                  We proudly provide professional construction services throughout the GTA 
                  and surrounding regions within a {radius} radius.
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {cities.map((city, index) => (
                <div 
                  key={index}
                  className="flex items-center gap-2 text-sm"
                >
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <span>{city}</span>
                </div>
              ))}
            </div>
            
            <p className="text-sm text-muted-foreground mt-4 pt-4 border-t">
              <strong>Coverage:</strong> Our service area includes but is not limited to the cities listed above. 
              Contact us for projects in other Ontario locations.
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default ServiceAreaSection;
