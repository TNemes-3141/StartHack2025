import {heroui} from "@heroui/theme"

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
  plugins: [heroui()],
}

module.exports = config;