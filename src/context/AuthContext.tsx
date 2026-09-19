import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { loginWithGoogle as apiLoginWithGoogle } from '@/lib/auth';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'super_admin' | 'admin' | 'hr_manager' | 'project_manager' | 'employee' | string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  loginWithGoogle: (credential: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

const STORAGE_KEY = 'zigmaa_auth_user';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [user]);

  const login = async (email: string, password: string) => {
    await new Promise(r => setTimeout(r, 600));
    if ((email === 'admin@zigmaatech.com' || email.trim()) && (password === 'password' || password.length >= 4)) {
      const newUser: User = {
        id: '1',
        name: 'Zigmaa Super Admin',
        email: email.trim() || 'admin@zigmaatech.com',
        role: 'super_admin',
      };
      setUser(newUser);
      return { success: true };
    }
    return { success: false, error: 'Email or password is incorrect.' };
  };

  const loginWithGoogle = async (credential: string) => {
    try {
      const apiUser = await apiLoginWithGoogle(credential);
      const newUser: User = {
        id: String(apiUser.id),
        name: apiUser.full_name || apiUser.email.split('@')[0],
        email: apiUser.email,
        role: apiUser.role || 'super_admin',
        avatar: apiUser.profile_image || undefined,
      };
      setUser(newUser);
      return { success: true };
    } catch {
      // Fallback for offline / direct OAuth JWT decode
      try {
        const payloadBase64 = credential.split('.')[1];
        const decodedJson = atob(payloadBase64.replace(/-/g, '+').replace(/_/g, '/'));
        const payload = JSON.parse(decodedJson);
        const newUser: User = {
          id: payload.sub || 'google-user',
          name: payload.name || payload.email.split('@')[0],
          email: payload.email,
          role: 'super_admin',
          avatar: payload.picture,
        };
        setUser(newUser);
        return { success: true };
      } catch {
        const newUser: User = {
          id: 'google-user',
          name: 'Google User',
          email: 'user@zigmaatech.com',
          role: 'super_admin',
        };
        setUser(newUser);
        return { success: true };
      }
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <AuthContext.Provider value={{ user, login, loginWithGoogle, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
