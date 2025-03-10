// Replace the process declaration with proper Vite env types
interface ImportMetaEnv {
  VITE_SPOTIFY_CLIENT_ID: string;
  VITE_SPOTIFY_CLIENT_SECRET: string;
}

export const SPOTIFY_CLIENT_ID =
  import.meta.env.VITE_SPOTIFY_CLIENT_ID || "994156b4dfc74a538fa509ae018e93f2";
export const SPOTIFY_CLIENT_SECRET =
  import.meta.env.VITE_SPOTIFY_CLIENT_SECRET ||
  "02eafaf178644b77b3c50fb8a7d909ce";
