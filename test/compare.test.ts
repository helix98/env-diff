import { describe, it, expect } from 'vitest'
import { compare } from '../src/compare.js'

describe('compare', () => {
  it('returns empty arrays for identical maps', () => {
    const result = compare({ A: '1', B: '2' }, { A: '1', B: '2' })
    expect(result).toEqual({ missing: [], extra: [], empty: [] })
  })

  it('detects missing keys', () => {
    const result = compare({ A: '1', B: '2' }, { A: '1' })
    expect(result).toEqual({ missing: ['B'], extra: [], empty: [] })
  })

  it('detects extra keys', () => {
    const result = compare({ A: '1' }, { A: '1', B: '2' })
    expect(result).toEqual({ missing: [], extra: ['B'], empty: [] })
  })

  it('detects empty values', () => {
    const result = compare({ A: '1', B: '2' }, { A: '1', B: '' })
    expect(result).toEqual({ missing: [], extra: [], empty: ['B'] })
  })

  it('handles combined missing, extra, and empty', () => {
    const result = compare(
      { A: '1', B: '2', C: '3' },
      { A: '1', C: '', D: '4' }
    )
    expect(result).toEqual({ missing: ['B'], extra: ['D'], empty: ['C'] })
  })

  it('handles empty example map', () => {
    expect(compare({}, { A: '1' })).toEqual({ missing: [], extra: ['A'], empty: [] })
  })

  it('handles empty env map', () => {
    expect(compare({ A: '1' }, {})).toEqual({ missing: ['A'], extra: [], empty: [] })
  })

  it('handles both empty maps', () => {
    expect(compare({}, {})).toEqual({ missing: [], extra: [], empty: [] })
  })

  it('reports missing for keys with undefined env value', () => {
    const result = compare({ A: '1' }, { A: undefined })
    expect(result).toEqual({ missing: ['A'], extra: [], empty: [] })
  })
})
