import { Role, PermissionType } from '@/types';

export const ROLE_PERMISSIONS: Record<Role, PermissionType[]> = {
  EMPLOYEE: [
    'VIEW_PROFILE',
    'CREATE_REQUEST',
    'VIEW_DOCUMENT',
    'UPLOAD_DOCUMENT',
  ],
  MANAGER: [
    'VIEW_PROFILE',
    'CREATE_REQUEST',
    'VIEW_DOCUMENT',
    'UPLOAD_DOCUMENT',
    'VIEW_TEAM',
    'APPROVE_REQUEST',
  ],
  HR_ADMIN: [
    'VIEW_PROFILE',
    'CREATE_REQUEST',
    'VIEW_DOCUMENT',
    'UPLOAD_DOCUMENT',
    'VIEW_TEAM',
    'APPROVE_REQUEST',
    'MANAGE_EMPLOYEES',
    'MANAGE_DOCUMENTS',
    'MANAGE_SURVEYS',
    'VIEW_ANALYTICS',
  ],
};

export const hasPermission = (userRole: Role | undefined, permission: PermissionType): boolean => {
  if (!userRole) return false;
  return ROLE_PERMISSIONS[userRole]?.includes(permission) ?? false;
};
