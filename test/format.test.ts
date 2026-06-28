import { describe, it, expect } from 'vitest'
import { formatTerminal, formatJson } from '../src/format.js'
import type { DiffResult } from '../src/compare.js'

describe('formatTerminal', () => {
  it('shows pass message when no differences', () => {
    const out = formatTerminal({ missing: [], extra: [], empty: [] })
    expect(out).toContain('Pass')
    expect(out).toContain('All keys match')
  })

  it('lists missing keys', () => {
    const out = formatTerminal({ missing: ['DB_URL'], extra: [], empty: [] })
    expect(out).toContain('MISSING')
    expect(out).toContain('DB_URL')
    expect(out).toContain('Fail')
  })

  it('lists extra keys', () => {
    const out = formatTerminal({ missing: [], extra: ['DEBUG'], empty: [] })
    expect(out).toContain('EXTRA')
    expect(out).toContain('DEBUG')
    expect(out).toContain('Fail')
  })

  it('lists empty values', () => {
    const out = formatTerminal({ missing: [], extra: [], empty: ['LOG_LEVEL'] })
    expect(out).toContain('EMPTY')
    expect(out).toContain('LOG_LEVEL')
    expect(out).toContain('Fail')
  })

  it('shows summary with counts', () => {
    const out = formatTerminal({ missing: ['A', 'B'], extra: ['C'], empty: ['D'] })
    expect(out).toContain('2 missing')
    expect(out).toContain('1 extra')
    expect(out).toContain('1 empty')
  })

  it('only shows categories that have items', () => {
    const out = formatTerminal({ missing: [], extra: ['X'], empty: [] })
    expect(out).not.toContain('MISSING')
    expect(out).toContain('EXTRA')
    expect(out).not.toContain('EMPTY')
  })
})

describe('formatJson', () => {
  it('returns parsable JSON with fail result', () => {
    const json = JSON.parse(formatJson({ missing: ['A'], extra: [], empty: [] }))
    expect(json).toEqual({ missing: ['A'], extra: [], empty: [], pass: false })
  })

  it('marks pass=true when no differences', () => {
    const json = JSON.parse(formatJson({ missing: [], extra: [], empty: [] }))
    expect(json).toEqual({ missing: [], extra: [], empty: [], pass: true })
  })
})
