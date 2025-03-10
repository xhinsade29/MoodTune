
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    allowedHosts: [
      'e2054abf-609f-4bc4-b19d-bb4725e2da55-00-1z2sc9lkqzh1e.sisko.replit.dev',
      // Allow all hosts with a wildcard
      'localhost',
      '.replit.dev',
      '*.replit.dev',
    ]
  }
})
