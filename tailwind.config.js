/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'script': ['Pinyon Script', 'cursive'],
        'body': ['Crimson Pro', 'serif'],
      },
      colors: {
        'boda-emerald': '#043431', // Verde esmeralda profundo
        'boda-cream': '#F9F5F1',   // Crema suave
        'boda-gold': '#C9A06C',    // Oro viejo
      }
    },
  },
  plugins: [],
}