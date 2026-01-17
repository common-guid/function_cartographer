import { describe, expect, it, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import App from '../App'
import { useGraphStore } from '../store/useGraphStore'

// Mock SigmaContainer to avoid canvas requirements but render children
// This allows GraphLoader to run and we can catch the infinite loop regression
vi.mock('@react-sigma/core', () => ({
  SigmaContainer: ({ children, style }: any) => <div data-testid="sigma-container" style={style}>{children}</div>,
  useLoadGraph: () => vi.fn(),
  useRegisterEvents: () => vi.fn(),
}))

// Mock fetch
global.fetch = vi.fn()

describe('App', () => {
  beforeEach(() => {
    useGraphStore.getState().reset()
    vi.clearAllMocks()
  })

  it('renders and loads graph without infinite loop', async () => {
     (global.fetch as any).mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({
        success: true,
        data: { nodes: [{id: 'n1', label: 'N1', confidence: 'high', tags: []}], edges: [] },
        warnings: ['w1'],
      }),
    })

    render(<App />)

    // Should start loading
    expect(screen.getByText(/Status: loading/i)).toBeInTheDocument()

    // Should eventually be ready
    await waitFor(() => expect(screen.getByText(/Status: ready/i)).toBeInTheDocument())

    // Check for content
    expect(screen.getByText(/w1/)).toBeInTheDocument()
    // Check if graph canvas (mocked sigma) is present
    expect(screen.getByTestId('sigma-container')).toBeInTheDocument()
  })

  it('shows error when API fails', async () => {
    (global.fetch as any).mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({
        success: false,
        error: 'fail',
        warnings: [],
      }),
    })

    render(<App />)

    await waitFor(() => expect(screen.getByText(/Error: fail/i)).toBeInTheDocument())
  })
})
