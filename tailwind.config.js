/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: '#5470FD',
        secondary: '#afbcff',
        background: '#f8f9fa',
        success: '#10b981',
        error: '#ef4444',
        text: '#1f2937',
      },
      fontFamily: {
        'raleway-bold': ['Raleway-Bold'],
        'raleway-light': ['Raleway-Light'],
        'raleway-medium': ['Raleway-Medium'],
        'raleway-regular': ['Raleway-Regular'],
      }
    },
  },
  plugins: [],
}
