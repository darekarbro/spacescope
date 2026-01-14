/**
 * Auth Context Provider
 * Manages user authentication state and provides auth methods
 */

'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, LoginDTO, SignupDTO, AuthResponse } from '@/types';
import { api } from '@/lib/api/client';
import { AUTH_ENDPOINTS } from '@/lib/api/endpoints';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginDTO) => Promise<void>;
  signup: (data: SignupDTO) => Promise<void>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Initialize auth on mount
  useEffect(() => {
    refreshAuth();
  }, []);

  async function refreshAuth() {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        setLoading(false);
        return;
      }
      const response = await api.get<AuthResponse>(AUTH_ENDPOINTS.ME);
      setUser(response.user);
    } catch (error) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  async function login(credentials: LoginDTO) {
    const response = await api.post<AuthResponse>(AUTH_ENDPOINTS.LOGIN, credentials);
    localStorage.setItem('access_token', response.access_token);
    if (response.refresh_token) {
      localStorage.setItem('refresh_token', response.refresh_token);
    }
    setUser(response.user);
  }

  async function signup(data: SignupDTO) {
    const response = await api.post<AuthResponse>(AUTH_ENDPOINTS.SIGNUP, data);
    localStorage.setItem('access_token', response.access_token);
    if (response.refresh_token) {
      localStorage.setItem('refresh_token', response.refresh_token);
    }
    setUser(response.user);
  }

  async function logout() {
    try {
      await api.post(AUTH_ENDPOINTS.LOGOUT);
    } finally {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      setUser(null);
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        login,
        signup,
        logout,
        refresh: refreshAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
