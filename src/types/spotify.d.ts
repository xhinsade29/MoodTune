export interface SpotifyTrack {
  id: string;
  name: string;
  uri: string;  // Add missing uri field
  preview_url: string | null;
  artists: SpotifyArtist[];
  album: SpotifyAlbum;
}

export interface SpotifyArtist {
  name: string;
}

export interface SpotifyAlbum {
  name: string;
  images: SpotifyImage[];
}

export interface SpotifyImage {
  url: string;
}
