import { useQuery } from "@tanstack/react-query";

const TMDB_API_KEY = "8265bd1679663a7ea12ac168da84d2e8";
const TMDB_BASE_URL = "https://api.themoviedb.org/3";

export interface Genre {
  id: number;
  name: string;
}

export interface Movie {
  id: number;
  title: string;
  poster_path: string;
  release_date: string;
  vote_average: number;
  overview: string;
  backdrop_path: string;
  genre_ids: number[];
  genres?: Genre[];
  runtime?: number;
  tagline?: string;
  imdb_id?: string;
  vote_count?: number;
}

export interface WatchProvider {
  logo_path: string;
  provider_id: number;
  provider_name: string;
  display_priority: number;
}

export interface WatchProvidersData {
  link?: string;
  flatrate?: WatchProvider[];
  rent?: WatchProvider[];
  buy?: WatchProvider[];
}

interface TMDBResponse {
  results: Movie[];
  page: number;
  total_pages: number;
}

export const useTrendingMovies = (page: number = 1) => {
  return useQuery<TMDBResponse>({
    queryKey: ["movies", "trending", page],
    queryFn: async () => {
      const response = await fetch(
        `${TMDB_BASE_URL}/trending/movie/week?api_key=${TMDB_API_KEY}&language=en-US&page=${page}`
      );
      if (!response.ok) throw new Error("Failed to fetch trending movies");
      return response.json();
    },
  });
};

export const usePopularMovies = (page: number = 1) => {
  return useQuery<TMDBResponse>({
    queryKey: ["movies", "popular", page],
    queryFn: async () => {
      const response = await fetch(
        `${TMDB_BASE_URL}/movie/popular?api_key=${TMDB_API_KEY}&language=en-US&page=${page}`
      );
      if (!response.ok) throw new Error("Failed to fetch movies");
      return response.json();
    },
  });
};

export const useSearchMovies = (query: string, page: number = 1) => {
  return useQuery<TMDBResponse>({
    queryKey: ["movies", "search", query, page],
    queryFn: async () => {
      const response = await fetch(
        `${TMDB_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&language=en-US&query=${encodeURIComponent(
          query
        )}&page=${page}`
      );
      if (!response.ok) throw new Error("Failed to search movies");
      return response.json();
    },
    enabled: query.length > 0,
  });
};

export const useMovieDetails = (movieId: number) => {
  return useQuery<Movie>({
    queryKey: ["movie", movieId],
    queryFn: async () => {
      const response = await fetch(
        `${TMDB_BASE_URL}/movie/${movieId}?api_key=${TMDB_API_KEY}&language=en-US`
      );
      if (!response.ok) throw new Error("Failed to fetch movie details");
      return response.json();
    },
    enabled: !!movieId,
  });
};

export const useUpcomingMovies = (page: number = 1) => {
  const today = new Date();
  const twoYearsLater = new Date(today.getFullYear() + 2, today.getMonth(), today.getDate());
  
  return useQuery<TMDBResponse>({
    queryKey: ["movies", "upcoming", page],
    queryFn: async () => {
      const response = await fetch(
        `${TMDB_BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=${page}&primary_release_date.gte=${today.toISOString().split('T')[0]}&primary_release_date.lte=${twoYearsLater.toISOString().split('T')[0]}`
      );
      if (!response.ok) throw new Error("Failed to fetch upcoming movies");
      return response.json();
    },
  });
};

export const useFilteredMovies = (page: number = 1, genreId?: number, year?: number) => {
  return useQuery<TMDBResponse>({
    queryKey: ["movies", "filtered", page, genreId, year],
    queryFn: async () => {
      let url = `${TMDB_BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&language=en-US&sort_by=popularity.desc&page=${page}`;
      if (genreId) url += `&with_genres=${genreId}`;
      if (year) url += `&primary_release_year=${year}`;
      
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch filtered movies");
      return response.json();
    },
    enabled: !!genreId || !!year,
  });
};

export const useGenres = () => {
  return useQuery<{ genres: Genre[] }>({
    queryKey: ["genres"],
    queryFn: async () => {
      const response = await fetch(
        `${TMDB_BASE_URL}/genre/movie/list?api_key=${TMDB_API_KEY}&language=en-US`
      );
      if (!response.ok) throw new Error("Failed to fetch genres");
      return response.json();
    },
  });
};

export const useWatchProviders = (movieId: number) => {
  return useQuery<{ results: { US?: WatchProvidersData } }>({
    queryKey: ["movie", movieId, "watch-providers"],
    queryFn: async () => {
      const response = await fetch(
        `${TMDB_BASE_URL}/movie/${movieId}/watch/providers?api_key=${TMDB_API_KEY}`
      );
      if (!response.ok) throw new Error("Failed to fetch watch providers");
      return response.json();
    },
    enabled: !!movieId,
  });
};

export const useMovieVideos = (movieId: number) => {
  return useQuery({
    queryKey: ["movieVideos", movieId],
    queryFn: async () => {
      const response = await fetch(
        `${TMDB_BASE_URL}/movie/${movieId}/videos?api_key=${TMDB_API_KEY}&language=en-US`
      );
      if (!response.ok) throw new Error("Failed to fetch movie videos");
      const data = await response.json();
      return data.results as Array<{
        id: string;
        key: string;
        name: string;
        site: string;
        type: string;
        official: boolean;
      }>;
    },
    enabled: !!movieId,
  });
};

export const useMovieReviews = (movieId: number) => {
  return useQuery({
    queryKey: ["movieReviews", movieId],
    queryFn: async () => {
      const response = await fetch(
        `${TMDB_BASE_URL}/movie/${movieId}/reviews?api_key=${TMDB_API_KEY}&language=en-US&page=1`
      );
      if (!response.ok) throw new Error("Failed to fetch movie reviews");
      const data = await response.json();
      return data.results as Array<{
        author: string;
        author_details: {
          name: string;
          username: string;
          avatar_path: string | null;
          rating: number | null;
        };
        content: string;
        created_at: string;
        id: string;
        updated_at: string;
        url: string;
      }>;
    },
    enabled: !!movieId,
  });
};

export const getImageUrl = (path: string, size: "w500" | "original" = "w500") => {
  if (!path) return "/placeholder.svg";
  return `https://image.tmdb.org/t/p/${size}${path}`;
};
