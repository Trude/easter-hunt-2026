import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import { renderPage } from '../test/utils'
import Combine from '../pages/Combine'

const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => ({
  ...(await vi.importActual<object>('react-router-dom')),
  useNavigate: () => mockNavigate,
}))

beforeEach(() => {
  mockNavigate.mockClear()
})

describe('Kombiner-siden — alle agenter samler kodene', () => {
  it('forklarer at alle tre agenter må legge inn sin kode', () => {
    renderPage(<Combine />)
    expect(screen.getByText(/alle tre agenter/i)).toBeInTheDocument()
  })

  it('viser felt for Sanders kode, Seldas kode, Sveins kode og kodeordet', () => {
    renderPage(<Combine />)
    expect(screen.getByText(/sanders kode/i)).toBeInTheDocument()
    expect(screen.getByText(/seldas kode/i)).toBeInTheDocument()
    expect(screen.getByText(/sveins kode/i)).toBeInTheDocument()
    expect(screen.getByText(/hemmelig kodeord/i)).toBeInTheDocument()
  })

  it('låse opp-knappen er deaktivert før noe er fylt inn', () => {
    renderPage(<Combine />)
    expect(screen.getByRole('button', { name: /lås opp/i })).toBeDisabled()
  })

  it('viser feilmelding når feil koder tastes inn', async () => {
    renderPage(<Combine />)
    const user = userEvent.setup()

    const [sanderFelt, seldaFelt, sveinFelt, kodeordFelt] = screen.getAllByRole('textbox')

    await user.type(sanderFelt, '99')
    await user.type(seldaFelt, '99')
    await user.type(sveinFelt, 'FEIL')
    await user.type(kodeordFelt, 'FEILKODE')
    await user.click(screen.getByRole('button', { name: /lås opp/i }))

    expect(screen.getByText(/en eller flere koder er feil/i)).toBeInTheDocument()
  })

  it('åpner Minecraft-siden når alle tre taster inn riktige koder', async () => {
    renderPage(<Combine />)
    const user = userEvent.setup()

    const [sanderFelt, seldaFelt, sveinFelt, kodeordFelt] = screen.getAllByRole('textbox')

    await user.type(sanderFelt, '42')
    await user.type(seldaFelt, '08')
    await user.type(sveinFelt, 'ONKELS')
    await user.type(kodeordFelt, 'PÅSKEJAKT')
    await user.click(screen.getByRole('button', { name: /lås opp/i }))

    expect(mockNavigate).toHaveBeenCalledWith('/minecraft')
  })

  it('forteller at kombiner allerede er fullført hvis de er tilbake', () => {
    localStorage.setItem('kombiner_done', 'true')
    renderPage(<Combine />)
    expect(screen.getByText(/kombiner allerede fullført/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /gå til minecraft/i })).toBeInTheDocument()
  })

  it('tar dem til Minecraft-siden fra "allerede fullført"-skjermen', async () => {
    localStorage.setItem('kombiner_done', 'true')
    renderPage(<Combine />)
    const user = userEvent.setup()
    await user.click(screen.getByRole('button', { name: /gå til minecraft/i }))
    expect(mockNavigate).toHaveBeenCalledWith('/minecraft')
  })

  it('kodeord-feltet godtar små bokstaver', async () => {
    renderPage(<Combine />)
    const user = userEvent.setup()

    const [sanderFelt, seldaFelt, sveinFelt, kodeordFelt] = screen.getAllByRole('textbox')

    await user.type(sanderFelt, '42')
    await user.type(seldaFelt, '08')
    await user.type(sveinFelt, 'onkels')
    await user.type(kodeordFelt, 'påskejakt')
    await user.click(screen.getByRole('button', { name: /lås opp/i }))

    expect(mockNavigate).toHaveBeenCalledWith('/minecraft')
  })
})
