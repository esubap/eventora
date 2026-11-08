import React, { useState, useEffect } from 'react';
import { Sparkles, Users, Disc, Volume2, Radio, HeartHandshake, ShieldAlert, Award, ArrowDown, Zap } from 'lucide-react';

export default function HeroSection({ squadInfo, members, onTriggerSound }) {
  const animatedCatchphrases = [
    "Where Bad Decisions Make The Best Stories.",
    "Certified Unhinged, Universally Unstoppable.",
    "99.4% of In-Game Losses Were Caused By Lag.",
    "United in Chaos, Divided on Pizza Toppings.",
    "Arguing in Discord Since 2020."
  ];

  const [phraseIndex, setPhraseIndex] = useState(0);
  const [fadeState, setFadeState] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setFadeState(false);
      setTimeout(() => {
        setPhraseIndex((prev) => (prev + 1) % animatedCatchphrases.length);
        setFadeState(true);
      }, 300);
    }, 4200);
    return () => clearInterval(interval);
  }, [animatedCatchphrases.length]);

  return (
    <section className="relative overflow-hidden pt-8 pb-16 lg:pt-14 lg:pb-24 border-b border-slate-900 cyber-grid">
      {/* Background Ambient Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -z-10 animate-pulse-glow" />
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none -z-10 animate-float" />
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-[600px] h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Badges: Streak & Discord Status */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-emerald-500/40 text-emerald-300 text-xs sm:text-sm font-semibold shadow-lg shadow-emerald-950/40">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span>{squadInfo.established}</span>
            <span className="text-slate-600">•</span>
            <span className="text-white font-bold">{squadInfo.streakDays} Days</span>
            <span className="text-emerald-400">Streak Active 🔥</span>
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-950/60 border border-indigo-700/40 text-indigo-200 text-xs sm:text-sm font-medium">
            <Radio className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
            <span>{squadInfo.activeVoiceCall}</span>
          </div>
        </div>

        {/* Animated Main Title & Crew Name */}
        <div className="text-center max-w-4xl mx-auto mb-10">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white uppercase font-display leading-tight sm:leading-none">
            <span className="block text-slate-300 text-xl sm:text-2xl font-bold tracking-widest text-emerald-400 mb-2 font-mono">
              OFFICIAL CREW HEADQUARTERS
            </span>
            <span className="bg-gradient-to-r from-emerald-400 via-teal-200 to-cyan-400 bg-clip-text text-transparent drop-shadow-sm">
              {squadInfo.name}
            </span>
          </h1>

          {/* Animated Catchphrase */}
          <div className="h-14 sm:h-16 flex items-center justify-center mt-4">
            <p
              className={`text-lg sm:text-2xl font-medium text-slate-300 transition-all duration-300 transform ${
                fadeState ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
              }`}
            >
              “{animatedCatchphrases[phraseIndex]}”
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mt-6">
            <a
              href="#roster"
              className="flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm sm:text-base bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-500/25 transition-all hover:scale-105 active:scale-95"
            >
              <Users className="w-5 h-5" />
              <span>Meet The Roster</span>
            </a>

            <a
              href="#wheel"
              className="flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm sm:text-base bg-slate-900/90 hover:bg-slate-800 text-white border border-slate-700/80 hover:border-emerald-500/50 shadow-lg transition-all hover:scale-105 active:scale-95"
            >
              <Disc className="w-5 h-5 text-amber-400" />
              <span>Spin Decision Wheel</span>
            </a>

            <a
              href="#soundboard"
              onClick={() => onTriggerSound && onTriggerSound('airhorn')}
              className="flex items-center gap-2 px-5 py-3.5 rounded-xl font-bold text-sm sm:text-base bg-gradient-to-r from-purple-900/80 to-slate-900 hover:from-purple-800 text-purple-200 border border-purple-700/50 hover:border-purple-500 transition-all hover:scale-105 active:scale-95"
            >
              <Volume2 className="w-5 h-5 text-purple-400" />
              <span>Soundboard</span>
            </a>
          </div>
        </div>

        {/* BOLD GROUP BANNER SECTION */}
        <div className="relative rounded-3xl overflow-hidden border-2 border-slate-800/90 shadow-2xl shadow-emerald-950/20 max-w-5xl mx-auto group">
          {/* Banner Image with layered gradients */}
          <div className="relative h-64 sm:h-96 w-full overflow-hidden">
            <img
              src={squadInfo.bannerImage}
              alt={`${squadInfo.name} Banner`}
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 filter brightness-75 contrast-110"
            />
            {/* Dark & color overlays for high contrast */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/40 via-transparent to-purple-950/40 mix-blend-multiply" />

            {/* In-banner Crew Avatar Stack */}
            <div className="absolute bottom-6 left-6 right-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <span className="inline-block px-3 py-1 text-xs font-mono font-bold tracking-wider uppercase bg-emerald-500 text-slate-950 rounded-md mb-2">
                  FULL CREW ASSEMBLED
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight drop-shadow-md">
                  {squadInfo.name}
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 max-w-md mt-1 drop-shadow">
                  {squadInfo.motto}
                </p>
              </div>

              {/* Stacked Member Avatars with Live Status */}
              <div className="flex items-center -space-x-3 overflow-hidden p-1.5 bg-slate-950/80 rounded-2xl border border-slate-700/60 backdrop-blur-md">
                {members.map((member) => (
                  <div key={member.id} className="relative group/avatar cursor-pointer" title={`${member.name} (${member.role})`}>
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="inline-block h-10 w-10 sm:h-12 sm:w-12 rounded-xl object-cover ring-2 ring-slate-900 hover:ring-emerald-400 hover:scale-110 transition-all z-10 hover:z-20"
                    />
                    <span
                      className={`absolute bottom-0 right-0 block h-3 w-3 rounded-full ring-2 ring-slate-950 ${
                        member.status === 'online' ? 'bg-emerald-500' :
                        member.status === 'idle' ? 'bg-amber-500' : 'bg-rose-500'
                      }`}
                    />
                  </div>
                ))}
                <div className="pl-5 pr-2 py-1 text-xs font-bold text-slate-300">
                  {members.length} Legends
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Squad Key Stats Cards Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mt-8 max-w-5xl mx-auto">
          {squadInfo.stats.map((stat, idx) => (
            <div
              key={idx}
              className="glass-card rounded-2xl p-4 sm:p-5 border border-slate-800/80 text-center hover:border-emerald-500/40 transition-all hover:-translate-y-1"
            >
              <div className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-emerald-400 font-mono tracking-tight">
                {stat.value}
              </div>
              <div className="text-xs sm:text-sm font-semibold text-slate-200 mt-1">
                {stat.label}
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                {stat.sub}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
