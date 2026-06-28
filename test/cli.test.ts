import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { mkdtempSync, writeFileSync, rmSync } from 'node:fs'
import { join } from 'node:path'
import { tmpdir } from 'node:os'
import { run } from '../src/cli.js'

let tmpDir: string

beforeAll(() => {
  tmpDir = mkdtempSync(join(tmpdir(), 'env-diff-test-'))
})

afterAll(() => {
  rmSync(tmpDir, { recursive: true, force: true })
})

function writeFile(name: string, content: string) {
  writeFileSync(join(tmpDir, name), content, 'utf-8')
}

describe('run', () => {
  it('returns pass for matching files', () => {
    writeFile('.env.example', 'A=1\nB=2\n')
    writeFile('.env', 'A=1\nB=2\n')
    const result = run(join(tmpDir, '.env.example'), join(tmpDir, '.env'))
    expect(result.exitCode).toBe(0)
    expect(result.output).toContain('Pass')
  })

  it('returns fail with differences', () => {
    writeFile('.env.example', 'A=1\nB=2\nC=3\n')
    writeFile('.env', 'A=1\nC=\nD=extra\n')
    const result = run(join(tmpDir, '.env.example'), join(tmpDir, '.env'))
    expect(result.exitCode).toBe(1)
    expect(result.output).toContain('MISSING')
    expect(result.output).toContain('B')
    expect(result.output).toContain('EXTRA')
    expect(result.output).toContain('D')
    expect(result.output).toContain('EMPTY')
    expect(result.output).toContain('C')
  })

  it('returns JSON output when requested', () => {
    writeFile('.env.example', 'A=1\nB=2\n')
    writeFile('.env', 'A=1\n')
    const result = run(join(tmpDir, '.env.example'), join(tmpDir, '.env'), { json: true })
    expect(result.exitCode).toBe(1)
    const parsed = JSON.parse(result.output)
    expect(parsed).toHaveProperty('missing')
    expect(parsed).toHaveProperty('pass', false)
  })

  it('returns empty output in quiet mode', () => {
    writeFile('.env.example', 'A=1\n')
    writeFile('.env', 'A=\n')
    const result = run(join(tmpDir, '.env.example'), join(tmpDir, '.env'), { quiet: true })
    expect(result.exitCode).toBe(1)
    expect(result.output).toBe('')
  })

  it('handles missing example file', () => {
    const result = run(join(tmpDir, 'nonexistent'), join(tmpDir, '.env'))
    expect(result.exitCode).toBe(2)
    expect(result.output).toContain('not found')
  })

  it('handles missing env file', () => {
    writeFile('.env.example', 'A=1\n')
    const result = run(join(tmpDir, '.env.example'), join(tmpDir, 'nonexistent'))
    expect(result.exitCode).toBe(2)
    expect(result.output).toContain('not found')
  })
})
