# @sb-codex/config

Zod-validated environment loader. Parse `process.env` once at startup, fail fast with a formatted error, and get a fully typed config object.

## Installation

```bash
pnpm add @sb-codex/config
# peer dependency
pnpm add zod
```

## Usage

```ts
import { createEnv, z } from '@sb-codex/config'

export const env = createEnv(
  z.object({
    NODE_ENV: z
      .enum(['development', 'production', 'test'])
      .default('development'),
    PORT: z.coerce.number().default(3001),
    DATABASE_URL: z.string(),
  }),
)

env.PORT // number, fully typed
```

Call it once and re-export the result so the rest of the codebase never touches `process.env` directly.

## API

| Export                       | Description                                                                     |
| ---------------------------- | ------------------------------------------------------------------------------- |
| `createEnv(schema, source?)` | Parse `source` (default `process.env`) against a Zod object; throws on failure. |
| `z`                          | Re-exported `zod` for convenience.                                              |

## Peer dependencies

- `zod` `^4`

---

Part of the [sb-codex SaaS starter](https://github.com/SB-SLIM/react-app-starter). See [docs/plugins](../../docs/plugins/README.md).
