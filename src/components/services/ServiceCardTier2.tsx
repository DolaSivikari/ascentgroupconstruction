import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Wrench } from "lucide-react";
import { Link } from "react-router-dom";
import { getChallengeColor } from "./challengeMapping";

interface ServiceCardTier2Props {
  id: string;
  name: string;
  slug: string;
  short_description: string | null;
  icon_name: string | null;
  challenge_tags?: string[] | null;
  service_tier?: string | null;
}

export const ServiceCardTier2 = ({
  name,
  slug,
  short_description,
  challenge_tags,
  service_tier,
}: ServiceCardTier2Props) => {
  const showTradeBadge = service_tier === 'TRADE_PACKAGE';
  
  return (
    <Card className="h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      <CardHeader>
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center">
            <Wrench className="w-6 h-6 text-accent" />
          </div>
          <div className="flex flex-wrap gap-1 justify-end">
            {showTradeBadge && (
              <span className="text-xs px-2 py-1 rounded-full font-medium bg-muted text-muted-foreground">
                Trade Package Available
              </span>
            )}
            {challenge_tags && challenge_tags.length > 0 && (
              <>
                {challenge_tags.slice(0, 2).map((tag) => (
                  <span
                    key={tag}
                    className="text-xs px-2 py-1 rounded-full font-medium"
                    style={{
                      backgroundColor: `${getChallengeColor(tag)}15`,
                      color: getChallengeColor(tag)
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </>
            )}
          </div>
        </div>
        <CardTitle className="text-lg">{name}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground line-clamp-3">
          {short_description}
        </p>
        
        <Button asChild variant="secondary" size="sm" className="w-full group">
          <Link to={`/services/${slug}`} className="flex items-center justify-center gap-2">
            Schedule Consultation
            <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
};
