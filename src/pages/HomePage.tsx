import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search, 
  MapPin, 
  Calendar, 
  Sparkles, 
  ArrowRight, 
  TrendingUp, 
  ShieldCheck, 
  QrCode, 
  CreditCard, 
  Zap, 
  Users, 
  Star, 
  CheckCircle2, 
  Music, 
  Laptop, 
  Briefcase, 
  GraduationCap, 
  Trophy, 
  Theater, 
  Compass,
  ChevronRight
} from 'lucide-react';
import { eventService } from '../services/eventService';
import type { Event, EventCategory } from '../types';
import { EventCard } from '../components/events/EventCard';
import { Badge } from '../components/common/Badge';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();

  const [categories, setCategories] = useState<EventCategory[]>([]);
  const [featuredEvents, setFeaturedEvents] = useState<Event[]>([]);
  const [trendingEvents, setTrendingEvents] = useState<Event[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [activeCategoryTab, setActiveCategoryTab] = useState<string>('all');

  // Hero search form state
  const [heroSearch, setHeroSearch] = useState('');
  const [heroLocation, setHeroLocation] = useState('all');
  const [heroCategory, setHeroCategory] = useState('all');

  useEffect(() => {
    const loadData = async () => {
      const cats = await eventService.getCategories();
      setCategories(cats);

      const featured = await eventService.getFeaturedEvents();
      setFeaturedEvents(featured);

      const trending = await eventService.getTrendingEvents();
      setTrendingEvents(trending);

      const all = await eventService.getEvents();
      setUpcomingEvents(all);
    };

    loadData();

    const handleEventUpdate = () => loadData();
    window.addEventListener('eventora:events-updated', handleEventUpdate);
    return () => window.removeEventListener('eventora:events-updated', handleEventUpdate);
  }, []);

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (heroSearch.trim()) params.set('search', heroSearch.trim());
    if (heroLocation !== 'all') params.set('location', heroLocation);
    if (heroCategory !== 'all') params.set('category', heroCategory);

    navigate(`/events?${params.toString()}`);
  };

  const filteredUpcoming = activeCategoryTab === 'all'
    ? upcomingEvents
    : upcomingEvents.filter(e => e.category?.slug === activeCategoryTab || e.category_id === activeCategoryTab);

  const getCategoryIcon = (iconName?: string) => {
    switch (iconName) {
      case 'Music': return <Music className="w-5 h-5" />;
      case 'Laptop': return <Laptop className="w-5 h-5" />;
      case 'Briefcase': return <Briefcase className="w-5 h-5" />;
      case 'GraduationCap': return <GraduationCap className="w-5 h-5" />;
      case 'Trophy': return <Trophy className="w-5 h-5" />;
      case 'Theater': return <Theater className="w-5 h-5" />;
      default: return <Compass className="w-5 h-5" />;
    }
  };

  return (
    <div className="flex flex-col gap-24 pb-16">
      
      {/* 1. HERO SECTION */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-32 overflow-hidden">
        {/* Glow Background Orbs */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-600/15 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] bg-sky-500/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          
          {/* Eyebrow Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-950/70 border border-purple-500/30 text-purple-300 text-xs font-semibold mb-6 shadow-glow-purple backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>The Premier Live Experience & Ticketing Platform</span>
          </div>

          {/* Hero Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.1] max-w-4xl mx-auto font-display">
            Unlock Unforgettable <br className="hidden sm:inline" />
            <span className="text-gradient-purple">Events & Instant Tickets</span>
          </h1>

          <p className="mt-6 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            From iconic concerts and stadium games to groundbreaking tech summits and intimate masterclasses. Secure your spot in seconds with tamper-proof digital QR tickets.
          </p>

          {/* Interactive Search Bar Box */}
          <div className="mt-10 max-w-4xl mx-auto">
            <form
              onSubmit={handleHeroSearch}
              className="p-3 sm:p-4 rounded-3xl bg-slate-900/90 border border-slate-700/80 shadow-2xl backdrop-blur-2xl grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-3 text-left"
            >
              {/* Event Name */}
              <div className="px-3 py-2 rounded-2xl bg-slate-950/60 border border-slate-800/80 focus-within:border-purple-500 transition-colors">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
                  Search Event
                </span>
                <div className="flex items-center gap-2">
                  <Search className="w-4 h-4 text-purple-400 flex-shrink-0" />
                  <input
                    type="text"
                    value={heroSearch}
                    onChange={(e) => setHeroSearch(e.target.value)}
                    placeholder="Concert, Hackathon, Expo..."
                    className="w-full bg-transparent text-xs text-white placeholder-slate-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Location */}
              <div className="px-3 py-2 rounded-2xl bg-slate-950/60 border border-slate-800/80 focus-within:border-purple-500 transition-colors">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
                  Location
                </span>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-sky-400 flex-shrink-0" />
                  <select
                    value={heroLocation}
                    onChange={(e) => setHeroLocation(e.target.value)}
                    className="w-full bg-transparent text-xs text-slate-200 focus:outline-none appearance-none cursor-pointer"
                  >
                    <option value="all" className="bg-slate-900">All Locations</option>
                    <option value="Addis Ababa" className="bg-slate-900">Addis Ababa</option>
                    <option value="Millennium Hall" className="bg-slate-900">Millennium Hall</option>
                    <option value="Entoto" className="bg-slate-900">Entoto Park</option>
                    <option value="Online" className="bg-slate-900">Online Stream</option>
                  </select>
                </div>
              </div>

              {/* Category */}
              <div className="px-3 py-2 rounded-2xl bg-slate-950/60 border border-slate-800/80 focus-within:border-purple-500 transition-colors">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
                  Category
                </span>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <select
                    value={heroCategory}
                    onChange={(e) => setHeroCategory(e.target.value)}
                    className="w-full bg-transparent text-xs text-slate-200 focus:outline-none appearance-none cursor-pointer"
                  >
                    <option value="all" className="bg-slate-900">All Categories</option>
                    {categories.map(c => (
                      <option key={c.id} value={c.slug} className="bg-slate-900">
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                className="h-full min-h-[46px] rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold text-xs sm:text-sm shadow-lg shadow-purple-600/30 transition-all flex items-center justify-center gap-2 hover:scale-[1.02]"
              >
                <span>Find Events</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>

          {/* Quick Metrics */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Instant Digital Delivery</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-purple-400" />
              <span>Anti-Scalp QR Verification</span>
            </div>
            <div className="flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-sky-400" />
              <span>Telebirr, Chapa & Card Ready</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. POPULAR CATEGORIES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex items-center justify-between mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-purple-400 block mb-1">
              Browse by Interest
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Explore Popular Categories
            </h2>
          </div>

          <Link
            to="/events"
            className="text-xs font-semibold text-purple-400 hover:text-purple-300 flex items-center gap-1 transition-colors"
          >
            <span>View All</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {categories.slice(0, 8).map(cat => (
            <Link
              key={cat.id}
              to={`/events?category=${cat.slug}`}
              className="group relative p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-purple-500/40 transition-all duration-300 hover:shadow-xl hover:shadow-purple-950/20 flex flex-col justify-between overflow-hidden"
            >
              <div className="w-10 h-10 rounded-xl bg-purple-950/60 border border-purple-500/30 text-purple-400 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-purple-600 group-hover:text-white transition-all">
                {getCategoryIcon(cat.icon)}
              </div>

              <div>
                <h3 className="text-sm font-bold text-white group-hover:text-purple-300 transition-colors">
                  {cat.name}
                </h3>
                <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">
                  {cat.description}
                </p>
              </div>

              <div className="mt-3 flex items-center text-[10px] font-semibold text-purple-400 group-hover:translate-x-1 transition-transform">
                <span>Browse Category →</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. FEATURED EVENTS */}
      {featuredEvents.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="flex items-center justify-between mb-8">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-purple-400 block mb-1">
                Hand-Picked Highlights
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Featured Experiences
              </h2>
            </div>

            <Link
              to="/events"
              className="text-xs font-semibold text-purple-400 hover:text-purple-300 flex items-center gap-1 transition-colors"
            >
              <span>See All Events</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredEvents.map(event => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </section>
      )}

      {/* 4. TRENDING EVENTS */}
      {trendingEvents.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="flex items-center gap-2 mb-8">
            <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-rose-400 block mb-0.5">
                Selling Out Fast
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Trending Right Now
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trendingEvents.map(event => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </section>
      )}

      {/* 5. UPCOMING EVENTS WITH CATEGORY TABS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-purple-400 block mb-1">
              Curated Calendar
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Upcoming Events
            </h2>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            <button
              onClick={() => setActiveCategoryTab('all')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                activeCategoryTab === 'all'
                  ? 'bg-purple-600 text-white'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              All
            </button>
            {categories.slice(0, 5).map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategoryTab(cat.slug)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                  activeCategoryTab === cat.slug
                    ? 'bg-purple-600 text-white'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUpcoming.slice(0, 6).map(event => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </section>

      {/* 6. HOW IT WORKS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-purple-400 block mb-1">
            Frictionless Booking
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            How Eventora Works
          </h2>
          <p className="text-sm text-slate-400 mt-2">
            Experience the simplest, safest way to discover events and secure genuine passes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Step 1 */}
          <div className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800 text-center relative group hover:border-purple-500/40 transition-colors">
            <div className="w-14 h-14 rounded-2xl bg-purple-950/80 border border-purple-500/30 text-purple-400 flex items-center justify-center mx-auto mb-6 text-xl font-bold">
              1
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Discover & Choose</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Explore thousands of verified music festivals, conferences, sports, and culture galas with date and price filtering.
            </p>
          </div>

          {/* Step 2 */}
          <div className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800 text-center relative group hover:border-sky-500/40 transition-colors">
            <div className="w-14 h-14 rounded-2xl bg-sky-950/80 border border-sky-500/30 text-sky-400 flex items-center justify-center mx-auto mb-6 text-xl font-bold">
              2
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Seamless Payment</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Pay effortlessly with Telebirr, Chapa, CBE Birr, or international Visa and Mastercard with 256-bit bank encryption.
            </p>
          </div>

          {/* Step 3 */}
          <div className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800 text-center relative group hover:border-emerald-500/40 transition-colors">
            <div className="w-14 h-14 rounded-2xl bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto mb-6 text-xl font-bold">
              3
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Instant Digital Entry</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Receive your personalized QR ticket instantly. Download high-res PDF or scan from your phone screen at the venue gates.
            </p>
          </div>
        </div>
      </section>

      {/* 7. ORGANIZER REGISTRATION CTA BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="relative rounded-3xl bg-gradient-to-r from-purple-900/90 via-indigo-900/90 to-slate-900 p-8 sm:p-14 border border-purple-500/40 overflow-hidden shadow-2xl">
          {/* Ambient Lighting */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-300 block mb-2">
              For Event Creators & Companies
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              Host Your Next Event on Eventora
            </h2>
            <p className="text-sm text-purple-200 mt-3 leading-relaxed">
              Gain full control over ticket tiers, real-time revenue analytics, attendee lists, automated email confirmations, and mobile camera QR check-in gates.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                to="/register?role=organizer"
                className="px-6 py-3 rounded-xl text-xs sm:text-sm font-bold bg-white text-slate-950 hover:bg-slate-100 shadow-xl transition-all hover:scale-[1.02] flex items-center gap-2"
              >
                <span>Register as Organizer</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                to="/about"
                className="px-6 py-3 rounded-xl text-xs sm:text-sm font-semibold bg-purple-950/60 text-purple-200 border border-purple-500/30 hover:bg-purple-900/60 transition-colors"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 8. CUSTOMER TESTIMONIALS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-purple-400 block mb-1">
            Loved By Thousands
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            What Attendees Are Saying
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Testimonial 1 */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-1 text-amber-400 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <p className="text-xs text-slate-300 leading-relaxed italic">
                "Eventora made booking tickets for the Addis Tech Summit so effortless. I paid via Telebirr in literally 30 seconds and the QR ticket was immediately ready on my phone."
              </p>
            </div>
            <div className="mt-6 flex items-center gap-3 pt-4 border-t border-slate-800">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"
                alt="Abebe K."
                className="w-9 h-9 rounded-full object-cover border border-purple-500/30"
              />
              <div>
                <h4 className="text-xs font-bold text-white">Abebe Kebede</h4>
                <span className="text-[10px] text-slate-400">Software Engineer, Addis Ababa</span>
              </div>
            </div>
          </div>

          {/* Testimonial 2 */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-1 text-amber-400 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <p className="text-xs text-slate-300 leading-relaxed italic">
                "As an event producer, the QR check-in camera tool transformed our gate operations. 1,500 people entered smoothly without a single duplicate ticket scam!"
              </p>
            </div>
            <div className="mt-6 flex items-center gap-3 pt-4 border-t border-slate-800">
              <img
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=100&q=80"
                alt="Selamawit T."
                className="w-9 h-9 rounded-full object-cover border border-purple-500/30"
              />
              <div>
                <h4 className="text-xs font-bold text-white">Selamawit Tadesse</h4>
                <span className="text-[10px] text-slate-400">Festival Producer, Selam Events</span>
              </div>
            </div>
          </div>

          {/* Testimonial 3 */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-1 text-amber-400 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <p className="text-xs text-slate-300 leading-relaxed italic">
                "Cleanest UI I have used for event bookings in East Africa. The downloadable PDF ticket looks very professional with genuine security hashes."
              </p>
            </div>
            <div className="mt-6 flex items-center gap-3 pt-4 border-t border-slate-800">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80"
                alt="Dawit M."
                className="w-9 h-9 rounded-full object-cover border border-purple-500/30"
              />
              <div>
                <h4 className="text-xs font-bold text-white">Dawit Mengistu</h4>
                <span className="text-[10px] text-slate-400">Startup Founder & Runner</span>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
