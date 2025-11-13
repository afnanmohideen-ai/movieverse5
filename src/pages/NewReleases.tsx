import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { MovieCard } from "@/components/MovieCard";
import { TVShowCard } from "@/components/TVShowCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

const API_KEY = "8265bd1679663a7ea12ac168da84d2e8";
const BASE_URL = "https://api.themoviedb.org/3";

export default function NewReleases() {
  const [movieUserRatings, setMovieUserRatings] = useState<Record<number, number>>({});
  const [tvUserRatings, setTvUserRatings] = useState<Record<number, number>>({});

  // Get date range for "new releases" (last 30 days)
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 30);

  const { data: newMovies, isLoading: loadingMovies } = useQuery({
    queryKey: ["newReleases", "movies"],
    queryFn: async () => {
      const response = await fetch(
        `${BASE_URL}/discover/movie?api_key=${API_KEY}&language=en-US&sort_by=release_date.desc&release_date.gte=${startDate.toISOString().split('T')[0]}&release_date.lte=${endDate.toISOString().split('T')[0]}&page=1`
      );
      if (!response.ok) throw new Error("Failed to fetch new movies");
      return response.json();
    },
  });

  const { data: newTVShows, isLoading: loadingTV } = useQuery({
    queryKey: ["newReleases", "tv"],
    queryFn: async () => {
      const response = await fetch(
        `${BASE_URL}/discover/tv?api_key=${API_KEY}&language=en-US&sort_by=first_air_date.desc&first_air_date.gte=${startDate.toISOString().split('T')[0]}&first_air_date.lte=${endDate.toISOString().split('T')[0]}&page=1`
      );
      if (!response.ok) throw new Error("Failed to fetch new TV shows");
      return response.json();
    },
  });

  const handleRateMovie = (movieId: number, rating: number) => {
    setMovieUserRatings((prev) => ({ ...prev, [movieId]: rating }));
  };

  const handleRateTV = (tvId: number, rating: number) => {
    setTvUserRatings((prev) => ({ ...prev, [tvId]: rating }));
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">New Releases</h1>
          <p className="text-muted-foreground">
            Recently added movies and TV shows from the last 30 days
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
                {newMovies?.results.map((movie: any) => (
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
                {newTVShows?.results.map((show: any) => (
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
