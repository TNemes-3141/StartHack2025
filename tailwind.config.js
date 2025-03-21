import {heroui} from "@heroui/theme"
import plugin from 'tailwindcss'


/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}"
  ],
  darkMode: "class",
  theme: {
    extend: {
      animation: {
        'fade-in-scale-0s': 'fade-in-scale 0.5s ease-in-out forwards',
        'fade-in-scale-1s': 'fade-in-scale 0.5s ease-in-out 0.1s forwards',
        'fade-in-scale-2s': 'fade-in-scale 0.5s ease-in-out 0.2s forwards',
        'fade-in-scale-3s': 'fade-in-scale 0.5s ease-in-out 0.3s forwards',
        'fade-in-scale-4s': 'fade-in-scale 0.5s ease-in-out 0.4s forwards',
        'fade-in-scale-5s': 'fade-in-scale 0.5s ease-in-out 0.5s forwards'
      },
      keyframes: {
        'fade-in-scale': {
          '0%': {
            opacity: '0',
          },
          '100%': {
            opacity: '1',
          },
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)"],
        mono: ["var(--font-mono)"],
      },
      colors: {
        primary: {
          DEFAULT: "#E52313"
        }, // Change this to your preferred color
        secondary: {
          light: "#F4F4F5",
          dark: "#27272A"
        },
        main: {
          light: "#FFFFFF",
          dark: "#000000"
        }
      },
    },
  },
  plugins: [
    heroui(),
    plugin(function ({ addUtilities }) {
      addUtilities({
        '.scrollbar-hide': {
          /* IE and Edge */
          '-ms-overflow-style': 'none',

          /* Firefox */
          'scrollbar-width': 'none',

          /* Safari and Chrome */
          '&::-webkit-scrollbar': {
            display: 'none'
          }
        }
      }
      )
    })
  ],
}

module.exports = config;