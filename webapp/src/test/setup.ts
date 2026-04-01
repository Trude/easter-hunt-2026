import '@testing-library/jest-dom'

// Tøm localStorage mellom hver test
beforeEach(() => {
  localStorage.clear()
})

// Framer-motion bruker requestAnimationFrame — stub det i jsdom
global.requestAnimationFrame = (cb) => { cb(0); return 0 }
