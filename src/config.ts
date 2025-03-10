<<<<<<< HEAD
// Remove the global declaration since it's now in vite-env.d.ts
const validateEnvVar = (name: string, value?: string): string => {
  if (!value) {
    console.error(`Missing environment variable: ${name}`);
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
};

const SPOTIFY_CLIENT_ID = validateEnvVar(
  'VITE_SPOTIFY_CLIENT_ID',
  import.meta.env.VITE_SPOTIFY_CLIENT_ID
);

const SPOTIFY_CLIENT_SECRET = validateEnvVar(
  'VITE_SPOTIFY_CLIENT_SECRET',
  import.meta.env.VITE_SPOTIFY_CLIENT_SECRET
);

const OPENAI_API_KEY = validateEnvVar(
  'VITE_OPENAI_API_KEY',
  import.meta.env.VITE_OPENAI_API_KEY
);

export {
  SPOTIFY_CLIENT_ID,
  SPOTIFY_CLIENT_SECRET,
  OPENAI_API_KEY
};
=======
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
>>>>>>> 98902f7b6308506e73bb8ffb989920c960a3e089
