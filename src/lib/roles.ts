import { apiRequest } from '@/lib/api';
import type { PermissionAction, PermissionMatrix, PermissionScope } from '@/lib/auth';

export interface SystemRole {
  id: number;
  name: 'Super Admin' | 'HR' | 'Employee';
  description: string;
  is_active: boolean;
  user_count: number;
  is_editable: boolean;
  permissions: PermissionMatrix;
}

export const permissionActions: PermissionAction[] = [
  'view', 'create', 'edit', 'delete', 'approve', 'export', 'manage',
];

export const permissionScopes: PermissionScope[] = [
  'none', 'own', 'assigned', 'department', 'all',
];

export async function getSystemRoles() {
  const response = await apiRequest<{ roles: SystemRole[] }>('/roles/');
  return response.roles;
}

export function updateRolePermissions(roleId: number, permissions: PermissionMatrix) {
  return apiRequest<SystemRole>(`/roles/${roleId}/permissions/`, {
    method: 'PUT',
    body: JSON.stringify({ permissions }),
  });
}
