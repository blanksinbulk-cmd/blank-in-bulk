/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        olive: "#7A8060",
        ink: "#111111",
        muted: "#666666",
        line: "#EAEAEA",
      },
      fontFamily: {
        display: ["'Manrope'", "sans-serif"],
        body: ["'Manrope'", "sans-serif"],
      },
    },
  },
  plugins: [],
};
