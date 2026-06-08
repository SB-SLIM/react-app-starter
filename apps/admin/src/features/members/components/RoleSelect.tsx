import { Select } from '@sb-codex/ui-components'
import type { MemberRole } from '@sb-codex/acl/client'

const options = [
  { value: 'owner', label: 'Owner' },
  { value: 'admin', label: 'Admin' },
  { value: 'manager', label: 'Manager' },
  { value: 'commercial', label: 'Commercial' },
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
      value={value}
      onChange={(val) => val && onChange(val as MemberRole)}
      options={options}
      isDisabled={disabled}
    />
  )
}
