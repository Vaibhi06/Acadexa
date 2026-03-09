import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    'global': 'window',
  },
  server: {
    port: 5173,
    strictPort: true, // Fail if port is busy, we'll try to clear it anyway
    host: true,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:5000',
        changeOrigin: true,
        secure: false,
      }
    }
  },
  optimizeDeps: {
    include: ['xlsx'],
    holdUntilResolved: true
  },
  resolve: {
    alias: {
      './dist/cpexcel.js': '', // Some xlsx versions need this
    }
  },
  build: {
    commonjsOptions: {
      include: [/xlsx/, /node_modules/],
      transformMixedEsModules: true
    }
  }
})
