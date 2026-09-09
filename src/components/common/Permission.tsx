import React from 'react';
import { PermissionType } from '@/types';
import { usePermissions } from '@/hooks/usePermissions';

interface PermissionProps {
  permission: PermissionType;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const Permission: React.FC<PermissionProps> = ({
  permission,
  children,
  fallback = null,
}) => {
  const { can } = usePermissions();

  if (!can(permission)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};
