import { createContext, useContext } from 'react';

import type { PermissionAction, PermissionMatrix } from '@/lib/auth';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'Super Admin' | 'HR' | 'Employee';
  permissions: PermissionMatrix;
  avatar?: string;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  loginWithGoogle: (credential: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  can: (module: string, action?: PermissionAction) => boolean;
  isAuthenticated: boolean;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
