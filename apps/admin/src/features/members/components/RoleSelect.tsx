import { Select } from '@sb-codex/ui-components'
import type { MemberRole } from '@sb-codex/acl/client'

const options = [
  { value: 'owner', label: 'Owner' },
  { value: 'admin', label: 'Admin' },
  { value: 'member', label: 'Member' },
]

interface Props {
  value: MemberRole
  onChange: (role: MemberRole) => void
  disabled?: boolean
}

export function RoleSelect({ value, onChange, disabled }: Props) {
  return (
    <Select
      value={options.find((o) => o.value === value) ?? null}
      onChange={(opt) => opt && onChange(opt.value as MemberRole)}
      options={options}
      isDisabled={disabled}
      menuPortalTarget={
        typeof document !== 'undefined' ? document.body : undefined
      }
    />
  )
}
