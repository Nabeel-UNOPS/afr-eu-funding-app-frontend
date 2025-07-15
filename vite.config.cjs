    const { defineConfig } = require('vite');
    const react = require('@vitejs/plugin-react');
    const tailwindcss = require('tailwindcss');
    const autoprefixer = require('autoprefixer');

    // https://vitejs.dev/config/
    module.exports = defineConfig({
      plugins: [react()],
      css: {
        postcss: {
          plugins: [
            tailwindcss,
            autoprefixer,
          ],
        },
      },
    });
    
