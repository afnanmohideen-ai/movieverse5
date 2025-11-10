import { useState } from "react";
import { Film } from "lucide-react";
import { MovieCard } from "@/components/MovieCard";
import { MovieGrid } from "@/components/MovieGrid";
import { SearchBar } from "@/components/SearchBar";
import { Navbar } from "@/components/Navbar";
import { FilterBar } from "@/components/FilterBar";
import { MoviePagination } from "@/components/MoviePagination";
import { 
  usePopularMovies, 
  useTrendingMovies, 
  useSearchMovies, 
  useUpcomingMovies,
  useFilteredMovies,
  getImageUrl 
} from "@/hooks/useMovies";
import { useToast } from "@/hooks/use-toast";
import heroImage from "@/assets/hero-cinema.jpg";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [userRatings, setUserRatings] = useState<Record<number, number>>({});
  const [selectedGenre, setSelectedGenre] = useState<number>();
  const [selectedYear, setSelectedYear] = useState<number>();
  const [trendingPage, setTrendingPage] = useState(1);
  const [popularPage, setPopularPage] = useState(1);
  const [upcomingPage, setUpcomingPage] = useState(1);
  const [searchPage, setSearchPage] = useState(1);
  const [filteredPage, setFilteredPage] = useState(1);
  const { toast } = useToast();

  const hasFilters = selectedGenre || selectedYear;

  const { data: trendingMovies, isLoading: isLoadingTrending } = useTrendingMovies(trendingPage);
  const { data: popularMovies, isLoading: isLoadingPopular } = usePopularMovies(popularPage);
  const { data: upcomingMovies, isLoading: isLoadingUpcoming } = useUpcomingMovies(upcomingPage);
  const { data: searchResults, isLoading: isSearching } = useSearchMovies(searchQuery, searchPage);
  const { data: filteredMovies, isLoading: isLoadingFiltered } = useFilteredMovies(
    filteredPage,
    selectedGenre,
    selectedYear
  );

  const handleRate = (movieId: number, rating: number) => {
    setUserRatings((prev) => ({ ...prev, [movieId]: rating }));
    toast({
      title: "Rating saved!",
      description: `You rated this movie ${rating} stars`,
    });
  };

  const handleClearFilters = () => {
    setSelectedGenre(undefined);
    setSelectedYear(undefined);
    setFilteredPage(1);
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
      <main className="container mx-auto px-4 py-16 space-y-20">
        {!searchQuery && (
          <FilterBar
            selectedGenre={selectedGenre}
            selectedYear={selectedYear}
            onGenreChange={(genre) => {
              setSelectedGenre(genre);
              setFilteredPage(1);
            }}
            onYearChange={(year) => {
              setSelectedYear(year);
              setFilteredPage(1);
            }}
            onClearFilters={handleClearFilters}
          />
        )}

        {searchQuery ? (
          <>
            <div className="mb-12">
              <h2 className="text-4xl font-bold text-foreground mb-3 tracking-tight">
                Search Results
              </h2>
              <p className="text-lg text-muted-foreground">
                Found {searchResults?.results?.length || 0} results
              </p>
            </div>

            {isSearching ? (
              <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent" />
              </div>
            ) : searchResults?.results && searchResults.results.length > 0 ? (
              <MovieGrid>
                {searchResults.results.map((movie) => (
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
                <p className="text-muted-foreground text-lg">No movies found</p>
              </div>
            )}

            {searchResults && searchResults.total_pages > 1 && (
              <MoviePagination
                currentPage={searchPage}
                totalPages={searchResults.total_pages}
                onPageChange={setSearchPage}
              />
            )}
          </>
        ) : hasFilters ? (
          <section>
            <div className="mb-8">
              <h2 className="text-4xl font-bold text-foreground mb-3 tracking-tight">
                Filtered Results
              </h2>
              <p className="text-lg text-muted-foreground">
                Movies matching your filters
              </p>
            </div>

            {isLoadingFiltered ? (
              <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent" />
              </div>
            ) : filteredMovies?.results && filteredMovies.results.length > 0 ? (
              <>
                <MovieGrid>
                  {filteredMovies.results.map((movie) => (
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

                {filteredMovies.total_pages > 1 && (
                  <MoviePagination
                    currentPage={filteredPage}
                    totalPages={filteredMovies.total_pages}
                    onPageChange={setFilteredPage}
                  />
                )}
              </>
            ) : (
              <div className="text-center py-20">
                <p className="text-muted-foreground text-lg">No movies found with these filters</p>
              </div>
            )}
          </section>
        ) : (
          <>
            {/* Trending Section */}
            <section>
              <div className="mb-8">
                <h2 className="text-4xl font-bold text-foreground mb-3 tracking-tight bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                  Trending Movies Right Now
                </h2>
                <p className="text-lg text-muted-foreground">
                  The hottest movies this week
                </p>
              </div>

              {isLoadingTrending ? (
                <div className="flex items-center justify-center py-20">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent" />
                </div>
              ) : trendingMovies?.results && trendingMovies.results.length > 0 ? (
                <MovieGrid>
                  {trendingMovies.results.map((movie) => (
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
                  <p className="text-muted-foreground text-lg">No trending movies available</p>
                </div>
              )}

              {trendingMovies && trendingMovies.total_pages > 1 && (
                <MoviePagination
                  currentPage={trendingPage}
                  totalPages={trendingMovies.total_pages}
                  onPageChange={setTrendingPage}
                />
              )}
            </section>

            {/* Popular Section */}
            <section>
              <div className="mb-8">
                <h2 className="text-4xl font-bold text-foreground mb-3 tracking-tight">
                  Most Popular
                </h2>
                <p className="text-lg text-muted-foreground">
                  All-time fan favorites
                </p>
              </div>

              {isLoadingPopular ? (
                <div className="flex items-center justify-center py-20">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent" />
                </div>
              ) : popularMovies?.results && popularMovies.results.length > 0 ? (
                <MovieGrid>
                  {popularMovies.results.map((movie) => (
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
                  <p className="text-muted-foreground text-lg">No popular movies available</p>
                </div>
              )}

              {popularMovies && popularMovies.total_pages > 1 && (
                <MoviePagination
                  currentPage={popularPage}
                  totalPages={popularMovies.total_pages}
                  onPageChange={setPopularPage}
                />
              )}
            </section>

            {/* Upcoming Section */}
            <section>
              <div className="mb-8">
                <h2 className="text-4xl font-bold text-foreground mb-3 tracking-tight bg-gradient-to-r from-accent via-primary to-accent bg-clip-text text-transparent">
                  Coming Soon
                </h2>
                <p className="text-lg text-muted-foreground">
                  Upcoming releases in the next 2 years
                </p>
              </div>

              {isLoadingUpcoming ? (
                <div className="flex items-center justify-center py-20">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent" />
                </div>
              ) : upcomingMovies?.results && upcomingMovies.results.length > 0 ? (
                <>
                  <MovieGrid>
                    {upcomingMovies.results.map((movie) => (
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

                  {upcomingMovies.total_pages > 1 && (
                    <MoviePagination
                      currentPage={upcomingPage}
                      totalPages={upcomingMovies.total_pages}
                      onPageChange={setUpcomingPage}
                    />
                  )}
                </>
              ) : (
                <div className="text-center py-20">
                  <p className="text-muted-foreground text-lg">No upcoming movies available</p>
                </div>
              )}
            </section>
          </>
        )}
      </main>
    </div>
  );
};

export default Index;
