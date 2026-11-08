import React, { useState } from 'react';
import { MessageSquareQuote, Search, Plus, Filter, Copy, Check, Flame, Smile, Skull, ShieldCheck } from 'lucide-react';
import AddQuoteModal from './AddQuoteModal';

export default function QuoteWall({ quotes, quoteCategories, members, onAddQuote }) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedAuthor, setSelectedAuthor] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Local quote reaction state
  const [reactionsState, setReactionsState] = useState(() => {
    const initial = {};
    quotes.forEach(q => {
      initial[q.id] = { ...q.reactions };
    });
    return initial;
  });

  const handleReaction = (quoteId, type) => {
    setReactionsState(prev => {
      const current = prev[quoteId] || { fire: 0, skull: 0, laugh: 0, cap: 0 };
      return {
        ...prev,
        [quoteId]: {
          ...current,
          [type]: (current[type] || 0) + 1
        }
      };
    });
  };

  const handleCopy = (quote) => {
    navigator.clipboard.writeText(`"${quote.text}" — ${quote.author} (${quote.date})`);
    setCopiedId(quote.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Filter logic
  const filteredQuotes = quotes.filter(quote => {
    const matchesCategory = selectedCategory === 'All' || quote.category === selectedCategory;
    const matchesAuthor = selectedAuthor === 'All' || quote.author === selectedAuthor;
    const matchesSearch = 
      quote.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
      quote.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      quote.context.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesAuthor && matchesSearch;
  });

  return (
    <section id="quotes" className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-slate-900">
      
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-purple-500/10 text-purple-400 border border-purple-500/30 uppercase tracking-widest mb-3">
            <MessageSquareQuote className="w-3.5 h-3.5" />
            <span>The Hall of Wisdom</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight uppercase font-display">
            The Quote <span className="text-purple-400">Wall</span>
          </h2>
          <p className="text-sm sm:text-base text-slate-400 mt-2 max-w-xl">
            Unfiltered, unhinged, and completely out of context. Every historic squad statement permanently recorded.
          </p>
        </div>

        {/* Action: Add Quote Button */}
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white shadow-lg shadow-purple-900/30 transition-all hover:scale-105 active:scale-95"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Add Iconic Quote</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800/80 mb-8 space-y-4">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
          
          {/* Search Input */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search quotes or keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-500"
            />
          </div>

          {/* Member Filter Dropdown */}
          <div className="flex items-center gap-2 w-full md:w-auto">
            <span className="text-xs font-bold text-slate-400 whitespace-nowrap hidden sm:inline">Filter Author:</span>
            <select
              value={selectedAuthor}
              onChange={(e) => setSelectedAuthor(e.target.value)}
              className="w-full sm:w-auto px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs sm:text-sm text-slate-200 focus:outline-none focus:border-purple-500"
            >
              <option value="All">All Squad Members</option>
              {members.map(m => (
                <option key={m.id} value={m.name}>{m.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none pt-2 border-t border-slate-800/60">
          {quoteCategories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/20'
                  : 'bg-slate-950 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Quote Grid */}
      {filteredQuotes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredQuotes.map((quote) => {
            const rx = reactionsState[quote.id] || quote.reactions || { fire: 0, skull: 0, laugh: 0, cap: 0 };
            const isCopied = copiedId === quote.id;

            return (
              <div
                key={quote.id}
                className="group relative rounded-2xl bg-slate-900/80 border border-slate-800/80 hover:border-purple-500/50 p-6 flex flex-col justify-between hover:shadow-xl hover:shadow-purple-900/10 transition-all duration-300 hover:-translate-y-1"
              >
                {/* Category & Copy action */}
                <div className="flex items-center justify-between mb-4">
                  <span className="px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider bg-purple-500/10 text-purple-300 border border-purple-500/20">
                    {quote.category}
                  </span>

                  <button
                    onClick={() => handleCopy(quote)}
                    className="p-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                    title="Copy Quote"
                  >
                    {isCopied ? (
                      <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-bold px-1">
                        <Check className="w-3.5 h-3.5" /> Copied!
                      </span>
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>

                {/* Quote Text */}
                <div className="mb-6 flex-1">
                  <p className="text-base sm:text-lg font-medium text-slate-100 leading-relaxed italic">
                    “{quote.text}”
                  </p>
                  
                  {quote.context && (
                    <p className="text-xs text-slate-400 mt-2.5 bg-slate-950/50 px-3 py-1.5 rounded-lg border border-slate-800/60 font-mono">
                      Context: {quote.context}
                    </p>
                  )}
                </div>

                {/* Author Info */}
                <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={quote.authorAvatar}
                      alt={quote.author}
                      className="w-10 h-10 rounded-xl object-cover ring-1 ring-slate-700"
                    />
                    <div>
                      <h4 className="text-sm font-bold text-white group-hover:text-purple-300 transition-colors">
                        {quote.author}
                      </h4>
                      <p className="text-[11px] text-slate-400">
                        {quote.date}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Interactive Reactions Bar */}
                <div className="mt-4 pt-3 border-t border-slate-800/50 flex items-center justify-between gap-1 text-xs">
                  <button
                    onClick={() => handleReaction(quote.id, 'fire')}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-950/80 hover:bg-amber-500/20 text-slate-300 hover:text-amber-400 border border-slate-800 transition-colors"
                  >
                    <span>🔥</span>
                    <span className="font-mono font-bold text-[11px]">{rx.fire || 0}</span>
                  </button>

                  <button
                    onClick={() => handleReaction(quote.id, 'laugh')}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-950/80 hover:bg-yellow-500/20 text-slate-300 hover:text-yellow-400 border border-slate-800 transition-colors"
                  >
                    <span>😂</span>
                    <span className="font-mono font-bold text-[11px]">{rx.laugh || 0}</span>
                  </button>

                  <button
                    onClick={() => handleReaction(quote.id, 'skull')}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-950/80 hover:bg-indigo-500/20 text-slate-300 hover:text-indigo-400 border border-slate-800 transition-colors"
                  >
                    <span>💀</span>
                    <span className="font-mono font-bold text-[11px]">{rx.skull || 0}</span>
                  </button>

                  <button
                    onClick={() => handleReaction(quote.id, 'cap')}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-950/80 hover:bg-rose-500/20 text-slate-300 hover:text-rose-400 border border-slate-800 transition-colors"
                    title="Cap (Lie)"
                  >
                    <span>🧢</span>
                    <span className="font-mono font-bold text-[11px]">{rx.cap || 0}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16 bg-slate-900/40 rounded-2xl border border-slate-800">
          <MessageSquareQuote className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-300">No quotes match your filters</h3>
          <p className="text-sm text-slate-500 mt-1">
            Try searching for something else or submit this moment to the wall.
          </p>
          <button
            onClick={() => { setSelectedCategory('All'); setSelectedAuthor('All'); setSearchQuery(''); }}
            className="mt-4 px-4 py-2 text-xs font-bold bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700"
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* Add Quote Modal */}
      {isAddModalOpen && (
        <AddQuoteModal
          members={members}
          categories={quoteCategories}
          onClose={() => setIsAddModalOpen(false)}
          onAddQuote={(newQuote) => {
            onAddQuote(newQuote);
            setReactionsState(prev => ({ ...prev, [newQuote.id]: newQuote.reactions }));
          }}
        />
      )}
    </section>
  );
}
