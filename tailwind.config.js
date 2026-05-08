/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          bg:          '#3d3d3d',
          orange:      '#FF210F',
          dark:        '#2a2a2a',
          light:       '#f5f5f5',
          muted:       '#9ca3af',
          // Named page-background aliases — used instead of raw hex so
          // light-mode CSS overrides work without special-char escaping
          'page-base':  '#1a1a1a',
          'page-dark':  '#111111',
          'page-card':  '#222222',
          'page-panel': '#1e1e1e',
        },
      },
      fontFamily: {
        heading: ['Barlow Condensed', 'sans-serif'],
        body:    ['Barlow', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
