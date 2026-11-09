import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { eventService } from '../services/eventService';
import type { Event, TicketType, Review } from '../types';
import { formatDate, formatTime, formatCurrency } from '../lib/utils';
import { storage } from '../lib/storage';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { 
  Calendar, 
  MapPin, 
  Clock, 
  Share2, 
  Heart, 
  ShieldCheck, 
  Check, 
  Users, 
  Star, 
  Ticket, 
  ArrowRight, 
  Globe, 
  ExternalLink,
  Plus,
  Minus,
  MessageSquarePlus
} from 'lucide-react';
import { Badge } from '../components/common/Badge';
import { ShareModal } from '../components/events/ShareModal';
import { EventCard } from '../components/events/EventCard';

export const EventDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const toast = useToast();

  const [event, setEvent] = useState<Event | null>(null);
  const [relatedEvents, setRelatedEvents] = useState<Event[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Ticket selection state
  const [selectedTicketId, setSelectedTicketId] = useState<string>('');
  const [ticketQuantity, setTicketQuantity] = useState<number>(1);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  // Review Form state
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  useEffect(() => {
    if (!id) return;

    const loadEventDetails = async () => {
      setIsLoading(true);
      try {
        const found = await eventService.getEventById(id);
        if (found) {
          setEvent(found);
          setIsFavorite(storage.getFavorites().includes(found.id));

          // Set default selected ticket type
          if (found.ticket_types && found.ticket_types.length > 0) {
            setSelectedTicketId(found.ticket_types[0].id);
          }

          // Load Reviews
          const revs = await eventService.getReviews(found.id);
          setReviews(revs);

          // Load Related Events
          const all = await eventService.getEvents();
          setRelatedEvents(all.filter(e => e.id !== found.id && e.category_id === found.category_id).slice(0, 3));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadEventDetails();
  }, [id]);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="w-12 h-12 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin mx-auto mb-4" />
        <p className="text-slate-400 text-sm">Loading event details...</p>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Event Not Found</h2>
        <p className="text-slate-400 text-xs mb-6">This event may have ended or the link is invalid.</p>
        <Link to="/events" className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-purple-600 text-white">
          Browse All Events
        </Link>
      </div>
    );
  }

  const selectedTier = event.ticket_types?.find(t => t.id === selectedTicketId);
  const unitPrice = selectedTier ? selectedTier.price : 0;
  const totalPrice = unitPrice * ticketQuantity;
  const currency = selectedTier?.currency || 'ETB';

  const handleToggleFavorite = () => {
    const next = storage.toggleFavorite(event.id);
    setIsFavorite(next);
    toast.info(next ? 'Added to your saved events' : 'Removed from saved events');
  };

  const handleQuantityChange = (delta: number) => {
    const max = selectedTier?.max_per_order || 10;
    const remaining = selectedTier?.remaining_quantity || 1;
    const effectiveLimit = Math.min(max, remaining);

    setTicketQuantity(prev => {
      const next = prev + delta;
      if (next < 1) return 1;
      if (next > effectiveLimit) {
        toast.warning(`Order limited to maximum ${effectiveLimit} tickets`);
        return effectiveLimit;
      }
      return next;
    });
  };

  const handleProceedToCheckout = () => {
    if (!selectedTier) {
      toast.error('Please choose a ticket category');
      return;
    }

    if (selectedTier.remaining_quantity < ticketQuantity) {
      toast.error(`Only ${selectedTier.remaining_quantity} ticket(s) remain.`);
      return;
    }

    // Direct navigate to checkout with ticket state
    navigate(`/checkout/${event.id}?ticketTypeId=${selectedTier.id}&qty=${ticketQuantity}`);
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewComment.trim()) {
      toast.error('Please write a brief comment.');
      return;
    }

    setIsSubmittingReview(true);
    try {
      const newRev = await eventService.addReview({
        event_id: event.id,
        user_id: user?.id || 'guest',
        user_name: user?.full_name || 'Verified Attendee',
        user_avatar: user?.avatar_url,
        rating: reviewRating,
        comment: reviewComment.trim(),
        is_verified_attendee: true
      });

      setReviews(prev => [newRev, ...prev]);
      setReviewComment('');
      toast.success('Thank you for rating this event!', 'Review Submitted');
    } catch (err: any) {
      toast.error(err.message || 'Error saving review');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      
      {/* 1. HERO COVER & HEADER */}
      <div className="relative rounded-3xl overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl">
        <div className="relative aspect-[21/9] sm:aspect-[21/8] w-full overflow-hidden">
          <img
            src={event.cover_image}
            alt={event.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />

          {/* Top Quick Actions (Back, Share, Bookmark) */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
            <Link
              to="/events"
              className="px-3.5 py-1.5 rounded-full bg-slate-950/70 border border-slate-700 text-xs font-semibold text-white backdrop-blur-md hover:bg-slate-900 transition-colors"
            >
              ← Back to Events
            </Link>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsShareModalOpen(true)}
                className="p-2.5 rounded-full bg-slate-950/70 border border-slate-700 text-white backdrop-blur-md hover:text-purple-400 transition-colors"
                title="Share event"
              >
                <Share2 className="w-4 h-4" />
              </button>

              <button
                onClick={handleToggleFavorite}
                className="p-2.5 rounded-full bg-slate-950/70 border border-slate-700 text-white backdrop-blur-md hover:text-rose-400 transition-colors"
                title="Save event"
              >
                <Heart className={`w-4 h-4 ${isFavorite ? 'fill-rose-500 text-rose-500' : ''}`} />
              </button>
            </div>
          </div>

          {/* Bottom Title & Badges Overlay */}
          <div className="absolute bottom-6 left-6 right-6 flex flex-col gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="purple" size="md">
                {event.category?.name || 'Live Event'}
              </Badge>
              <Badge variant="cyan" size="md">
                {event.event_type.toUpperCase()}
              </Badge>
              {event.featured && (
                <Badge variant="success" size="md">
                  FEATURED
                </Badge>
              )}
            </div>

            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight font-display max-w-4xl">
              {event.title}
            </h1>
          </div>
        </div>
      </div>

      {/* 2. MAIN 2-COLUMN LAYOUT: DETAILS & BOOKING CARD */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* LEFT 2 COLS: Event Details, Organizer, Gallery, Terms, Reviews */}
        <div className="lg:col-span-2 space-y-10">
          
          {/* Key Quick Facts Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-purple-950/80 text-purple-400 border border-purple-500/20">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Date</span>
                <span className="text-xs font-bold text-white block mt-0.5">{formatDate(event.start_date)}</span>
                <span className="text-[11px] text-slate-400">{formatTime(event.start_time)}</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-sky-950/80 text-sky-400 border border-sky-500/20">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Location</span>
                <span className="text-xs font-bold text-white block mt-0.5 truncate">{event.venue_name || event.city}</span>
                <span className="text-[11px] text-slate-400 truncate block">{event.address || event.city}</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-950/80 text-emerald-400 border border-emerald-500/20">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Capacity</span>
                <span className="text-xs font-bold text-white block mt-0.5">{event.capacity.toLocaleString()} Attendees</span>
                <span className="text-[11px] text-emerald-400">Tickets Available</span>
              </div>
            </div>
          </div>

          {/* Description Section */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-white tracking-tight">About This Event</h2>
            <div className="text-sm text-slate-300 leading-relaxed space-y-4 whitespace-pre-line bg-slate-900/40 p-6 rounded-2xl border border-slate-800/80">
              {event.description}
            </div>
          </div>

          {/* Organizer Card */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400 block">Hosted by</span>
            <div className="flex items-center gap-4">
              <img
                src={event.organizer?.avatar_url || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80'}
                alt={event.organizer?.full_name}
                className="w-14 h-14 rounded-2xl object-cover border border-purple-500/30"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-white">
                    {event.organizer?.organization_name || event.organizer?.full_name || 'Selam Productions'}
                  </h3>
                  <Badge variant="cyan" size="sm">Verified Organizer</Badge>
                </div>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                  {event.organizer?.bio || 'Professional event creator hosting high-impact international concerts and tech summits.'}
                </p>
              </div>
            </div>
          </div>

          {/* Terms & Conditions */}
          {event.terms_and_conditions && (
            <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-2">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-purple-400" />
                <span>Terms & Entry Requirements</span>
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                {event.terms_and_conditions}
              </p>
            </div>
          )}

          {/* Attendee Reviews & Star Ratings */}
          <div className="space-y-6 pt-6 border-t border-slate-800">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-white tracking-tight">Reviews & Attendee Ratings</h3>
                <div className="flex items-center gap-2 mt-1 text-xs text-slate-400">
                  <div className="flex items-center gap-1 text-amber-400">
                    <Star className="w-4 h-4 fill-amber-400" />
                    <span className="font-bold text-white text-sm">{event.average_rating || 5.0}</span>
                  </div>
                  <span>•</span>
                  <span>{reviews.length} verified review{reviews.length === 1 ? '' : 's'}</span>
                </div>
              </div>
            </div>

            {/* Leave a Review Form */}
            <form onSubmit={handleSubmitReview} className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white">Rate your experience:</span>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setReviewRating(star)}
                      className="p-1 hover:scale-110 transition-transform"
                    >
                      <Star className={`w-5 h-5 ${star <= reviewRating ? 'fill-amber-400 text-amber-400' : 'text-slate-600'}`} />
                    </button>
                  ))}
                </div>
              </div>

              <textarea
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                placeholder="Share your thoughts about this event, sound, atmosphere, or organization..."
                rows={2}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-500"
              />

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmittingReview || !reviewComment.trim()}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-purple-600 hover:bg-purple-500 text-white transition-colors disabled:opacity-50"
                >
                  {isSubmittingReview ? 'Posting...' : 'Post Review'}
                </button>
              </div>
            </form>

            {/* Reviews List */}
            <div className="space-y-3">
              {reviews.map(rev => (
                <div key={rev.id} className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white">{rev.user_name}</span>
                      {rev.is_verified_attendee && (
                        <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                          <Check className="w-3 h-3" /> Verified Attendee
                        </span>
                      )}
                    </div>
                    <div className="flex items-center text-amber-400">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-amber-400" />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">{rev.comment}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COL: Sticky Ticket Matrix & Checkout Selector */}
        <div className="lg:col-span-1">
          <div className="sticky top-28 p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-6">
            
            <div className="pb-4 border-b border-slate-800">
              <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400 block mb-1">
                Select Tickets
              </span>
              <h3 className="text-xl font-extrabold text-white">Tickets & Pricing</h3>
            </div>

            {/* Ticket Tier List */}
            <div className="space-y-3">
              {event.ticket_types?.map(tier => {
                const isSelected = selectedTicketId === tier.id;
                const isSoldOut = tier.remaining_quantity <= 0;

                return (
                  <div
                    key={tier.id}
                    onClick={() => {
                      if (!isSoldOut) {
                        setSelectedTicketId(tier.id);
                        setTicketQuantity(1);
                      }
                    }}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-purple-950/40 border-purple-500 shadow-md shadow-purple-950/40'
                        : isSoldOut
                        ? 'bg-slate-950/40 border-slate-800/50 opacity-60 cursor-not-allowed'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="text-xs font-bold text-white">{tier.name}</h4>
                        <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">{tier.description}</p>
                      </div>
                      <span className="text-xs font-extrabold text-purple-400">
                        {formatCurrency(tier.price, tier.currency)}
                      </span>
                    </div>

                    {/* Perks List */}
                    {tier.perks && tier.perks.length > 0 && (
                      <div className="mt-2.5 pt-2 border-t border-slate-800/60 flex flex-wrap gap-1.5">
                        {tier.perks.map((p, idx) => (
                          <span key={idx} className="text-[10px] px-2 py-0.5 rounded-md bg-slate-900 text-slate-300">
                            ✓ {p}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Remaining Stock Indicator */}
                    <div className="mt-2 text-[10px] flex items-center justify-between text-slate-400">
                      <span>Max {tier.max_per_order || 10} per order</span>
                      <span className={tier.remaining_quantity < 30 ? 'text-rose-400 font-semibold' : 'text-emerald-400'}>
                        {isSoldOut ? 'Sold Out' : `${tier.remaining_quantity} left`}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Quantity Selector Counter */}
            {selectedTier && selectedTier.remaining_quantity > 0 && (
              <div className="pt-2">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-slate-300">Quantity:</span>
                  <div className="flex items-center gap-3 bg-slate-950 border border-slate-800 rounded-xl p-1">
                    <button
                      onClick={() => handleQuantityChange(-1)}
                      className="p-1 rounded-lg hover:bg-slate-800 text-slate-300 transition-colors"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-6 text-center text-xs font-bold text-white font-mono">
                      {ticketQuantity}
                    </span>
                    <button
                      onClick={() => handleQuantityChange(1)}
                      className="p-1 rounded-lg hover:bg-slate-800 text-slate-300 transition-colors"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Subtotal Calculation */}
                <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/80 flex items-center justify-between text-xs mt-3">
                  <span className="text-slate-400">Total Price:</span>
                  <span className="text-base font-extrabold text-white">
                    {formatCurrency(totalPrice, currency)}
                  </span>
                </div>
              </div>
            )}

            {/* Checkout Action Button */}
            <button
              onClick={handleProceedToCheckout}
              disabled={!selectedTier || selectedTier.remaining_quantity <= 0}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs sm:text-sm shadow-xl shadow-purple-600/30 transition-all hover:scale-[1.01] flex items-center justify-center gap-2 disabled:opacity-50 disabled:pointer-events-none"
            >
              <Ticket className="w-4 h-4" />
              <span>{unitPrice === 0 ? 'Claim Free Ticket' : 'Proceed to Checkout'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="text-[10px] text-center text-slate-500 space-y-1">
              <p>🔒 100% Genuine Ticket Guarantee</p>
              <p>Supported: Telebirr, Chapa, CBE Birr & Credit Cards</p>
            </div>
          </div>
        </div>
      </div>

      {/* 3. RELATED EVENTS CAROUSEL */}
      {relatedEvents.length > 0 && (
        <div className="space-y-6 pt-12 border-t border-slate-800">
          <h2 className="text-2xl font-bold text-white tracking-tight">
            You Might Also Like
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedEvents.map(re => (
              <EventCard key={re.id} event={re} />
            ))}
          </div>
        </div>
      )}

      {/* Share Modal */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        eventTitle={event.title}
        eventUrl={window.location.href}
      />
    </div>
  );
};
