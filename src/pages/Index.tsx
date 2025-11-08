import { useState } from "react";
import { Film } from "lucide-react";
import { MovieCard } from "@/components/MovieCard";
import { MovieGrid } from "@/components/MovieGrid";
import { SearchBar } from "@/components/SearchBar";
import { usePopularMovies, useSearchMovies, getImageUrl } from "@/hooks/useMovies";
import { useToast } from "@/hooks/use-toast";
import heroImage from "@/assets/hero-cinema.jpg";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [userRatings, setUserRatings] = useState<Record<number, number>>({});
  const { toast } = useToast();

  const { data: popularMovies, isLoading: isLoadingPopular } = usePopularMovies();
  const { data: searchResults, isLoading: isSearching } = useSearchMovies(searchQuery);

  const displayMovies = searchQuery ? searchResults?.results : popularMovies?.results;
  const isLoading = searchQuery ? isSearching : isLoadingPopular;

  const handleRate = (movieId: number, rating: number) => {
    setUserRatings((prev) => ({ ...prev, [movieId]: rating }));
    toast({
      title: "Rating saved!",
      description: `You rated this movie ${rating} stars`,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative h-[60vh] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />
        </div>

        <div className="relative container mx-auto px-4 h-full flex flex-col items-center justify-center text-center space-y-6">
          <div className="flex items-center gap-3 mb-4">
            <Film className="w-12 h-12 text-primary" />
            <h1 className="text-5xl md:text-7xl font-bold text-foreground">
              Movieverse
            </h1>
          </div>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl">
            Discover, rate, and track your favorite films
          </p>

          <div className="w-full max-w-2xl mt-8">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search for movies..."
            />
          </div>
        </div>
      </div>

      {/* Movies Section */}
      <main className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">
            {searchQuery ? "Search Results" : "Popular Movies"}
          </h2>
          <p className="text-muted-foreground">
            {searchQuery
              ? `Found ${displayMovies?.length || 0} results`
              : "Trending movies right now"}
          </p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent" />
          </div>
        ) : displayMovies && displayMovies.length > 0 ? (
          <MovieGrid>
            {displayMovies.map((movie) => (
              <MovieCard
                key={movie.id}
                id={movie.id}
                title={movie.title}
                posterPath={getImageUrl(movie.poster_path)}
                releaseDate={movie.release_date}
                rating={movie.vote_average}
                userRating={userRatings[movie.id]}
                onRate={(rating) => handleRate(movie.id, rating)}
              />
            ))}
          </MovieGrid>
        ) : (
          <div className="text-center py-20">
            <p className="text-muted-foreground text-lg">
              {searchQuery ? "No movies found" : "No movies available"}
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
