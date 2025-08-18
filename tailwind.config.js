/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // MealStack 브랜드 컬러 (피그마 기준)
        primary: {
          red: '#dc2626',
          'red-hover': '#b91c1c',
        },
        background: {
          black: '#111111',
          dark: '#1a1a1a',
        },
        card: {
          gray: '#333333',
          'dark-gray': '#262626',
        },
        text: {
          white: '#ffffff',
          gray: '#cccccc',
          'light-gray': '#999999',
        },
        border: {
          gray: '#666666',
          'light-gray': '#808080',
        }
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
};