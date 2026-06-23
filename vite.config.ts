import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
// GitHub Pages serves the app under /CookingRecipe/, but Cloudflare Pages
// (which sets CF_PAGES) serves it at the domain root. Pick the base accordingly
// so assets resolve on both.
export default defineConfig({
  plugins: [react()],
  base: process.env.CF_PAGES ? '/' : '/CookingRecipe/',
})