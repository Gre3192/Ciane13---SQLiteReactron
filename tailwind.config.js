/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        roboto: ['Roboto', 'sans-serif'],
      },
    },
    variants: {
      scrollbar: ['rounded'],
    },
    plugins: [
      require('tailwind-scrollbar'),
    ],
  }
}
