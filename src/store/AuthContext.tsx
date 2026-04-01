import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { User } from '@/types';

interface AuthContextValue { user: User | null; login: (u: User) => void; logout: () => void; }
const AuthContext = createContext<AuthContextValue | null>(null);
const KEY = 'bankready_user';

function loadUser(): User | null {
  try { const r = localStorage.getItem(KEY); return r ? (JSON.parse(r) as User) : null; }
  catch { return null; }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(loadUser);
  const login  = useCallback((u: User)  => { setUser(u); localStorage.setItem(KEY, JSON.stringify(u)); }, []);
  const logout = useCallback(() => { setUser(null); localStorage.removeItem(KEY); }, []);
  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
}
