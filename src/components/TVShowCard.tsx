import { useState } from "react";
import { Star, Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useSupabaseWatchlist } from "@/hooks/useSupabaseWatchlist";
import { useToast } from "@/hooks/use-toast";

interface TVShowCardProps {
  id: number;
  name: string;
  posterPath: string;
  firstAirDate: string;
  rating: number;
  userRating?: number;
  onRate?: (rating: number) => void;
}

export const TVShowCard = ({
  id,
  name,
  posterPath,
  firstAirDate,
  rating,
  userRating,
  onRate,
}: TVShowCardProps) => {
  const [hoveredStar, setHoveredStar] = useState<number | null>(null);
  const navigate = useNavigate();
  const { isInWatchlist, toggleWatchlist } = useSupabaseWatchlist();
  const { toast } = useToast();
  const isInList = isInWatchlist(id, "tv");

  const imageUrl = posterPath 
    ? `https://image.tmdb.org/t/p/w500${posterPath}`
    : "/placeholder.svg";

  const handleWatchlistClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWatchlist(id, "tv");
    toast({
      title: isInList ? "Removed from watchlist" : "Added to watchlist",
      description: isInList
        ? `${name} removed from your watchlist`
        : `${name} added to your watchlist`,
    });
  };

  const handleCardClick = () => {
    navigate(`/tv/${id}`);
  };

  const handleStarClick = (e: React.MouseEvent, starRating: number) => {
    e.stopPropagation();
    onRate?.(starRating);
  };

  return (
    <Card
      className="group relative overflow-hidden bg-card/50 backdrop-blur-sm border border-border/50 hover:border-primary/50 transition-all duration-500 cursor-pointer hover:shadow-elevated hover:-translate-y-2"
      onClick={handleCardClick}
    >
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-2 right-2 z-10 bg-background/80 backdrop-blur-sm hover:bg-background/90"
        onClick={handleWatchlistClick}
      >
        <Heart className={`w-4 h-4 ${isInList ? "fill-primary text-primary" : ""}`} />
      </Button>

      <div className="aspect-[2/3] relative overflow-hidden">
        <img
          src={imageUrl}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
      </div>

      <div className="p-5 space-y-3 bg-gradient-glass backdrop-blur-md border-t border-border/30">
        <div>
          <h3 className="font-semibold text-foreground line-clamp-1 group-hover:text-primary transition-colors duration-300 text-lg">
            {name}
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            {firstAirDate ? new Date(firstAirDate).getFullYear() : "TBA"}
          </p>
        </div>

        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Star className="w-4 h-4 fill-accent text-accent" />
            <span className="font-medium">{rating.toFixed(1)}</span>
          </div>

          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onMouseEnter={() => setHoveredStar(star)}
                onMouseLeave={() => setHoveredStar(null)}
                onClick={(e) => handleStarClick(e, star)}
                className="transition-all duration-200 hover:scale-125 active:scale-95"
              >
                <Star
                  className={cn(
                    "w-4 h-4 transition-all duration-200",
                    (hoveredStar !== null && star <= hoveredStar) ||
                    (hoveredStar === null && userRating && star <= userRating)
                      ? "fill-accent text-accent drop-shadow-[0_0_8px_rgba(234,179,8,0.6)]"
                      : "text-muted-foreground/50 hover:text-muted-foreground"
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
