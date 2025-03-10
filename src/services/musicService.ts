import { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET } from '../config';

// Spotify related interfaces
interface SpotifyArtist {
  id: string;
  name: string;
}

interface SpotifyImage {
  url: string;
  height: number;
  width: number;
}

interface SpotifyAlbum {
  id: string;
  name: string;
  images: SpotifyImage[];
}

export interface SpotifyTrack {
  id: string;
  name: string;
  uri: string;
  artists: SpotifyArtist[];
  album: SpotifyAlbum;
  moodConfidence?: number;
  conversationId?: string;
  lastInteraction?: Date;
  isRealTime?: boolean;
}

interface SpotifyTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

interface SpotifyRecommendationsResponse {
  tracks: SpotifyTrack[];
}

interface SpotifyPlaylistItem {
  track: SpotifyTrack;
}

interface SpotifyPlaylist {
  id: string;
  name: string;
}

interface SpotifyPlaylistsResponse {
  playlists: {
    items: SpotifyPlaylist[];
  };
}

interface SpotifyPlaylistTracksResponse {
  items: SpotifyPlaylistItem[];
}

// Get Spotify access token
const getSpotifyToken = async (): Promise<string> => {
  try {
    if (!SPOTIFY_CLIENT_ID || !SPOTIFY_CLIENT_SECRET) {
      throw new Error('Spotify credentials are not configured');
    }

    const credentials = btoa(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`);
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${credentials}`
      },
      body: 'grant_type=client_credentials'
    });

    if (!response.ok) {
      throw new Error(`Spotify API error: ${response.status}`);
    }

    const data: SpotifyTokenResponse = await response.json();
    return data.access_token;
  } catch (error) {
    console.error('Failed to get Spotify token:', error);
    throw error;
  }
};

// Map emotions to Spotify genres/playlists
const emotionToMusicMap: Record<string, string> = {
  happy: 'pop,happy',
  sad: 'sad,indie,acoustic',
  energetic: 'edm,dance,workout',
  calm: 'ambient,chill,meditation',
  angry: 'rock,metal,intense',
  anxious: 'classical,piano,ambient',
  excited: 'party,dance,pop',
  melancholic: 'indie,folk,rainy-day',
  nostalgic: '80s,90s,oldies',
  relaxed: 'lofi,jazz,acoustic'
};

// Get tracks based on emotion
export const getTracksForEmotion = async (emotion: string, confidence: number = 1): Promise<SpotifyTrack[]> => {
  try {
    const token = await getSpotifyToken();
    const genre = emotionToMusicMap[emotion.toLowerCase()] || 'pop';
    
    const response = await fetch(`https://api.spotify.com/v1/recommendations?seed_genres=${genre}&limit=10`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const data: SpotifyRecommendationsResponse = await response.json();
    return data.tracks.map(track => ({
      ...track,
      moodConfidence: confidence
    })) || [];
  } catch (error) {
    console.error("Error getting tracks:", error);
    return [];
  }
};

// Alternative: Get a pre-made Spotify playlist for the emotion
export const getPlaylistForEmotion = async (emotion: string): Promise<SpotifyTrack[]> => {
  try {
    const token = await getSpotifyToken();
    
    // Search for playlists matching the emotion
    const searchResponse = await fetch(
      `https://api.spotify.com/v1/search?q=${emotion} mood&type=playlist&limit=5`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const searchData: SpotifyPlaylistsResponse = await searchResponse.json();
    const playlists = searchData.playlists?.items || [];
    
    if (playlists.length > 0) {
      // Get tracks from the first playlist
      const playlistResponse = await fetch(
        `https://api.spotify.com/v1/playlists/${playlists[0].id}/tracks?limit=10`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const playlistData: SpotifyPlaylistTracksResponse = await playlistResponse.json();
      return playlistData.items.map(item => item.track) || [];
    }
    
    return [];
  } catch (error) {
    console.error("Error getting playlist:", error);
    return [];
  }
};