import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  define: {
    global: 'globalThis',
  },
  optimizeDeps: {
    exclude: ['@btc-vision/bitcoin', 'opnet'],
  },
  build: {
    rollupOptions: {
      external: ['https://esm.sh/opnet@1.8.1-rc.17', 'https://esm.sh/@btc-vision/bitcoin@7.0.0-rc.6'],
      output: {
        manualChunks: (id) => {
          if (id.includes('react') || id.includes('react-dom')) {
            return 'vendor';
          }
          if (id.includes('framer-motion') || id.includes('lucide-react')) {
            return 'blockchain';
          }
          return 'index';
        },
      },
    },
    commonjsOptions: {
      include: [],
    },
  },
  server: {
    headers: {
      'Content-Security-Policy': "default-src 'self' 'unsafe-inline' 'unsafe-eval' data: blob: https://esm.sh https://cdn.jsdelivr.net; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://esm.sh https://cdn.jsdelivr.net; connect-src 'self' https://testnet.opnet.org https://esm.sh https://cdn.jsdelivr.net;",
    },
  },
})
