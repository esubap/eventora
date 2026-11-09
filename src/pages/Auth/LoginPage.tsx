import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Ticket, Lock, Mail, ArrowRight, Sparkles, Shield, User, Building } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const from = (location.state as any)?.from?.pathname || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      toast.error('Please enter both email and password.');
      return;
    }

    try {
      await login({ email: email.trim(), password });
      navigate(from, { replace: true });
    } catch (err) {
      // Error is handled in AuthContext via toast
    }
  };

  const handleQuickFill = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('Password123!');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        
        {/* Header Branding */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-sky-400 p-[2px]">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Ticket className="w-5 h-5 text-purple-400 transform -rotate-12" />
              </div>
            </div>
            <span className="text-2xl font-extrabold text-white font-display tracking-wider">
              EVENTORA
            </span>
          </Link>
          <h1 className="text-2xl font-bold text-white tracking-tight">Welcome Back</h1>
          <p className="text-xs text-slate-400">
            Sign in to access your booked tickets, organizer events, or platform controls.
          </p>
        </div>

        {/* Quick Demo Credentials Assistant */}
        <div className="p-4 rounded-2xl bg-purple-950/40 border border-purple-500/30 space-y-2.5">
          <div className="flex items-center gap-1.5 text-xs font-bold text-purple-300">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>Instant Demo Account Sign-In:</span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleQuickFill('customer@eventora.com')}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-purple-500 text-[11px] font-semibold text-slate-200 text-center transition-colors flex flex-col items-center gap-1"
            >
              <User className="w-3.5 h-3.5 text-sky-400" />
              <span>Customer</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickFill('organizer@eventora.com')}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-purple-500 text-[11px] font-semibold text-slate-200 text-center transition-colors flex flex-col items-center gap-1"
            >
              <Building className="w-3.5 h-3.5 text-purple-400" />
              <span>Organizer</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickFill('admin@eventora.com')}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-purple-500 text-[11px] font-semibold text-slate-200 text-center transition-colors flex flex-col items-center gap-1"
            >
              <Shield className="w-3.5 h-3.5 text-rose-400" />
              <span>Admin</span>
            </button>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl space-y-4">
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Password
              </label>
              <Link to="/forgot-password" className="text-[11px] text-purple-400 hover:underline">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-purple-600/30 transition-all flex items-center justify-center gap-1.5 disabled:opacity-50 mt-2"
          >
            <span>{isLoading ? 'Signing In...' : 'Sign In'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <p className="text-center text-xs text-slate-400">
          Don't have an account?{' '}
          <Link to="/register" className="text-purple-400 font-semibold hover:underline">
            Create an Account
          </Link>
        </p>

      </div>
    </div>
  );
};
