/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#2D6A4F",
        darkGreen: "#1B4332",
        lightGreen: "#74C69D",
        brown: "#6B4226",
        skyBlue: "#74C0FC",
        cream: "#F9F3E3",
        whiteCard: "#FFFFFF",
        warning: "#F4A261",
        error: "#E63946",
      },
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
