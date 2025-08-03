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
  const [currentUser, setCurrentUserState] = useState<User | undefined>(() => {
    return getCurrentUser() || undefined;
  });

  const { data: user, isLoading, error } = useQuery({
    queryKey: ["/api/user"],
    retry: false,
    enabled: !!currentUser, // Only fetch if we have a user in localStorage
  });

  useEffect(() => {
    if (user) {
      setCurrentUserState(user);
      setCurrentUser(user);
    }
  }, [user]);

  const login = (user: User) => {
    setCurrentUserState(user);
    setCurrentUser(user);
  };

  const logout = () => {
    setCurrentUserState(undefined);
    clearCurrentUser();
  };

  const authValue: AuthContextType = {
    user: currentUser,
    isLoading,
    isAuthenticated: !!currentUser,
    error,
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