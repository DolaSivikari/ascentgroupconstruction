import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { getChallengeColor } from "./challengeMapping";

interface ServiceCardTier3Props {
  id: string;
  name: string;
  slug: string;
  short_description: string | null;
  challenge_tags?: string[] | null;
}

export const ServiceCardTier3 = ({
  name,
  slug,
  short_description,
  challenge_tags,
}: ServiceCardTier3Props) => {
  return (
    <Card className="h-full hover:shadow-md transition-all duration-200">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h4 className="font-semibold text-foreground">{name}</h4>
          {challenge_tags && challenge_tags.length > 0 && (
            <span
              className="text-xs px-2 py-0.5 rounded-full font-medium shrink-0"
              style={{
                backgroundColor: `${getChallengeColor(challenge_tags[0])}15`,
                color: getChallengeColor(challenge_tags[0])
              }}
            >
              {challenge_tags[0]}
            </span>
          )}
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
          {short_description}
        </p>
        <Link 
          to={`/services/${slug}`}
          className="text-sm text-primary hover:text-primary/80 inline-flex items-center gap-1 font-medium transition-colors"
        >
          Learn More
          <ArrowRight className="w-3 h-3" />
        </Link>
      </CardContent>
    </Card>
  );
};
