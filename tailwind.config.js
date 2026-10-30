/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#070e17',
          900: '#0d1826',
          850: '#111f32',
          800: '#17273c',
          700: '#1f344e',
        },
        gold: {
          100: '#f9f3e5',
          200: '#f1e3c2',
          300: '#e5cd96',
          400: '#d4af62',
          500: '#b8863b',
          600: '#a37430',
          700: '#875d24',
        },
        ivory: {
          50: '#fdfbf7',
          100: '#faf6ee',
          200: '#f4ede0',
          300: '#ebe1ce',
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
        signature: ['"Alex Brush"', '"Dancing Script"', 'cursive'],
      }
    },
  },
  plugins: [],
};
