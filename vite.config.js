import { defineConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig({
  server: {
    // Listen on 0.0.0.0 so external tunnels (like ngrok) and local network devices can connect
    host: '0.0.0.0',
    port: 5173,
    strictPort: false,
    cors: true,
    // Allow any Host header (prevents Vite's "Host not allowed" error on *.ngrok-free.app)
    allowedHosts: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'ngrok-skip-browser-warning': 'true',
    },
    hmr: {
      clientPort: process.env.NGROK_PORT ? parseInt(process.env.NGROK_PORT, 10) : undefined,
    },
  },
  preview: {
    // Allow ngrok to forward to the preview server as well
    host: '0.0.0.0',
    port: 4173,
    strictPort: false,
    cors: true,
    allowedHosts: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'ngrok-skip-browser-warning': 'true',
    },
  },
});
