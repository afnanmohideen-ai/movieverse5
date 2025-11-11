import { useQuery } from "@tanstack/react-query";

const API_KEY = "8265bd1679663a7ea12ac168da84d2e8";
const BASE_URL = "https://api.themoviedb.org/3";

export interface TVShow {
  id: number;
  name: string;
  original_name: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  first_air_date: string;
  vote_average: number;
  vote_count: number;
  genre_ids: number[];
  origin_country: string[];
}

interface TMDBResponse {
  page: number;
  results: TVShow[];
  total_pages: number;
  total_results: number;
}

export const useTrendingTVShows = (page: number = 1) => {
  return useQuery<TMDBResponse>({
    queryKey: ["trendingTVShows", page],
    queryFn: async () => {
      const res = await fetch(
        `${BASE_URL}/trending/tv/week?api_key=${API_KEY}&language=en-US&page=${page}`
      );
      if (!res.ok) throw new Error("Failed to fetch trending TV shows");
      return res.json();
    },
  });
};

export const usePopularTVShows = (page: number = 1) => {
  return useQuery<TMDBResponse>({
    queryKey: ["popularTVShows", page],
    queryFn: async () => {
      const res = await fetch(
        `${BASE_URL}/tv/popular?api_key=${API_KEY}&language=en-US&page=${page}`
      );
      if (!res.ok) throw new Error("Failed to fetch popular TV shows");
      return res.json();
    },
  });
};

export const useUpcomingTVShows = (page: number = 1) => {
  return useQuery<TMDBResponse>({
    queryKey: ["upcomingTVShows", page],
    queryFn: async () => {
      const today = new Date().toISOString().split("T")[0];
      const twoYearsLater = new Date();
      twoYearsLater.setFullYear(twoYearsLater.getFullYear() + 2);
      const endDate = twoYearsLater.toISOString().split("T")[0];

      const res = await fetch(
        `${BASE_URL}/discover/tv?api_key=${API_KEY}&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=${page}&first_air_date.gte=${today}&first_air_date.lte=${endDate}`
      );
      if (!res.ok) throw new Error("Failed to fetch upcoming TV shows");
      return res.json();
    },
  });
};

export const useSearchTVShows = (query: string, page: number = 1) => {
  return useQuery<TMDBResponse>({
    queryKey: ["searchTVShows", query, page],
    queryFn: async () => {
      const res = await fetch(
        `${BASE_URL}/search/tv?api_key=${API_KEY}&language=en-US&query=${encodeURIComponent(
          query
        )}&page=${page}&include_adult=false`
      );
      if (!res.ok) throw new Error("Failed to search TV shows");
      return res.json();
    },
    enabled: query.length > 0,
  });
};

export interface TVShowDetails extends TVShow {
  created_by: Array<{ id: number; name: string }>;
  episode_run_time: number[];
  genres: Array<{ id: number; name: string }>;
  homepage: string;
  in_production: boolean;
  last_air_date: string;
  number_of_episodes: number;
  number_of_seasons: number;
  status: string;
  tagline: string;
  type: string;
}

export const useTVShowDetails = (tvShowId: number) => {
  return useQuery<TVShowDetails>({
    queryKey: ["tvShow", tvShowId],
    queryFn: async () => {
      const res = await fetch(
        `${BASE_URL}/tv/${tvShowId}?api_key=${API_KEY}&language=en-US`
      );
      if (!res.ok) throw new Error("Failed to fetch TV show details");
      return res.json();
    },
    enabled: !!tvShowId,
  });
};

export const useTVShowVideos = (tvShowId: number) => {
  return useQuery({
    queryKey: ["tvShowVideos", tvShowId],
    queryFn: async () => {
      const res = await fetch(
        `${BASE_URL}/tv/${tvShowId}/videos?api_key=${API_KEY}&language=en-US`
      );
      if (!res.ok) throw new Error("Failed to fetch TV show videos");
      const data = await res.json();
      return data.results as Array<{
        id: string;
        key: string;
        name: string;
        site: string;
        type: string;
        official: boolean;
      }>;
    },
    enabled: !!tvShowId,
  });
};

export const useTVShowWatchProviders = (tvShowId: number) => {
  return useQuery<{ results: { US?: any } }>({
    queryKey: ["tvShow", tvShowId, "watch-providers"],
    queryFn: async () => {
      const res = await fetch(
        `${BASE_URL}/tv/${tvShowId}/watch/providers?api_key=${API_KEY}`
      );
      if (!res.ok) throw new Error("Failed to fetch watch providers");
      return res.json();
    },
    enabled: !!tvShowId,
  });
};
