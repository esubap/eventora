import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { storage } from '../../lib/storage';
import { bookingService } from '../../services/bookingService';
import { ticketService } from '../../services/ticketService';
import { eventService } from '../../services/eventService';
import type { Booking, Ticket as TicketType, Event } from '../../types';
import { formatCurrency, formatDate, formatTime } from '../../lib/utils';
import { TicketCard } from '../../components/tickets/TicketCard';
import { EventCard } from '../../components/events/EventCard';
import { Modal } from '../../components/common/Modal';
import { useToast } from '../../context/ToastContext';
import { 
  Ticket, 
  Calendar, 
  Heart, 
  CreditCard, 
  User, 
  Settings, 
  Download, 
  QrCode, 
  ExternalLink,
  CheckCircle2,
  Lock,
  Bell
} from 'lucide-react';
import { Badge } from '../../components/common/Badge';

export const CustomerDashboard: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const toast = useToast();

  const [activeTab, setActiveTab] = useState<'tickets' | 'favorites' | 'payments' | 'profile'>('tickets');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [tickets, setTickets] = useState<TicketType[]>([]);
  const [favoriteEvents, setFavoriteEvents] = useState<Event[]>([]);

  // Selected ticket for modal viewing
  const [selectedTicket, setSelectedTicket] = useState<TicketType | null>(null);

  // Profile Edit form state
  const [fullName, setFullName] = useState(user?.full_name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  useEffect(() => {
    if (!user) return;

    const loadData = async () => {
      const userBookings = await bookingService.getUserBookings(user.id);
      setBookings(userBookings);

      const userTickets = await ticketService.getUserTickets(user.id);
      setTickets(userTickets);

      const favIds = storage.getFavorites();
      const allEvents = storage.getEvents();
      setFavoriteEvents(allEvents.filter(e => favIds.includes(e.id)));
    };

    loadData();

    const handleUpdate = () => loadData();
    window.addEventListener('eventora:bookings-updated', handleUpdate);
    window.addEventListener('eventora:favorites-updated', handleUpdate);
    return () => {
      window.removeEventListener('eventora:bookings-updated', handleUpdate);
      window.removeEventListener('eventora:favorites-updated', handleUpdate);
    };
  }, [user]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingProfile(true);
    try {
      await updateProfile({
        full_name: fullName.trim(),
        phone: phone.trim(),
        bio: bio.trim()
      });
    } catch (err) {
      // Error handled in AuthContext
    } finally {
      setIsSavingProfile(false);
    }
  };

  const upcomingBookings = bookings.filter(b => {
    if (!b.event?.start_date) return true;
    return new Date(b.event.start_date) >= new Date();
  });

  const pastBookings = bookings.filter(b => {
    if (!b.event?.start_date) return false;
    return new Date(b.event.start_date) < new Date();
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* 1. WELCOME PROFILE BANNER */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4 text-center sm:text-left">
          <img
            src={user?.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user?.full_name || 'User')}`}
            alt={user?.full_name}
            className="w-16 h-16 rounded-2xl object-cover border-2 border-purple-500/40 shadow-lg"
          />
          <div>
            <div className="flex items-center gap-2 justify-center sm:justify-start">
              <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                {user?.full_name}
              </h1>
              <Badge variant="purple" size="sm">Attendee</Badge>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">{user?.email}</p>
          </div>
        </div>

        {/* Quick KPI Counters */}
        <div className="flex items-center gap-4 sm:gap-6 text-center">
          <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800/80 min-w-[90px]">
            <span className="text-xs text-slate-400 block font-medium">My Tickets</span>
            <span className="text-xl font-extrabold text-purple-400 font-mono mt-0.5 block">
              {tickets.length}
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800/80 min-w-[90px]">
            <span className="text-xs text-slate-400 block font-medium">Bookings</span>
            <span className="text-xl font-extrabold text-sky-400 font-mono mt-0.5 block">
              {bookings.length}
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800/80 min-w-[90px]">
            <span className="text-xs text-slate-400 block font-medium">Saved</span>
            <span className="text-xl font-extrabold text-rose-400 font-mono mt-0.5 block">
              {favoriteEvents.length}
            </span>
          </div>
        </div>
      </div>

      {/* 2. TAB NAVIGATION */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveTab('tickets')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'tickets'
              ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Ticket className="w-4 h-4" />
          <span>My Tickets & Passes ({tickets.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('favorites')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'favorites'
              ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Heart className="w-4 h-4" />
          <span>Saved Events ({favoriteEvents.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('payments')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'payments'
              ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          <span>Payment History</span>
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'profile'
              ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <User className="w-4 h-4" />
          <span>Profile Settings</span>
        </button>
      </div>

      {/* 3. TAB CONTENT */}

      {/* TAB 1: TICKETS */}
      {activeTab === 'tickets' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white">Active Digital Tickets</h2>
            <span className="text-xs text-slate-400">Click any ticket to view QR and download PDF</span>
          </div>

          {tickets.length === 0 ? (
            <div className="p-16 rounded-3xl bg-slate-900/40 border border-slate-800 text-center max-w-md mx-auto">
              <Ticket className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <h3 className="text-base font-bold text-white mb-1">No Tickets Booked Yet</h3>
              <p className="text-xs text-slate-400 mb-6">
                You haven't purchased or registered for any events yet. Check out the latest experiences!
              </p>
              <button
                onClick={() => (window.location.href = '/events')}
                className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-purple-600 hover:bg-purple-500 text-white transition-colors"
              >
                Browse Events
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {tickets.map(tkt => (
                <div
                  key={tkt.id}
                  onClick={() => setSelectedTicket(tkt)}
                  className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-purple-500/50 cursor-pointer transition-all hover:shadow-xl flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant={tkt.status === 'checked_in' ? 'warning' : 'success'} size="sm">
                        {tkt.status === 'checked_in' ? 'CHECKED IN' : 'VALID ENTRY'}
                      </Badge>
                      <span className="font-mono text-[11px] font-bold text-purple-400">
                        {tkt.ticket_number}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-white leading-snug line-clamp-2">
                      {tkt.event?.title || 'Live Event'}
                    </h3>

                    <div className="mt-3 space-y-1.5 text-xs text-slate-400">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-purple-400" />
                        <span>{formatDate(tkt.event?.start_date || '')} • {formatTime(tkt.event?.start_time || '')}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Ticket className="w-3.5 h-3.5 text-sky-400" />
                        <span>Tier: <strong className="text-slate-200">{tkt.ticket_type?.name || 'General Admission'}</strong></span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                    <span className="text-slate-400 font-mono text-[11px]">Attendee: {tkt.attendee_name}</span>
                    <span className="font-semibold text-purple-400 flex items-center gap-1">
                      <QrCode className="w-3.5 h-3.5" />
                      <span>View QR & Download PDF</span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: SAVED FAVORITES */}
      {activeTab === 'favorites' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white">Your Bookmarked Events</h2>
            <span className="text-xs text-slate-400">{favoriteEvents.length} Saved</span>
          </div>

          {favoriteEvents.length === 0 ? (
            <div className="p-16 rounded-3xl bg-slate-900/40 border border-slate-800 text-center max-w-md mx-auto">
              <Heart className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <h3 className="text-base font-bold text-white mb-1">No Saved Events</h3>
              <p className="text-xs text-slate-400">
                Click the heart icon on any event to bookmark it for quick access later.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {favoriteEvents.map(e => (
                <EventCard key={e.id} event={e} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: PAYMENT HISTORY */}
      {activeTab === 'payments' && (
        <div className="space-y-6">
          <h2 className="text-lg font-bold text-white">Payment Records & Invoices</h2>

          <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950/80 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="p-4">Booking Ref</th>
                    <th className="p-4">Event</th>
                    <th className="p-4">Date</th>
                    <th className="p-4">Gateway</th>
                    <th className="p-4">Amount</th>
                    <th className="p-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {bookings.map(b => (
                    <tr key={b.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="p-4 font-mono font-bold text-purple-300">{b.booking_reference}</td>
                      <td className="p-4 font-semibold text-white max-w-xs truncate">{b.event?.title || 'Event'}</td>
                      <td className="p-4 text-slate-400">{formatDate(b.created_at)}</td>
                      <td className="p-4 capitalize text-sky-400">{b.payment?.payment_gateway || 'Telebirr'}</td>
                      <td className="p-4 font-bold text-white">{formatCurrency(b.total_amount, b.currency)}</td>
                      <td className="p-4">
                        <Badge variant="success" size="sm">COMPLETED</Badge>
                      </td>
                    </tr>
                  ))}
                  {bookings.length === 0 && (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-slate-500">
                        No transactions found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: PROFILE SETTINGS */}
      {activeTab === 'profile' && (
        <div className="max-w-xl mx-auto space-y-6">
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-6">
            <h2 className="text-lg font-bold text-white pb-3 border-b border-slate-800">
              Personal Information & Settings
            </h2>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  disabled
                  value={user?.email || ''}
                  className="w-full bg-slate-950/50 border border-slate-800/60 rounded-xl px-3.5 py-2 text-xs text-slate-500 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Bio / Notes
                </label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={3}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={isSavingProfile}
                  className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-purple-600 hover:bg-purple-500 text-white transition-colors disabled:opacity-50"
                >
                  {isSavingProfile ? 'Saving...' : 'Save Profile Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Ticket Details & Download Modal */}
      {selectedTicket && (
        <Modal
          isOpen={!!selectedTicket}
          onClose={() => setSelectedTicket(null)}
          title="Digital Ticket Details"
          maxWidth="2xl"
        >
          <div className="space-y-4">
            <TicketCard ticket={selectedTicket} />
          </div>
        </Modal>
      )}

    </div>
  );
};
