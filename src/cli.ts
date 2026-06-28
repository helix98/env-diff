import { readFileSync, existsSync } from 'node:fs'
import { parseEnv } from './parser.js'
import { compare } from './compare.js'
import { formatTerminal, formatJson } from './format.js'
import type { DiffResult } from './compare.js'

const VERSION = '0.1.0'

export interface RunOptions {
  json?: boolean
  quiet?: boolean
}

export interface RunResult {
  exitCode: number
  output: string
}

export function run(examplePath: string, envPath: string, options: RunOptions = {}): RunResult {
  if (!existsSync(examplePath)) {
    return { exitCode: 2, output: `Error: File not found — ${examplePath}` }
  }
  if (!existsSync(envPath)) {
    return { exitCode: 2, output: `Error: File not found — ${envPath}` }
  }

  const exampleContent = readFileSync(examplePath, 'utf-8')
  const envContent = readFileSync(envPath, 'utf-8')

  const example = parseEnv(exampleContent)
  const env = parseEnv(envContent)
  const diff = compare(example, env)

  if (options.quiet) {
    const pass = diff.missing.length === 0 && diff.extra.length === 0 && diff.empty.length === 0
    return { exitCode: pass ? 0 : 1, output: '' }
  }

  const output = options.json ? formatJson(diff) : formatTerminal(diff)
  const pass = diff.missing.length === 0 && diff.extra.length === 0 && diff.empty.length === 0

  return { exitCode: pass ? 0 : 1, output }
}

function printHelp(): void {
  const help = `env-diff — Compare .env files

Usage:
  env-diff [options] [example-file] [env-file]

Positional arguments:
  example-file     Path to example env file (default: .env.example)
  env-file         Path to env file (default: .env)

Options:
  --json           Output results as JSON
  --quiet          Suppress all output, exit code only
  --version        Print version
  --help           Show this help`

  console.log(help)
}

export function main(args: string[]): void {
  if (args.includes('--help') || args.includes('-h')) {
    printHelp()
    process.exit(0)
  }

  if (args.includes('--version') || args.includes('-v')) {
    console.log(VERSION)
    process.exit(0)
  }

  const positionalArgs = args.filter(a => !a.startsWith('--'))
  const examplePath = positionalArgs[0] ?? '.env.example'
  const envPath = positionalArgs[1] ?? '.env'
  const json = args.includes('--json')
  const quiet = args.includes('--quiet')

  const result = run(examplePath, envPath, { json, quiet })

  if (result.output) {
    process.stdout.write(result.output + '\n')
  }

  process.exit(result.exitCode)
}

const isMain = process.argv[1]?.endsWith('env-diff.js') || process.argv[1]?.endsWith('cli.js')
if (isMain) {
  main(process.argv.slice(2))
}
