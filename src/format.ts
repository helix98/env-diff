import picocolors from 'picocolors'
import type { DiffResult } from './compare.js'

function section(label: string, items: string[], color: (s: string) => string): string {
  if (items.length === 0) return ''
  const header = `${color(label)} (${items.length})`
  const lines = items.map(k => `    ${k}`).join('\n')
  return `\n  ${header}\n${lines}`
}

export function formatTerminal(result: DiffResult): string {
  const { missing, extra, empty } = result
  const hasDiff = missing.length > 0 || extra.length > 0 || empty.length > 0

  if (!hasDiff) {
    return `env-diff report\n\n  ${picocolors.green('✓')} Pass: All keys match\n`
  }

  const parts: string[] = ['env-diff report']

  parts.push(section('MISSING', missing, picocolors.red))
  parts.push(section('EXTRA', extra, picocolors.yellow))
  parts.push(section('EMPTY', empty, picocolors.cyan))

  const counts = [
    missing.length > 0 ? `${missing.length} missing` : '',
    extra.length > 0 ? `${extra.length} extra` : '',
    empty.length > 0 ? `${empty.length} empty` : '',
  ].filter(Boolean).join(', ')

  parts.push(`\n  ${picocolors.red('✗')} Fail: ${counts}\n`)

  return parts.join('')
}

export function formatJson(result: DiffResult): string {
  const pass = result.missing.length === 0 && result.extra.length === 0 && result.empty.length === 0
  return JSON.stringify({ ...result, pass }, null, 2)
}
