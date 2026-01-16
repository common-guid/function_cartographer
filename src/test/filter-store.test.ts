import { describe, expect, it, beforeEach } from 'vitest'
import { useGraphStore } from '../store/useGraphStore'

describe('useGraphStore filters', () => {
  beforeEach(() => {
    useGraphStore.getState().reset()
  })
  describe('default filter state', () => {
    it('initializes with empty search query', () => {
      const store = useGraphStore.getState()
      expect(store.filters.searchQuery).toBe('')
    })

    it('hides vendor by default', () => {
      const store = useGraphStore.getState()
      expect(store.filters.showVendor).toBe(false)
    })

    it('hides boilerplate by default', () => {
      const store = useGraphStore.getState()
      expect(store.filters.showBoilerplate).toBe(false)
    })

    it('hides framework by default', () => {
      const store = useGraphStore.getState()
      expect(store.filters.showFramework).toBe(false)
    })

    it('sets minConfidence to low by default', () => {
      const store = useGraphStore.getState()
      expect(store.filters.minConfidence).toBe('low')
    })

    it('disables includeNeighbors by default', () => {
      const store = useGraphStore.getState()
      expect(store.filters.includeNeighbors).toBe(false)
    })
  })

  describe('setFilter action', () => {
    it('updates searchQuery filter', () => {
      const store = useGraphStore.getState()
      store.setFilter('searchQuery', 'handleClick')
      const updated = useGraphStore.getState()
      expect(updated.filters.searchQuery).toBe('handleClick')
    })

    it('updates showVendor filter', () => {
      const store = useGraphStore.getState()
      store.setFilter('showVendor', true)
      const updated = useGraphStore.getState()
      expect(updated.filters.showVendor).toBe(true)
    })

    it('updates showBoilerplate filter', () => {
      const store = useGraphStore.getState()
      store.setFilter('showBoilerplate', true)
      const updated = useGraphStore.getState()
      expect(updated.filters.showBoilerplate).toBe(true)
    })

    it('updates showFramework filter', () => {
      const store = useGraphStore.getState()
      store.setFilter('showFramework', true)
      const updated = useGraphStore.getState()
      expect(updated.filters.showFramework).toBe(true)
    })

    it('updates minConfidence filter', () => {
      const store = useGraphStore.getState()
      store.setFilter('minConfidence', 'high')
      const updated = useGraphStore.getState()
      expect(updated.filters.minConfidence).toBe('high')
    })

    it('updates includeNeighbors filter', () => {
      const store = useGraphStore.getState()
      store.setFilter('includeNeighbors', true)
      const updated = useGraphStore.getState()
      expect(updated.filters.includeNeighbors).toBe(true)
    })

    it('allows multiple independent filter updates', () => {
      const store = useGraphStore.getState()
      store.setFilter('searchQuery', 'foo')
      store.setFilter('showVendor', true)
      store.setFilter('minConfidence', 'medium')
      const updated = useGraphStore.getState()
      expect(updated.filters.searchQuery).toBe('foo')
      expect(updated.filters.showVendor).toBe(true)
      expect(updated.filters.minConfidence).toBe('medium')
    })

    it('does not mutate other filter properties', () => {
      const store = useGraphStore.getState()
      const oldFramework = store.filters.showFramework
      store.setFilter('showVendor', true)
      const updated = useGraphStore.getState()
      expect(updated.filters.showFramework).toBe(oldFramework)
    })
  })

  describe('reset action', () => {
    it('restores all filters to defaults', () => {
      const store = useGraphStore.getState()
      store.setFilter('searchQuery', 'test')
      store.setFilter('showVendor', true)
      store.setFilter('showBoilerplate', true)
      store.setFilter('showFramework', true)
      store.setFilter('minConfidence', 'high')
      store.setFilter('includeNeighbors', true)

      store.reset()

      const state = useGraphStore.getState()
      expect(state.filters.searchQuery).toBe('')
      expect(state.filters.showVendor).toBe(false)
      expect(state.filters.showBoilerplate).toBe(false)
      expect(state.filters.showFramework).toBe(false)
      expect(state.filters.minConfidence).toBe('low')
      expect(state.filters.includeNeighbors).toBe(false)
    })

    it('resets filters alongside other state', () => {
      const store = useGraphStore.getState()
      store.setStatus('ready')
      store.setFilter('showVendor', true)
      store.setSelectedNode('n1')

      store.reset()

      const state = useGraphStore.getState()
      expect(state.status).toBe('idle')
      expect(state.filters.showVendor).toBe(false)
      expect(state.selectedNode).toBeNull()
    })
  })

  describe('filter state persistence during operations', () => {
    it('preserves filters when payload changes', () => {
      const store = useGraphStore.getState()
      store.setFilter('searchQuery', 'test')
      store.setFilter('showVendor', true)

      store.setPayload({ nodes: [], edges: [] })

      const updated = useGraphStore.getState()
      expect(updated.filters.searchQuery).toBe('test')
      expect(updated.filters.showVendor).toBe(true)
    })

    it('preserves filters when status changes', () => {
      const store = useGraphStore.getState()
      store.setFilter('minConfidence', 'high')

      store.setStatus('loading')
      store.setStatus('ready')

      const updated = useGraphStore.getState()
      expect(updated.filters.minConfidence).toBe('high')
    })

    it('preserves filters when selection changes', () => {
      const store = useGraphStore.getState()
      store.setFilter('searchQuery', 'foo')

      store.setSelectedNode('node1')

      const updated = useGraphStore.getState()
      expect(updated.filters.searchQuery).toBe('foo')
    })
  })

  describe('filter value constraints', () => {
    it('accepts all valid confidence levels', () => {
      const levels: Array<'low' | 'medium' | 'high'> = ['low', 'medium', 'high']
      levels.forEach((level) => {
        const store = useGraphStore.getState()
        store.setFilter('minConfidence', level)
        const updated = useGraphStore.getState()
        expect(updated.filters.minConfidence).toBe(level)
      })
    })

    it('accepts boolean values for toggles', () => {
      let store = useGraphStore.getState()
      store.setFilter('showVendor', true)
      let updated = useGraphStore.getState()
      expect(updated.filters.showVendor).toBe(true)
      store = useGraphStore.getState()
      store.setFilter('showVendor', false)
      updated = useGraphStore.getState()
      expect(updated.filters.showVendor).toBe(false)
    })

    it('handles string search queries of any length', () => {
      const store = useGraphStore.getState()
      const longQuery = 'a'.repeat(1000)
      store.setFilter('searchQuery', longQuery)
      const updated = useGraphStore.getState()
      expect(updated.filters.searchQuery).toBe(longQuery)
    })
  })
})
