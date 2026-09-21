import { useState, useEffect, type ReactNode } from 'react';
import {
  loginWithGoogle as apiLoginWithGoogle,
  loginWithPassword as apiLoginWithPassword,
  logout as apiLogout,
  type AuthUser,
  type PermissionAction,
} from '@/lib/auth';
import { AuthContext, type User } from '@/context/auth-context';

const LEGACY_USER_STORAGE_KEY = 'zigmaa_auth_user';
const LEGACY_ACCESS_TOKEN_STORAGE_KEY = 'zigmaa_access_token';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    localStorage.removeItem(LEGACY_USER_STORAGE_KEY);
    sessionStorage.removeItem(LEGACY_ACCESS_TOKEN_STORAGE_KEY);
  }, []);

  const acceptApiUser = (apiUser: AuthUser): User => ({
    id: String(apiUser.id),
    name: apiUser.full_name || apiUser.email.split('@')[0],
    email: apiUser.email,
    role: apiUser.role,
    permissions: apiUser.permissions,
    avatar: apiUser.profile_image || undefined,
  });

  const login = async (email: string, password: string) => {
    try {
      setUser(acceptApiUser(await apiLoginWithPassword(email.trim(), password)));
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Email or password is incorrect.',
      };
    }
  };

  const loginWithGoogle = async (credential: string) => {
    try {
      const apiUser = await apiLoginWithGoogle(credential);
      setUser(acceptApiUser(apiUser));
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Google sign-in failed.',
      };
    }
  };

  const logout = async () => {
    try {
      await apiLogout();
    } finally {
      setUser(null);
      localStorage.removeItem(LEGACY_USER_STORAGE_KEY);
      sessionStorage.removeItem(LEGACY_ACCESS_TOKEN_STORAGE_KEY);
    }
  };

  const can = (module: string, action: PermissionAction = 'view') => {
    if (!user) return false;
    if (user.role === 'Super Admin') return true;
    return user.permissions?.[module]?.actions.includes(action) ?? false;
  };

  return (
    <AuthContext.Provider value={{ user, login, loginWithGoogle, logout, can, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}
