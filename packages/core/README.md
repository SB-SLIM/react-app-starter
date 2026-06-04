# @sb-codex/core

Core utilities shared across the sb-codex SaaS starter.

## Installation

```bash
pnpm add @sb-codex/core
```

## Usage

```ts
import { cn } from '@sb-codex/core'

cn('px-4 py-2', isActive && 'bg-primary-600', className)
// → merged className string (powered by clsx)
```

## API

| Export          | Description                                     |
| --------------- | ----------------------------------------------- |
| `cn(...inputs)` | Conditional `className` builder (clsx wrapper). |

---

Part of the [sb-codex SaaS starter](https://github.com/SB-SLIM/react-app-starter). See [docs/plugins](../../docs/plugins/README.md).
