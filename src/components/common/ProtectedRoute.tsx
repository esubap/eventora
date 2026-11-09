import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';
import { ShieldAlert, ArrowRight, Home } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles
}) => {
  const { user, role, isAuthenticated, isLoading, switchDemoRole } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin mb-4" />
        <p className="text-slate-400 text-sm">Verifying session permissions...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && role && !allowedRoles.includes(role)) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center shadow-2xl">
          <div className="w-16 h-16 bg-rose-500/10 text-rose-400 rounded-2xl flex items-center justify-center mx-auto mb-5 border border-rose-500/20">
            <ShieldAlert className="w-8 h-8" />
          </div>

          <h2 className="text-2xl font-bold text-white mb-2">Access Restricted</h2>
          <p className="text-slate-400 text-sm mb-6 leading-relaxed">
            This dashboard requires <span className="text-purple-400 font-semibold">{allowedRoles.join(' or ')}</span> permissions. Your current role is <span className="text-amber-400 font-semibold">{role}</span>.
          </p>

          {/* Quick Demo Switcher for convenience */}
          <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 mb-6 text-left">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Quick Switch Role (Testing Mode):
            </p>
            <div className="flex flex-wrap gap-2">
              {allowedRoles.map(targetRole => (
                <button
                  key={targetRole}
                  onClick={() => switchDemoRole(targetRole)}
                  className="px-3 py-1.5 text-xs font-medium rounded-lg bg-purple-600 hover:bg-purple-500 text-white transition-colors flex items-center gap-1.5"
                >
                  <span>Switch to {targetRole}</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              ))}
            </div>
          </div>

          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-slate-300 hover:text-white transition-colors"
          >
            <Home className="w-4 h-4" />
            <span>Return to Homepage</span>
          </Link>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
