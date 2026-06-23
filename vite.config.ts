import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
// Default base is "/" — correct for the Cloudflare Worker (served at the domain
// root) and local dev. The GitHub Pages deploy overrides it to "/CookingRecipe/"
// via `vite build --base=/CookingRecipe/` (see the predeploy script).
export default defineConfig({
  plugins: [react()],
  base: '/',
})