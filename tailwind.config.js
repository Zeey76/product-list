/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./*{html,js}"],
  theme: {
    spacing: Array.from({ length: 30 }, (_, i) => i).reduce((acc, i) => {
      acc[i] = `${i}rem`;
      acc[`${i}.5`] = `${i}.5rem`;
      return acc;
    }, {}),
    extend: {
      colors: {
        red: "hsl(14, 86%, 42%)",
        green: "hsl(159, 69%, 38%)",
        rose50: "hsl(20, 50%, 98%)",
        rose100: "hsl(13, 31%, 94%)",
        rose300: "hsl(14, 25%, 72%)",
        rose400: "hsl(7, 20%, 60%)",
        rose500: "hsl(12, 20%, 44%)",
        rose900: "hsl(14, 65%, 9%)",
      },
      fontFamily: {
        redHat: ['"Red Hat Text"', 'sans-serif']
      }
    },
  },
  plugins: [],
};
