import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { GameProvider } from '../context/GameContext'
import type { ReactElement } from 'react'

/**
 * Render en side med Router og GameProvider.
 * Bruk `navigate`-mock i testen for å sjekke navigasjon.
 */
export function renderPage(ui: ReactElement) {
  return render(
    <MemoryRouter>
      <GameProvider>{ui}</GameProvider>
    </MemoryRouter>
  )
}

/**
 * Sett localStorage-nøkler som om en spiller har fullført avdelinger.
 */
export function setDeptsComplete(player: string, deptIds: number[]) {
  deptIds.forEach(id => {
    localStorage.setItem(`${player}_dept_${id}_complete`, 'true')
  })
}

export function setEggsFound(player: string, eggIds: number[]) {
  eggIds.forEach(id => {
    localStorage.setItem(`${player}_egg_${id}`, 'true')
  })
}

export function setAllSveinGroupsComplete() {
  for (let i = 1; i <= 6; i++) {
    localStorage.setItem(`svein_dept_${i}_complete`, 'true')
  }
}
