import React from 'react';
import { Shield, Sparkles, Zap, MessageSquareQuote, ChevronRight, Gamepad2 } from 'lucide-react';

export default function MemberCard({ member, onSelectMember }) {
  // Map role color themes
  const roleColors = {
    "The Tactician": "from-emerald-500/20 to-teal-500/10 border-emerald-500/40 text-emerald-300",
    "The Chaos Gremlin": "from-pink-500/20 to-rose-500/10 border-pink-500/40 text-pink-300",
    "The Mom Friend": "from-sky-500/20 to-blue-500/10 border-sky-500/40 text-sky-300",
    "The Silent Carry": "from-purple-500/20 to-indigo-500/10 border-purple-500/40 text-purple-300",
    "The Aux Cord Menace": "from-amber-500/20 to-orange-500/10 border-amber-500/40 text-amber-300",
    "The Lorekeeper": "from-yellow-500/20 to-lime-500/10 border-yellow-500/40 text-yellow-300"
  };

  const badgeClass = roleColors[member.role] || "from-slate-700/20 to-slate-800/20 border-slate-600 text-slate-300";

  return (
    <div
      onClick={() => onSelectMember(member)}
      className="group relative rounded-2xl bg-slate-900/80 border border-slate-800/90 hover:border-emerald-500/50 hover:shadow-2xl hover:shadow-emerald-500/10 transition-all duration-300 overflow-hidden flex flex-col justify-between cursor-pointer hover:-translate-y-1.5"
    >
      {/* Top Banner Accent */}
      <div
        className="h-2 w-full transition-all group-hover:h-2.5"
        style={{ backgroundColor: member.accentColor || '#06ffa5' }}
      />

      <div className="p-5 sm:p-6 flex-1 flex flex-col">
        {/* Card Header: Avatar & Role */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="relative">
            <img
              src={member.avatar}
              alt={member.name}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover ring-2 ring-slate-800 group-hover:ring-emerald-400/80 transition-all shadow-md group-hover:scale-105"
            />
            {/* Status dot */}
            <span
              className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full ring-2 ring-slate-900 ${
                member.status === 'online' ? 'bg-emerald-500' :
                member.status === 'idle' ? 'bg-amber-500' : 'bg-rose-500'
              }`}
              title={`Status: ${member.status}`}
            />
          </div>

          <div className="text-right flex-1">
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold border bg-gradient-to-r ${badgeClass} shadow-sm`}>
              {member.roleBadge || member.role}
            </span>
            <div className="text-[11px] text-slate-400 font-mono mt-1">
              {member.discordTag}
            </div>
          </div>
        </div>

        {/* Member Name & Nickname */}
        <div className="mb-3">
          <h3 className="text-xl font-bold text-white group-hover:text-emerald-400 transition-colors">
            {member.name}
          </h3>
          <p className="text-xs font-semibold text-emerald-400/90 tracking-wide uppercase font-mono">
            "{member.nickname}"
          </p>
        </div>

        {/* Personal Quote */}
        <div className="mb-4 bg-slate-950/60 p-3 rounded-xl border border-slate-800/80 text-xs italic text-slate-300 flex items-start gap-2">
          <MessageSquareQuote className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <p className="line-clamp-2">"{member.quote}"</p>
        </div>

        {/* Funny Stat Meters */}
        <div className="space-y-2.5 my-2 flex-1">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
            <span>Combat & Chaos Stats</span>
            <Sparkles className="w-3 h-3 text-amber-400" />
          </div>

          {member.stats.map((stat, idx) => (
            <div key={idx} className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 font-medium">{stat.name}</span>
                <span className="text-slate-400 font-mono font-bold text-[11px]">
                  {stat.value}% <span className="text-slate-400">({stat.rating})</span>
                </span>
              </div>
              <div className="w-full h-2 bg-slate-800/90 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700 ease-out"
                  style={{
                    width: `${stat.value}%`,
                    backgroundColor: member.accentColor || '#06ffa5'
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Special Perk */}
        {member.specialPerk && (
          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-start gap-2 text-xs text-slate-300">
            <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
            <p className="line-clamp-2">
              <span className="font-bold text-slate-200">Perk: </span>
              {member.specialPerk}
            </p>
          </div>
        )}
      </div>

      {/* Card Footer / Dossier CTA */}
      <div className="px-5 py-3 bg-slate-950/70 border-t border-slate-800/90 flex items-center justify-between text-xs font-semibold text-slate-400 group-hover:text-emerald-400 transition-colors">
        <span>Open Dossier File</span>
        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </div>
    </div>
  );
}
