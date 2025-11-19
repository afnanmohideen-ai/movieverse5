import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface WatchlistItem {
  id: number;
  type: "movie" | "tv";
}

const WATCHLIST_KEY = "movieverse_watchlist";

export const useSupabaseWatchlist = () => {
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Load watchlist on mount
  useEffect(() => {
    loadWatchlist();
    
    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      loadWatchlist();
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadWatchlist = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);

    if (user) {
      // Load from Supabase for authenticated users
      const { data, error } = await supabase
        .from("user_watchlist")
        .select("item_id, item_type")
        .eq("user_id", user.id);

      if (!error && data) {
        const items = data.map(item => ({
          id: item.item_id,
          type: item.item_type as "movie" | "tv"
        }));
        setWatchlist(items);
        // Also save to localStorage as backup
        localStorage.setItem(WATCHLIST_KEY, JSON.stringify(items));
      }
    } else {
      // Load from localStorage for guests
      const saved = localStorage.getItem(WATCHLIST_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Handle legacy format
        if (Array.isArray(parsed) && parsed.length > 0 && typeof parsed[0] === "number") {
          setWatchlist(parsed.map((id: number) => ({ id, type: "movie" as const })));
        } else {
          setWatchlist(parsed);
        }
      }
    }
    setLoading(false);
  };

  const addToWatchlist = async (itemId: number, type: "movie" | "tv" = "movie") => {
    const newItem = { id: itemId, type };
    
    if (user) {
      // Add to Supabase
      const { error } = await supabase
        .from("user_watchlist")
        .insert({
          user_id: user.id,
          item_id: itemId,
          item_type: type
        });

      if (error) {
        toast({
          title: "Error",
          description: "Failed to add to watchlist",
          variant: "destructive",
        });
        return;
      }
    }

    // Update local state
    setWatchlist(prev => [...prev, newItem]);
    
    // Save to localStorage
    const updated = [...watchlist, newItem];
    localStorage.setItem(WATCHLIST_KEY, JSON.stringify(updated));
  };

  const removeFromWatchlist = async (itemId: number, type: "movie" | "tv" = "movie") => {
    if (user) {
      // Remove from Supabase
      const { error } = await supabase
        .from("user_watchlist")
        .delete()
        .eq("user_id", user.id)
        .eq("item_id", itemId)
        .eq("item_type", type);

      if (error) {
        toast({
          title: "Error",
          description: "Failed to remove from watchlist",
          variant: "destructive",
        });
        return;
      }
    }

    // Update local state
    setWatchlist(prev => prev.filter(item => !(item.id === itemId && item.type === type)));
    
    // Save to localStorage
    const updated = watchlist.filter(item => !(item.id === itemId && item.type === type));
    localStorage.setItem(WATCHLIST_KEY, JSON.stringify(updated));
  };

  const isInWatchlist = (itemId: number, type: "movie" | "tv" = "movie") => 
    watchlist.some(item => item.id === itemId && item.type === type);

  const toggleWatchlist = async (itemId: number, type: "movie" | "tv" = "movie") => {
    if (isInWatchlist(itemId, type)) {
      await removeFromWatchlist(itemId, type);
    } else {
      await addToWatchlist(itemId, type);
    }
  };

  return {
    watchlist,
    addToWatchlist,
    removeFromWatchlist,
    isInWatchlist,
    toggleWatchlist,
    loading,
    isAuthenticated: !!user,
  };
};
