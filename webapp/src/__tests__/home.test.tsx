import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import { renderPage } from '../test/utils'
import Home from '../pages/Home'

const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => ({
  ...(await vi.importActual<object>('react-router-dom')),
  useNavigate: () => mockNavigate,
}))

beforeEach(() => {
  mockNavigate.mockClear()
})

describe('Forsiden — kode-innlogging', () => {
  it('viser velkomsttekst til detektiven', () => {
    renderPage(<Home />)
    expect(screen.getByText(/tast inn koden din/i)).toBeInTheDocument()
  })

  it('viser feilmelding når brukeren taster inn en ugyldig kode', async () => {
    renderPage(<Home />)
    const user = userEvent.setup()

    await user.type(screen.getByPlaceholderText(/kode her/i), 'FEILKODE')
    await user.click(screen.getByRole('button', { name: /tast inn kode/i }))

    expect(screen.getByText(/ugyldig kode/i)).toBeInTheDocument()
  })

  it('tar Sander til sin side når han taster inn KODEKNEKKEREN', async () => {
    renderPage(<Home />)
    const user = userEvent.setup()

    await user.type(screen.getByPlaceholderText(/kode her/i), 'KODEKNEKKEREN')
    await user.click(screen.getByRole('button', { name: /tast inn kode/i }))

    expect(mockNavigate).toHaveBeenCalledWith('/sander')
  })

  it('tar Selda til sin side når hun taster inn SPORHUNDEN', async () => {
    renderPage(<Home />)
    const user = userEvent.setup()

    await user.type(screen.getByPlaceholderText(/kode her/i), 'SPORHUNDEN')
    await user.click(screen.getByRole('button', { name: /tast inn kode/i }))

    expect(mockNavigate).toHaveBeenCalledWith('/selda')
  })

  it('tar Svein til sin side når han taster inn SVEIN', async () => {
    renderPage(<Home />)
    const user = userEvent.setup()

    await user.type(screen.getByPlaceholderText(/kode her/i), 'SVEIN')
    await user.click(screen.getByRole('button', { name: /tast inn kode/i }))

    expect(mockNavigate).toHaveBeenCalledWith('/agent')
  })

  it('tar alle til finalen med koden VARDEN26', async () => {
    renderPage(<Home />)
    const user = userEvent.setup()

    await user.type(screen.getByPlaceholderText(/kode her/i), 'VARDEN26')
    await user.click(screen.getByRole('button', { name: /tast inn kode/i }))

    expect(mockNavigate).toHaveBeenCalledWith('/finale')
  })

  it('fungerer med små bokstaver — koder er ikke case-sensitive', async () => {
    renderPage(<Home />)
    const user = userEvent.setup()

    await user.type(screen.getByPlaceholderText(/kode her/i), 'kodeknekkeren')
    await user.click(screen.getByRole('button', { name: /tast inn kode/i }))

    expect(mockNavigate).toHaveBeenCalledWith('/sander')
  })

  it('tømmer alt lagret fremgang når RESET2026 tastes inn', async () => {
    localStorage.setItem('sander_dept_1_complete', 'true')
    localStorage.setItem('kombiner_done', 'true')

    renderPage(<Home />)
    const user = userEvent.setup()

    await user.type(screen.getByPlaceholderText(/kode her/i), 'RESET2026')
    await user.click(screen.getByRole('button', { name: /tast inn kode/i }))

    expect(localStorage.getItem('sander_dept_1_complete')).toBeNull()
    expect(localStorage.getItem('kombiner_done')).toBeNull()
    expect(mockNavigate).not.toHaveBeenCalled()
  })

  it('kan navigere med Enter-tasten i stedet for å klikke knappen', async () => {
    renderPage(<Home />)
    const user = userEvent.setup()

    await user.type(screen.getByPlaceholderText(/kode her/i), 'SPORHUNDEN{Enter}')

    expect(mockNavigate).toHaveBeenCalledWith('/selda')
  })
})
