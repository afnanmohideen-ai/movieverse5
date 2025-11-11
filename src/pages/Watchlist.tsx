import { useWatchlist } from "@/hooks/useWatchlist";
import { useMovieDetails } from "@/hooks/useMovies";
import { Navbar } from "@/components/Navbar";
import { MovieCard } from "@/components/MovieCard";
import { MovieGrid } from "@/components/MovieGrid";

const WatchlistMovieCard = ({ movieId }: { movieId: number }) => {
  const { data: movie, isLoading } = useMovieDetails(movieId);

  if (isLoading) {
    return (
      <div className="animate-pulse bg-card rounded-lg h-96">
        <div className="w-full h-full bg-muted rounded-lg" />
      </div>
    );
  }

  if (!movie) return null;

  return (
    <MovieCard
      id={movie.id}
      title={movie.title}
      posterPath={movie.poster_path}
      releaseDate={movie.release_date}
      rating={movie.vote_average}
    />
  );
};

const Watchlist = () => {
  const { watchlist } = useWatchlist();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">My Watchlist</h1>
          <p className="text-muted-foreground">
            {watchlist.length === 0
              ? "Your watchlist is empty. Add some movies to get started!"
              : `You have ${watchlist.length} ${watchlist.length === 1 ? "movie" : "movies"} in your watchlist.`}
          </p>
        </div>

        {watchlist.length > 0 ? (
          <MovieGrid>
            {watchlist.map((movieId) => (
              <WatchlistMovieCard key={movieId} movieId={movieId} />
            ))}
          </MovieGrid>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="text-6xl mb-4">🎬</div>
            <h2 className="text-2xl font-semibold text-foreground mb-2">No movies yet</h2>
            <p className="text-muted-foreground max-w-md">
              Start adding movies to your watchlist by clicking the heart icon on any movie card.
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Watchlist;
