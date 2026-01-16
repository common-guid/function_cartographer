import { describe, expect, it } from 'vitest'
import type { NodePayload, EdgePayload, FilterState } from '../types/graph'

// Replicate the filter logic from GraphCanvas for testing
const confidenceRank: Record<'low' | 'medium' | 'high', number> = {
  low: 0,
  medium: 1,
  high: 2,
}

const passesTagFilters = (node: NodePayload, filters: FilterState) => {
  if (!filters.showVendor && node.tags.includes('vendor')) return false
  if (!filters.showBoilerplate && node.tags.includes('boilerplate')) return false
  if (!filters.showFramework && node.tags.includes('framework')) return false
  return true
}

const passesConfidence = (node: NodePayload, filters: FilterState) =>
  confidenceRank[node.confidence] >= confidenceRank[filters.minConfidence]

const matchesSearch = (node: NodePayload, query: string) => {
  if (!query) return true
  const haystack = [
    node.label,
    node.inferredName,
    node.minifiedName,
    node.moduleId,
    node.file,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()
  return haystack.includes(query)
}

describe('filter rendering logic', () => {
  describe('passesTagFilters', () => {
    const defaultFilters: FilterState = {
      searchQuery: '',
      showVendor: false,
      showBoilerplate: false,
      showFramework: false,
      minConfidence: 'low',
      includeNeighbors: false,
    }

    it('filters out vendor nodes when showVendor is false', () => {
      const node: NodePayload = {
        id: 'n1',
        label: 'react',
        confidence: 'high',
        tags: ['vendor'],
      }
      expect(passesTagFilters(node, defaultFilters)).toBe(false)
    })

    it('includes vendor nodes when showVendor is true', () => {
      const node: NodePayload = {
        id: 'n1',
        label: 'react',
        confidence: 'high',
        tags: ['vendor'],
      }
      const filters: FilterState = { ...defaultFilters, showVendor: true }
      expect(passesTagFilters(node, filters)).toBe(true)
    })

    it('filters out boilerplate nodes when showBoilerplate is false', () => {
      const node: NodePayload = {
        id: 'n1',
        label: 'webpack',
        confidence: 'medium',
        tags: ['boilerplate'],
      }
      expect(passesTagFilters(node, defaultFilters)).toBe(false)
    })

    it('includes boilerplate nodes when showBoilerplate is true', () => {
      const node: NodePayload = {
        id: 'n1',
        label: 'webpack',
        confidence: 'medium',
        tags: ['boilerplate'],
      }
      const filters: FilterState = { ...defaultFilters, showBoilerplate: true }
      expect(passesTagFilters(node, filters)).toBe(true)
    })

    it('filters out framework nodes when showFramework is false', () => {
      const node: NodePayload = {
        id: 'n1',
        label: 'React',
        confidence: 'high',
        tags: ['framework'],
      }
      expect(passesTagFilters(node, defaultFilters)).toBe(false)
    })

    it('includes framework nodes when showFramework is true', () => {
      const node: NodePayload = {
        id: 'n1',
        label: 'React',
        confidence: 'high',
        tags: ['framework'],
      }
      const filters: FilterState = { ...defaultFilters, showFramework: true }
      expect(passesTagFilters(node, filters)).toBe(true)
    })

    it('includes source nodes regardless of filter settings', () => {
      const node: NodePayload = {
        id: 'n1',
        label: 'handleClick',
        confidence: 'high',
        tags: ['source'],
      }
      expect(passesTagFilters(node, defaultFilters)).toBe(true)
    })

    it('filters nodes with multiple tags (any matching tag fails)', () => {
      const node: NodePayload = {
        id: 'n1',
        label: 'mixed',
        confidence: 'high',
        tags: ['source', 'vendor'],
      }
      expect(passesTagFilters(node, defaultFilters)).toBe(false)
    })

    it('includes nodes with multiple tags when all are enabled', () => {
      const node: NodePayload = {
        id: 'n1',
        label: 'mixed',
        confidence: 'high',
        tags: ['source', 'vendor', 'boilerplate'],
      }
      const filters: FilterState = {
        ...defaultFilters,
        showVendor: true,
        showBoilerplate: true,
      }
      expect(passesTagFilters(node, filters)).toBe(true)
    })
  })

  describe('passesConfidence', () => {
    const defaultFilters: FilterState = {
      searchQuery: '',
      showVendor: false,
      showBoilerplate: false,
      showFramework: false,
      minConfidence: 'low',
      includeNeighbors: false,
    }

    it('includes high confidence nodes when minConfidence is low', () => {
      const node: NodePayload = {
        id: 'n1',
        label: 'func',
        confidence: 'high',
        tags: ['source'],
      }
      expect(passesConfidence(node, defaultFilters)).toBe(true)
    })

    it('includes medium confidence nodes when minConfidence is low', () => {
      const node: NodePayload = {
        id: 'n1',
        label: 'func',
        confidence: 'medium',
        tags: ['source'],
      }
      expect(passesConfidence(node, defaultFilters)).toBe(true)
    })

    it('includes low confidence nodes when minConfidence is low', () => {
      const node: NodePayload = {
        id: 'n1',
        label: 'func',
        confidence: 'low',
        tags: ['source'],
      }
      expect(passesConfidence(node, defaultFilters)).toBe(true)
    })

    it('filters low confidence nodes when minConfidence is medium', () => {
      const node: NodePayload = {
        id: 'n1',
        label: 'func',
        confidence: 'low',
        tags: ['source'],
      }
      const filters: FilterState = { ...defaultFilters, minConfidence: 'medium' }
      expect(passesConfidence(node, filters)).toBe(false)
    })

    it('includes medium confidence nodes when minConfidence is medium', () => {
      const node: NodePayload = {
        id: 'n1',
        label: 'func',
        confidence: 'medium',
        tags: ['source'],
      }
      const filters: FilterState = { ...defaultFilters, minConfidence: 'medium' }
      expect(passesConfidence(node, filters)).toBe(true)
    })

    it('filters low and medium confidence nodes when minConfidence is high', () => {
      const lowNode: NodePayload = {
        id: 'n1',
        label: 'func1',
        confidence: 'low',
        tags: ['source'],
      }
      const mediumNode: NodePayload = {
        id: 'n2',
        label: 'func2',
        confidence: 'medium',
        tags: ['source'],
      }
      const filters: FilterState = { ...defaultFilters, minConfidence: 'high' }
      expect(passesConfidence(lowNode, filters)).toBe(false)
      expect(passesConfidence(mediumNode, filters)).toBe(false)
    })

    it('includes high confidence nodes when minConfidence is high', () => {
      const node: NodePayload = {
        id: 'n1',
        label: 'func',
        confidence: 'high',
        tags: ['source'],
      }
      const filters: FilterState = { ...defaultFilters, minConfidence: 'high' }
      expect(passesConfidence(node, filters)).toBe(true)
    })
  })

  describe('matchesSearch', () => {
    const defaultFilters: FilterState = {
      searchQuery: '',
      showVendor: false,
      showBoilerplate: false,
      showFramework: false,
      minConfidence: 'low',
      includeNeighbors: false,
    }

    it('includes all nodes when search query is empty', () => {
      const node: NodePayload = {
        id: 'n1',
        label: 'handleClick',
        confidence: 'high',
        tags: ['source'],
      }
      expect(matchesSearch(node, '')).toBe(true)
    })

    it('matches inferred name', () => {
      const node: NodePayload = {
        id: 'n1',
        label: 'a',
        inferredName: 'handleClick',
        confidence: 'high',
        tags: ['source'],
      }
      expect(matchesSearch(node, 'handleclick')).toBe(true)
    })

    it('matches label', () => {
      const node: NodePayload = {
        id: 'n1',
        label: 'handleSubmit',
        confidence: 'high',
        tags: ['source'],
      }
      expect(matchesSearch(node, 'submit')).toBe(true)
    })

    it('matches minified name', () => {
      const node: NodePayload = {
        id: 'n1',
        label: 'a',
        minifiedName: 'handleClick',
        confidence: 'high',
        tags: ['source'],
      }
      expect(matchesSearch(node, 'handleclick')).toBe(true)
    })

    it('matches module ID', () => {
      const node: NodePayload = {
        id: 'n1',
        label: 'a',
        moduleId: 'src/components/Button',
        confidence: 'high',
        tags: ['source'],
      }
      expect(matchesSearch(node, 'button')).toBe(true)
    })

    it('matches file path', () => {
      const node: NodePayload = {
        id: 'n1',
        label: 'a',
        file: 'src/components/App.js',
        confidence: 'high',
        tags: ['source'],
      }
      expect(matchesSearch(node, 'app')).toBe(true)
    })

    it('is case insensitive', () => {
      const node: NodePayload = {
        id: 'n1',
        label: 'HandleClick',
        confidence: 'high',
        tags: ['source'],
      }
      expect(matchesSearch(node, 'handleclick')).toBe(true)
    })

    it('filters nodes that do not match', () => {
      const node: NodePayload = {
        id: 'n1',
        label: 'someRandomFunc',
        confidence: 'high',
        tags: ['source'],
      }
      expect(matchesSearch(node, 'handleClick')).toBe(false)
    })

    it('matches partial strings', () => {
      const node: NodePayload = {
        id: 'n1',
        label: 'handleClickEvent',
        confidence: 'high',
        tags: ['source'],
      }
      expect(matchesSearch(node, 'click')).toBe(true)
    })

    it('combines multiple fields for matching', () => {
      const node: NodePayload = {
        id: 'n1',
        label: 'a',
        inferredName: 'x',
        file: 'src/handlers.js',
        confidence: 'high',
        tags: ['source'],
      }
      expect(matchesSearch(node, 'handlers')).toBe(true)
    })
  })

  describe('combined filtering', () => {
    const defaultFilters: FilterState = {
      searchQuery: '',
      showVendor: false,
      showBoilerplate: false,
      showFramework: false,
      minConfidence: 'low',
      includeNeighbors: false,
    }

    it('applies all filters in conjunction (AND logic)', () => {
      const node: NodePayload = {
        id: 'n1',
        label: 'handleClick',
        inferredName: 'handleClick',
        confidence: 'high',
        tags: ['source', 'vendor'],
      }
      const filters: FilterState = {
        ...defaultFilters,
        searchQuery: 'handle',
        minConfidence: 'high',
      }
      // Passes search, confidence, but fails tag filter (vendor not shown)
      const passesSearch = matchesSearch(node, filters.searchQuery)
      const passesConf = passesConfidence(node, filters)
      const passesTags = passesTagFilters(node, filters)
      expect(passesSearch).toBe(true)
      expect(passesConf).toBe(true)
      expect(passesTags).toBe(false) // should be filtered out
    })

    it('includes node only if all filters pass', () => {
      const node: NodePayload = {
        id: 'n1',
        label: 'submit',
        confidence: 'medium',
        tags: ['source'],
      }
      const filters: FilterState = {
        ...defaultFilters,
        searchQuery: 'submit',
        minConfidence: 'medium',
      }
      expect(matchesSearch(node, filters.searchQuery)).toBe(true)
      expect(passesConfidence(node, filters)).toBe(true)
      expect(passesTagFilters(node, filters)).toBe(true)
    })
  })

  describe('edge filtering with visible nodes', () => {
    it('only includes edges between visible nodes', () => {
      const visibleIds = new Set(['n1', 'n2'])
      const edge: EdgePayload = { source: 'n1', target: 'n2' }
      const shouldInclude =
        visibleIds.has(edge.source) && visibleIds.has(edge.target)
      expect(shouldInclude).toBe(true)
    })

    it('filters edges with invisible source', () => {
      const visibleIds = new Set(['n2'])
      const edge: EdgePayload = { source: 'n1', target: 'n2' }
      const shouldInclude =
        visibleIds.has(edge.source) && visibleIds.has(edge.target)
      expect(shouldInclude).toBe(false)
    })

    it('filters edges with invisible target', () => {
      const visibleIds = new Set(['n1'])
      const edge: EdgePayload = { source: 'n1', target: 'n2' }
      const shouldInclude =
        visibleIds.has(edge.source) && visibleIds.has(edge.target)
      expect(shouldInclude).toBe(false)
    })
  })
})
