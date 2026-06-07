# @sb-codex/ui-components

RSC-aware React design system for the sb-codex SaaS starter: component primitives, charts, layouts, headless hooks, a `UIProvider` (light/dark theme state), and the shared Tailwind `theme.css`.

## Installation

```bash
pnpm add @sb-codex/ui-components
# peer dependency
pnpm add react
```

Components are styled with Tailwind and built on **Radix UI** primitives. A few components wrap third-party libraries (bundled as dependencies): `recharts` (charts), `@tanstack/react-table` (`DataTable`), `react-datepicker` (`DatePicker`), `react-select` (`Select` — themed via the `primary-*` tokens), `sonner` (`Toaster`), `lucide-react` (icons).

## Usage

### Theme (single Tailwind entry)

```css
/* your app's index.css */
@import '@sb-codex/ui-components/theme.css';

/* DatePicker needs react-datepicker's base stylesheet, imported once: */
@import 'react-datepicker/dist/react-datepicker.css';

/* override the palette for this app */
@theme {
  --color-primary-600: #db2777;
}
```

> If you use `<DatePicker />`, also add `react-datepicker` to the **consuming app's** dependencies so the stylesheet resolves in isolated/CI builds.

### Provider + components

```tsx
import { UIProvider, Button, Toaster, useTheme } from '@sb-codex/ui-components'

function App() {
  return (
    <UIProvider>
      <Button>Click</Button>
      <Toaster /> {/* mount once at the root */}
    </UIProvider>
  )
}

function Toggle() {
  const { theme, toggleTheme } = useTheme()
  return <button onClick={toggleTheme}>{theme}</button>
}
```

## Exports

### Components

| Group        | Exports                                                                                                                                                                    |
| ------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Primitives   | `Button`, `Input`, `Textarea`, `Label`, `Checkbox`, `Switch`, `Select`, `Combobox`, `DatePicker`, `Badge`, `Avatar`, `Card`, `Separator`, `Skeleton`, `Spinner`, `Tooltip` |
| Overlays     | `Dialog`, `ConfirmDialog`, `Popover`, `DropdownMenu`, `Toaster` + `toast`                                                                                                  |
| Data display | `Table`, `DataTable` (TanStack: search + sort + pagination), `Pagination`, `StatCard`, `Tabs`, `Stepper`, `Breadcrumb`                                                     |
| Patterns     | `PageHeader`, `EmptyState`, `CardUser`                                                                                                                                     |
| Charts       | `SbAreaChart`, `SbBarChart`, `SbLineChart` (recharts wrappers)                                                                                                             |

### Layout

`BlankLayout`, `MainLayout` (sidebar + header), `Header`, `Sidebar`, `Footer`, `LandingHeader`

### Hooks

| Hook                                     | Description                                                                                                                                   |
| ---------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| `useTheme()`                             | `{ theme, setTheme, toggleTheme }` (from `UIProvider`).                                                                                       |
| `useStepper(total)`                      | Stepper state: `{ step, next, prev, goTo, reset, isFirst, isLast }`. Pairs with `<Stepper />`.                                                |
| `useModal(keys)`                         | Control one or many modals by key, with optional typed per-modal data: `open(key, data)` → `state[key]`. Keys are inferred from the argument. |
| `useMediaQuery(query)` / `useIsMobile()` | Responsive helpers.                                                                                                                           |
| `useLocalStorage(key, initial)`          | Persistent state hook.                                                                                                                        |

### Lib / styles

`cn` (clsx helper) · `./theme.css` (Tailwind entry: `@import 'tailwindcss'`, tokens, `dark` variant).

## Selected APIs

```tsx
// DataTable — TanStack column defs; built-in search, sort, pagination
import { DataTable, type ColumnDef } from '@sb-codex/ui-components'

const columns: ColumnDef<Row>[] = [
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'email', header: 'Email' },
]
<DataTable columns={columns} data={rows} searchPlaceholder="Search…" />

// useModal — many modals, one hook, typed data per key
const modal = useModal<'edit' | 'delete', Row>(['edit', 'delete'])
modal.open('edit', row)   // type-checked against Row
modal.state.edit          // Row | undefined
```

## Theming

Tokens are semantic (`primary-*`, not brand names). Override at **build time** (per app, via `@theme`) or at **runtime** (per tenant):

```ts
document.documentElement.style.setProperty('--color-primary-600', brandColor)
```

## Peer dependencies

- `react` `>=18`

---

Part of the [sb-codex SaaS starter](https://github.com/SB-SLIM/react-app-starter). See [docs/plugins](../../docs/plugins/README.md).
