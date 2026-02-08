/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        "arion-purple-soft": "rgb(231, 220, 226)",
        "arion-purple-strong": "rgb(128, 0, 128)",
      },
    },
  },
  plugins: [require("daisyui")],
};
