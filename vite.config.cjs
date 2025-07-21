import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import autoprefixer from 'autoprefixer'
import tailwindcss from 'tailwindcss'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    postcss: {
      plugins: [
        // The Tailwind config is now passed directly to the plugin
        tailwindcss({
          content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
          theme: {
            extend: {},
          },
          plugins: [],
        }),
        autoprefixer,
      ],
    },
  },
})
