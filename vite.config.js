import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/variant-price.php': {
        target: 'http://13.203.184.96/',
        changeOrigin: true,
        secure: false,
      },
      '^/rest/.*': {
        target: 'http://13.203.184.96/',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
