---
'@sb-codex/ui-components': minor
'@sb-codex/api-contracts': minor
'@sb-codex/core': minor
'@sb-codex/config': minor
'@sb-codex/db': minor
'@sb-codex/auth': minor
'@sb-codex/jobs': minor
---

Design-system build-out.

- Components: `DropdownMenu`, `ConfirmDialog`, `Pagination`, `Spinner`,
  `Breadcrumb`, `Popover`, `Stepper`; wired `Table`, `Combobox` exports.
- `DataTable` rebuilt on `@tanstack/react-table` (global search, sorting,
  pagination); `DatePicker` rebuilt on `react-datepicker`.
- Hooks: `useStepper`, `useModal` (multi-modal control with typed per-modal data).
- api-contracts/server: `clients.count` procedure for table pagination.
