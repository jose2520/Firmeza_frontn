import React from 'react';
import { Navigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

interface AdminGuardProps {
  children: React.ReactNode;
}

export function AdminGuard({ children }: AdminGuardProps) {
  const { user, isInitializing, isAuthenticated } = useAuth();

  if (isInitializing) {
    return (
      <div className="flex-1 min-h-screen flex items-center justify-center bg-brand-bg dark:bg-brand-navy-dark">
        <Loader2 className="w-10 h-10 animate-spin text-brand-gold" />
      </div>
    );
  }

  // Si no está autenticado o no es Admin, redirige al portal de login
  if (!isAuthenticated || user?.role !== 'Admin') {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

export default AdminGuard;
