/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./pages/**/*.{js,jsx}', './components/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        navy: '#0D1F3C',
        blue: { DEFAULT: '#1B3F72', light: '#2563EB' },
        gold: { DEFAULT: '#C9A84C', light: '#F0CB6E' },
        cream: '#FAF7F2',
      },
      fontFamily: {
        serif: ['Playfair Display', 'serif'],
        sans: ['DM Sans', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
