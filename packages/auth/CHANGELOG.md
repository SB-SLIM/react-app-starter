# @sb-codex/auth

## 0.1.0-beta.2

### Minor Changes

- a63b602: Design-system build-out.
  - Components: `DropdownMenu`, `ConfirmDialog`, `Pagination`, `Spinner`,
    `Breadcrumb`, `Popover`, `Stepper`, `RadioGroup`; wired `Table`, `Combobox` exports.
  - `DataTable` rebuilt on `@tanstack/react-table` (global search, sorting,
    pagination); `DatePicker` rebuilt on `react-datepicker`; `Select` rebuilt on
    react-select v5, themed via the `primary-*` tokens.
  - Hooks: `useStepper`, `useModal` (multi-modal control with typed per-modal data).
  - api-contracts/server: `clients.count` procedure for table pagination.

### Patch Changes

- Updated dependencies [a63b602]
  - @sb-codex/core@0.1.0-beta.1
  - @sb-codex/db@0.1.0-beta.1

## 0.0.1-beta.0

### Patch Changes

- Initial beta release of the sb-codex SaaS starter plugins.
- Updated dependencies
  - @sb-codex/db@0.0.1-beta.0
