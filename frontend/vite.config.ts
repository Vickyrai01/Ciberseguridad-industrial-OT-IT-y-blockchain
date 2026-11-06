import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
export default defineConfig({
  base: process.env.VITE_BASE_PATH ?? '/',
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'framer-motion'],
          'supabase-vendor': ['@supabase/supabase-js'],
          'i18n-vendor': ['i18next', 'react-i18next'],
        },
      },
    },
  },
})
