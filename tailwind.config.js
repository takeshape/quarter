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
          'primary': 'rgb(9, 139, 199)',
          'input-bg': 'rgb(9, 139, 199)',
          'message-bg': 'rgb(9, 139, 199)',
          'header-link': 'rgb(0, 33, 105)'
        }
      },
      dark: {
        colors: {
          'primary': 'rgb(7, 139, 199)',
          'input-bg': 'hsl(240, 4%, 30%)',
          'message-bg': 'rgb(0, 49, 109)',
          'header-link': 'hsl(0, 0%, 85%)'
        }
      }
    }
  })],
};
