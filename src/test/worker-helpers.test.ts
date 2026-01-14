import { describe, expect, it } from 'vitest'
import { moduleIdFromPath, stringifyCallee } from '../workers/analysis.worker'

describe('moduleIdFromPath', () => {
  it('strips .js extension', () => {
    expect(moduleIdFromPath('main.js')).toBe('main')
  })

  it('handles nested paths', () => {
    expect(moduleIdFromPath('chunks/app.123.js')).toBe('chunks/app.123')
  })
})

describe('stringifyCallee', () => {
  it('returns identifier name', () => {
    expect(stringifyCallee({ type: 'Identifier', name: 'foo' })).toBe('foo')
  })

  it('handles member expressions', () => {
    const node = {
      type: 'MemberExpression',
      object: { type: 'Identifier', name: 'obj' },
      property: { type: 'Identifier', name: 'bar' },
      computed: false,
    }
    expect(stringifyCallee(node)).toBe('obj.bar')
  })

  it('returns null for unsupported nodes', () => {
    expect(stringifyCallee({ type: 'ThisExpression' })).toBeNull()
  })
})
