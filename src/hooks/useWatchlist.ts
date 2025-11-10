import { useState, useEffect } from "react";

const WATCHLIST_KEY = "movieverse_watchlist";

export const useWatchlist = () => {
  const [watchlist, setWatchlist] = useState<number[]>(() => {
    const saved = localStorage.getItem(WATCHLIST_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem(WATCHLIST_KEY, JSON.stringify(watchlist));
  }, [watchlist]);

  const addToWatchlist = (movieId: number) => {
    setWatchlist((prev) => [...prev, movieId]);
  };

  const removeFromWatchlist = (movieId: number) => {
    setWatchlist((prev) => prev.filter((id) => id !== movieId));
  };

  const isInWatchlist = (movieId: number) => watchlist.includes(movieId);

  const toggleWatchlist = (movieId: number) => {
    if (isInWatchlist(movieId)) {
      removeFromWatchlist(movieId);
    } else {
      addToWatchlist(movieId);
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
