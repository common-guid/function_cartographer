import { describe, expect, it } from 'vitest'
import fs from 'fs'
import os from 'os'
import path from 'path'
import { shouldRebuildUi } from '../cli/uiBuild'

const makeTempRoot = () => fs.mkdtempSync(path.join(os.tmpdir(), 'js-lens-ui-'))

const touch = (filePath: string, time: Date) => {
  fs.utimesSync(filePath, time, time)
}

describe('shouldRebuildUi', () => {
  it('returns true when dist index is missing', () => {
    const root = makeTempRoot()
    fs.mkdirSync(path.join(root, 'src'), { recursive: true })
    fs.writeFileSync(path.join(root, 'src', 'App.tsx'), 'export {}')

    expect(shouldRebuildUi(root)).toBe(true)
  })

  it('returns false when dist is newer than src', () => {
    const root = makeTempRoot()
    const srcDir = path.join(root, 'src')
    const distDir = path.join(root, 'dist')
    fs.mkdirSync(srcDir, { recursive: true })
    fs.mkdirSync(distDir, { recursive: true })
    const srcFile = path.join(srcDir, 'App.tsx')
    const distIndex = path.join(distDir, 'index.html')
    fs.writeFileSync(srcFile, 'export {}')
    fs.writeFileSync(distIndex, '<html></html>')

    const older = new Date('2024-01-01T00:00:00Z')
    const newer = new Date('2024-01-02T00:00:00Z')
    touch(srcFile, older)
    touch(distIndex, newer)

    expect(shouldRebuildUi(root)).toBe(false)
  })

  it('returns true when src is newer than dist', () => {
    const root = makeTempRoot()
    const srcDir = path.join(root, 'src')
    const distDir = path.join(root, 'dist')
    fs.mkdirSync(srcDir, { recursive: true })
    fs.mkdirSync(distDir, { recursive: true })
    const srcFile = path.join(srcDir, 'App.tsx')
    const distIndex = path.join(distDir, 'index.html')
    fs.writeFileSync(srcFile, 'export {}')
    fs.writeFileSync(distIndex, '<html></html>')

    const older = new Date('2024-01-01T00:00:00Z')
    const newer = new Date('2024-01-02T00:00:00Z')
    touch(distIndex, older)
    touch(srcFile, newer)

    expect(shouldRebuildUi(root)).toBe(true)
  })
})
