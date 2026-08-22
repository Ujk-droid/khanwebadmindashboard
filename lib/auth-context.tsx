'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  isAuthenticated: boolean;
  loading: boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const getTokenFromCookie = () => {
    if (typeof window === 'undefined') return null;
    return document.cookie.split('; ').find((cookie) => cookie.startsWith('adminToken='))?.split('=')[1] || null;
  };

  useEffect(() => {
    const token = localStorage.getItem('adminToken') || getTokenFromCookie();
    if (token) {
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const logout = () => {
    localStorage.removeItem('adminToken');
    if (typeof window !== 'undefined') {
      const cookieAttributes = window.location.protocol === 'https:'
        ? '; Secure; SameSite=None'
        : '';
      document.cookie = `adminToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT${cookieAttributes}`;
    }
    setIsAuthenticated(false);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}