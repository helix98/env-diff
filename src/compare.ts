export interface DiffResult {
  missing: string[]
  extra: string[]
  empty: string[]
}

export function compare(
  example: Record<string, string | undefined>,
  env: Record<string, string | undefined>
): DiffResult {
  const missing: string[] = []
  const extra: string[] = []
  const empty: string[] = []

  const allKeys = new Set([...Object.keys(example), ...Object.keys(env)])

  for (const key of allKeys) {
    const inExample = key in example
    const inEnv = key in env && env[key] !== undefined
    const envValue = env[key]

    if (inExample && !inEnv) {
      missing.push(key)
    } else if (!inExample && inEnv) {
      extra.push(key)
    } else if (inEnv && envValue === '') {
      empty.push(key)
    }
  }

  return { missing, extra, empty }
}
