/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'custom-blue': '#16ABF8',
        'custom-blue-100': '#428BC1',
        'custom-purple': '#8942C1',
        'custom-black': '#111111',
        'custom-red': '#ED4C5C',
        'custom-green': '#00A790',
        'custom-yellow': '#F8A541',
        'custom-gray': '#555555',
        'custom-gray-100': '#F4F4F4',
        'custom-gray-200': '#888888',
        'custom-gray-300': '#4A4A4A',
      },
      boxShadow: {
        'custom-sm': '0px 4px 10px rgba(0, 0, 0, 0.1)',
        custom: '0px 6px 10px rgba(0, 0, 0, 0.1);',
      },
      minWidth: {
        button: '7.3125rem',
      },
      maxWidth: {
        'select-sm': '12rem',
        'select-lg': '15rem',
      },
      maxHeight: {
        card: '9.375rem',
        'card-lg': '14.625rem',
      },
      fontSize: {
        xxs: '0.625rem',
      },
    },
  },
  plugins: [require('@tailwindcss/line-clamp')],
};
