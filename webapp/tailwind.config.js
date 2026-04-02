export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        pixel: ['"Press Start 2P"', 'cursive'],
      },
      colors: {
        mc: {
          dark: '#fffde7',
          green: '#16a34a',
          yellow: '#d97706',
          brown: '#8B4513',
          stone: '#6b7280',
          dirt: '#916B47',
          purple: '#9333ea',
          pink: '#ec4899',
          lavender: '#ede9fe',
        }
      }
    }
  },
  plugins: [],
}
