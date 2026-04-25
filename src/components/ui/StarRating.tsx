import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  rating: number; // 0-5
  maxRating?: number;
  size?: "sm" | "md" | "lg";
  showValue?: boolean;
  className?: string;
}

export const StarRating = ({ 
  rating, 
  maxRating = 5, 
  size = "md", 
  showValue = false,
  className 
}: StarRatingProps) => {
  const sizeClasses = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  };

  const renderStars = () => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 1; i <= maxRating; i++) {
      if (i <= fullStars) {
        // Full star
        stars.push(
          <Star
            key={i}
            className={cn(sizeClasses[size], "fill-warning text-warning")}
          />
        );
      } else if (i === fullStars + 1 && hasHalfStar) {
        // Half star
        stars.push(
          <div key={i} className="relative">
            <Star className={cn(sizeClasses[size], "text-muted-foreground")} />
            <div className="absolute inset-0 overflow-hidden" style={{ width: "50%" }}>
              <Star className={cn(sizeClasses[size], "fill-warning text-warning")} />
            </div>
          </div>
        );
      } else {
        // Empty star
        stars.push(
          <Star
            key={i}
            className={cn(sizeClasses[size], "text-muted-foreground")}
          />
        );
      }
    }

    return stars;
  };

  return (
    <div className={cn("flex items-center gap-1", className)}>
      {renderStars()}
      {showValue && (
        <span className="ml-1 text-sm text-muted-foreground">
          ({rating.toFixed(1)})
        </span>
      )}
    </div>
  );
};
