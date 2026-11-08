import React from 'react';
import { Sparkles, Heart, ArrowUp, Github, Disc, Users, Volume2 } from 'lucide-react';

export default function Footer({ squadInfo }) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-slate-900 bg-slate-950/90 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-slate-900">
          
          {/* Logo & Tagline */}
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-slate-950 font-bold text-sm">
                ⚡
              </div>
              <span className="font-extrabold text-lg text-white">
                {squadInfo.name}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1 max-w-sm">
              {squadInfo.motto}
            </p>
          </div>

          {/* Quick Nav Links */}
          <div className="flex items-center gap-6 text-xs font-semibold text-slate-400">
            <a href="#roster" className="hover:text-emerald-400 transition-colors">Squad Roster</a>
            <a href="#quotes" className="hover:text-purple-400 transition-colors">Quote Wall</a>
            <a href="#wheel" className="hover:text-amber-400 transition-colors">Decision Wheel</a>
            <a href="#soundboard" className="hover:text-pink-400 transition-colors">Soundboard</a>
          </div>

          {/* Back to top */}
          <button
            onClick={scrollToTop}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-xs font-semibold transition-colors"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 text-center sm:text-left">
          <p>
            Built with React, Vite, Tailwind CSS & late night voice calls. Keep the squad streak alive! 🔥
          </p>
          <p className="font-mono">
            {squadInfo.established} • Unbroken Friendship Hub
          </p>
        </div>
      </div>
    </footer>
  );
}
