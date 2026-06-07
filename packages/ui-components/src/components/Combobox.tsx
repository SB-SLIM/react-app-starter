'use client'

import React, { useState, useRef, useEffect } from 'react'
import { clsx } from 'clsx'
import { Check, ChevronDown, X } from 'lucide-react'

export type ComboboxOption = {
  value: string
  label: string
}

export type ComboboxProps = {
  options: ComboboxOption[]
  value?: string
  onChange?: (value: string | undefined) => void
  placeholder?: string
  disabled?: boolean
  clearable?: boolean
  emptyMessage?: string
  className?: string
}

export function Combobox({
  options,
  value,
  onChange,
  placeholder = 'Select…',
  disabled = false,
  clearable = false,
  emptyMessage = 'No results found.',
  className,
}: ComboboxProps) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const selectedOption = options.find((o) => o.value === value)

  const filtered = query
    ? options.filter((o) => o.label.toLowerCase().includes(query.toLowerCase()))
    : options

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false)
        setQuery('')
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  function handleSelect(option: ComboboxOption) {
    onChange?.(option.value)
    setOpen(false)
    setQuery('')
  }

  function handleClear(e: React.MouseEvent) {
    e.stopPropagation()
    onChange?.(undefined)
    setQuery('')
  }

  function handleTriggerClick() {
    if (disabled) return
    const next = !open
    setOpen(next)
    if (next) {
      setTimeout(() => inputRef.current?.focus(), 0)
    }
  }

  return (
    <div ref={containerRef} className={clsx('relative w-full', className)}>
      <div
        role="combobox"
        aria-expanded={open}
        aria-haspopup="listbox"
        onClick={handleTriggerClick}
        className={clsx(
          'flex h-10 w-full cursor-pointer items-center justify-between rounded border border-gray-300 bg-white px-3 py-2 text-sm select-none',
          'focus-within:ring-2 focus-within:ring-primary-600 focus-within:border-transparent',
          'dark:border-gray-600 dark:bg-gray-900',
          disabled && 'cursor-not-allowed opacity-50 pointer-events-none',
        )}
      >
        {open ? (
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={selectedOption?.label ?? placeholder}
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-gray-400 dark:text-gray-100"
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          <span
            className={clsx(
              'flex-1 truncate',
              !selectedOption && 'text-gray-400',
              selectedOption && 'text-gray-900 dark:text-gray-100',
            )}
          >
            {selectedOption?.label ?? placeholder}
          </span>
        )}

        <div className="flex shrink-0 items-center gap-1">
          {clearable && selectedOption && (
            <button
              type="button"
              onClick={handleClear}
              className="rounded p-0.5 hover:bg-gray-100 dark:hover:bg-gray-800"
              aria-label="Clear selection"
            >
              <X className="h-3.5 w-3.5 text-gray-400" />
            </button>
          )}
          <ChevronDown
            className={clsx(
              'h-4 w-4 text-gray-400 transition-transform duration-150',
              open && 'rotate-180',
            )}
          />
        </div>
      </div>

      {open && (
        <div
          role="listbox"
          className={clsx(
            'absolute z-50 mt-1 w-full rounded border border-gray-200 bg-white shadow-md',
            'dark:border-gray-700 dark:bg-gray-900',
          )}
        >
          <div className="max-h-60 overflow-auto p-1">
            {filtered.length === 0 ? (
              <p className="px-2 py-4 text-center text-sm text-gray-400">
                {emptyMessage}
              </p>
            ) : (
              filtered.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  role="option"
                  aria-selected={option.value === value}
                  onClick={() => handleSelect(option)}
                  className={clsx(
                    'flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-left text-sm',
                    'hover:bg-gray-100 dark:hover:bg-gray-800',
                    option.value === value &&
                      'bg-gray-50 font-medium dark:bg-gray-800',
                  )}
                >
                  <Check
                    className={clsx(
                      'h-4 w-4 shrink-0',
                      option.value === value
                        ? 'text-primary-600 dark:text-primary-400'
                        : 'opacity-0',
                    )}
                  />
                  <span className="text-gray-900 dark:text-gray-100">
                    {option.label}
                  </span>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}
