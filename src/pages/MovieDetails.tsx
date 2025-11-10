import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Calendar, Star, Clock, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/Navbar";
import { useMovieDetails, useWatchProviders, getImageUrl } from "@/hooks/useMovies";
import { useWatchlist } from "@/hooks/useWatchlist";
import { useToast } from "@/hooks/use-toast";

const MovieDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const movieId = parseInt(id || "0");
  
  const { data: movie, isLoading } = useMovieDetails(movieId);
  const { data: watchProvidersData } = useWatchProviders(movieId);
  const { isInWatchlist, toggleWatchlist } = useWatchlist();

  const watchProviders = watchProvidersData?.results?.US;
  const isInList = isInWatchlist(movieId);

  const handleWatchlistToggle = () => {
    toggleWatchlist(movieId);
    toast({
      title: isInList ? "Removed from watchlist" : "Added to watchlist",
      description: isInList
        ? "Movie removed from your watchlist"
        : "Movie added to your watchlist",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent" />
        </div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-3xl font-bold mb-4">Movie not found</h1>
          <Button onClick={() => navigate("/")}>Go Home</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section with Backdrop */}
      <div className="relative h-[60vh] overflow-hidden mt-16">
        <div
          className="absolute inset-0 bg-cover bg-center scale-110"
          style={{ backgroundImage: `url(${getImageUrl(movie.backdrop_path, "original")})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/60 to-background" />
        </div>

        <div className="relative container mx-auto px-4 h-full flex items-end pb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/")}
            className="absolute top-4 left-4 gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 -mt-32 relative z-10">
        <div className="grid md:grid-cols-[300px_1fr] gap-8 mb-12">
          {/* Poster */}
          <div className="mx-auto md:mx-0">
            <img
              src={getImageUrl(movie.poster_path)}
              alt={movie.title}
              className="w-full rounded-2xl shadow-elegant border border-border/50"
            />
          </div>

          {/* Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-5xl font-bold text-foreground mb-2">{movie.title}</h1>
              {movie.tagline && (
                <p className="text-xl text-muted-foreground italic">{movie.tagline}</p>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2 bg-primary/20 px-4 py-2 rounded-full">
                <Star className="w-5 h-5 fill-primary text-primary" />
                <span className="font-bold text-lg">{movie.vote_average.toFixed(1)}</span>
              </div>

              {movie.release_date && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="w-5 h-5" />
                  <span>{new Date(movie.release_date).getFullYear()}</span>
                </div>
              )}

              {movie.runtime && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="w-5 h-5" />
                  <span>{movie.runtime} min</span>
                </div>
              )}

              <Button
                variant={isInList ? "default" : "outline"}
                size="sm"
                onClick={handleWatchlistToggle}
                className="gap-2"
              >
                <Heart className={`w-4 h-4 ${isInList ? "fill-current" : ""}`} />
                {isInList ? "In Watchlist" : "Add to Watchlist"}
              </Button>
            </div>

            {movie.genres && movie.genres.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {movie.genres.map((genre) => (
                  <Badge key={genre.id} variant="secondary" className="text-sm">
                    {genre.name}
                  </Badge>
                ))}
              </div>
            )}

            <div className="bg-card/50 backdrop-blur-xl border border-border/50 rounded-2xl p-6">
              <h2 className="text-2xl font-bold mb-3">Overview</h2>
              <p className="text-muted-foreground leading-relaxed">{movie.overview}</p>
            </div>

            {/* Streaming Providers */}
            {watchProviders && (
              <div className="bg-card/50 backdrop-blur-xl border border-border/50 rounded-2xl p-6">
                <h2 className="text-2xl font-bold mb-4">Where to Watch</h2>
                
                {watchProviders.flatrate && watchProviders.flatrate.length > 0 && (
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold mb-3 text-muted-foreground">Stream</h3>
                    <div className="flex flex-wrap gap-3">
                      {watchProviders.flatrate.map((provider) => (
                        <div
                          key={provider.provider_id}
                          className="flex flex-col items-center gap-2"
                          title={provider.provider_name}
                        >
                          <img
                            src={getImageUrl(provider.logo_path)}
                            alt={provider.provider_name}
                            className="w-12 h-12 rounded-xl"
                          />
                          <span className="text-xs text-center max-w-[60px]">
                            {provider.provider_name}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {watchProviders.rent && watchProviders.rent.length > 0 && (
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold mb-3 text-muted-foreground">Rent</h3>
                    <div className="flex flex-wrap gap-3">
                      {watchProviders.rent.map((provider) => (
                        <div
                          key={provider.provider_id}
                          className="flex flex-col items-center gap-2"
                          title={provider.provider_name}
                        >
                          <img
                            src={getImageUrl(provider.logo_path)}
                            alt={provider.provider_name}
                            className="w-12 h-12 rounded-xl"
                          />
                          <span className="text-xs text-center max-w-[60px]">
                            {provider.provider_name}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {watchProviders.buy && watchProviders.buy.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3 text-muted-foreground">Buy</h3>
                    <div className="flex flex-wrap gap-3">
                      {watchProviders.buy.map((provider) => (
                        <div
                          key={provider.provider_id}
                          className="flex flex-col items-center gap-2"
                          title={provider.provider_name}
                        >
                          <img
                            src={getImageUrl(provider.logo_path)}
                            alt={provider.provider_name}
                            className="w-12 h-12 rounded-xl"
                          />
                          <span className="text-xs text-center max-w-[60px]">
                            {provider.provider_name}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {!watchProviders.flatrate && !watchProviders.rent && !watchProviders.buy && (
                  <p className="text-muted-foreground">
                    No streaming information available for your region.
                  </p>
                )}

                {watchProviders.link && (
                  <a
                    href={watchProviders.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline text-sm mt-4 inline-block"
                  >
                    View more options on JustWatch →
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;
