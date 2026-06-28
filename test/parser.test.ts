import { describe, it, expect } from 'vitest'
import { parseEnv } from '../src/parser.js'

describe('parseEnv', () => {
  it('parses simple key-value pairs', () => {
    expect(parseEnv('KEY=value\nFOO=bar')).toEqual({ KEY: 'value', FOO: 'bar' })
  })

  it('skips blank lines', () => {
    expect(parseEnv('KEY=value\n\n\nFOO=bar')).toEqual({ KEY: 'value', FOO: 'bar' })
  })

  it('skips full-line comments', () => {
    expect(parseEnv('# comment\nKEY=value\n# another\nFOO=bar')).toEqual({ KEY: 'value', FOO: 'bar' })
  })

  it('trims whitespace from keys and values', () => {
    expect(parseEnv('  KEY  =  value  \n  FOO=bar  ')).toEqual({ KEY: 'value', FOO: 'bar' })
  })

  it('treats empty value as empty string', () => {
    expect(parseEnv('KEY=\nFOO=bar')).toEqual({ KEY: '', FOO: 'bar' })
  })

  it('skips lines with empty keys after trimming', () => {
    expect(parseEnv('=value\nKEY=bar')).toEqual({ KEY: 'bar' })
  })

  it('handles values with embedded equals signs', () => {
    expect(parseEnv('KEY=foo=bar=baz')).toEqual({ KEY: 'foo=bar=baz' })
  })

  it('returns empty map for empty string', () => {
    expect(parseEnv('')).toEqual({})
  })

  it('includes inline # as part of value (no inline comment stripping)', () => {
    expect(parseEnv('KEY=foo#bar')).toEqual({ KEY: 'foo#bar' })
  })

  it('handles lines without value as empty string', () => {
    expect(parseEnv('KEY=')).toEqual({ KEY: '' })
  })

  it('overwrites duplicate keys with last value', () => {
    expect(parseEnv('KEY=first\nKEY=second')).toEqual({ KEY: 'second' })
  })
})
