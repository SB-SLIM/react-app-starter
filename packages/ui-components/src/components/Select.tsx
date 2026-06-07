'use client'

import { clsx } from 'clsx'
import ReactSelect, { type ClassNamesConfig } from 'react-select'

export type SelectOption = { value: string; label: string }

export type SelectProps = {
  options: SelectOption[]
  value?: string | null
  onChange?: (value: string | undefined) => void
  placeholder?: string
  isDisabled?: boolean
  isClearable?: boolean
  isSearchable?: boolean
  isMulti?: false
  id?: string
  name?: string
  className?: string
}

// Tailwind-token classNames — selected option + focus ring use the app's
// semantic `primary-*` colors, so the Select inherits each tenant's theme.
const classNames: ClassNamesConfig<SelectOption, false> = {
  control: (state) =>
    clsx(
      'flex min-h-10 w-full rounded border bg-white px-1 text-sm dark:bg-gray-900',
      state.isFocused
        ? 'border-transparent ring-2 ring-primary-600'
        : 'border-gray-300 dark:border-gray-600',
      state.isDisabled && 'cursor-not-allowed opacity-50',
    ),
  valueContainer: () => 'gap-1 px-2 py-1',
  placeholder: () => 'text-gray-400',
  singleValue: () => 'text-gray-900 dark:text-gray-100',
  input: () => 'text-gray-900 dark:text-gray-100',
  indicatorsContainer: () => 'text-gray-400',
  dropdownIndicator: () => 'px-2',
  clearIndicator: () =>
    'cursor-pointer px-1 hover:text-gray-600 dark:hover:text-gray-300',
  indicatorSeparator: () => 'my-2 w-px bg-gray-200 dark:bg-gray-700',
  menu: () =>
    'mt-1 overflow-hidden rounded border border-gray-200 bg-white shadow-md dark:border-gray-700 dark:bg-gray-900',
  menuList: () => 'p-1',
  option: (state) =>
    clsx(
      'cursor-pointer rounded-sm px-2 py-1.5 text-sm',
      state.isSelected
        ? 'bg-primary-600 text-white dark:bg-primary-500'
        : state.isFocused
          ? 'bg-gray-100 dark:bg-gray-800'
          : 'text-gray-900 dark:text-gray-100',
    ),
  noOptionsMessage: () => 'px-2 py-4 text-center text-sm text-gray-400',
}

/**
 * Single-select built on react-select v5, themed with the design-system tokens.
 *
 * ```tsx
 * <Select options={roles} value={role} onChange={setRole} isClearable />
 * ```
 */
export const Select = ({
  options,
  value,
  onChange,
  placeholder = 'Select…',
  isDisabled = false,
  isClearable = false,
  isSearchable = true,
  id,
  name,
  className,
}: SelectProps) => {
  const selected = options.find((o) => o.value === value) ?? null

  return (
    <ReactSelect<SelectOption>
      inputId={id}
      name={name}
      options={options}
      value={selected}
      onChange={(option) => onChange?.(option?.value)}
      placeholder={placeholder}
      isDisabled={isDisabled}
      isClearable={isClearable}
      isSearchable={isSearchable}
      unstyled
      className={className}
      classNamePrefix="sb-select"
      menuPortalTarget={
        typeof document !== 'undefined' ? document.body : undefined
      }
      styles={{ menuPortal: (base) => ({ ...base, zIndex: 50 }) }}
      classNames={classNames}
    />
  )
}
