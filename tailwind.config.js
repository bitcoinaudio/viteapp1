/** @type {import('tailwindcss').Config} */
export default {
  content:  ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      screens: {
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        
      }
    },
  },
  plugins: [require('daisyui')],
}

