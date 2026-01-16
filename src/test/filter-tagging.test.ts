import { describe, expect, it } from 'vitest'
import { detectTags } from '../workers/analysis.worker'

describe('detectTags', () => {
  describe('vendor detection', () => {
    it('tags node_modules paths as vendor', () => {
      const tags = detectTags('node_modules/react/index.js', '')
      expect(tags).toContain('vendor')
      expect(tags).not.toContain('source')
    })

    it('tags vendor directory as vendor', () => {
      const tags = detectTags('vendor/lib/utils.js', '')
      expect(tags).toContain('vendor')
    })

    it('tags chunk-vendors as vendor', () => {
      const tags = detectTags('chunk-vendors.abc.js', '')
      expect(tags).toContain('vendor')
    })

    it('tags polyfill as vendor', () => {
      const tags = detectTags('polyfill.js', '')
      expect(tags).toContain('vendor')
    })

    it('tags app source code as source', () => {
      const tags = detectTags('src/components/App.js', '')
      expect(tags).toContain('source')
      expect(tags).not.toContain('vendor')
    })
  })

  describe('boilerplate detection', () => {
    it('detects __webpack_require__ pattern', () => {
      const snippet = "__webpack_require__('src/index.js')"
      const tags = detectTags('main.js', snippet)
      expect(tags).toContain('boilerplate')
    })

    it('detects self.webpackChunk pattern', () => {
      const snippet = 'self.webpackChunk = []'
      const tags = detectTags('main.js', snippet)
      expect(tags).toContain('boilerplate')
    })

    it('detects (function(modules) pattern', () => {
      const snippet = '(function(modules) { /* webpack */'
      const tags = detectTags('bundle.js', snippet)
      expect(tags).toContain('boilerplate')
    })

    it('does not tag normal code as boilerplate', () => {
      const snippet = 'function handleClick() { return true; }'
      const tags = detectTags('main.js', snippet)
      expect(tags).not.toContain('boilerplate')
    })
  })

  describe('framework detection', () => {
    it('detects React.createElement', () => {
      const snippet = 'React.createElement("div", null)'
      const tags = detectTags('app.js', snippet)
      expect(tags).toContain('framework')
    })

    it('detects .jsx extension pattern', () => {
      const snippet = 'import Component from "./App.jsx"'
      const tags = detectTags('main.js', snippet)
      expect(tags).toContain('framework')
    })

    it('detects $$typeof pattern', () => {
      const snippet = 'obj.$$typeof = Symbol.for("react.element")'
      const tags = detectTags('bundle.js', snippet)
      expect(tags).toContain('framework')
    })

    it('does not tag non-framework code as framework', () => {
      const snippet = 'function add(a, b) { return a + b; }'
      const tags = detectTags('utils.js', snippet)
      expect(tags).not.toContain('framework')
    })
  })

  describe('tag combination', () => {
    it('combines vendor and boilerplate tags', () => {
      const snippet = "__webpack_require__('react')"
      const tags = detectTags('node_modules/react/index.js', snippet)
      expect(tags).toContain('vendor')
      expect(tags).toContain('boilerplate')
      expect(new Set(tags).size).toBe(2) // no duplicates
    })

    it('combines source and framework tags', () => {
      const snippet = 'React.createElement("div", null)'
      const tags = detectTags('src/App.js', snippet)
      expect(tags).toContain('source')
      expect(tags).toContain('framework')
    })

    it('deduplicates tags', () => {
      // If somehow the same tag is identified twice, deduplicate
      const snippet = 'React.createElement' // framework keyword
      const tags = detectTags('src/app.jsx', snippet) // .jsx also triggers framework
      const uniqueTags = new Set(tags)
      expect(uniqueTags.size).toBe(tags.length)
    })

    it('handles all tags present', () => {
      const snippet = "React.createElement('div'); __webpack_require__('react'); self.webpackChunk = []"
      const tags = detectTags('node_modules/bundle.jsx', snippet)
      expect(new Set(tags).size).toBe(tags.length) // all unique
      expect(tags.length).toBeGreaterThan(1)
    })
  })

  describe('case insensitivity', () => {
    it('handles uppercase paths', () => {
      const tags = detectTags('NODE_MODULES/REACT/INDEX.JS', '')
      expect(tags).toContain('vendor')
    })

    it('handles mixed case paths', () => {
      const tags = detectTags('Vendor/Lib/Utils.js', '')
      expect(tags).toContain('vendor')
    })
  })

  describe('edge cases', () => {
    it('returns source when no special patterns match', () => {
      const tags = detectTags('utils/helpers.js', 'const add = (a, b) => a + b')
      expect(tags).toEqual(['source'])
    })

    it('handles empty snippet', () => {
      const tags = detectTags('src/index.js', '')
      expect(tags).toContain('source')
    })

    it('handles empty path', () => {
      // Should be treated as source unless boilerplate/framework patterns exist
      const tags = detectTags('', '')
      expect(tags).toContain('source')
    })

    it('handles very long snippets (only uses reasonable prefix)', () => {
      const longSnippet = 'const x = ' + 'a'.repeat(10000)
      const tags = detectTags('src/index.js', longSnippet)
      expect(tags).toContain('source')
    })
  })
})
