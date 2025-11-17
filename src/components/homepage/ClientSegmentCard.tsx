import { ReactNode } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/ui/Button";
import { Link } from "react-router-dom";
import { CheckCircle2, LucideIcon } from "lucide-react";

interface ClientSegmentCardProps {
  icon: LucideIcon;
  title: string;
  services: string[];
  ctaText: string;
  ctaUrl: string;
}

const ClientSegmentCard = ({ icon: Icon, title, services, ctaText, ctaUrl }: ClientSegmentCardProps) => {
  return (
    <Card className="group h-full p-6 rounded-xl bg-gradient-to-br from-background to-muted/30 border-2 border-construction-orange/20 hover:border-construction-orange/40 hover:shadow-lg transition-all duration-500 hover:scale-[1.02]">
      <div className="h-full flex flex-col">
        {/* Icon & Title */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-construction-orange/10 flex items-center justify-center flex-shrink-0 group-hover:bg-construction-orange/20 transition-colors duration-300">
            <Icon className="w-6 h-6 text-construction-orange" />
          </div>
          <h3 className="text-xl font-bold text-foreground leading-tight">
            {title}
          </h3>
        </div>

        {/* Services List */}
        <ul className="space-y-3 mb-6 flex-1">
          {services.map((service, idx) => (
            <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
              <CheckCircle2 className="w-4 h-4 text-construction-orange flex-shrink-0 mt-0.5" />
              <span>{service}</span>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <Button asChild className="w-full bg-construction-orange hover:bg-construction-orange/90 shadow-md hover:shadow-lg transition-all duration-300">
          <Link to={ctaUrl}>{ctaText}</Link>
        </Button>
      </div>
    </Card>
  );
};

export default ClientSegmentCard;
