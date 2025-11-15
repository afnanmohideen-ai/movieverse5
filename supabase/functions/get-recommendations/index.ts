import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.81.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const TMDB_API_KEY = "c8fadbbe523947799c4d537b7f1fbe3d";
const TMDB_BASE_URL = "https://api.themoviedb.org/3";

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_PUBLISHABLE_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    const { data: { user } } = await supabaseClient.auth.getUser();

    // If not authenticated, return deterministic generic picks (no user data)
    if (!user) {
      const today = new Date().toISOString().split('T')[0];
      const seed = today.split('-').join('');

      const movieResponse = await fetch(
        `${TMDB_BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&sort_by=popularity.desc&vote_count.gte=1000&page=${parseInt(seed) % 5 + 1}`
      );
      const movieData = await movieResponse.json();

      const tvResponse = await fetch(
        `${TMDB_BASE_URL}/discover/tv?api_key=${TMDB_API_KEY}&sort_by=popularity.desc&vote_count.gte=500&page=${parseInt(seed) % 5 + 1}`
      );
      const tvData = await tvResponse.json();

      const movieIndex = parseInt(seed.slice(-2)) % (movieData.results?.length || 1);
      const tvIndex = parseInt(seed.slice(-3, -1)) % (tvData.results?.length || 1);

      return new Response(
        JSON.stringify({
          movie: movieData.results?.[movieIndex] || movieData.results?.[0] || null,
          tvShow: tvData.results?.[tvIndex] || tvData.results?.[0] || null,
          userPreferences: {
            favoriteGenres: [],
            watchlistCount: 0,
            ratingsCount: 0,
          },
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get user profile with favorite genres
    const { data: profile } = await supabaseClient
      .from('profiles')
      .select('favorite_genres')
      .eq('user_id', user.id)
      .single();

    // Get user's watchlist
    const { data: watchlist } = await supabaseClient
      .from('user_watchlist')
      .select('item_id, item_type')
      .eq('user_id', user.id);

    // Get user's ratings
    const { data: ratings } = await supabaseClient
      .from('user_ratings')
      .select('item_id, item_type, rating')
      .eq('user_id', user.id);

    // Get daily seed (changes each day)
    const today = new Date().toISOString().split('T')[0];
    const seed = today.split('-').join('');

    // Fetch recommendations from TMDB
    const genreIds = profile?.favorite_genres || [];
    const genreParam = genreIds.length > 0 ? `&with_genres=${genreIds.join(',')}` : '';

    // Get popular movies with user's genres
    const movieResponse = await fetch(
      `${TMDB_BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}${genreParam}&sort_by=vote_average.desc&vote_count.gte=1000&page=${parseInt(seed) % 5 + 1}`
    );
    const movieData = await movieResponse.json();

    // Get popular TV shows with user's genres
    const tvResponse = await fetch(
      `${TMDB_BASE_URL}/discover/tv?api_key=${TMDB_API_KEY}${genreParam}&sort_by=vote_average.desc&vote_count.gte=500&page=${parseInt(seed) % 5 + 1}`
    );
    const tvData = await tvResponse.json();

    // Filter out already watched items
    const watchlistIds = new Set(watchlist?.map(w => `${w.item_type}-${w.item_id}`) || []);
    
    const filteredMovies = movieData.results?.filter((m: any) => 
      !watchlistIds.has(`movie-${m.id}`)
    ) || [];
    
    const filteredTVShows = tvData.results?.filter((t: any) => 
      !watchlistIds.has(`tv-${t.id}`)
    ) || [];

    // Select today's recommendations (deterministic based on date)
    const movieIndex = parseInt(seed.slice(-2)) % (filteredMovies.length || 1);
    const tvIndex = parseInt(seed.slice(-3, -1)) % (filteredTVShows.length || 1);

    const todaysMovie = filteredMovies[movieIndex] || movieData.results?.[0];
    const todaysTVShow = filteredTVShows[tvIndex] || tvData.results?.[0];

    return new Response(
      JSON.stringify({
        movie: todaysMovie,
        tvShow: todaysTVShow,
        userPreferences: {
          favoriteGenres: genreIds,
          watchlistCount: watchlist?.length || 0,
          ratingsCount: ratings?.length || 0
        }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in get-recommendations function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
