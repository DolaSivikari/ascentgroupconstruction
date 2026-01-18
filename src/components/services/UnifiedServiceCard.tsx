import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Building2, Wrench, Hammer } from "lucide-react";
import { Link } from "react-router-dom";
import { getChallengeColor } from "./challengeMapping";

interface UnifiedServiceCardProps {
  id: string;
  name: string;
  slug: string;
  short_description: string | null;
  service_tier?: string | null;
  challenge_tags?: string[] | null;
  marketSegment?: 'commercial' | 'residential' | 'both';
}

const getIconForTier = (tier: string | null) => {
  if (tier === 'PRIME_SPECIALTY') return Building2;
  if (tier === 'TRADE_PACKAGE') return Wrench;
  return Hammer;
};

const getTierBadge = (tier: string | null) => {
  if (tier === 'PRIME_SPECIALTY') {
    return (
      <span className="text-xs px-3 py-1 rounded-full font-semibold bg-primary text-primary-foreground">
        Prime Specialty
      </span>
    );
  }
  if (tier === 'TRADE_PACKAGE') {
    return (
      <span className="text-xs px-2 py-1 rounded-full font-medium bg-muted text-muted-foreground">
        Trade Package
      </span>
    );
  }
  return (
    <span className="text-xs px-2 py-1 rounded-full font-medium bg-secondary/20 text-secondary-foreground">
      Self-Perform
    </span>
  );
};

const getIconColors = (segment: 'commercial' | 'residential' | 'both') => {
  switch (segment) {
    case 'commercial':
      return {
        bg: 'bg-primary/10',
        text: 'text-primary',
      };
    case 'residential':
      return {
        bg: 'bg-orange-500/10',
        text: 'text-orange-500',
      };
    case 'both':
      return {
        bg: 'bg-secondary/10',
        text: 'text-secondary-foreground',
      };
  }
};

export const UnifiedServiceCard = ({
  name,
  slug,
  short_description,
  service_tier,
  challenge_tags,
  marketSegment = 'commercial',
}: UnifiedServiceCardProps) => {
  const Icon = getIconForTier(service_tier);
  const iconColors = getIconColors(marketSegment);
  
  return (
    <Card variant="interactive" className="h-full min-h-[360px] flex flex-col">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className={`w-14 h-14 rounded-lg ${iconColors.bg} flex items-center justify-center flex-shrink-0`}>
            <Icon className={`w-7 h-7 ${iconColors.text}`} />
          </div>
          <div className="flex flex-wrap gap-1 justify-end">
            {getTierBadge(service_tier)}
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
        <CardTitle className="text-xl">{name}</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col justify-between">
        <p className="text-base text-muted-foreground line-clamp-3 mb-6">
          {short_description}
        </p>
        
        <Button asChild variant="secondary" className="w-full group">
          <Link to={`/services/${slug}`} className="flex items-center justify-center gap-2">
            Learn More
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
};
