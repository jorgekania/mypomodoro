/** @type {import('tailwindcss').Config} */

const plugin = require('tailwindcss/plugin');
const defaultTheme = require('tailwindcss/defaultTheme');

const rotateY = plugin(function ({ addUtilities }) {
  addUtilities ({
    '.rotate-y-180': {
      transform: "rotateY(180deg)"
    },
    '.-rotate-y-180': {
      transform: "rotateY(-180deg)"
    }
  })
})

module.exports = {
  content: ["./public/*.{html,js}"],
  theme: {
    extend: {
      colors: {
        "color-primary": "#01051e",
        "color-primary-light": "#020726",
        "color-primary-dark": "#010417",
        "color-secondary": "#00BF63",
        "color-gray": "#333",
        "color-white": "#fff",
        "color-blob": "#A427DF",
      },
      fontFamily: {
        league: ['"League Spartan"', ...defaultTheme.fontFamily.sans]
      }
    },
    container: {
      center: true,
      padding: {
        DEFAULT: '20px',
        md: "50px"
      }
    }
  },
  plugins: [rotateY],
}
