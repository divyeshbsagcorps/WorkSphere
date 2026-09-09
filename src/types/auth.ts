export type Role = 'EMPLOYEE' | 'MANAGER' | 'HR_ADMIN';

export type PermissionType = 
  | 'VIEW_PROFILE'
  | 'CREATE_REQUEST'
  | 'VIEW_DOCUMENT'
  | 'UPLOAD_DOCUMENT'
  | 'VIEW_TEAM'
  | 'APPROVE_REQUEST'
  | 'MANAGE_EMPLOYEES'
  | 'MANAGE_DOCUMENTS'
  | 'MANAGE_SURVEYS'
  | 'VIEW_ANALYTICS';

export interface User {
  id: number;
  name: string;
  email: string;
  role: Role;
  avatar?: string;
  department: string;
  title: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}
