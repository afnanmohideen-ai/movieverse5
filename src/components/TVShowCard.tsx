import { useState } from "react";
import { Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface TVShowCardProps {
  id: number;
  name: string;
  posterPath: string;
  firstAirDate: string;
  rating: number;
}

export const TVShowCard = ({
  id,
  name,
  posterPath,
  firstAirDate,
  rating,
}: TVShowCardProps) => {
  const navigate = useNavigate();

  const imageUrl = posterPath 
    ? `https://image.tmdb.org/t/p/w500${posterPath}`
    : "/placeholder.svg";

  const handleCardClick = () => {
    navigate(`/tv/${id}`);
  };

  return (
    <Card
      className="group relative overflow-hidden bg-card/50 backdrop-blur-sm border border-border/50 hover:border-primary/50 transition-all duration-500 cursor-pointer hover:shadow-elevated hover:-translate-y-2"
      onClick={handleCardClick}
    >
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
        </div>
      </div>
    </Card>
  );
};
