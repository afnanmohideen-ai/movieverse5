import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Recommendation {
  movie: any;
  tvShow: any;
  userPreferences: {
    favoriteGenres: number[];
    watchlistCount: number;
    ratingsCount: number;
  };
}

export const useRecommendations = () => {
  return useQuery({
    queryKey: ["recommendations", new Date().toISOString().split('T')[0]],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke('get-recommendations');
      
      if (error) throw error;
      return data as Recommendation;
    },
    staleTime: 1000 * 60 * 60, // Cache for 1 hour
  });
};
