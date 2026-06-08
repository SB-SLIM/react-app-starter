import { describe, it, expect, afterEach } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'
import { AclProvider, AccessGuard, useRole } from '../client'

afterEach(cleanup)

function RoleDisplay() {
  const { role, isPending } = useRole()
  return (
    <span data-testid="role">{isPending ? 'pending' : (role ?? 'none')}</span>
  )
}

describe('AclProvider + useRole', () => {
  it('provides default pending state when no provider is mounted', () => {
    render(<RoleDisplay />)
    expect(screen.getByTestId('role').textContent).toBe('pending')
  })

  it('provides role and isPending=false from context', () => {
    render(
      <AclProvider role="admin" isPending={false}>
        <RoleDisplay />
      </AclProvider>,
    )
    expect(screen.getByTestId('role').textContent).toBe('admin')
  })

  it('shows pending when isPending=true even when role is set', () => {
    render(
      <AclProvider role="owner" isPending={true}>
        <RoleDisplay />
      </AclProvider>,
    )
    expect(screen.getByTestId('role').textContent).toBe('pending')
  })

  it('shows none when role is null and isPending=false', () => {
    render(
      <AclProvider role={null} isPending={false}>
        <RoleDisplay />
      </AclProvider>,
    )
    expect(screen.getByTestId('role').textContent).toBe('none')
  })
})

describe('AccessGuard', () => {
  it('renders children when role is in the allowed list', () => {
    render(
      <AclProvider role="admin" isPending={false}>
        <AccessGuard roles={['admin', 'owner']}>
          <span data-testid="content">secret</span>
        </AccessGuard>
      </AclProvider>,
    )
    expect(screen.getByTestId('content')).toBeDefined()
  })

  it('renders fallback when role is not allowed', () => {
    render(
      <AclProvider role="member" isPending={false}>
        <AccessGuard
          roles={['admin', 'owner']}
          fallback={<span data-testid="fallback">no access</span>}
        >
          <span data-testid="content">secret</span>
        </AccessGuard>
      </AclProvider>,
    )
    expect(screen.queryByTestId('content')).toBeNull()
    expect(screen.getByTestId('fallback')).toBeDefined()
  })

  it('renders fallback while isPending', () => {
    render(
      <AclProvider role="owner" isPending={true}>
        <AccessGuard
          roles={['owner']}
          fallback={<span data-testid="fallback">loading</span>}
        >
          <span data-testid="content">secret</span>
        </AccessGuard>
      </AclProvider>,
    )
    expect(screen.queryByTestId('content')).toBeNull()
    expect(screen.getByTestId('fallback')).toBeDefined()
  })

  it('renders nothing by default when access denied', () => {
    const { container } = render(
      <AclProvider role="member" isPending={false}>
        <AccessGuard roles={['owner']}>
          <span data-testid="content">secret</span>
        </AccessGuard>
      </AclProvider>,
    )
    expect(screen.queryByTestId('content')).toBeNull()
    expect(container.textContent).toBe('')
  })
})
