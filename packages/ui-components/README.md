# @sb-codex/ui-components

React component primitives, a `UIProvider` (light/dark theme state), and the shared Tailwind `theme.css` for the sb-codex SaaS starter.

## Installation

```bash
pnpm add @sb-codex/ui-components
# peer dependency
pnpm add react
```

## Usage

### Theme (single Tailwind entry)

```css
/* your app's index.css */
@import '@sb-codex/ui-components/theme.css';

/* override the palette for this app */
@theme {
  --color-primary-600: #db2777;
}
```

### Provider + components

```tsx
import { UIProvider, Button, useTheme } from '@sb-codex/ui-components'

function App() {
  return (
    <UIProvider>
      <Button variant="primary">Click</Button>
    </UIProvider>
  )
}

function Toggle() {
  const { theme, toggleTheme } = useTheme()
  return <button onClick={toggleTheme}>{theme}</button>
}
```

## API

| Export               | Description                                                                  |
| -------------------- | ---------------------------------------------------------------------------- |
| `Button`, `CardUser` | Component primitives.                                                        |
| `UIProvider`         | Theme state provider; toggles the `.dark` class, persists to `localStorage`. |
| `useTheme()`         | `{ theme, setTheme, toggleTheme }`.                                          |
| `./theme.css`        | Tailwind entry: `@import 'tailwindcss'`, design tokens, `dark` variant.      |

## Theming

Tokens are semantic (`primary-*`, not brand names). Override at **build time** (per app, via `@theme`) or at **runtime** (per tenant):

```ts
document.documentElement.style.setProperty('--color-primary-600', brandColor)
```

## Peer dependencies

- `react` `>=18`

---

Part of the [sb-codex SaaS starter](https://github.com/SB-SLIM/react-app-starter). See [docs/plugins](../../docs/plugins/README.md).
