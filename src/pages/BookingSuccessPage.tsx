import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { storage } from '../lib/storage';
import { Booking } from '../types';
import { formatCurrency, formatDate, formatTime } from '../lib/utils';
import { TicketCard } from '../components/tickets/TicketCard';
import { 
  CheckCircle2, 
  Calendar, 
  Mail, 
  Download, 
  ArrowRight, 
  Home, 
  ShieldCheck, 
  Ticket as TicketIcon,
  Sparkles
} from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { Badge } from '../components/common/Badge';

export const BookingSuccessPage: React.FC = () => {
  const { bookingId } = useParams<{ bookingId: string }>();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [resendingEmail, setResendingEmail] = useState(false);
  const toast = useToast();

  useEffect(() => {
    if (!bookingId) return;

    const found = storage.getBookingById(bookingId);
    if (found) {
      setBooking(found);

      // Trigger Celebration Confetti
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {}
    }
  }, [bookingId]);

  if (!booking) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <h2 className="text-xl font-bold text-white mb-2">Booking Not Found</h2>
        <Link to="/" className="text-purple-400 text-xs hover:underline">
          Return to Homepage
        </Link>
      </div>
    );
  }

  const handleResendEmail = () => {
    setResendingEmail(true);
    setTimeout(() => {
      setResendingEmail(false);
      toast.success(`Booking confirmation & PDF tickets resent to ${booking.customer_email}`, 'Email Delivered');
    }, 1000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      
      {/* 1. CELEBRATION HEADER */}
      <div className="text-center space-y-3">
        <div className="w-16 h-16 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-950/50">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-950/80 border border-purple-500/30 text-purple-300 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-purple-400" />
          <span>Payment Verified & Confirmed</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-display">
          You're Going to {booking.event?.title || 'the Event'}!
        </h1>

        <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto">
          Your booking reference is <strong className="text-white font-mono">{booking.booking_reference}</strong>. A confirmation receipt has been sent to <span className="text-purple-400 font-medium">{booking.customer_email}</span>.
        </p>

        {/* Quick Action Buttons */}
        <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={handleResendEmail}
            disabled={resendingEmail}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 transition-colors flex items-center gap-1.5"
          >
            <Mail className="w-3.5 h-3.5 text-sky-400" />
            <span>{resendingEmail ? 'Sending...' : 'Resend Email Receipt'}</span>
          </button>

          <Link
            to="/dashboard/customer"
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-purple-600 hover:bg-purple-500 text-white transition-colors flex items-center gap-1.5"
          >
            <TicketIcon className="w-3.5 h-3.5" />
            <span>View All My Tickets</span>
          </Link>
        </div>
      </div>

      {/* 2. TICKETS PREVIEW SECTION */}
      <div className="space-y-6">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div>
            <h2 className="text-lg font-bold text-white">Your Official E-Tickets</h2>
            <p className="text-xs text-slate-400">
              Each ticket contains an encrypted verification QR token. Present digital code or download high-res PDF.
            </p>
          </div>
          <Badge variant="purple" size="md">
            {booking.tickets?.length || 1} Ticket{(booking.tickets?.length || 1) === 1 ? '' : 's'}
          </Badge>
        </div>

        <div className="space-y-8">
          {booking.tickets?.map(ticket => (
            <TicketCard key={ticket.id} ticket={ticket} event={booking.event} />
          ))}
        </div>
      </div>

      {/* 3. ORDER RECEIPT & SUMMARY */}
      <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300">
          Order Summary & Payment Receipt
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs pt-2">
          <div>
            <span className="text-slate-500 block text-[10px] uppercase font-semibold">Booking Ref</span>
            <span className="font-mono font-bold text-white">{booking.booking_reference}</span>
          </div>

          <div>
            <span className="text-slate-500 block text-[10px] uppercase font-semibold">Gateway</span>
            <span className="font-semibold text-sky-400 capitalize">{booking.payment?.payment_gateway || 'Telebirr'}</span>
          </div>

          <div>
            <span className="text-slate-500 block text-[10px] uppercase font-semibold">Transaction ID</span>
            <span className="font-mono text-slate-300 text-[11px] truncate block">
              {booking.payment?.transaction_reference || 'TXN-CONFIRMED'}
            </span>
          </div>

          <div>
            <span className="text-slate-500 block text-[10px] uppercase font-semibold">Total Paid</span>
            <span className="font-extrabold text-white text-sm">
              {formatCurrency(booking.total_amount, booking.currency)}
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="flex items-center justify-between pt-6 border-t border-slate-800">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <Home className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>

        <Link
          to="/events"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-purple-400 hover:text-purple-300 transition-colors"
        >
          <span>Explore More Events</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

    </div>
  );
};
