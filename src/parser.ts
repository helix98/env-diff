export function parseEnv(content: string): Record<string, string | undefined> {
  const result: Record<string, string | undefined> = {}
  const lines = content.split('\n')
  for (const rawLine of lines) {
    const line = rawLine.trim()
    if (line === '' || line.startsWith('#')) continue
    const eqIndex = line.indexOf('=')
    if (eqIndex === -1) continue
    const key = line.slice(0, eqIndex).trim()
    const value = line.slice(eqIndex + 1).trim()
    if (key === '') continue
    result[key] = value
  }
  return result
}
