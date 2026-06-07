import { useCallback, useMemo, useState } from 'react'

export type UseModalReturn<K extends string, TData = unknown> = {
  /** The keys this hook manages. */
  keys: readonly K[]
  /** Keys currently open. */
  openKeys: K[]
  /** Data attached to each open modal, keyed by modal name. */
  state: Partial<Record<K, TData>>
  isOpen: (key: K) => boolean
  /** Open a modal, optionally attaching data retrievable from `state[key]`. */
  open: (key: K, data?: TData) => void
  close: (key: K) => void
  /** Toggle a modal; when opening you may attach data. */
  toggle: (key: K, data?: TData) => void
  closeAll: () => void
}

/**
 * Control one or many modals by key, with optional per-modal data.
 *
 * Pass the data type as the second generic argument:
 *
 * ```tsx
 * const modal = useModal<'edit' | 'delete', Client>(['edit', 'delete'])
 * modal.open('edit', client)        // attach data
 * modal.state.edit                  // Client | undefined
 * <Dialog open={modal.isOpen('edit')} onOpenChange={(o) => !o && modal.close('edit')}>
 * ```
 */
export const useModal = <K extends string, TData = unknown>(
  keys: K | readonly K[],
): UseModalReturn<K, TData> => {
  const allowed = useMemo<readonly K[]>(
    () => (Array.isArray(keys) ? (keys as readonly K[]) : ([keys] as K[])),
    [keys],
  )

  // Presence of a key = open; the mapped value = its attached data.
  const [entries, setEntries] = useState<Map<K, TData | undefined>>(
    () => new Map(),
  )

  const isOpen = useCallback((key: K) => entries.has(key), [entries])

  const open = useCallback(
    (key: K, data?: TData) =>
      setEntries((prev) => new Map(prev).set(key, data)),
    [],
  )

  const close = useCallback(
    (key: K) =>
      setEntries((prev) => {
        const next = new Map(prev)
        next.delete(key)
        return next
      }),
    [],
  )

  const toggle = useCallback(
    (key: K, data?: TData) =>
      setEntries((prev) => {
        const next = new Map(prev)
        if (next.has(key)) next.delete(key)
        else next.set(key, data)
        return next
      }),
    [],
  )

  const closeAll = useCallback(() => setEntries(new Map()), [])

  const state = useMemo(() => {
    const result: Partial<Record<K, TData>> = {}
    for (const [key, data] of entries) {
      if (data !== undefined) result[key] = data
    }
    return result
  }, [entries])

  return {
    keys: allowed,
    openKeys: [...entries.keys()],
    state,
    isOpen,
    open,
    close,
    toggle,
    closeAll,
  }
}
