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
      fontSize: {
        'xs': ['0.875rem', { lineHeight: '1.25rem' }],    // 14px, increased from 12px
        'sm': ['1rem', { lineHeight: '1.5rem' }],          // 16px, increased from 14px
        'base': ['1.125rem', { lineHeight: '1.75rem' }],   // 18px, increased from 16px
        'lg': ['1.25rem', { lineHeight: '1.875rem' }],     // 20px, increased from 18px
        'xl': ['1.375rem', { lineHeight: '2rem' }],        // 22px, increased from 20px
        '2xl': ['1.625rem', { lineHeight: '2.25rem' }],    // 26px, increased from 24px
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: ["light"], // Force light mode only
  },
};
