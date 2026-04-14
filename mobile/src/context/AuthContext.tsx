import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api, type AuthUser, getToken, setToken, removeToken } from '../utils/api';

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<AuthUser>;
  register: (name: string, email: string, password: string) => Promise<AuthUser>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    const token = await getToken();
    if (!token) { setIsLoading(false); return; }
    try {
      const profile = await api.getProfile();
      setUser(profile);
    } catch {
      await removeToken();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { refreshUser(); }, [refreshUser]);

  const login = async (email: string, password: string) => {
    const data = await api.login(email, password);
    if (!data.token) throw new Error('No token received');
    await setToken(data.token);
    setUser(data);
    return data;
  };

  const register = async (name: string, email: string, password: string) => {
    const data = await api.register(name, email, password);
    if (!data.token) throw new Error('No token received');
    await setToken(data.token);
    setUser(data);
    return data;
  };

  const logout = async () => {
    await removeToken();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
};
