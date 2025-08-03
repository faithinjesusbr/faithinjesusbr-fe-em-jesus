import React, { createContext, useContext, ReactNode, useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getCurrentUser, setCurrentUser, clearCurrentUser } from "@/lib/auth";

interface User {
  id: string;
  name: string;
  email?: string;
  isAdmin?: boolean;
  points?: string;
}

interface AuthContextType {
  user: User | undefined;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: any;
  login: (user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUserState] = useState<User | undefined>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initialize auth state from localStorage
    try {
      const storedUser = getCurrentUser();
      if (storedUser) {
        setCurrentUserState(storedUser);
      }
    } catch (error) {
      console.error('Error loading user from localStorage:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = (user: User) => {
    try {
      setCurrentUserState(user);
      setCurrentUser(user);
    } catch (error) {
      console.error('Error during login:', error);
    }
  };

  const logout = () => {
    try {
      setCurrentUserState(undefined);
      clearCurrentUser();
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const authValue: AuthContextType = {
    user: currentUser,
    isLoading,
    isAuthenticated: !!currentUser,
    error: null,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={authValue}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}