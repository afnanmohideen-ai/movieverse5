import { useQuery } from "@tanstack/react-query";

const TMDB_API_KEY = "8265bd1679663a7ea12ac168da84d2e8";
const TMDB_BASE_URL = "https://api.themoviedb.org/3";

export interface Movie {
  id: number;
  title: string;
  poster_path: string;
  release_date: string;
  vote_average: number;
  overview: string;
  backdrop_path: string;
  genre_ids: number[];
}

interface TMDBResponse {
  results: Movie[];
  page: number;
  total_pages: number;
}

export const usePopularMovies = () => {
  return useQuery<TMDBResponse>({
    queryKey: ["movies", "popular"],
    queryFn: async () => {
      const response = await fetch(
        `${TMDB_BASE_URL}/movie/popular?api_key=${TMDB_API_KEY}&language=en-US&page=1`
      );
      if (!response.ok) throw new Error("Failed to fetch movies");
      return response.json();
    },
  });
};

export const useSearchMovies = (query: string) => {
  return useQuery<TMDBResponse>({
    queryKey: ["movies", "search", query],
    queryFn: async () => {
      const response = await fetch(
        `${TMDB_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&language=en-US&query=${encodeURIComponent(
          query
        )}&page=1`
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

export const getImageUrl = (path: string, size: "w500" | "original" = "w500") => {
  if (!path) return "/placeholder.svg";
  return `https://image.tmdb.org/t/p/${size}${path}`;
};
