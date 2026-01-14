import { describe, expect, it, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

const processDirectory = vi.fn()
const resolveNodeDetail = vi.fn().mockResolvedValue({ success: true, data: { nodes: [], edges: [] }, warnings: [] })

vi.mock('../services/fileSystem', () => ({
  openDirectory: vi.fn().mockResolvedValue({ mock: true }),
}))

vi.mock('comlink', () => ({
  wrap: () => ({ processDirectory, resolveNodeDetail }),
  expose: vi.fn(),
}))

vi.mock('../workers/analysis.worker?worker', () => {
  return { default: class MockWorker {} }
})

vi.mock('../components/GraphCanvas', () => ({
  GraphCanvas: () => <div data-testid="graph-canvas" />,
}))

// Import App after mocks so mocks apply to its dependencies
import App from '../App'

describe('App', () => {
  beforeEach(() => {
    processDirectory.mockReset()
  })

  it('shows ready status after successful worker result', async () => {
    processDirectory.mockResolvedValue({
      success: true,
      warnings: ['w1'],
      data: { nodes: [], edges: [] },
    })

    render(<App />)

    await userEvent.click(screen.getByRole('button', { name: /open project/i }))

    await waitFor(() => expect(screen.getByText(/status: ready/i)).toBeInTheDocument())
    expect(screen.getByText(/w1/)).toBeInTheDocument()
  })

  it('shows error when worker fails', async () => {
    processDirectory.mockResolvedValue({
      success: false,
      error: 'fail',
      warnings: [],
    })

    render(<App />)
    await userEvent.click(screen.getByRole('button', { name: /open project/i }))

    await waitFor(() => expect(screen.getByText(/error: fail/i)).toBeInTheDocument())
  })
})
