import { LucideIcon, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/design-system/components/Card";
import { Button } from "@/ui/Button";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface ClientSegmentCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  link: string;
  examples?: string[];
  className?: string;
}

export const ClientSegmentCard = ({ 
  icon: Icon, 
  title, 
  description, 
  link,
  examples = [],
  className 
}: ClientSegmentCardProps) => {
  return (
    <Card variant="interactive" hover className={cn("h-full", className)}>
      <CardContent className="p-8 flex flex-col h-full">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
          <Icon className="w-8 h-8 text-primary" />
        </div>
        <h3 className="text-2xl font-bold text-foreground mb-3">{title}</h3>
        <p className="text-muted-foreground leading-relaxed mb-4 flex-grow">
          {description}
        </p>
        {examples.length > 0 && (
          <ul className="space-y-2 mb-6 text-sm text-muted-foreground">
            {examples.map((example, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span>{example}</span>
              </li>
            ))}
          </ul>
        )}
        <Button asChild variant="outline" className="group w-full">
          <Link to={link}>
            Learn More
            <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
};
