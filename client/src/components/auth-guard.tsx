import { useAuth } from "@/hooks/use-auth";
import { ReactNode } from "react";
import { Redirect } from "wouter";

interface AuthGuardProps {
  children: ReactNode;
  requireAdmin?: boolean;
}

export default function AuthGuard({ children, requireAdmin = false }: AuthGuardProps) {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Redirect to="/login" />;
  }

  if (requireAdmin && !user?.isAdmin) {
    return <Redirect to="/" />;
  }

  return <>{children}</>;
}
