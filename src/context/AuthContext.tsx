import { createContext, useContext, useState, ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'super_admin' | 'admin' | 'hr_manager' | 'project_manager' | 'employee';
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, password: string) => {
    await new Promise(r => setTimeout(r, 1000));
    if (email === 'admin@zigmaatech.com' && password === 'password') {
      setUser({
        id: '1',
        name: 'Zigmaa Super Admin',
        email: 'admin@zigmaatech.com',
        role: 'super_admin',
      });
      return { success: true };
    }
    return { success: false, error: 'Email or password is incorrect.' };
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
