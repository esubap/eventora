import React, { useState } from 'react';
import { Users, Sparkles, Disc, Volume2, MessageSquareQuote, Sliders, Menu, X, Flame } from 'lucide-react';

export default function Navbar({ squadInfo, onOpenCustomizer }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Squad Roster', href: '#roster', icon: Users },
    { name: 'Quote Wall', href: '#quotes', icon: MessageSquareQuote },
    { name: 'Decision Wheel', href: '#wheel', icon: Disc },
    { name: 'Soundboard', href: '#soundboard', icon: Volume2 },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/85 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo & Crew Tag */}
          <a href="#" className="flex items-center gap-3 group">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-400 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform duration-300">
              <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-slate-950 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg sm:text-xl tracking-tight text-white group-hover:text-emerald-400 transition-colors">
                  {squadInfo.name}
                </span>
                <span className="px-2 py-0.5 text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-full">
                  LIVE
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                {squadInfo.streakDays} Days Unbroken Streak 🔥
              </p>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <a
                  key={link.name}
                  href={link.href}
                  className="flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/60 transition-all duration-200"
                >
                  <Icon className="w-4 h-4 text-emerald-400" />
                  {link.name}
                </a>
              );
            })}
          </nav>

          {/* Right Action: Data Customizer & Status */}
          <div className="hidden sm:flex items-center gap-3">
            <button
              onClick={onOpenCustomizer}
              className="flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-750 transition-all shadow-sm"
              title="Edit or inspect mock data"
            >
              <Sliders className="w-3.5 h-3.5 text-cyan-400" />
              <span>Swap Data / JSON</span>
            </button>

            <a
              href="#wheel"
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-bold bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 hover:brightness-110 shadow-lg shadow-emerald-500/20 transition-all active:scale-95"
            >
              <Flame className="w-4 h-4" />
              <span>Spin The Wheel</span>
            </a>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-800 bg-slate-950/95 px-4 pt-2 pb-6 space-y-2 backdrop-blur-xl">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-base font-medium text-slate-200 hover:bg-slate-800/80 hover:text-emerald-400"
              >
                <Icon className="w-5 h-5 text-emerald-400" />
                {link.name}
              </a>
            );
          })}
          <div className="pt-2 border-t border-slate-800 flex flex-col gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenCustomizer();
              }}
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg text-sm font-medium bg-slate-900 text-slate-300 border border-slate-700"
            >
              <Sliders className="w-4 h-4 text-cyan-400" />
              Swap Real Data (JSON)
            </button>
            <a
              href="#wheel"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg text-sm font-bold bg-emerald-500 text-slate-950"
            >
              <Flame className="w-4 h-4" />
              Spin Decision Wheel
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
