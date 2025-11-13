import { useState } from "react";
import { Film } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MovieCard } from "@/components/MovieCard";
import { MovieGrid } from "@/components/MovieGrid";
import { TVShowCard } from "@/components/TVShowCard";
import { SearchBar } from "@/components/SearchBar";
import { Navbar } from "@/components/Navbar";
import { FilterBar } from "@/components/FilterBar";
import { AdvancedFilters, FilterOptions } from "@/components/AdvancedFilters";
import { MoviePagination } from "@/components/MoviePagination";
import { 
  usePopularMovies, 
  useTrendingMovies, 
  useSearchMovies, 
  useUpcomingMovies,
  useFilteredMovies,
  getImageUrl 
} from "@/hooks/useMovies";
import { 
  usePopularTVShows, 
  useTrendingTVShows, 
  useSearchTVShows, 
  useUpcomingTVShows 
} from "@/hooks/useTVShows";
import { useToast } from "@/hooks/use-toast";
import heroImage from "@/assets/hero-cinema.jpg";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [userRatings, setUserRatings] = useState<Record<number, number>>({});
  const [tvUserRatings, setTvUserRatings] = useState<Record<number, number>>({});
  const [selectedGenre, setSelectedGenre] = useState<number>();
  const [selectedYear, setSelectedYear] = useState<number>();
  const [activeTab, setActiveTab] = useState("movies");
  const [trendingPage, setTrendingPage] = useState(1);
  const [popularPage, setPopularPage] = useState(1);
  const [upcomingPage, setUpcomingPage] = useState(1);
  const [searchPage, setSearchPage] = useState(1);
  const [filteredPage, setFilteredPage] = useState(1);
  const { toast } = useToast();
  const currentYear = new Date().getFullYear();
  const [advancedFilters, setAdvancedFilters] = useState<FilterOptions>({
    providers: [],
    genres: [],
    yearRange: [1900, currentYear],
    ratingRange: [0, 10],
    priceTypes: [],
  });

  const hasFilters = selectedGenre || selectedYear;

  // Movie hooks
  const { data: trendingMovies, isLoading: isLoadingTrending } = useTrendingMovies(trendingPage);
  const { data: popularMovies, isLoading: isLoadingPopular } = usePopularMovies(popularPage);
  const { data: upcomingMovies, isLoading: isLoadingUpcoming } = useUpcomingMovies(upcomingPage);
  const { data: searchResults, isLoading: isSearching } = useSearchMovies(searchQuery, searchPage);
  const { data: filteredMovies, isLoading: isLoadingFiltered } = useFilteredMovies(
    filteredPage,
    selectedGenre,
    selectedYear
  );

  // TV Show hooks
  const { data: trendingTVShows, isLoading: isLoadingTrendingTV } = useTrendingTVShows(trendingPage);
  const { data: popularTVShows, isLoading: isLoadingPopularTV } = usePopularTVShows(popularPage);
  const { data: upcomingTVShows, isLoading: isLoadingUpcomingTV } = useUpcomingTVShows(upcomingPage);
  const { data: searchTVResults, isLoading: isSearchingTV } = useSearchTVShows(searchQuery, searchPage);

  const handleRate = (movieId: number, rating: number) => {
    setUserRatings((prev) => ({ ...prev, [movieId]: rating }));
    toast({
      title: "Rating saved!",
      description: `You rated this movie ${rating} stars`,
    });
  };

  const handleRateTV = (tvShowId: number, rating: number) => {
    setTvUserRatings((prev) => ({ ...prev, [tvShowId]: rating }));
    toast({
      title: "Rating saved!",
      description: `You rated this TV show ${rating} stars`,
    });
  };

  const handleClearFilters = () => {
    setSelectedGenre(undefined);
    setSelectedYear(undefined);
    setFilteredPage(1);
  };

  // Filter out unreleased movies (only show released movies)
  const filterReleasedMovies = (movies: typeof trendingMovies) => {
    if (!movies?.results) return movies;
    const today = new Date().toISOString().split('T')[0];
    return {
      ...movies,
      results: movies.results.filter(movie => movie.release_date && movie.release_date <= today)
    };
  };

  const releasedTrendingMovies = filterReleasedMovies(trendingMovies);
  const releasedPopularMovies = filterReleasedMovies(popularMovies);
  const releasedFilteredMovies = filterReleasedMovies(filteredMovies);

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
              placeholder={`Search for ${activeTab === "movies" ? "movies" : "TV shows"}...`}
            />
          </div>
        </div>
      </div>

      {/* Content Section with Tabs */}
      <main className="container mx-auto px-4 py-16">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
            <TabsTrigger value="movies">Movies</TabsTrigger>
            <TabsTrigger value="tvshows">TV Shows</TabsTrigger>
          </TabsList>

          {/* MOVIES TAB */}
          <TabsContent value="movies" className="space-y-20">
        {!searchQuery && (
          <div className="flex gap-4 mb-8">
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
            <AdvancedFilters
              filters={advancedFilters}
              onFiltersChange={setAdvancedFilters}
              contentType="movie"
            />
          </div>
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
            ) : releasedFilteredMovies?.results && releasedFilteredMovies.results.length > 0 ? (
              <>
                <MovieGrid>
                  {releasedFilteredMovies.results.map((movie) => (
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
              ) : releasedTrendingMovies?.results && releasedTrendingMovies.results.length > 0 ? (
                <MovieGrid>
                  {releasedTrendingMovies.results.map((movie) => (
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
              ) : releasedPopularMovies?.results && releasedPopularMovies.results.length > 0 ? (
                <MovieGrid>
                  {releasedPopularMovies.results.map((movie) => (
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
          </TabsContent>

          {/* TV SHOWS TAB */}
          <TabsContent value="tvshows" className="space-y-20">
            {searchQuery ? (
              <>
                <div className="mb-12">
                  <h2 className="text-4xl font-bold text-foreground mb-3 tracking-tight">
                    Search Results
                  </h2>
                  <p className="text-lg text-muted-foreground">
                    Found {searchTVResults?.results?.length || 0} results
                  </p>
                </div>

                {isSearchingTV ? (
                  <div className="flex items-center justify-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent" />
                  </div>
                ) : searchTVResults?.results && searchTVResults.results.length > 0 ? (
                  <MovieGrid>
                    {searchTVResults.results.map((show) => (
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
                  </MovieGrid>
                ) : (
                  <div className="text-center py-20">
                    <p className="text-muted-foreground text-lg">No TV shows found</p>
                  </div>
                )}
              </>
            ) : (
              <>
                {/* Trending TV Shows */}
                <section>
                  <h2 className="text-4xl font-bold text-foreground mb-8 tracking-tight">
                    Trending TV Shows
                  </h2>
                  
                  {isLoadingTrendingTV ? (
                    <div className="flex items-center justify-center py-20">
                      <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent" />
                    </div>
                  ) : trendingTVShows?.results && trendingTVShows.results.length > 0 ? (
                    <>
                      <MovieGrid>
                        {trendingTVShows.results.map((show) => (
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
                      </MovieGrid>

                      {trendingTVShows.total_pages > 1 && (
                        <MoviePagination
                          currentPage={trendingPage}
                          totalPages={trendingTVShows.total_pages}
                          onPageChange={setTrendingPage}
                        />
                      )}
                    </>
                  ) : (
                    <div className="text-center py-20">
                      <p className="text-muted-foreground text-lg">No trending TV shows available</p>
                    </div>
                  )}
                </section>

                {/* Popular TV Shows */}
                <section>
                  <h2 className="text-4xl font-bold text-foreground mb-8 tracking-tight">
                    Most Popular TV Shows
                  </h2>
                  
                  {isLoadingPopularTV ? (
                    <div className="flex items-center justify-center py-20">
                      <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent" />
                    </div>
                  ) : popularTVShows?.results && popularTVShows.results.length > 0 ? (
                    <>
                      <MovieGrid>
                        {popularTVShows.results.map((show) => (
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
                      </MovieGrid>

                      {popularTVShows.total_pages > 1 && (
                        <MoviePagination
                          currentPage={popularPage}
                          totalPages={popularTVShows.total_pages}
                          onPageChange={setPopularPage}
                        />
                      )}
                    </>
                  ) : (
                    <div className="text-center py-20">
                      <p className="text-muted-foreground text-lg">No popular TV shows available</p>
                    </div>
                  )}
                </section>

                {/* Coming Soon TV Shows */}
                <section>
                  <h2 className="text-4xl font-bold text-foreground mb-8 tracking-tight">
                    Coming Soon TV Shows
                  </h2>
                  
                  {isLoadingUpcomingTV ? (
                    <div className="flex items-center justify-center py-20">
                      <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent" />
                    </div>
                  ) : upcomingTVShows?.results && upcomingTVShows.results.length > 0 ? (
                    <>
                      <MovieGrid>
                        {upcomingTVShows.results.map((show) => (
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
                      </MovieGrid>

                      {upcomingTVShows.total_pages > 1 && (
                        <MoviePagination
                          currentPage={upcomingPage}
                          totalPages={upcomingTVShows.total_pages}
                          onPageChange={setUpcomingPage}
                        />
                      )}
                    </>
                  ) : (
                    <div className="text-center py-20">
                      <p className="text-muted-foreground text-lg">No upcoming TV shows available</p>
                    </div>
                  )}
                </section>
              </>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;
