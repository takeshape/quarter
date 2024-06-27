// tailwind.config.js
const {nextui} = require("@nextui-org/theme");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  darkMode: "class",
  plugins: [nextui({
    themes: {
      light: {
        colors: {
          'background-secondary': 'hsl(150, 100%, 90%)'
        }
      },
      dark: {
        colors: {
          'background-secondary': 'hsl(212, 100%, 20%)'
        }
      }
    }
  })],
};
