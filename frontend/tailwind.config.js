/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // This line is the important one
  ],
  theme: {
    extend: {
      fontFamily: {
        // Add this line
        'sans': ['Aclonia', 'sans-serif'] // Sets Aclonia as the default sans-serif font
      },
      colors: {
        // You can add your "chess yellow" here for easy reuse
        'chess-yellow': '#D4DB00', // This is a guess, use your exact color
      }
    },
  },
  plugins: [],
}