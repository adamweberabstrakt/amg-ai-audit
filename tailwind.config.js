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
          bg:     '#3d3d3d',
          orange: '#e85d04',
          dark:   '#2a2a2a',
          light:  '#f5f5f5',
          muted:  '#9ca3af',
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
