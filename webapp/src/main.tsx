import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'

// ⚠️ TESTMODE — FJERN FØR DEPLOY ⚠️
if (new URLSearchParams(window.location.search).has('testmode')) {
  for (let i = 1; i <= 13; i++) {
    localStorage.setItem(`sander_dept_${i}_complete`, 'true')
    localStorage.setItem(`selda_dept_${i}_complete`, 'true')
  }
  for (let i = 1; i <= 6; i++) {
    localStorage.setItem(`svein_dept_${i}_complete`, 'true')
    localStorage.setItem(`sander_egg_${i}`, 'true')
    localStorage.setItem(`selda_egg_${i}`, 'true')
  }
  localStorage.setItem('kombiner_done', 'true')
  localStorage.setItem('minecraft_done', 'true')
}
// ⚠️ SLUTT TESTMODE ⚠️

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
