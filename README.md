# @helix_dev/env-diff

[![npm version](https://img.shields.io/npm/v/@helix_dev/env-diff?style=flat-square)](https://www.npmjs.com/package/@helix_dev/env-diff)
[![MIT license](https://img.shields.io/npm/l/@helix_dev/env-diff?style=flat-square)](LICENSE)
[![Node.js](https://img.shields.io/badge/node-%3E%3D18-brightgreen?style=flat-square)](package.json)

Compare `.env` files — report missing keys, extra keys, and empty values. A pre-deploy check that runs in CI so missing env vars never reach production.

## Why?

Missing environment variables are one of the most common causes of broken deploys. A misconfigured `.env` file can silently crash your application at runtime — often minutes after the deploy completes. `env-diff` catches these mismatches *before* they reach production by comparing your `.env` against `.env.example` at build time.

## Install

```bash
npm install --save-dev @helix_dev/env-diff
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

## Example Output

```
env-diff report

  MISSING (2)
    DATABASE_URL
    REDIS_URL

  EXTRA (1)
    DEBUG_MODE

  EMPTY (1)
    API_KEY

  ✗ Fail: 2 missing, 1 extra, 1 empty
```

A clean run looks like:

```
env-diff report

  ✓ Pass: All keys match
```

## CI/CD Integration

### GitHub Actions

Add this step to your workflow before deploy:

```yaml
- name: Check environment variables
  run: npx @helix_dev/env-diff --quiet
```

Or with visible output:

```yaml
- name: Check environment variables
  run: npx @helix_dev/env-diff
```

The command exits `0` when everything matches and `1` when differences are found, so your pipeline can gate deploys on the result:

```yaml
- name: Validate environment
  id: env-check
  run: npx @helix_dev/env-diff --json > env-report.json

- name: Upload env report
  uses: actions/upload-artifact@v4
  with:
    name: env-report
    path: env-report.json
```

## Exit Codes

| Code | Meaning |
|------|---------|
| 0    | All keys match |
| 1    | Differences found |
| 2    | Error (file not found, etc.) |

## Programmatic API

```ts
import { compare } from '@helix_dev/env-diff'

const result = compare(
  { DATABASE_URL: 'postgres://...' },
  { DATABASE_URL: '' }
)
// → { missing: [], extra: [], empty: ['DATABASE_URL'] }
```

## License

MIT
