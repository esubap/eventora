import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Heart, ArrowUpRight, Sparkles, CheckCircle2 } from 'lucide-react';
import type { Event } from '../../types';
import { formatDate, formatTime, getPriceRange } from '../../lib/utils';
import { storage } from '../../lib/storage';
import { Badge } from '../common/Badge';

interface EventCardProps {
  event: Event;
  isFavoriteInitial?: boolean;
}

export const EventCard: React.FC<EventCardProps> = ({ event, isFavoriteInitial = false }) => {
  const [isFavorite, setIsFavorite] = useState<boolean>(() => {
    return storage.getFavorites().includes(event.id);
  });

  const priceRange = getPriceRange(event.ticket_types);

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const updated = storage.toggleFavorite(event.id);
    setIsFavorite(updated);
  };

  const startFormatted = formatDate(event.start_date);
  const timeFormatted = formatTime(event.start_time);

  return (
    <div className="group relative rounded-2xl bg-slate-900/80 border border-slate-800/80 hover:border-purple-500/40 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-950/40 flex flex-col overflow-hidden h-full">
      {/* Cover Image & Overlays */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-950">
        <img
          src={event.cover_image}
          alt={event.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent" />

        {/* Category Pill */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5">
          <Badge variant="purple" size="sm" className="backdrop-blur-md bg-purple-950/80">
            {event.category?.name || 'Event'}
          </Badge>
          {event.featured && (
            <Badge variant="cyan" size="sm" className="backdrop-blur-md bg-sky-950/80">
              <Sparkles className="w-3 h-3 mr-1 text-sky-400" />
              Featured
            </Badge>
          )}
        </div>

        {/* Favorite Heart Button */}
        <button
          onClick={handleToggleFavorite}
          className="absolute top-3 right-3 p-2 rounded-full bg-slate-950/60 backdrop-blur-md border border-slate-800 text-slate-300 hover:text-rose-400 transition-colors"
          aria-label="Add to favorites"
        >
          <Heart className={`w-4 h-4 transition-transform ${isFavorite ? 'fill-rose-500 text-rose-500 scale-110' : ''}`} />
        </button>

        {/* Event Format Badge */}
        <div className="absolute bottom-3 left-3">
          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-900/90 text-slate-300 border border-slate-700/60 backdrop-blur-md">
            {event.event_type}
          </span>
        </div>

        {/* Price Tag */}
        <div className="absolute bottom-3 right-3">
          <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-purple-600/90 text-white backdrop-blur-md shadow-md">
            {priceRange.text}
          </span>
        </div>
      </div>

      {/* Content Details */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Date & Time */}
          <div className="flex items-center gap-2 text-xs font-medium text-purple-400 mb-2">
            <Calendar className="w-3.5 h-3.5" />
            <span>{startFormatted} • {timeFormatted}</span>
          </div>

          {/* Title */}
          <Link to={`/events/${event.slug || event.id}`} className="group-hover:text-purple-300 transition-colors">
            <h3 className="text-base font-bold text-white line-clamp-2 leading-snug tracking-tight">
              {event.title}
            </h3>
          </Link>

          {/* Description Snippet */}
          <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
            {event.short_description || event.description}
          </p>
        </div>

        {/* Location & Action */}
        <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-1.5 truncate max-w-[65%]">
            <MapPin className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
            <span className="truncate">{event.venue_name || event.city || 'Addis Ababa'}</span>
          </div>

          <Link
            to={`/events/${event.slug || event.id}`}
            className="flex items-center gap-1 font-semibold text-purple-400 hover:text-purple-300 transition-colors flex-shrink-0"
          >
            <span>Tickets</span>
            <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
};
