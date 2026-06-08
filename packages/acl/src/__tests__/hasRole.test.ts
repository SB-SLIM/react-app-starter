import { describe, it, expect } from 'vitest'
import { hasRole, ROLE_HIERARCHY } from '../index'

describe('ROLE_HIERARCHY', () => {
  it('owner > admin > member', () => {
    expect(ROLE_HIERARCHY.owner).toBeGreaterThan(ROLE_HIERARCHY.admin)
    expect(ROLE_HIERARCHY.admin).toBeGreaterThan(ROLE_HIERARCHY.member)
  })
})

describe('hasRole', () => {
  it('returns false for null role', () => {
    expect(hasRole(null, 'member')).toBe(false)
    expect(hasRole(null, 'admin')).toBe(false)
    expect(hasRole(null, 'owner')).toBe(false)
  })

  it('member satisfies member but not admin or owner', () => {
    expect(hasRole('member', 'member')).toBe(true)
    expect(hasRole('member', 'admin')).toBe(false)
    expect(hasRole('member', 'owner')).toBe(false)
  })

  it('admin satisfies member and admin but not owner', () => {
    expect(hasRole('admin', 'member')).toBe(true)
    expect(hasRole('admin', 'admin')).toBe(true)
    expect(hasRole('admin', 'owner')).toBe(false)
  })

  it('owner satisfies all roles', () => {
    expect(hasRole('owner', 'member')).toBe(true)
    expect(hasRole('owner', 'admin')).toBe(true)
    expect(hasRole('owner', 'owner')).toBe(true)
  })
})
