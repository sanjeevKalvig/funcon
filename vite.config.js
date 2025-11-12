import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/variant-price.php': {
        target: 'http://rocking.magento.com',
        changeOrigin: true,
        secure: false,
      },
      '^/rest/.*': {
        target: 'http://rocking.magento.com',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
