import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      output: {
        // Vendor chunks change rarely, so returning visitors keep them cached
        // across deploys. Recharts is already its own chunk because the
        // dashboard charts are lazy-loaded.
        manualChunks(id) {
          if (!id.includes('node_modules')) return
          if (id.includes('/firebase/') || id.includes('/@firebase/')) return 'firebase'
          if (/\/node_modules\/(react|react-dom|react-router|react-router-dom|scheduler)\//.test(id)) {
            return 'react-vendor'
          }
        },
      },
    },
  },
})