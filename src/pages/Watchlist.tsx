import { useSupabaseWatchlist } from "@/hooks/useSupabaseWatchlist";
import { useMovieDetails, getImageUrl } from "@/hooks/useMovies";
import { useTVShowDetails } from "@/hooks/useTVShows";
import { Navbar } from "@/components/Navbar";
import { MovieCard } from "@/components/MovieCard";
import { TVShowCard } from "@/components/TVShowCard";
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
      posterPath={getImageUrl(movie.poster_path)}
      releaseDate={movie.release_date}
      rating={movie.vote_average}
    />
  );
};

const WatchlistTVShowCard = ({ tvShowId }: { tvShowId: number }) => {
  const { data: tvShow, isLoading } = useTVShowDetails(tvShowId);

  if (isLoading) {
    return (
      <div className="animate-pulse bg-card rounded-lg h-96">
        <div className="w-full h-full bg-muted rounded-lg" />
      </div>
    );
  }

  if (!tvShow) return null;

  return (
    <TVShowCard
      id={tvShow.id}
      name={tvShow.name}
      posterPath={tvShow.poster_path}
      firstAirDate={tvShow.first_air_date}
      rating={tvShow.vote_average}
    />
  );
};

const Watchlist = () => {
  const { watchlist } = useSupabaseWatchlist();

  const movieItems = watchlist.filter((item) => item.type === "movie");
  const tvItems = watchlist.filter((item) => item.type === "tv");

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">My Watchlist</h1>
          <p className="text-muted-foreground">
            {watchlist.length === 0
              ? "Your watchlist is empty. Add some movies and TV shows to get started!"
              : `You have ${movieItems.length} ${movieItems.length === 1 ? "movie" : "movies"} and ${tvItems.length} ${tvItems.length === 1 ? "TV show" : "TV shows"} in your watchlist.`}
          </p>
        </div>

        {watchlist.length > 0 ? (
          <>
            {movieItems.length > 0 && (
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-foreground mb-6">Movies</h2>
                <MovieGrid>
                  {movieItems.map((item) => (
                    <WatchlistMovieCard key={`movie-${item.id}`} movieId={item.id} />
                  ))}
                </MovieGrid>
              </section>
            )}

            {tvItems.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold text-foreground mb-6">TV Shows</h2>
                <MovieGrid>
                  {tvItems.map((item) => (
                    <WatchlistTVShowCard key={`tv-${item.id}`} tvShowId={item.id} />
                  ))}
                </MovieGrid>
              </section>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="text-6xl mb-4">🎬</div>
            <h2 className="text-2xl font-semibold text-foreground mb-2">Nothing here yet</h2>
            <p className="text-muted-foreground max-w-md">
              Start adding movies and TV shows to your watchlist by clicking the heart icon on any card.
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Watchlist;
