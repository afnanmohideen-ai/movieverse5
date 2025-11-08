import { useState } from "react";
import { Star } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface MovieCardProps {
  id: number;
  title: string;
  posterPath: string;
  releaseDate: string;
  rating: number;
  userRating?: number;
  onRate?: (rating: number) => void;
  onClick?: () => void;
}

export const MovieCard = ({
  title,
  posterPath,
  releaseDate,
  rating,
  userRating,
  onRate,
  onClick,
}: MovieCardProps) => {
  const [hoveredStar, setHoveredStar] = useState<number | null>(null);

  const handleStarClick = (starRating: number) => {
    if (onRate) {
      onRate(starRating);
    }
  };

  return (
    <Card
      className="group relative overflow-hidden bg-card border-border hover:border-primary transition-all duration-300 cursor-pointer hover:shadow-glow"
      onClick={onClick}
    >
      <div className="aspect-[2/3] relative overflow-hidden">
        <img
          src={posterPath}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      <div className="p-4 space-y-3">
        <div>
          <h3 className="font-semibold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
            {title}
          </h3>
          <p className="text-sm text-muted-foreground">
            {new Date(releaseDate).getFullYear()}
          </p>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Star className="w-4 h-4 fill-accent text-accent" />
            <span>{rating.toFixed(1)}</span>
          </div>

          <div 
            className="flex gap-1"
            onClick={(e) => e.stopPropagation()}
          >
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onMouseEnter={() => setHoveredStar(star)}
                onMouseLeave={() => setHoveredStar(null)}
                onClick={() => handleStarClick(star)}
                className="transition-transform hover:scale-110"
              >
                <Star
                  className={cn(
                    "w-4 h-4 transition-colors",
                    (hoveredStar !== null && star <= hoveredStar) ||
                    (hoveredStar === null && userRating && star <= userRating)
                      ? "fill-accent text-accent"
                      : "text-muted-foreground"
                  )}
                />
              </button>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
};
