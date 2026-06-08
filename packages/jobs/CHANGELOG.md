# @sb-codex/jobs

## 0.1.0-beta.1

### Minor Changes

- a63b602: Design-system build-out.
  - Components: `DropdownMenu`, `ConfirmDialog`, `Pagination`, `Spinner`,
    `Breadcrumb`, `Popover`, `Stepper`, `RadioGroup`; wired `Table`, `Combobox` exports.
  - `DataTable` rebuilt on `@tanstack/react-table` (global search, sorting,
    pagination); `DatePicker` rebuilt on `react-datepicker`; `Select` rebuilt on
    react-select v5, themed via the `primary-*` tokens.
  - Hooks: `useStepper`, `useModal` (multi-modal control with typed per-modal data).
  - api-contracts/server: `clients.count` procedure for table pagination.

## 0.0.1-beta.0

### Patch Changes

- Initial beta release of the sb-codex SaaS starter plugins.
