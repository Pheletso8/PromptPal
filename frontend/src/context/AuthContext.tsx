/**
 * AuthContext.tsx
 * 
 * Global React context for user authentication state.
 * Wraps the whole app so any component can access the logged-in user,
 * trigger login/logout, and know if authentication is loading.
 */
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api, type AuthUser } from '../utils/api';

// ─── Shape of the context value ──────────────────────────────────────────────
interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  updateProfile: (profileData: { name?: string; email?: string; password?: string; profileImage?: string }) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ─── Provider Component ───────────────────────────────────────────────────────
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'));
  const [isLoading, setIsLoading] = useState(true);

  // On mount, if we have a stored token, fetch the user's profile to hydrate state
  const refreshUser = useCallback(async () => {
    const storedToken = localStorage.getItem('token');
    if (!storedToken) {
      setIsLoading(false);
      return;
    }
    try {
      const profile = await api.getProfile();
      setUser(profile);
    } catch {
      // Token is invalid or expired – clear everything
      localStorage.removeItem('token');
      setToken(null);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  // ─── Login ────────────────────────────────────────────────────────────────
  const login = async (email: string, password: string) => {
    const data = await api.login(email, password);
    if (!data.token) {
      throw new Error('Login failed: No token received from server');
    }
    localStorage.setItem('token', data.token);
    setToken(data.token);
    setUser(data);
  };

  // ─── Register ─────────────────────────────────────────────────────────────
  const register = async (name: string, email: string, password: string) => {
    const data = await api.register(name, email, password);
    if (!data.token) {
      throw new Error('Registration failed: No token received from server');
    }
    localStorage.setItem('token', data.token);
    setToken(data.token);
    setUser(data);
  };

  // ─── Logout ───────────────────────────────────────────────────────────────
  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  const updateProfile = async (profileData: { name?: string; email?: string; password?: string; profileImage?: string }) => {
    const updatedUser = await api.updateProfile(profileData);
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, register, logout, refreshUser, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

// ─── Hook for consuming the context ──────────────────────────────────────────
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
};
