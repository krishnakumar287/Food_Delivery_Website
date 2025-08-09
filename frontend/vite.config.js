import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: process.env.VITE_BASH_PATH || "/Food_Delivery_Website",
  server: {
    proxy: {
      '/api': 'https://food-delivery-website-2-5x0z.onrender.com'
    }
  }
})
