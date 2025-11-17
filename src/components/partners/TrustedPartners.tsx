import { ExternalLink, Building2, Factory, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import nobleExteriors from "@/assets/partners/noble-exteriors.webp";
import eagleContracting from "@/assets/partners/eagle-contracting.png";
import eagleCladding from "@/assets/partners/eagle-cladding.png";
import miralCladding from "@/assets/partners/miral-cladding.png";
import elipsYapi from "@/assets/partners/elips-yapi.png";
import ostim from "@/assets/partners/ostim.png";
import silverstone from "@/assets/partners/silverstone.png";
import durmusGroup from "@/assets/partners/durmus-group.png";
import skocc from "@/assets/partners/skocc.jpg";
import musiadCanada from "@/assets/partners/musiad-canada.svg";

interface Partner {
  name: string;
  url: string;
  category: "installation" | "fabrication" | "affiliations";
  logo: string;
}

interface TrustedPartnersProps {
  variant?: "simple" | "grouped";
  background?: "default" | "muted";
  showDescription?: boolean;
}

const partners: Partner[] = [
  { name: "Noble Exteriors", url: "https://www.nobleexteriors.ca/", category: "installation", logo: nobleExteriors },
  { name: "Eagle Contracting Inc.", url: "https://eaglecontractinginc.ca/services/", category: "installation", logo: eagleContracting },
  { name: "Eagle Cladding", url: "https://eaglecladding.com/", category: "installation", logo: eagleCladding },
  { name: "Miral Cladding", url: "https://miralcladding.com/", category: "fabrication", logo: miralCladding },
  { name: "Elips Yapı", url: "https://elipsyapi.com.tr/", category: "fabrication", logo: elipsYapi },
  { name: "OSTIM", url: "https://ostim.ca/services/", category: "fabrication", logo: ostim },
  { name: "My Silverstone Ltd.", url: "http://www.mysilverstoneltd.com/", category: "fabrication", logo: silverstone },
  { name: "Durmus Group", url: "https://www.durmusgroup.ca/", category: "fabrication", logo: durmusGroup },
  { name: "SKOCC", url: "https://skocc.ca/", category: "fabrication", logo: skocc },
  { name: "MÜSİAD Canada", url: "https://musiadcanada.org/", category: "affiliations", logo: musiadCanada },
];

const categoryConfig = {
  installation: {
    title: "Installation & Contracting",
    icon: Building2,
    description: "Trusted partners for professional installation and contracting services"
  },
  fabrication: {
    title: "Fabrication & Supply",
    icon: Factory,
    description: "Quality materials and fabrication from specialized suppliers"
  },
  affiliations: {
    title: "Affiliations & Community",
    icon: Users,
    description: "Professional associations and industry memberships"
  }
};

export function TrustedPartners({ 
  variant = "simple", 
  background = "default",
  showDescription = true 
}: TrustedPartnersProps) {
  const sectionClasses = cn(
    "py-24",
    background === "muted" && "bg-muted/30"
  );

  const PartnerCard = ({ partner }: { partner: Partner }) => (
    <Card className="group hover:shadow-xl hover:border-primary/30 transition-all h-full overflow-hidden">
      <CardContent className="p-0">
        <a
          href={partner.url}
          target="_blank"
          rel="noopener noreferrer"
          className="block relative"
        >
          <div className="aspect-[4/3] bg-gradient-to-br from-muted/30 to-muted/10 flex items-center justify-center p-6 relative overflow-hidden">
            <img
              src={partner.logo}
              alt={`${partner.name} logo`}
              className="w-full h-full object-contain transition-all duration-300 group-hover:scale-110 filter grayscale group-hover:grayscale-0"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <ExternalLink className="absolute bottom-3 right-3 w-5 h-5 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <div className="p-4 text-center border-t bg-card">
            <span className="font-medium text-sm text-foreground group-hover:text-primary transition-colors line-clamp-1">
              {partner.name}
            </span>
          </div>
        </a>
      </CardContent>
    </Card>
  );

  const renderGrouped = () => {
    const categories = ["installation", "fabrication", "affiliations"] as const;
    
    return (
      <div className="space-y-16">
        {categories.map((category) => {
          const categoryPartners = partners.filter(p => p.category === category);
          const config = categoryConfig[category];
          const IconComponent = config.icon;
          
          return (
            <div key={category}>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <IconComponent className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold">{config.title}</h3>
                  {showDescription && (
                    <p className="text-sm text-muted-foreground">{config.description}</p>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {categoryPartners.map((partner) => (
                  <PartnerCard key={partner.name} partner={partner} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderSimple = () => (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {partners.map((partner) => (
        <PartnerCard key={partner.name} partner={partner} />
      ))}
    </div>
  );

  return (
    <section className={sectionClasses}>
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Trusted Partners & Affiliations
            </h2>
            {showDescription && (
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                Delivering excellence through collaboration with specialized fabricators, 
                installers, suppliers, and industry associations
              </p>
            )}
          </div>

          {variant === "grouped" ? renderGrouped() : renderSimple()}

          <div className="mt-12 text-center">
            <p className="text-xs text-muted-foreground max-w-2xl mx-auto">
              Company names and logos are property of their respective owners. 
              Relationships may include partnerships, affiliations, and professional associations.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
