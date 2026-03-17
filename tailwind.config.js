/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./popup.tsx",
    "./components/**/*.tsx",
    "./tabs/**/*.tsx"
  ],
  theme: {
    extend: {
      colors: {
        financeGreen: '#10b981',
        financeRed: '#ef4444',
        terminalBg: '#0f172a'
      }
    },
  },
  plugins: [],
}