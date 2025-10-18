/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        'serif': ['Cormorant Garamond', 'serif'],
        'sans': ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fadeIn': 'fadeIn 0.5s ease-out',
      },
      letterSpacing: {
        'widest': '0.3em',
        'ultra-wide': '0.4em',
      },
      colors: {
        gray: {
          150: '#f7f7f7',
        },
      },
    },
  },
  plugins: [],
};