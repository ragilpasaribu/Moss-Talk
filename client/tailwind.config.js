/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#50e1cd',
        secondary:"#4cb5a7"
      },
    },
  },
  plugins: [],
}

