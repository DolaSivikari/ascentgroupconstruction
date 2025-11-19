import { StarRating } from "./StarRating";
import { cn } from "@/lib/utils";

interface AggregateRatingDisplayProps {
  rating: {
    ratingValue: string;
    reviewCount: string;
    bestRating?: string;
    worstRating?: string;
  };
  size?: "sm" | "md" | "lg";
  showReviewCount?: boolean;
  className?: string;
}

/**
 * Display aggregate rating with stars and review count
 * Follows Google Rich Results guidelines
 */
export const AggregateRatingDisplay = ({ 
  rating, 
  size = "md", 
  showReviewCount = true,
  className 
}: AggregateRatingDisplayProps) => {
  const ratingValue = parseFloat(rating.ratingValue);
  const reviewCount = parseInt(rating.reviewCount);

  // Don't render if no ratings
  if (reviewCount === 0 || ratingValue === 0) {
    return null;
  }

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <StarRating rating={ratingValue} size={size} />
      {showReviewCount && (
        <span className="text-sm text-muted-foreground">
          {ratingValue.toFixed(1)} ({reviewCount} {reviewCount === 1 ? "review" : "reviews"})
        </span>
      )}
    </div>
  );
};
