import { screen, waitFor, act, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import { renderPage } from '../test/utils'
import Agent from '../pages/Agent'
import AgentGroup from '../pages/AgentGroup'

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
  useParams: () => ({ groupId: '1' }),
}))

beforeEach(() => {
  mockNavigate.mockClear()
})

describe('Agent Øransen — Sveins hemmelige oppdrag', () => {
  it('presenterer Svein som Agent Øransen', () => {
    renderPage(<Agent />)
    expect(screen.getByText(/AGENT ØRANSEN/)).toBeInTheDocument()
  })

  it('viser at ingen arkivmapper er dekryptert ved start', () => {
    renderPage(<Agent />)
    expect(screen.getByText(/0\/6 arkivmapper dekryptert/)).toBeInTheDocument()
  })

  it('viser alle 6 oppdragsmapper', () => {
    renderPage(<Agent />)
    expect(screen.getByText(/Fotballhjerne/)).toBeInTheDocument()
    expect(screen.getByText(/Byggmesteren/)).toBeInTheDocument()
    expect(screen.getByText(/Smaksdommeren/)).toBeInTheDocument()
    expect(screen.getByText(/Fjellmannen/)).toBeInTheDocument()
    expect(screen.getByText(/Mysteriet om Agent Øransen/)).toBeInTheDocument()
    expect(screen.getByText(/Siste mappe/)).toBeInTheDocument()
  })

  it('første mappe er tilgjengelig, resten er låst', () => {
    renderPage(<Agent />)
    const mapper = screen.getAllByRole('button', { name: /mappe/i })
    expect(mapper[0]).not.toBeDisabled()
    for (let i = 1; i < mapper.length; i++) {
      expect(mapper[i]).toBeDisabled()
    }
  })

  it('åpner gruppe 1 når Svein klikker på første mappe', async () => {
    renderPage(<Agent />)
    const user = userEvent.setup()
    await user.click(screen.getAllByRole('button', { name: /mappe/i })[0])
    expect(mockNavigate).toHaveBeenCalledWith('/agent/gruppe/1')
  })

  it('viser 1/6 og avslører bokstaven O etter at gruppe 1 er fullført', () => {
    localStorage.setItem('svein_dept_1_complete', 'true')
    renderPage(<Agent />)
    expect(screen.getByText(/1\/6 arkivmapper dekryptert/)).toBeInTheDocument()
    expect(screen.getAllByText('O').length).toBeGreaterThan(0)
  })

  it('viser koden ONKELS og bursdagsmelding når alle 6 mapper er dekryptert', () => {
    for (let i = 1; i <= 6; i++) {
      localStorage.setItem(`svein_dept_${i}_complete`, 'true')
    }
    renderPage(<Agent />)
    expect(screen.getAllByText('ONKELS').length).toBeGreaterThan(0)
    expect(screen.getByText(/Gratulerer med dagen/i)).toBeInTheDocument()
  })
})

describe('Arkivmappe — trivia-gruppe', () => {
  it('viser første spørsmål i gruppe 1', () => {
    renderPage(<AgentGroup />)
    expect(screen.getByText('ARKIVMAPPE #1')).toBeInTheDocument()
    expect(screen.getByText(/1\/5/)).toBeInTheDocument()
    expect(screen.getByText(/Trenger 4\/5 riktige/)).toBeInTheDocument()
  })

  it('viser alle svarmuligheter for det første Liverpool-spørsmålet', () => {
    renderPage(<AgentGroup />)
    expect(screen.getByRole('button', { name: '1977' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '1973' })).toBeInTheDocument()
  })

  it('viser riktig tilbakemelding etter at Svein svarer riktig', async () => {
    renderPage(<AgentGroup />)
    const user = userEvent.setup()
    await user.click(screen.getByRole('button', { name: '1977' }))
    expect(screen.getByText(/✓ Riktig!/i)).toBeInTheDocument()
  })

  it('viser feil tilbakemelding etter at Svein svarer feil', async () => {
    renderPage(<AgentGroup />)
    const user = userEvent.setup()
    await user.click(screen.getByRole('button', { name: '1973' }))
    expect(screen.getByText(/✗ Feil svar/i)).toBeInTheDocument()
  })

  it('viser "ALLEREDE DEKRYPTERT" og bokstaven O når gruppe 1 er fullført fra før', () => {
    localStorage.setItem('svein_dept_1_complete', 'true')
    renderPage(<AgentGroup />)
    expect(screen.getByText(/ALLEREDE DEKRYPTERT/i)).toBeInTheDocument()
    expect(screen.getByText(/bokstav avslørt/i)).toBeInTheDocument()
    expect(screen.getByText('O')).toBeInTheDocument()
  })

  it('informerer om at man må gå tilbake for å se alle mapper', () => {
    renderPage(<AgentGroup />)
    expect(screen.getByRole('button', { name: /tilbake/i })).toBeInTheDocument()
  })

  it('navigerer tilbake til agent-huben via tilbake-knappen', async () => {
    renderPage(<AgentGroup />)
    const user = userEvent.setup()
    await user.click(screen.getByRole('button', { name: /tilbake/i }))
    expect(mockNavigate).toHaveBeenCalledWith('/agent')
  })

  it('viser AVVIST-melding og "Prøv igjen"-knapp etter for mange feil svar', () => {
    vi.useFakeTimers()
    renderPage(<AgentGroup />)

    // Svar feil på alle 5 ved å klikke siste alternativ hvert spørsmål
    for (let i = 0; i < 5; i++) {
      const buttons = screen.getAllByRole('button').filter(b => {
        const text = b.textContent?.trim() ?? ''
        return text.length > 0 && text.length < 50 && !text.includes('TILBAKE') && !text.includes('←')
      })
      if (buttons.length > 0) {
        fireEvent.click(buttons[buttons.length - 1])
      }
      act(() => { vi.advanceTimersByTime(1600) })
    }

    expect(screen.getByText(/AVVIST/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /prøv igjen/i })).toBeInTheDocument()

    vi.useRealTimers()
  })
})
