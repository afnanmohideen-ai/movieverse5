import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useSupabaseRatings = () => {
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadRatings();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      loadRatings();
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadRatings = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);

    if (user) {
      const { data, error } = await supabase
        .from("user_ratings")
        .select("item_id, item_type, rating")
        .eq("user_id", user.id);

      if (!error && data) {
        const ratingsMap: Record<string, number> = {};
        data.forEach(item => {
          ratingsMap[`${item.item_type}-${item.item_id}`] = item.rating;
        });
        setRatings(ratingsMap);
      }
    } else {
      // For guests, load from localStorage
      const saved = localStorage.getItem("movieverse_ratings");
      if (saved) {
        setRatings(JSON.parse(saved));
      }
    }
    setLoading(false);
  };

  const setRating = async (itemId: number, type: "movie" | "tv", rating: number) => {
    const key = `${type}-${itemId}`;

    if (user) {
      // Upsert to Supabase
      const { error } = await supabase
        .from("user_ratings")
        .upsert({
          user_id: user.id,
          item_id: itemId,
          item_type: type,
          rating: rating
        }, {
          onConflict: "user_id,item_id,item_type"
        });

      if (error) {
        toast({
          title: "Error",
          description: "Failed to save rating",
          variant: "destructive",
        });
        return;
      }
    }

    // Update local state
    setRatings(prev => ({ ...prev, [key]: rating }));
    
    // Save to localStorage for guests
    if (!user) {
      const updated = { ...ratings, [key]: rating };
      localStorage.setItem("movieverse_ratings", JSON.stringify(updated));
    }

    toast({
      title: "Rating saved!",
      description: `You rated this ${type} ${rating} stars`,
    });
  };

  const getRating = (itemId: number, type: "movie" | "tv") => {
    return ratings[`${type}-${itemId}`];
  };

  return {
    ratings,
    setRating,
    getRating,
    loading,
    isAuthenticated: !!user,
  };
};
