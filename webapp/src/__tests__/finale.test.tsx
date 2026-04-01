import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi, describe, it, expect } from 'vitest'
import { renderPage, setDeptsComplete, setAllSveinGroupsComplete } from '../test/utils'
import Finale from '../pages/Finale'

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, initial, animate, exit, transition, ...rest }: any) => <div {...rest}>{children}</div>,
    button: ({ children, initial, animate, exit, transition, ...rest }: any) => <button {...rest}>{children}</button>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}))

vi.mock('react-router-dom', async () => ({
  ...(await vi.importActual<object>('react-router-dom')),
  useNavigate: () => vi.fn(),
}))

function setAllPlayersReady() {
  setDeptsComplete('sander', Array.from({ length: 12 }, (_, i) => i + 1))
  setDeptsComplete('selda', Array.from({ length: 12 }, (_, i) => i + 1))
  setAllSveinGroupsComplete()
}

describe('Finale — avsløringen', () => {
  it('viser en venteskjerm mens ikke alle agenter er klare', () => {
    renderPage(<Finale />)
    expect(screen.getByText(/venter på alle agenter/i)).toBeInTheDocument()
  })

  it('viser status for alle tre agenter på venteskjermen', () => {
    renderPage(<Finale />)
    expect(screen.getByText(/KODEKNEKKEREN \(Sander\)/)).toBeInTheDocument()
    expect(screen.getByText(/SPORHUNDEN \(Selda\)/)).toBeInTheDocument()
    expect(screen.getByText(/AGENT ØRANSEN \(Svein\)/)).toBeInTheDocument()
  })

  it('viser at Sander er klar med checkmark etter at han er ferdig', () => {
    setDeptsComplete('sander', Array.from({ length: 12 }, (_, i) => i + 1))
    renderPage(<Finale />)
    const sanderRad = screen.getByText(/KODEKNEKKEREN \(Sander\)/).closest('div')
    expect(sanderRad?.textContent).toContain('KLAR')
  })

  it('viser at Svein er klar etter at alle 6 grupper er fullført', () => {
    setAllSveinGroupsComplete()
    renderPage(<Finale />)
    const sveinRad = screen.getByText(/AGENT ØRANSEN \(Svein\)/).closest('div')
    expect(sveinRad?.textContent).toContain('KLAR')
  })

  it('viser Påskehare-meldingen til barna når alle agenter er klare', () => {
    setAllPlayersReady()
    renderPage(<Finale />)
    expect(screen.getByText(/SANDER OG SELDA/i)).toBeInTheDocument()
    expect(screen.getByText(/beste detektivene/i)).toBeInTheDocument()
  })

  it('skjuler gjemmestedet til barna trykker på knappen', () => {
    setAllPlayersReady()
    renderPage(<Finale />)
    expect(screen.queryByText(/VED PEISEN/)).not.toBeInTheDocument()
    expect(screen.queryByText('4208')).not.toBeInTheDocument()
  })

  it('avslører gjemmestedet VED PEISEN når de trykker på knappen', async () => {
    setAllPlayersReady()
    renderPage(<Finale />)
    const user = userEvent.setup()

    await user.click(screen.getByRole('button', { name: /vis gjemmestedet/i }))

    await waitFor(() => {
      expect(screen.getByText(/VED PEISEN/)).toBeInTheDocument()
    })
  })

  it('avslører kombinasjonslåsen 4208 til skattekisten', async () => {
    setAllPlayersReady()
    renderPage(<Finale />)
    const user = userEvent.setup()

    await user.click(screen.getByRole('button', { name: /vis gjemmestedet/i }))

    await waitFor(() => {
      expect(screen.getByText('4208')).toBeInTheDocument()
    })
  })

  it('skjuler finale-innholdet på venteskjermen', () => {
    renderPage(<Finale />)
    expect(screen.queryByText(/vis gjemmestedet/i)).not.toBeInTheDocument()
    expect(screen.queryByText('4208')).not.toBeInTheDocument()
  })
})
