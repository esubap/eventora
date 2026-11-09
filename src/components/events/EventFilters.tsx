import React from 'react';
import { Search, MapPin, Calendar, DollarSign, SlidersHorizontal, RotateCcw } from 'lucide-react';
import { FilterOptions, EventCategory } from '../../types';

interface EventFiltersProps {
  filters: FilterOptions;
  categories: EventCategory[];
  onChange: (updated: Partial<FilterOptions>) => void;
  onReset: () => void;
}

export const EventFilters: React.FC<EventFiltersProps> = ({
  filters,
  categories,
  onChange,
  onReset
}) => {
  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
        <input
          type="text"
          value={filters.searchQuery || ''}
          onChange={(e) => onChange({ searchQuery: e.target.value })}
          placeholder="Search by event title, keyword, or venue..."
          className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
        />
      </div>

      {/* Category Pills (Horizontal Scroll) */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Categories</span>
          {filters.category && filters.category !== 'all' && (
            <button
              onClick={() => onChange({ category: 'all' })}
              className="text-[11px] text-purple-400 hover:text-purple-300"
            >
              Clear Category
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => onChange({ category: 'all' })}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              !filters.category || filters.category === 'all'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            All Categories
          </button>

          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => onChange({ category: cat.slug })}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                filters.category === cat.slug
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Dropdown Selectors: Location, Date, Price, Sort */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2 border-t border-slate-800/80">
        
        {/* Location Filter */}
        <div className="relative">
          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Location
          </label>
          <div className="relative">
            <MapPin className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
            <select
              value={filters.location || 'all'}
              onChange={(e) => onChange({ location: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-8 py-2 text-xs text-slate-200 focus:outline-none focus:border-purple-500 appearance-none cursor-pointer"
            >
              <option value="all">All Locations</option>
              <option value="Addis Ababa">Addis Ababa, Ethiopia</option>
              <option value="Millennium Hall">Millennium Hall</option>
              <option value="Entoto">Entoto Natural Park</option>
              <option value="Meskel Square">Meskel Square</option>
              <option value="Online">Online / Virtual</option>
            </select>
          </div>
        </div>

        {/* Date Filter */}
        <div>
          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Date
          </label>
          <div className="relative">
            <Calendar className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
            <select
              value={filters.dateFilter || 'all'}
              onChange={(e) => onChange({ dateFilter: e.target.value as any })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-8 py-2 text-xs text-slate-200 focus:outline-none focus:border-purple-500 appearance-none cursor-pointer"
            >
              <option value="all">Any Date</option>
              <option value="today">Today</option>
              <option value="tomorrow">Tomorrow</option>
              <option value="this_weekend">This Weekend</option>
              <option value="this_month">This Month</option>
            </select>
          </div>
        </div>

        {/* Price Filter */}
        <div>
          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Price
          </label>
          <div className="relative">
            <DollarSign className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
            <select
              value={filters.priceType || 'all'}
              onChange={(e) => onChange({ priceType: e.target.value as any })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-8 py-2 text-xs text-slate-200 focus:outline-none focus:border-purple-500 appearance-none cursor-pointer"
            >
              <option value="all">All Prices</option>
              <option value="free">Free Events Only</option>
              <option value="paid">Paid Tickets</option>
            </select>
          </div>
        </div>

        {/* Sort By */}
        <div>
          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Sort By
          </label>
          <div className="relative">
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
            <select
              value={filters.sortBy || 'popular'}
              onChange={(e) => onChange({ sortBy: e.target.value as any })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-8 py-2 text-xs text-slate-200 focus:outline-none focus:border-purple-500 appearance-none cursor-pointer"
            >
              <option value="popular">Most Popular</option>
              <option value="newest">Newest Added</option>
              <option value="date_asc">Event Date (Soonest)</option>
              <option value="price_low">Price: Low to High</option>
              <option value="price_high">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Reset Filters CTA */}
      <div className="flex justify-end pt-1">
        <button
          onClick={onReset}
          className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset All Filters</span>
        </button>
      </div>
    </div>
  );
};
