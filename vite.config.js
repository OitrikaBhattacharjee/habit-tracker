import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Set this to match your repo name when deploying to GitHub Pages.
// e.g. github.com/yourname/habit-tracker -> base: '/habit-tracker/'
export default defineConfig({
  base: '/habit-tracker/',
  plugins: [react()],
})
