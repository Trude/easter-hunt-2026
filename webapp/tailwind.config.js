export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        pixel: ['"Press Start 2P"', 'cursive'],
      },
      colors: {
        mc: {
          dark: '#1a1a2e',
          green: '#5c8a1e',
          yellow: '#f5c518',
          brown: '#8B4513',
          stone: '#7a7a7a',
          dirt: '#916B47',
        }
      }
    }
  },
  plugins: [],
}
