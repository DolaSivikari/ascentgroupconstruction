import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Building2 } from "lucide-react";
import { Link } from "react-router-dom";
import { getChallengeColor } from "./challengeMapping";

interface ServiceCardTier1Props {
  id: string;
  name: string;
  slug: string;
  short_description: string | null;
  icon_name: string | null;
  challenge_tags?: string[] | null;
  typical_timeline?: string | null;
  service_tier?: string | null;
}

export const ServiceCardTier1 = ({
  name,
  slug,
  short_description,
  challenge_tags,
  typical_timeline,
  service_tier,
}: ServiceCardTier1Props) => {
  const showPrimeBadge = service_tier === 'PRIME_SPECIALTY';
  
  return (
    <Card className="h-full hover:shadow-xl transition-all duration-300 border-2">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center">
            <Building2 className="w-8 h-8 text-primary" />
          </div>
          <div className="flex flex-wrap gap-2 justify-end">
            {showPrimeBadge && (
              <span className="text-xs px-2 py-1 rounded-full font-medium bg-primary text-primary-foreground">
                Prime Specialty
              </span>
            )}
            {challenge_tags && challenge_tags.length > 0 && (
              <>
                {challenge_tags.slice(0, 2).map((tag) => (
                  <span
                    key={tag}
                    className="text-xs px-3 py-1 rounded-full font-semibold"
                    style={{
                      backgroundColor: `${getChallengeColor(tag)}20`,
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
        <CardTitle className="text-2xl">{name}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <p className="text-muted-foreground leading-relaxed">
          {short_description}
        </p>
        
        {typical_timeline && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">Typical Timeline:</span>
            {typical_timeline}
          </div>
        )}
        
        <div className="pt-4 border-t border-border">
          <Button asChild size="lg" className="w-full group">
            <Link to={`/services/${slug}`} className="flex items-center justify-center gap-2">
              Request Capability Statement
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
