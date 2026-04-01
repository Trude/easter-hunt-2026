import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import { renderPage, setDeptsComplete, setEggsFound } from '../test/utils'
import SanderHub from '../pages/SanderHub'
import SeldaHub from '../pages/SeldaHub'

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, initial, animate, exit, transition, ...rest }: any) => <div {...rest}>{children}</div>,
    button: ({ children, initial, animate, exit, transition, ...rest }: any) => <button {...rest}>{children}</button>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}))

const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => ({
  ...(await vi.importActual<object>('react-router-dom')),
  useNavigate: () => mockNavigate,
}))

beforeEach(() => {
  mockNavigate.mockClear()
})

describe('Sanderss detektivkontor', () => {
  it('hilser Sander med hans agentnavn', () => {
    renderPage(<SanderHub />)
    expect(screen.getByText(/KODEKNEKKEREN/)).toBeInTheDocument()
  })

  it('viser at ingen avdelinger er fullført ved start', () => {
    renderPage(<SanderHub />)
    expect(screen.getByText(/0\/12 fullført/)).toBeInTheDocument()
  })

  it('viser 12 avdelingskort', () => {
    renderPage(<SanderHub />)
    // Alle avdelingstitlene skal vises
    expect(screen.getByText('Påske & Krim')).toBeInTheDocument()
    expect(screen.getByText('Memory')).toBeInTheDocument()
    expect(screen.getByText('Puslespill')).toBeInTheDocument()
  })

  it('oppdaterer fremgangen etter fullførte avdelinger', () => {
    setDeptsComplete('sander', [1, 2, 3])
    renderPage(<SanderHub />)
    expect(screen.getByText(/3\/12 fullført/)).toBeInTheDocument()
  })

  it('viser ikke egg-teller før noen egg er funnet', () => {
    renderPage(<SanderHub />)
    expect(screen.queryByText(/påskeegg funnet/i)).not.toBeInTheDocument()
  })

  it('viser egg-teller etter at Sander har funnet påskeegg', () => {
    setEggsFound('sander', [1, 2])
    renderPage(<SanderHub />)
    expect(screen.getByText(/2\/6 påskeegg funnet/i)).toBeInTheDocument()
  })

  it('låser opp hemmelig avdeling etter alle 6 egg er funnet', () => {
    setEggsFound('sander', [1, 2, 3, 4, 5, 6])
    renderPage(<SanderHub />)
    expect(screen.getByText(/HEMMELIG/)).toBeInTheDocument()
  })

  it('navigerer til avdeling 1 når Sander klikker på første kort', async () => {
    renderPage(<SanderHub />)
    const user = userEvent.setup()
    await user.click(screen.getByText('Påske & Krim'))
    expect(mockNavigate).toHaveBeenCalledWith('/sander/1')
  })

  it('viser koden 42 og knapp til kombiner når alle avdelinger er fullført', () => {
    setDeptsComplete('sander', Array.from({ length: 12 }, (_, i) => i + 1))
    setEggsFound('sander', [1, 2, 3, 4, 5, 6])
    setDeptsComplete('sander', [13])
    renderPage(<SanderHub />)
    expect(screen.getByText('42')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /gå til kombiner/i })).toBeInTheDocument()
  })

  it('navigerer til kombiner-siden fra fullførtskjermen', async () => {
    setDeptsComplete('sander', Array.from({ length: 12 }, (_, i) => i + 1))
    setEggsFound('sander', [1, 2, 3, 4, 5, 6])
    setDeptsComplete('sander', [13])
    renderPage(<SanderHub />)
    const user = userEvent.setup()
    await user.click(screen.getByRole('button', { name: /gå til kombiner/i }))
    expect(mockNavigate).toHaveBeenCalledWith('/kombiner')
  })
})

describe('Seldas detektivkontor', () => {
  it('hilser Selda med hennes agentnavn', () => {
    renderPage(<SeldaHub />)
    expect(screen.getByText(/SPORHUNDEN/)).toBeInTheDocument()
  })

  it('viser at ingen avdelinger er fullført ved start', () => {
    renderPage(<SeldaHub />)
    expect(screen.getByText(/0\/12 fullført/)).toBeInTheDocument()
  })

  it('viser avdelingen Musikk (Selda har musikk, Sander har sport)', () => {
    renderPage(<SeldaHub />)
    expect(screen.getByText('Musikk')).toBeInTheDocument()
  })

  it('viser egg-teller etter at Selda har funnet påskeegg', () => {
    setEggsFound('selda', [1, 2, 3])
    renderPage(<SeldaHub />)
    expect(screen.getByText(/3\/6 påskeegg funnet/i)).toBeInTheDocument()
  })

  it('låser opp hemmelig avdeling etter alle 6 egg er funnet', () => {
    setEggsFound('selda', [1, 2, 3, 4, 5, 6])
    renderPage(<SeldaHub />)
    expect(screen.getByText(/HEMMELIG/)).toBeInTheDocument()
  })

  it('viser koden 08 og knapp til kombiner når alle avdelinger er fullført', () => {
    setDeptsComplete('selda', Array.from({ length: 12 }, (_, i) => i + 1))
    setEggsFound('selda', [1, 2, 3, 4, 5, 6])
    setDeptsComplete('selda', [13])
    renderPage(<SeldaHub />)
    expect(screen.getByText('08')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /gå til kombiner/i })).toBeInTheDocument()
  })
})
