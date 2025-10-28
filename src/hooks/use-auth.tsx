
"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';

// This is a mock authentication context.
// In a real application, you'd integrate with Firebase Auth, NextAuth.js, or another service.

type AuthUser = {
  name: string;
  email: string;
};

type AuthContextType = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, pass: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Simulate checking for an existing session
    const checkSession = () => {
      try {
        const storedUser = sessionStorage.getItem('user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error("Could not parse user from session storage", error)
      }
      setIsLoading(false);
    };
    checkSession();
  }, []);
  
  const login = (email: string, pass: string) => {
    // Mock login logic
    if (email && pass) {
      const userData = {
        name: 'Fleet Manager',
        email: 'manager@example.com',
      };
      setUser(userData);
      try {
        sessionStorage.setItem('user', JSON.stringify(userData));
      } catch (error) {
        console.error("Could not save user to session storage", error)
      }
    }
  };

  const logout = () => {
    setUser(null);
    try {
      sessionStorage.removeItem('user');
    } catch (error) {
      console.error("Could not remove user from session storage", error)
    }
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
