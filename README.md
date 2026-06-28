# env-diff

Compare `.env` files — report missing keys, extra keys, and empty values. Useful as a CI/CD pre-deploy check.

## Install

```bash
npm install --save-dev env-diff
```

## Usage

```bash
# Compare .env.example vs .env (default)
env-diff

# Compare specific files
env-diff .env.example .env.production

# JSON output for CI
env-diff --json

# Silent mode (exit code only)
env-diff --quiet
```

## Exit Codes

| Code | Meaning |
|------|---------|
| 0    | All keys match |
| 1    | Differences found |
| 2    | Error (file not found, etc.) |

## Programmatic API

```ts
import { compare } from 'env-diff'

const result = compare(
  { DATABASE_URL: 'postgres://...' },
  { DATABASE_URL: '' }
)
// → { missing: [], extra: [], empty: ['DATABASE_URL'] }
```

## License

MIT
