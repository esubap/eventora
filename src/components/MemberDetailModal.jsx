import React, { useState } from 'react';
import { X, Sparkles, Zap, Heart, MessageSquareQuote, Gamepad2, Award, Shield, Check } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function MemberDetailModal({ member, quotes, onClose, onTriggerSound }) {
  const [hypeCount, setHypeCount] = useState(0);
  const [hyped, setHyped] = useState(false);

  if (!member) return null;

  // Filter quotes attributed to this member
  const memberQuotes = quotes.filter(q => q.author === member.name || q.authorId === member.id);

  const handleHype = (e) => {
    setHypeCount(prev => prev + 1);
    setHyped(true);
    if (onTriggerSound) {
      onTriggerSound('level_up');
    }
    
    // Launch confetti from button coordinates
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (rect.left + rect.width / 2) / window.innerWidth;
    const y = (rect.top + rect.height / 2) / window.innerHeight;
    confetti({
      particleCount: 40,
      spread: 60,
      origin: { x, y }
    });

    setTimeout(() => setHyped(false), 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div 
        className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Banner */}
        <div
          className="h-24 sm:h-28 relative flex items-end p-6"
          style={{
            background: `linear-gradient(135deg, ${member.accentColor || '#10b981'}44, #0b0f19)`
          }}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-slate-950/60 hover:bg-slate-950 text-slate-300 hover:text-white border border-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Avatar & Main Info */}
        <div className="px-6 -mt-12 sm:-mt-14 pb-4 border-b border-slate-800 flex flex-col sm:flex-row items-center sm:items-end justify-between gap-4 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="relative">
              <img
                src={member.avatar}
                alt={member.name}
                className="w-24 h-24 rounded-2xl object-cover ring-4 ring-slate-900 shadow-xl"
              />
              <span
                className={`absolute bottom-1 right-1 w-4 h-4 rounded-full ring-2 ring-slate-900 ${
                  member.status === 'online' ? 'bg-emerald-500' :
                  member.status === 'idle' ? 'bg-amber-500' : 'bg-rose-500'
                }`}
              />
            </div>
            <div>
              <div className="inline-block px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-1">
                {member.role}
              </div>
              <h2 className="text-2xl font-black text-white">{member.name}</h2>
              <p className="text-sm font-semibold text-emerald-400 font-mono">
                "{member.nickname}"
              </p>
            </div>
          </div>

          {/* Hype Button */}
          <button
            onClick={handleHype}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-all shadow-lg active:scale-95 ${
              hyped 
                ? 'bg-pink-500 text-white scale-105' 
                : 'bg-slate-800 hover:bg-pink-600/20 text-pink-400 border border-pink-500/30'
            }`}
          >
            <Heart className={`w-4 h-4 ${hyped ? 'fill-white animate-ping' : 'fill-pink-500'}`} />
            <span>Hype Member</span>
            <span className="ml-1 px-2 py-0.5 rounded-full bg-slate-950/60 text-xs font-mono">
              +{hypeCount}
            </span>
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Bio */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Character Dossier / Lore
            </h4>
            <p className="text-sm text-slate-200 leading-relaxed bg-slate-950/50 p-4 rounded-xl border border-slate-800">
              {member.bio}
            </p>
          </div>

          {/* Favorite Games & Special Perk */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-800/80">
              <div className="flex items-center gap-2 text-xs font-bold uppercase text-slate-400 mb-1">
                <Gamepad2 className="w-4 h-4 text-cyan-400" />
                <span>Primary Loadout / Games</span>
              </div>
              <p className="text-sm font-semibold text-slate-100">{member.favoriteGame || "Valorant & Discord"}</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-800/80">
              <div className="flex items-center gap-2 text-xs font-bold uppercase text-slate-400 mb-1">
                <Zap className="w-4 h-4 text-amber-400" />
                <span>Special Perk</span>
              </div>
              <p className="text-sm font-semibold text-slate-100">{member.specialPerk}</p>
            </div>
          </div>

          {/* Detailed Stat Breakdown */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center justify-between">
              <span>Performance Breakdown</span>
              <span className="text-[11px] font-mono text-emerald-400">Class Rating: S-Tier</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {member.stats.map((stat, idx) => (
                <div key={idx} className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/70">
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="font-medium text-slate-300">{stat.name}</span>
                    <span className="font-mono font-bold text-emerald-400">{stat.value}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${stat.value}%`,
                        backgroundColor: member.accentColor || '#06ffa5'
                      }}
                    />
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1 italic">
                    Assessment: {stat.rating}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Member Quotes */}
          {memberQuotes.length > 0 && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
                <MessageSquareQuote className="w-4 h-4 text-emerald-400" />
                <span>Archived Quotes on the Wall ({memberQuotes.length})</span>
              </h4>
              <div className="space-y-2">
                {memberQuotes.map((q) => (
                  <div key={q.id} className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-xs">
                    <p className="text-slate-200 italic font-medium">"{q.text}"</p>
                    <div className="flex items-center justify-between mt-2 text-[11px] text-slate-400">
                      <span>{q.date} • {q.category}</span>
                      <span className="text-slate-400">{q.context}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-950/80 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs sm:text-sm font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
          >
            Close Dossier
          </button>
        </div>
      </div>
    </div>
  );
}
