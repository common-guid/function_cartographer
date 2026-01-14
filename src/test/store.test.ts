import { describe, expect, it } from 'vitest'
import { useGraphStore } from '../store/useGraphStore'

describe('useGraphStore', () => {
  it('has sane defaults', () => {
    const state = useGraphStore.getState()
    expect(state.status).toBe('idle')
    expect(state.graph).toBeNull()
    expect(state.payload).toBeNull()
    expect(state.warnings).toEqual([])
    expect(state.error).toBeNull()
  })

  it('updates status and error', () => {
    const { setStatus, setError } = useGraphStore.getState()
    setStatus('loading')
    setError('boom')
    const state = useGraphStore.getState()
    expect(state.status).toBe('loading')
    expect(state.error).toBe('boom')
  })

  it('resets to defaults', () => {
    const store = useGraphStore.getState()
    store.setStatus('ready')
    store.setWarnings(['warn'])
    store.setSelectedNode('n1')
    store.reset()
    const state = useGraphStore.getState()
    expect(state.status).toBe('idle')
    expect(state.warnings).toEqual([])
    expect(state.selectedNode).toBeNull()
  })
})
