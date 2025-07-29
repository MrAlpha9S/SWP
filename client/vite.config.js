import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

const isProduction = process.env.NODE_ENV === 'production'

export default defineConfig({
  server: {
    proxy: {
      '/api/v1': {
        target: isProduction ? 'https://ezquit.site' : 'http://localhost:3000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/v1/, '')
      }
    }
  },
  plugins: [
    react()
  ],
})