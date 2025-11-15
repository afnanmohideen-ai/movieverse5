import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface RecommendationCardProps {
  title: string;
  item: any;
  type: "movie" | "tv";
}

export const TodaysRecommendation = ({ title, item, type }: RecommendationCardProps) => {
  const navigate = useNavigate();

  if (!item) return null;

  const handleClick = () => {
    navigate(`/${type}/${item.id}`);
  };

  return (
    <Card className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow" onClick={handleClick}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Sparkles className="w-5 h-5 text-primary" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-4">
          <img
            src={`https://image.tmdb.org/t/p/w200${item.poster_path}`}
            alt={item.title || item.name}
            className="w-24 h-36 object-cover rounded"
          />
          <div className="flex-1">
            <h3 className="font-semibold text-lg mb-1">
              {item.title || item.name}
            </h3>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="secondary">
                ⭐ {item.vote_average?.toFixed(1)}
              </Badge>
              <span className="text-sm text-muted-foreground">
                {item.release_date?.split('-')[0] || item.first_air_date?.split('-')[0]}
              </span>
            </div>
            <p className="text-sm text-muted-foreground line-clamp-3">
              {item.overview}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
