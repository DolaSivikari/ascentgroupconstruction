import { MapPin, CheckCircle2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface ServiceCitySectionProps {
  serviceName: string;
  serviceSlug: string;
  recentProjects?: {
    title: string;
    location: string;
    description: string;
  }[];
  faqs?: {
    question: string;
    answer: string;
  }[];
}

const gtaCities = [
  { name: "Toronto", highlight: true },
  { name: "Mississauga", highlight: true },
  { name: "Scarborough", highlight: true },
  { name: "North York", highlight: true },
  { name: "Etobicoke", highlight: true },
  { name: "Brampton", highlight: false },
  { name: "Vaughan", highlight: false },
  { name: "Markham", highlight: false },
  { name: "Richmond Hill", highlight: false },
  { name: "Oakville", highlight: false },
];

export const ServiceCitySection = ({ 
  serviceName, 
  serviceSlug,
  recentProjects,
  faqs 
}: ServiceCitySectionProps) => {
  return (
    <section className="py-16 bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4">
        {/* Main City Section */}
        <div className="max-w-4xl mx-auto mb-12 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-6">
            <MapPin className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Serving the Greater Toronto Area</span>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            {serviceName} in Toronto & the GTA
          </h2>
          
          <p className="text-lg text-muted-foreground leading-relaxed">
            Serving commercial and multi-family clients across <strong>Toronto</strong>, <strong>Mississauga</strong>, 
            {" "}<strong>Scarborough</strong>, <strong>North York</strong>, <strong>Etobicoke</strong>, Brampton, Vaughan, 
            Markham, Richmond Hill, and Oakville with proven expertise in {serviceName.toLowerCase()}.
          </p>
        </div>

        {/* Service Areas Grid */}
        <div className="max-w-5xl mx-auto mb-16">
          <h3 className="text-xl font-semibold mb-6 text-center">Our Service Area</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {gtaCities.map((city) => (
              <Card 
                key={city.name}
                className={`
                  text-center transition-all duration-300 hover:scale-105 hover:shadow-lg
                  ${city.highlight ? 'border-primary/50 bg-primary/5' : 'bg-card'}
                `}
              >
                <CardContent className="p-4">
                  <CheckCircle2 className={`w-5 h-5 mx-auto mb-2 ${city.highlight ? 'text-primary' : 'text-muted-foreground'}`} />
                  <p className={`font-medium text-sm ${city.highlight ? 'text-primary' : 'text-foreground'}`}>
                    {city.name}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Recent Projects in GTA Cities */}
        {recentProjects && recentProjects.length > 0 && (
          <div className="max-w-4xl mx-auto mb-16">
            <h3 className="text-2xl font-bold mb-6">Recent {serviceName} Projects in the GTA</h3>
            <div className="space-y-4">
              {recentProjects.map((project, index) => (
                <Card key={index} className="border-l-4 border-l-primary">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                      <div>
                        <h4 className="font-semibold text-lg mb-1">{project.title}</h4>
                        <p className="text-sm text-primary mb-2">{project.location}</p>
                        <p className="text-muted-foreground">{project.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* City-Specific FAQs */}
        {faqs && faqs.length > 0 && (
          <div className="max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold mb-6">
              {serviceName} in Toronto & the GTA – Common Questions
            </h3>
            <div className="space-y-6">
              {faqs.map((faq, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <h4 className="font-semibold text-lg mb-3 text-foreground">
                      {faq.question}
                    </h4>
                    <p className="text-muted-foreground leading-relaxed">
                      {faq.answer}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
