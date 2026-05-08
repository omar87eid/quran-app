/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        tajawal: ['Tajawal', 'sans-serif'],
      },
      colors: {
        teal: {
          700: '#0f766e',
          800: '#115e59',
          900: '#134e4a',
        },
        surface: '#ffffff',
        bg: '#f8fafc',
      },
      borderRadius: {
        '2xl': '18px',
      },
      boxShadow: {
        soft: '0 4px 24px 0 rgba(15,118,110,0.08)',
        card: '0 2px 16px 0 rgba(15,118,110,0.10)',
        player: '0 -4px 32px 0 rgba(15,118,110,0.13)',
      },
    },
  },
  plugins: [],
}
