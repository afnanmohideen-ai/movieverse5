import { useState, useEffect } from "react";

const WATCHLIST_KEY = "movieverse_watchlist";

export interface WatchlistItem {
  id: number;
  type: "movie" | "tv";
}

export const useWatchlist = () => {
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>(() => {
    const saved = localStorage.getItem(WATCHLIST_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      // Handle legacy format (array of numbers)
      if (Array.isArray(parsed) && parsed.length > 0 && typeof parsed[0] === "number") {
        return parsed.map((id: number) => ({ id, type: "movie" as const }));
      }
      return parsed;
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem(WATCHLIST_KEY, JSON.stringify(watchlist));
  }, [watchlist]);

  const addToWatchlist = (itemId: number, type: "movie" | "tv" = "movie") => {
    setWatchlist((prev) => [...prev, { id: itemId, type }]);
  };

  const removeFromWatchlist = (itemId: number, type: "movie" | "tv" = "movie") => {
    setWatchlist((prev) => prev.filter((item) => !(item.id === itemId && item.type === type)));
  };

  const isInWatchlist = (itemId: number, type: "movie" | "tv" = "movie") => 
    watchlist.some((item) => item.id === itemId && item.type === type);

  const toggleWatchlist = (itemId: number, type: "movie" | "tv" = "movie") => {
    if (isInWatchlist(itemId, type)) {
      removeFromWatchlist(itemId, type);
    } else {
      addToWatchlist(itemId, type);
    }
  };

  return {
    watchlist,
    addToWatchlist,
    removeFromWatchlist,
    isInWatchlist,
    toggleWatchlist,
  };
};
