import { useState } from "react";
import { Film } from "lucide-react";
import { MovieCard } from "@/components/MovieCard";
import { MovieGrid } from "@/components/MovieGrid";
import { SearchBar } from "@/components/SearchBar";
import { Navbar } from "@/components/Navbar";
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
      <Navbar />
      
      {/* Hero Section */}
      <div className="relative h-[70vh] overflow-hidden mt-16">
        <div
          className="absolute inset-0 bg-cover bg-center scale-110"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/70 to-background" />
        </div>

        <div className="relative container mx-auto px-4 h-full flex flex-col items-center justify-center text-center space-y-8">
          <div className="flex items-center gap-4 mb-2 animate-fade-in">
            <Film className="w-14 h-14 text-primary drop-shadow-[0_0_20px_rgba(79,156,255,0.5)]" />
            <h1 className="text-6xl md:text-8xl font-bold text-foreground tracking-tight bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text">
              Movieverse
            </h1>
          </div>
          <p className="text-xl md:text-3xl text-muted-foreground max-w-3xl font-light animate-fade-in">
            Discover, rate, and track your favorite films
          </p>

          <div className="w-full max-w-2xl mt-12">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search for movies..."
            />
          </div>
        </div>
      </div>

      {/* Movies Section */}
      <main className="container mx-auto px-4 py-16">
        <div className="mb-12">
          <h2 className="text-4xl font-bold text-foreground mb-3 tracking-tight">
            {searchQuery ? "Search Results" : "Popular Movies"}
          </h2>
          <p className="text-lg text-muted-foreground">
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
