/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#ff6b35',
        secondary: '#00e5cc',
        dark: '#0a0e27',
        darker: '#050814'
      }
    },
  },
  plugins: [],
}
