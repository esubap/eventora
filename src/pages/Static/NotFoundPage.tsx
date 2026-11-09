import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Home, ArrowRight } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="w-20 h-20 rounded-3xl bg-purple-950/80 border border-purple-500/30 text-purple-400 flex items-center justify-center mx-auto shadow-2xl">
          <Compass className="w-10 h-10 animate-spin-slow" />
        </div>

        <div className="space-y-2">
          <span className="text-4xl font-extrabold text-white font-mono block">404</span>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Page Not Found
          </h1>
          <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
            The event, ticket link, or dashboard page you requested does not exist or may have been moved.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            to="/"
            className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-slate-900 border border-slate-800 hover:bg-slate-800 text-white transition-colors flex items-center gap-1.5"
          >
            <Home className="w-4 h-4" />
            <span>Return Home</span>
          </Link>

          <Link
            to="/events"
            className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-600/30 transition-all flex items-center gap-1.5"
          >
            <span>Explore Live Events</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};
