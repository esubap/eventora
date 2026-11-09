import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { eventService } from '../services/eventService';
import type { Event, EventCategory, FilterOptions } from '../types';
import { EventCard } from '../components/events/EventCard';
import { EventFilters } from '../components/events/EventFilters';
import { Compass, Sparkles, FilterX } from 'lucide-react';

export const EventsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [categories, setCategories] = useState<EventCategory[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize filters from URL params
  const [filters, setFilters] = useState<FilterOptions>({
    searchQuery: searchParams.get('search') || '',
    category: searchParams.get('category') || 'all',
    location: searchParams.get('location') || 'all',
    dateFilter: (searchParams.get('date') as any) || 'all',
    priceType: (searchParams.get('price') as any) || 'all',
    sortBy: (searchParams.get('sort') as any) || 'popular'
  });

  // Load Categories once
  useEffect(() => {
    eventService.getCategories().then(setCategories);
  }, []);

  // Fetch Events when filters change
  useEffect(() => {
    const fetchFiltered = async () => {
      setIsLoading(true);
      try {
        const data = await eventService.getEvents(filters);
        setEvents(data);
      } catch (err) {
        console.error('Failed to load events', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFiltered();

    // Sync to URL search params
    const newParams = new URLSearchParams();
    if (filters.searchQuery) newParams.set('search', filters.searchQuery);
    if (filters.category && filters.category !== 'all') newParams.set('category', filters.category);
    if (filters.location && filters.location !== 'all') newParams.set('location', filters.location);
    if (filters.dateFilter && filters.dateFilter !== 'all') newParams.set('date', filters.dateFilter);
    if (filters.priceType && filters.priceType !== 'all') newParams.set('price', filters.priceType);
    if (filters.sortBy && filters.sortBy !== 'popular') newParams.set('sort', filters.sortBy);

    setSearchParams(newParams, { replace: true });
  }, [filters, setSearchParams]);

  const handleFilterChange = (updated: Partial<FilterOptions>) => {
    setFilters(prev => ({ ...prev, ...updated }));
  };

  const handleResetFilters = () => {
    setFilters({
      searchQuery: '',
      category: 'all',
      location: 'all',
      dateFilter: 'all',
      priceType: 'all',
      sortBy: 'popular'
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Header Banner */}
      <div className="relative rounded-3xl bg-gradient-to-r from-purple-950/80 via-slate-900 to-slate-950 border border-purple-500/30 p-8 sm:p-12 overflow-hidden shadow-2xl">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-900/60 border border-purple-400/30 text-purple-300 text-xs font-semibold mb-3">
            <Compass className="w-3.5 h-3.5 text-purple-400" />
            <span>Discover What's Happening</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-display">
            Browse All Events & Experiences
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
            Search from live concerts, technical masterclasses, cultural galas, and marathons. Filter by price, city, or date to find your next unforgettable experience.
          </p>
        </div>
      </div>

      {/* Filter Control Center */}
      <EventFilters
        filters={filters}
        categories={categories}
        onChange={handleFilterChange}
        onReset={handleResetFilters}
      />

      {/* Results Header Bar */}
      <div className="flex items-center justify-between text-xs text-slate-400 pt-2">
        <span className="font-semibold text-slate-200">
          Showing <strong className="text-purple-400">{events.length}</strong> event{events.length === 1 ? '' : 's'}
        </span>

        {filters.category && filters.category !== 'all' && (
          <span className="text-[11px] px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-300">
            Category: <strong className="text-purple-300">{filters.category}</strong>
          </span>
        )}
      </div>

      {/* Event Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-80 rounded-2xl bg-slate-900/50 border border-slate-800 animate-pulse" />
          ))}
        </div>
      ) : events.length === 0 ? (
        <div className="p-16 rounded-3xl bg-slate-900/40 border border-slate-800 text-center max-w-lg mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-purple-950/60 border border-purple-500/20 text-purple-400 flex items-center justify-center mx-auto mb-4">
            <FilterX className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-white mb-1">No Matching Events Found</h3>
          <p className="text-xs text-slate-400 mb-6 leading-relaxed">
            We couldn't find any events matching your current filter criteria. Try adjusting your keyword search or location.
          </p>
          <button
            onClick={handleResetFilters}
            className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-purple-600 hover:bg-purple-500 text-white transition-colors"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map(event => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </div>
  );
};
