import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Calendar, Star, Play, User, ExternalLink, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Navbar } from "@/components/Navbar";
import { useTVShowDetails, useTVShowVideos, useTVShowWatchProviders, useTVShowReviews, useTVShowCredits } from "@/hooks/useTVShows";
import { getImageUrl } from "@/hooks/useMovies";

const TVShowDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const tvShowId = parseInt(id || "0");
  
  const { data: tvShow, isLoading } = useTVShowDetails(tvShowId);
  const { data: videos } = useTVShowVideos(tvShowId);
  const { data: watchProvidersData } = useTVShowWatchProviders(tvShowId);
  const { data: reviews } = useTVShowReviews(tvShowId);
  const { data: credits } = useTVShowCredits(tvShowId);

  const watchProviders = watchProvidersData?.results?.US;
  const trailers = videos?.filter(v => v.type === "Trailer" && v.site === "YouTube") || [];
  const creators = tvShow?.created_by || [];
  const topCast = credits?.cast.slice(0, 10) || [];

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

  if (!tvShow) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-3xl font-bold mb-4">TV Show not found</h1>
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
          style={{ backgroundImage: `url(${getImageUrl(tvShow.backdrop_path, "original")})` }}
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
              src={getImageUrl(tvShow.poster_path)}
              alt={tvShow.name}
              className="w-full rounded-2xl shadow-elegant border border-border/50"
            />
          </div>

          {/* Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-5xl font-bold text-foreground mb-2">{tvShow.name}</h1>
              {tvShow.tagline && (
                <p className="text-xl text-muted-foreground italic">{tvShow.tagline}</p>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2 bg-primary/20 px-4 py-2 rounded-full">
                <Star className="w-5 h-5 fill-primary text-primary" />
                <span className="font-bold text-lg">{tvShow.vote_average.toFixed(1)}</span>
              </div>

              {tvShow.first_air_date && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="w-5 h-5" />
                  <span>{new Date(tvShow.first_air_date).getFullYear()}</span>
                </div>
              )}

              <Badge variant="secondary">
                {tvShow.number_of_seasons} Season{tvShow.number_of_seasons !== 1 ? 's' : ''}
              </Badge>

              <Badge variant="secondary">
                {tvShow.number_of_episodes} Episodes
              </Badge>
            </div>

            {tvShow.genres && tvShow.genres.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tvShow.genres.map((genre) => (
                  <Badge key={genre.id} variant="secondary" className="text-sm">
                    {genre.name}
                  </Badge>
                ))}
              </div>
            )}

            <div className="bg-card/50 backdrop-blur-xl border border-border/50 rounded-2xl p-6">
              <h2 className="text-2xl font-bold mb-3">Overview</h2>
              <p className="text-muted-foreground leading-relaxed">{tvShow.overview}</p>
            </div>

            {/* Production & Creators Info */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Networks/Production */}
              {tvShow.production_companies && tvShow.production_companies.length > 0 && (
                <div className="bg-card/50 backdrop-blur-xl border border-border/50 rounded-2xl p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Building2 className="w-5 h-5 text-primary" />
                    <h2 className="text-2xl font-bold">Production</h2>
                  </div>
                  <div className="space-y-3">
                    {tvShow.production_companies.map((company: any) => (
                      <div key={company.id} className="flex items-center gap-3">
                        {company.logo_path ? (
                          <img
                            src={getImageUrl(company.logo_path)}
                            alt={company.name}
                            className="h-8 object-contain bg-white/10 rounded px-2 py-1"
                          />
                        ) : (
                          <Building2 className="w-6 h-6 text-muted-foreground" />
                        )}
                        <span className="text-foreground">{company.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Creators */}
              {creators.length > 0 && (
                <div className="bg-card/50 backdrop-blur-xl border border-border/50 rounded-2xl p-6">
                  <h2 className="text-2xl font-bold mb-4">Created By</h2>
                  <div className="space-y-3">
                    {creators.map((creator: any) => (
                      <div key={creator.id} className="flex items-center gap-3">
                        <User className="w-6 h-6 text-primary" />
                        <span className="text-foreground font-medium">{creator.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Streaming Providers */}
            {watchProviders && (
              <div className="bg-card/50 backdrop-blur-xl border border-border/50 rounded-2xl p-6">
                <h2 className="text-2xl font-bold mb-4">Where to Watch</h2>
                
                {watchProviders.flatrate && watchProviders.flatrate.length > 0 && (
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold mb-3 text-muted-foreground">Stream</h3>
                    <div className="flex flex-wrap gap-3">
                      {watchProviders.flatrate.map((provider: any) => (
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

        {/* Cast Section */}
        {topCast.length > 0 && (
          <div className="mb-12">
            <h2 className="text-3xl font-bold mb-6">Top Cast</h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
              {topCast.map((actor) => (
                <div key={actor.id} className="text-center">
                  {actor.profile_path ? (
                    <img
                      src={getImageUrl(actor.profile_path)}
                      alt={actor.name}
                      className="w-full aspect-[2/3] object-cover rounded-2xl mb-3 shadow-lg"
                    />
                  ) : (
                    <div className="w-full aspect-[2/3] bg-card/50 rounded-2xl flex items-center justify-center mb-3">
                      <User className="w-12 h-12 text-muted-foreground" />
                    </div>
                  )}
                  <h3 className="font-semibold text-sm">{actor.name}</h3>
                  <p className="text-xs text-muted-foreground line-clamp-2">{actor.character}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Trailers Section */}
        {trailers && trailers.length > 0 && (
          <div className="mb-12">
            <h2 className="text-3xl font-bold mb-6">Trailers & Videos</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {trailers.map((video) => (
                <div key={video.id} className="bg-card/50 backdrop-blur-xl border border-border/50 rounded-2xl overflow-hidden">
                  <div className="relative aspect-video">
                    <iframe
                      src={`https://www.youtube.com/embed/${video.key}`}
                      title={video.name}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                  <div className="p-4">
                    <div className="flex items-center gap-2 text-primary">
                      <Play className="w-4 h-4" />
                      <p className="font-semibold">{video.name}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Reviews Section */}
        {reviews && reviews.length > 0 && (
          <div className="mb-12">
            <h2 className="text-3xl font-bold mb-6">User Reviews ({reviews.length})</h2>
            <div className="space-y-6">
              {reviews.map((review) => (
                <Card key={review.id} className="bg-card/50 backdrop-blur-xl border border-border/50">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="flex-shrink-0">
                        {review.author_details.avatar_path ? (
                          <img
                            src={
                              review.author_details.avatar_path.startsWith("/https")
                                ? review.author_details.avatar_path.slice(1)
                                : getImageUrl(review.author_details.avatar_path)
                            }
                            alt={review.author}
                            className="w-12 h-12 rounded-full"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                            <User className="w-6 h-6 text-primary" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <h3 className="font-semibold text-lg">{review.author}</h3>
                            <p className="text-sm text-muted-foreground">
                              {new Date(review.created_at).toLocaleDateString()}
                            </p>
                          </div>
                          {review.author_details.rating && (
                            <div className="flex items-center gap-1 bg-primary/20 px-3 py-1 rounded-full">
                              <Star className="w-4 h-4 fill-primary text-primary" />
                              <span className="font-semibold">{review.author_details.rating}/10</span>
                            </div>
                          )}
                        </div>
                        <p className="text-muted-foreground leading-relaxed line-clamp-6">
                          {review.content}
                        </p>
                        <a
                          href={review.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-primary hover:underline mt-2 text-sm"
                        >
                          Read full review <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TVShowDetails;
