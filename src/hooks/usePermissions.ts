import { useAuth } from './useAuth';
import { PermissionType } from '@/types';
import { hasPermission } from '@/utils/rbac';

export const usePermissions = () => {
  const { role } = useAuth();

  const can = (permission: PermissionType): boolean => {
    return hasPermission(role, permission);
  };

  return { can, role };
};
