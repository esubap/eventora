import React, { useState } from 'react';
import { Users, Search, Shield, Filter, Sparkles } from 'lucide-react';
import MemberCard from './MemberCard';

export default function SquadRoster({ members, onSelectMember }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');

  // Extract unique roles
  const roles = ['All', ...new Set(members.map(m => m.role))];

  // Filter members based on search and selected role
  const filteredMembers = members.filter(member => {
    const matchesSearch = 
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.nickname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.quote.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = roleFilter === 'All' || member.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  return (
    <section id="roster" className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-slate-900">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 uppercase tracking-widest mb-3">
            <Users className="w-3.5 h-3.5" />
            <span>Active Operatives</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight uppercase font-display">
            The Squad <span className="text-emerald-400">Roster</span>
          </h2>
          <p className="text-sm sm:text-base text-slate-400 mt-2 max-w-xl">
            Meet the legends, the freeloaders, and the emotional anchors holding this friend group together.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          {/* Search Bar */}
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search member or trait..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-900/90 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Role Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
        <Filter className="w-4 h-4 text-slate-500 shrink-0 ml-1" />
        {roles.map((role) => (
          <button
            key={role}
            onClick={() => setRoleFilter(role)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              roleFilter === role
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
            }`}
          >
            {role}
          </button>
        ))}
      </div>

      {/* Members Grid */}
      {filteredMembers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMembers.map((member) => (
            <MemberCard
              key={member.id}
              member={member}
              onSelectMember={onSelectMember}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-slate-900/40 rounded-2xl border border-slate-800">
          <Sparkles className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-300">No squad members found</h3>
          <p className="text-sm text-slate-500 mt-1">
            Try adjusting your search query or reset the role filter.
          </p>
          <button
            onClick={() => { setSearchTerm(''); setRoleFilter('All'); }}
            className="mt-4 px-4 py-2 text-xs font-bold bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700"
          >
            Reset Filters
          </button>
        </div>
      )}
    </section>
  );
}
