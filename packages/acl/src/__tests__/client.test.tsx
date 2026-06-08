import { describe, it, expect, afterEach } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'
import {
  AclProvider,
  AccessGuard,
  Can,
  useRole,
  usePermission,
} from '../client'

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

describe('Can + usePermission', () => {
  it('renders children when the permission is held', () => {
    render(
      <AclProvider permissions={['clients:create']} isPending={false}>
        <Can permission="clients:create">
          <span data-testid="content">new client</span>
        </Can>
      </AclProvider>,
    )
    expect(screen.getByTestId('content')).toBeDefined()
  })

  it('renders fallback when the permission is missing', () => {
    render(
      <AclProvider permissions={['clients:read']} isPending={false}>
        <Can
          permission="clients:delete"
          fallback={<span data-testid="fallback">denied</span>}
        >
          <span data-testid="content">delete</span>
        </Can>
      </AclProvider>,
    )
    expect(screen.queryByTestId('content')).toBeNull()
    expect(screen.getByTestId('fallback')).toBeDefined()
  })

  it('requires all permissions when given an array', () => {
    render(
      <AclProvider permissions={['clients:read']} isPending={false}>
        <Can permission={['clients:read', 'clients:update']}>
          <span data-testid="content">edit</span>
        </Can>
      </AclProvider>,
    )
    expect(screen.queryByTestId('content')).toBeNull()
  })

  it('renders fallback while pending', () => {
    render(
      <AclProvider permissions={['clients:read']} isPending={true}>
        <Can
          permission="clients:read"
          fallback={<span data-testid="fallback">loading</span>}
        >
          <span data-testid="content">list</span>
        </Can>
      </AclProvider>,
    )
    expect(screen.queryByTestId('content')).toBeNull()
    expect(screen.getByTestId('fallback')).toBeDefined()
  })

  it('usePermission reflects the granted permissions', () => {
    function Probe() {
      return (
        <span data-testid="probe">
          {usePermission('clients:create') ? 'yes' : 'no'}
        </span>
      )
    }
    render(
      <AclProvider permissions={['clients:create']} isPending={false}>
        <Probe />
      </AclProvider>,
    )
    expect(screen.getByTestId('probe').textContent).toBe('yes')
  })
})
