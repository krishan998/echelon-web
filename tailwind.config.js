/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        coral: {
          300: '#fab4a4',
          500: '#f47458',
        },
      },
    },
  },
  plugins: [],
};