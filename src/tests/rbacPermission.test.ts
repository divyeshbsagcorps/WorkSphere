import { describe, it, expect } from 'vitest';
import { hasPermission } from '@/utils/rbac';

describe('Role-Based Access Control (RBAC)', () => {
  it('should allow EMPLOYEE to view profile and submit requests, but DENY manage employees', () => {
    expect(hasPermission('EMPLOYEE', 'VIEW_PROFILE')).toBe(true);
    expect(hasPermission('EMPLOYEE', 'CREATE_REQUEST')).toBe(true);
    expect(hasPermission('EMPLOYEE', 'MANAGE_EMPLOYEES')).toBe(false);
    expect(hasPermission('EMPLOYEE', 'APPROVE_REQUEST')).toBe(false);
  });

  it('should allow MANAGER to approve requests and view team, but DENY manage analytics', () => {
    expect(hasPermission('MANAGER', 'APPROVE_REQUEST')).toBe(true);
    expect(hasPermission('MANAGER', 'VIEW_TEAM')).toBe(true);
    expect(hasPermission('MANAGER', 'VIEW_ANALYTICS')).toBe(false);
  });

  it('should allow HR_ADMIN full operational permissions', () => {
    expect(hasPermission('HR_ADMIN', 'MANAGE_EMPLOYEES')).toBe(true);
    expect(hasPermission('HR_ADMIN', 'MANAGE_DOCUMENTS')).toBe(true);
    expect(hasPermission('HR_ADMIN', 'MANAGE_SURVEYS')).toBe(true);
    expect(hasPermission('HR_ADMIN', 'VIEW_ANALYTICS')).toBe(true);
  });
});
