import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.tsx';
import { ShieldAlert, LogOut, ArrowLeft } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, isAdmin, loading, logout, adminError } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#111c2a] flex flex-col items-center justify-center text-white">
        <div className="w-12 h-12 border-3 border-[#b8863b] border-t-transparent rounded-full animate-spin mb-4" />
        <p className="font-serif text-lg text-[#ecd7ba] tracking-wide">
          Verifying Admin Access...
        </p>
      </div>
    );
  }

  // Not signed in -> redirect to login
  if (!user) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  // Signed in but not an authorized admin
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-[#1e293b] rounded-2xl border border-red-500/30 p-8 text-center shadow-2xl">
          <div className="w-16 h-16 bg-red-500/10 text-red-400 rounded-full flex items-center justify-center mx-auto mb-5">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h2 className="font-serif text-2xl font-bold text-white mb-2">
            Access Restricted
          </h2>
          <p className="text-sm text-slate-300 mb-6 leading-relaxed">
            {adminError ||
              `The account (${user.email}) is signed in, but does not possess administrative privileges to manage this portfolio.`}
          </p>
          <div className="space-y-3">
            <button
              onClick={() => logout()}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-semibold transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Sign Out & Switch Account
            </button>
            <a
              href="/"
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-sm font-medium transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Return to Website
            </a>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

