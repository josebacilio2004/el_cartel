/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: '#0D0E11',
        'frank-bg': '#0D0E11',
        'frank-surface': '#13151B',
        'frank-card': '#161922',
        'frank-border': '#232733',
        'frank-orange': {
          DEFAULT: '#C4622D',
          hover: '#D66B33',
          dark: '#A64F22'
        },
        'frank-gold': '#C88A3B',
        'frank-gray': {
          light: '#D1D5DB',
          muted: '#8A8F9E',
          dark: '#1C1F2A'
        },
        primary: {
          DEFAULT: '#C4622D',
          hover: '#D66B33',
          light: '#E07A43',
          dim: 'rgba(196, 98, 45, 0.15)',
        },
        secondary: {
          DEFAULT: '#10B981',
          dim: 'rgba(16, 185, 129, 0.15)',
        }
      },
      fontFamily: {
        display: ['"Bebas Neue"', '"Oswald"', 'sans-serif'],
        bebas: ['"Bebas Neue"', 'sans-serif'],
        oswald: ['"Oswald"', 'sans-serif'],
        sans: ['"Montserrat"', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
