// Replace the process declaration with proper Vite env types
interface ImportMetaEnv {
  VITE_OPENAI_API_KEY: string
  VITE_SPOTIFY_CLIENT_ID: string
  VITE_SPOTIFY_CLIENT_SECRET: string
  VITE_WEBSOCKET_URL: string
  VITE_REALTIME_ENABLED: string
  VITE_OPENAI_ORG_ID: string
  VITE_OPENAI_PROJECT_ID: string
}

export const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY || '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';
export const SPOTIFY_CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID || '994156b4dfc74a538fa509ae018e93f2';
export const SPOTIFY_CLIENT_SECRET = import.meta.env.VITE_SPOTIFY_CLIENT_SECRET || '02eafaf178644b77b3c50fb8a7d909ce';
export const WEBSOCKET_URL = import.meta.env.VITE_WEBSOCKET_URL || 'ws://localhost:3000';
export const REALTIME_ENABLED = import.meta.env.VITE_REALTIME_ENABLED === 'true';
export const OPENAI_ORG_ID = import.meta.env.VITE_OPENAI_ORG_ID || 'org-tRoeJAHWt62CDURHjpqzTd1g';
export const OPENAI_PROJECT_ID = import.meta.env.VITE_OPENAI_PROJECT_ID || 'proj_ibYs2MsHqx8pxj3QJmo9kPN7';
export const OPENAI_WEBSOCKET_URL = 'wss://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview-2024-12-17';

export function createWebSocketConnection() {
  if (!REALTIME_ENABLED) {
    console.log('Realtime features are disabled');
    return null;
  }
  
  try {
    const socket = new WebSocket(WEBSOCKET_URL);
    
    socket.onopen = () => {
      console.log('WebSocket connection established');
    };
    
    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log('Message received:', data);
      // Handle the received message
    };
    
    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
    
    socket.onclose = () => {
      console.log('WebSocket connection closed');
    };
    
    return socket;
  } catch (error) {
    console.error('Failed to create WebSocket connection:', error);
    return null;
  }
}