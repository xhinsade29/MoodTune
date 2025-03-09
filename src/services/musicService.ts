import axios from 'axios';
import { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET } from '../config';

export interface SpotifyTrack {
  id: string;
  name: string;
  uri: string;
  preview_url: string | null;
  artists: { name: string }[];
  album: {
    name: string;
    images: { url: string; height: number; width: number; }[];
  };
  moodConfidence?: number;
}

// Removed unused interface

// Update emotion to genre mapping to include more specific genres
const emotionToMusicMap: Record<string, string[]> = {
  happy: ['pop dance party happy', 'feel good', 'upbeat hits', 'happy music'],
  sad: ['sad songs', 'melancholic', 'indie sad', 'emotional ballads', 'heartbreak', 'sad music'],
  energetic: ['dance electronic edm', 'workout', 'power hit', 'energy playlist'],
  calm: ['ambient chill', 'relaxing piano', 'peaceful', 'calming music'],
  angry: ['rock metal', 'punk intense', 'rage', 'aggressive music'],
  anxious: ['classical piano', 'instrumental ambient', 'meditation', 'calming anxiety'],
  excited: ['dance pop', 'party', 'upbeat', 'excitement playlist'],
  melancholic: ['indie acoustic', 'melancholic songs', 'emotional', 'sad indie', 'melancholy playlist', 'slow sad songs'],
  nostalgic: ['retro oldies', 'classic vintage', '80s 90s', 'throwback hits'],
  relaxed: ['lofi jazz', 'chill ambient', 'soft acoustic', 'relaxing playlist']
};

// Add debug helper
const logApiError = (error: any, context: string) => {
  if (axios.isAxiosError(error)) {
    console.error(`${context} - Status:`, error.response?.status);
    console.error('Error details:', error.response?.data);
    console.error('Request URL:', error.config?.url);
    console.error('Request params:', error.config?.params);
  } else {
    console.error(`${context}:`, error);
  }
};

// Add this debug function at the start of the file
const debugDependencies = () => {
  console.log('Checking dependencies...');
  console.log('Spotify Client ID:', SPOTIFY_CLIENT_ID ? '✓ Present' : '✗ Missing');
  console.log('Spotify Client Secret:', SPOTIFY_CLIENT_SECRET ? '✓ Present' : '✗ Missing');
  console.log('Axios:', typeof axios === 'function' ? '✓ Present' : '✗ Missing');
};

// Get Spotify access token
const getSpotifyToken = async (): Promise<string> => {
  debugDependencies(); // Add this line
  try {
    if (!SPOTIFY_CLIENT_ID || !SPOTIFY_CLIENT_SECRET) {
      throw new Error('Spotify credentials are not configured');
    }

    // Use btoa() instead of Buffer for browser environments
    const credentials = btoa(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`);
    
    const response = await axios.post(
      'https://accounts.spotify.com/api/token',
      new URLSearchParams({
        'grant_type': 'client_credentials'
      }).toString(),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Basic ${credentials}`
        }
      }
    );

    if (!response.data.access_token) {
      throw new Error('No access token received from Spotify');
    }

    return response.data.access_token;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Spotify API Error:', error.response?.data || error.message);
      throw new Error(`Spotify authentication failed: ${error.response?.data?.error || error.message}`);
    }
    throw new Error('Authentication failed with Spotify');
  }
};

// Add function to get playlist by search keywords
export const searchPlaylistsByKeywords = async (token: string, keywords: string[]): Promise<SpotifyTrack[]> => {
  for (const keyword of keywords) {
    try {
      const response = await axios.get('https://api.spotify.com/v1/search', {
        headers: { 'Authorization': `Bearer ${token}` },
        params: {
          q: keyword,
          type: 'track',
          market: 'US',
          limit: 50
        }
      });

      const tracks = response.data?.tracks?.items || [];
      const playableTracks = tracks
        .filter((track: SpotifyTrack) => track?.preview_url)
        .slice(0, 10);

      if (playableTracks.length > 0) {
        return playableTracks;
      }
    } catch (error) {
      console.warn(`Search failed for keyword: ${keyword}`, error);
    }
  }
  return [];
};

// Update the main track fetching function
export const getTracksForEmotion = async (emotion: string): Promise<SpotifyTrack[]> => {
  const token = await getSpotifyToken();
  let allTracks: SpotifyTrack[] = [];
  
  // Add generic terms to all searches
  const genericTerms = ['popular', 'top', 'hits'];
  const searchTerms = [
    ...(emotionToMusicMap[emotion.toLowerCase()] || [emotion]),
    ...genericTerms.map(term => `${emotion} ${term}`)
  ];

  const fetchWithRetry = async (term: string, retryCount = 5) => {
    for (let i = 0; i < retryCount; i++) {
      try {
        console.log(`Searching for: ${term} (attempt ${i + 1})`);
        const response = await axios.get('https://api.spotify.com/v1/search', {
          headers: { 'Authorization': `Bearer ${token}` },
          params: {
            q: term,
            type: 'track',
            market: 'US',
            limit: 50
          }
        });

        const tracks = response.data?.tracks?.items || [];
        console.log(`Found ${tracks.length} tracks for term: ${term}`);
        return tracks;
      } catch (error) {
        if (i === retryCount - 1) throw error;
        await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
      }
    }
    return [];
  };

  // Try each search term
  for (const term of searchTerms) {
    try {
      const tracks = await fetchWithRetry(term);
      const playableTracks = tracks.filter((track: SpotifyTrack) => 
        track?.name && 
        track?.artists?.length > 0 && 
        track?.album?.images?.length > 0
      );

      // Use Array.from() to fix Set iteration error
      allTracks = Array.from(new Set([...allTracks, ...playableTracks]));

      if (allTracks.length >= 5) {
        console.log(`Found ${allTracks.length} tracks for mood: ${emotion}`);
        return allTracks.slice(0, 10);
      }
    } catch (error) {
      console.warn(`Search failed for term: ${term}`, error);
    }
  }

  // If we have any tracks, return them
  if (allTracks.length > 0) {
    console.log(`Found ${allTracks.length} tracks for mood: ${emotion}`);
    return allTracks;
  }

  // Try broader fallback search terms
  const fallbackTerms = [
    'popular songs',
    'top hits',
    'indie hits',
    'pop music',
    emotion,
    'playlist'
  ];

  for (const term of fallbackTerms) {
    try {
      const tracks = await fetchWithRetry(term);
      const playableTracks = tracks.filter((track: SpotifyTrack) => 
        track?.name && track?.artists?.length > 0
      );

      if (playableTracks.length > 0) {
        console.log(`Found ${playableTracks.length} tracks using fallback term: ${term}`);
        return playableTracks.slice(0, 10);
      }
    } catch (error) {
      console.warn(`Fallback search failed for term: ${term}`, error);
    }
  }

  // If still no tracks, try the playlist approach as last resort
  try {
    const playlistTracks = await getPlaylistForEmotion(emotion);
    if (playlistTracks.length > 0) {
      return playlistTracks;
    }
  } catch (error) {
    console.warn('Playlist fallback failed:', error);
  }

  throw new Error(`Could not find any playable tracks for mood: ${emotion}. Try broadening your mood description.`);
};

// Helper functions for music parameters
export const getTargetEnergy = (emotion: string): number => {
  switch (emotion.toLowerCase()) {
    case 'energetic':
      return 0.8;
    case 'calm':
    case 'relaxed':
      return 0.3;
    case 'angry':
      return 0.9;
    case 'sad':
    case 'melancholic':
      return 0.4;
    default:
      return 0.5;
  }
};

export const getTargetValence = (emotion: string): number => {
  switch (emotion.toLowerCase()) {
    case 'happy':
    case 'excited':
      return 0.8;
    case 'sad':
      return 0.3;
    case 'calm':
    case 'relaxed':
      return 0.6;
    case 'angry':
      return 0.2;
    default:
      return 0.5;
  }
};

// Update playlist search to handle errors better
export const getPlaylistForEmotion = async (emotion: string): Promise<SpotifyTrack[]> => {
  try {
    const token = await getSpotifyToken();
    console.log('Searching playlists for emotion:', emotion);

    // Try multiple search terms for better results
    const searchTerms = [
      `${emotion} mood playlist`,
      `${emotion} vibes`,
      `${emotionToMusicMap[emotion.toLowerCase()]} playlist`
    ];

    for (const searchTerm of searchTerms) {
      try {
        const searchResponse = await axios.get('https://api.spotify.com/v1/search', {
          headers: { 'Authorization': `Bearer ${token}` },
          params: {
            q: searchTerm,
            type: 'playlist',
            market: 'US',
            limit: 5
          }
        });

        const playlists = searchResponse.data?.playlists?.items;
        if (!playlists || playlists.length === 0) {
          console.log(`No playlists found for term: ${searchTerm}`);
          continue;
        }

        // Try each playlist until we find one with playable tracks
        for (const playlist of playlists) {
          if (!playlist?.id) continue;

          console.log('Trying playlist:', playlist.name || 'Unnamed Playlist');

          const tracksResponse = await axios.get(
            `https://api.spotify.com/v1/playlists/${playlist.id}/tracks`,
            {
              headers: { 'Authorization': `Bearer ${token}` },
              params: {
                market: 'US',
                limit: 50,
                fields: 'items(track(id,name,uri,preview_url,artists,album))'
              }
            }
          );

          if (tracksResponse.data?.items) {
            const playableTracks = tracksResponse.data.items
              .map((item: any) => item?.track)
              .filter((track: SpotifyTrack | null) => 
                track && 
                track.preview_url && 
                track.id && 
                track.name && 
                track.artists?.[0]?.name
              )
              .slice(0, 10);

            if (playableTracks.length > 0) {
              console.log(`Found ${playableTracks.length} playable tracks from playlist`);
              return playableTracks;
            }
          }
        }
      } catch (error) {
        console.warn(`Failed to get results for search term: ${searchTerm}`, error);
        continue;
      }
    }

    // If we got here, we couldn't find any suitable tracks
    throw new Error(`No playable tracks found for mood: ${emotion}`);

  } catch (error) {
    logApiError(error, 'Playlist fetch error');
    throw error;
  }
};

// Add available Spotify genres for recommendations
const availableGenres = [
  'pop', 'rock', 'hip-hop', 'electronic', 'classical', 'jazz',
  'ambient', 'indie', 'dance', 'alternative', 'metal', 'punk',
  'soul', 'r-n-b', 'blues', 'chill'
];

export const getRecommendedTracks = async (
  seedTracks: string[],
  emotion: string
): Promise<SpotifyTrack[]> => {
  try {
    const token = await getSpotifyToken();
    console.log('Getting recommendations with seeds:', seedTracks);

    const targetEnergy = getTargetEnergy(emotion);
    const targetValence = getTargetValence(emotion);

    // First try: Use seed tracks and genres
    try {
      const response = await axios.get('https://api.spotify.com/v1/recommendations', {
        headers: { 'Authorization': `Bearer ${token}` },
        params: {
          seed_tracks: seedTracks.slice(0, 2).join(','),
          seed_genres: availableGenres.slice(0, 3).join(','),
          target_energy: targetEnergy,
          target_valence: targetValence,
          min_popularity: 50,
          limit: 20,
          market: 'US'
        }
      });

      const recommendedTracks = response.data?.tracks || [];
      const playableTracks = recommendedTracks
        .filter((track: SpotifyTrack) => 
          track?.preview_url && 
          track?.name && 
          track?.artists?.length > 0
        )
        .slice(0, 10);

      if (playableTracks.length > 0) {
        return playableTracks;
      }
    } catch (error) {
      console.warn('Failed with seed tracks, falling back to genres only');
    }

    // Second try: Use only genres
    const genreResponse = await axios.get('https://api.spotify.com/v1/recommendations', {
      headers: { 'Authorization': `Bearer ${token}` },
      params: {
        seed_genres: availableGenres.slice(0, 5).join(','),
        target_energy: targetEnergy,
        target_valence: targetValence,
        min_popularity: 50,
        limit: 20,
        market: 'US'
      }
    });

    const genreTracks = genreResponse.data?.tracks || [];
    const playableGenreTracks = genreTracks
      .filter((track: SpotifyTrack) => track?.preview_url)
      .slice(0, 10);

    if (playableGenreTracks.length > 0) {
      return playableGenreTracks;
    }

    throw new Error('No playable recommended tracks found');
  } catch (error) {
    logApiError(error, 'Recommendation error');
    if (axios.isAxiosError(error)) {
      throw new Error(`Recommendation request failed: ${error.response?.data?.error?.message || error.message}`);
    }
    throw error;
  }
};