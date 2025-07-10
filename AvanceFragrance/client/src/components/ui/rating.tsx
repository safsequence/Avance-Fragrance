import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface RatingProps {
  rating: number;
  maxRating?: number;
  size?: "sm" | "md" | "lg";
  showNumber?: boolean;
  interactive?: boolean;
  onRatingChange?: (rating: number) => void;
}

export function Rating({ 
  rating, 
  maxRating = 5, 
  size = "md", 
  showNumber = false, 
  interactive = false,
  onRatingChange 
}: RatingProps) {
  const sizeClasses = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-5 h-5"
  };

  const handleStarClick = (starRating: number) => {
    if (interactive && onRatingChange) {
      onRatingChange(starRating);
    }
  };

  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center">
        {Array.from({ length: maxRating }, (_, index) => {
          const starRating = index + 1;
          const isFilled = starRating <= rating;
          const isPartial = starRating - 1 < rating && starRating > rating;
          
          return (
            <Star
              key={index}
              className={cn(
                sizeClasses[size],
                "transition-colors",
                isFilled || isPartial
                  ? "fill-yellow-400 text-yellow-400"
                  : "fill-gray-300 text-gray-300 dark:fill-gray-600 dark:text-gray-600",
                interactive && "cursor-pointer hover:scale-110"
              )}
              onClick={() => handleStarClick(starRating)}
            />
          );
        })}
      </div>
      {showNumber && (
        <span className="text-sm text-muted-foreground ml-1">
          ({rating.toFixed(1)})
        </span>
      )}
    </div>
  );
}