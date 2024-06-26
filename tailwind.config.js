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
      light: {},
      dark: {
        colors: {
          content1: 'red',
          primary: 'red',
          focus: 'red',
          content2: 'red',
          content3: 'red',
          content4: 'red',

          
          secondary: 'red',

          success: 'red',

          overlay: 'red',

          danger: 'red',
          divider: 'red',
          activeNavItem: 'red'
        }
      }
    }
  })],
};