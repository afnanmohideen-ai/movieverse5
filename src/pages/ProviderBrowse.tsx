import { useState } from "react";
import { useParams } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { MovieCard } from "@/components/MovieCard";
import { TVShowCard } from "@/components/TVShowCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

const API_KEY = "8265bd1679663a7ea12ac168da84d2e8";
const BASE_URL = "https://api.themoviedb.org/3";

const PROVIDER_INFO: Record<string, { name: string; id: number; logo: string }> = {
  netflix: { name: "Netflix", id: 8, logo: "🎬" },
  disney: { name: "Disney+", id: 337, logo: "✨" },
  prime: { name: "Prime Video", id: 9, logo: "📦" },
  hulu: { name: "Hulu", id: 15, logo: "🟢" },
  hbo: { name: "HBO Max", id: 384, logo: "🎭" },
  apple: { name: "Apple TV+", id: 350, logo: "🍎" },
  paramount: { name: "Paramount+", id: 531, logo: "⭐" },
  peacock: { name: "Peacock", id: 386, logo: "🦚" },
};

export default function ProviderBrowse() {
  const { provider } = useParams<{ provider: string }>();
  const [movieUserRatings, setMovieUserRatings] = useState<Record<number, number>>({});
  const [tvUserRatings, setTvUserRatings] = useState<Record<number, number>>({});

  const providerInfo = provider ? PROVIDER_INFO[provider] : null;

  const { data: providerMovies, isLoading: loadingMovies } = useQuery({
    queryKey: ["provider", provider, "movies"],
    queryFn: async () => {
      if (!providerInfo) return null;
      const response = await fetch(
        `${BASE_URL}/discover/movie?api_key=${API_KEY}&language=en-US&sort_by=popularity.desc&with_watch_providers=${providerInfo.id}&watch_region=US&page=1`
      );
      if (!response.ok) throw new Error("Failed to fetch provider movies");
      return response.json();
    },
    enabled: !!providerInfo,
  });

  const { data: providerTVShows, isLoading: loadingTV } = useQuery({
    queryKey: ["provider", provider, "tv"],
    queryFn: async () => {
      if (!providerInfo) return null;
      const response = await fetch(
        `${BASE_URL}/discover/tv?api_key=${API_KEY}&language=en-US&sort_by=popularity.desc&with_watch_providers=${providerInfo.id}&watch_region=US&page=1`
      );
      if (!response.ok) throw new Error("Failed to fetch provider TV shows");
      return response.json();
    },
    enabled: !!providerInfo,
  });

  const handleRateMovie = (movieId: number, rating: number) => {
    setMovieUserRatings((prev) => ({ ...prev, [movieId]: rating }));
  };

  const handleRateTV = (tvId: number, rating: number) => {
    setTvUserRatings((prev) => ({ ...prev, [tvId]: rating }));
  };

  if (!providerInfo) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold">Provider not found</h1>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-5xl">{providerInfo.logo}</span>
            <h1 className="text-4xl font-bold">{providerInfo.name}</h1>
          </div>
          <p className="text-muted-foreground">
            Browse all movies and TV shows available on {providerInfo.name}
          </p>
        </div>

        <Tabs defaultValue="movies" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="movies">Movies</TabsTrigger>
            <TabsTrigger value="tv">TV Shows</TabsTrigger>
          </TabsList>

          <TabsContent value="movies">
            {loadingMovies ? (
              <div className="flex justify-center items-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {providerMovies?.results.map((movie: any) => (
                  <MovieCard
                    key={movie.id}
                    id={movie.id}
                    title={movie.title}
                    posterPath={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    releaseDate={movie.release_date}
                    rating={movie.vote_average}
                    userRating={movieUserRatings[movie.id]}
                    onRate={(rating) => handleRateMovie(movie.id, rating)}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="tv">
            {loadingTV ? (
              <div className="flex justify-center items-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {providerTVShows?.results.map((show: any) => (
                  <TVShowCard
                    key={show.id}
                    id={show.id}
                    name={show.name}
                    posterPath={show.poster_path}
                    firstAirDate={show.first_air_date}
                    rating={show.vote_average}
                    userRating={tvUserRatings[show.id]}
                    onRate={(rating) => handleRateTV(show.id, rating)}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
