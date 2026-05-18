/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          950: '#101113',
          900: '#17191d',
          850: '#1e2227',
          800: '#252a31',
          700: '#343a43'
        },
        chalk: {
          100: '#f5f7f2',
          300: '#d7ddcf',
          500: '#aab4a3'
        },
        focus: {
          teal: '#4fd1c5',
          gold: '#f5c76b',
          rose: '#ef8aa0',
          green: '#8bd17c'
        }
      },
      boxShadow: {
        widget: '0 18px 48px rgba(0, 0, 0, 0.28)',
        insetLine: 'inset 0 1px 0 rgba(255, 255, 255, 0.06)'
      }
    }
  },
  plugins: []
};
