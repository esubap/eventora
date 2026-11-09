import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate, Link } from 'react-router-dom';
import { eventService } from '../services/eventService';
import { bookingService } from '../services/bookingService';
import type { Event, TicketType, PaymentGateway } from '../types';
import { formatCurrency, formatDate, formatTime } from '../lib/utils';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { 
  ShieldCheck, 
  Lock, 
  Ticket, 
  CreditCard, 
  Smartphone, 
  Building, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  Tag,
  AlertCircle
} from 'lucide-react';
import { Badge } from '../components/common/Badge';

export const CheckoutPage: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const toast = useToast();

  const [event, setEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  // Form Fields
  const [fullName, setFullName] = useState(user?.full_name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '+251911234567');
  const [selectedTicketTypeId, setSelectedTicketTypeId] = useState<string>(searchParams.get('ticketTypeId') || '');
  const [quantity, setQuantity] = useState<number>(parseInt(searchParams.get('qty') || '1', 10));

  // Payment
  const [paymentGateway, setPaymentGateway] = useState<PaymentGateway>('telebirr');
  const [telebirrPhone, setTelebirrPhone] = useState(user?.phone || '0911234567');
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);

  useEffect(() => {
    if (!eventId) return;

    eventService.getEventById(eventId).then(found => {
      if (found) {
        setEvent(found);
        if (!selectedTicketTypeId && found.ticket_types && found.ticket_types.length > 0) {
          setSelectedTicketTypeId(found.ticket_types[0].id);
        }
      }
      setIsLoading(false);
    });
  }, [eventId, selectedTicketTypeId]);

  useEffect(() => {
    if (user) {
      if (!fullName) setFullName(user.full_name);
      if (!email) setEmail(user.email);
      if (!phone && user.phone) setPhone(user.phone);
    }
  }, [user]);

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="w-12 h-12 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin mx-auto mb-4" />
        <p className="text-slate-400 text-sm">Preparing secure checkout session...</p>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <h2 className="text-xl font-bold text-white mb-2">Event Not Found</h2>
        <Link to="/events" className="text-purple-400 text-xs hover:underline">
          Return to Events
        </Link>
      </div>
    );
  }

  const selectedTier = event.ticket_types?.find(t => t.id === selectedTicketTypeId);
  const unitPrice = selectedTier ? selectedTier.price : 0;
  const subtotal = unitPrice * quantity;
  const discount = appliedPromo ? Math.round(subtotal * 0.1) : 0;
  const totalAmount = Math.max(0, subtotal - discount);
  const currency = selectedTier?.currency || 'ETB';
  const isFree = totalAmount === 0;

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (promoCode.trim().toUpperCase() === 'EVENTORA2026') {
      setAppliedPromo('EVENTORA2026');
      toast.success('Promo code EVENTORA2026 applied! 10% discount added.', 'Discount Applied');
    } else {
      toast.error('Invalid promo code. Try "EVENTORA2026"', 'Promo Code Error');
    }
  };

  const handleSubmitBooking = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName.trim() || !email.trim() || !email.includes('@')) {
      toast.error('Please enter a valid full name and email for ticket delivery.');
      return;
    }

    if (!selectedTier) {
      toast.error('Please select a valid ticket category.');
      return;
    }

    if (selectedTier.remaining_quantity < quantity) {
      toast.error(`Only ${selectedTier.remaining_quantity} ticket(s) remain.`);
      return;
    }

    setIsProcessing(true);
    toast.info('Validating inventory & processing payment gateway...', 'Processing Transaction');

    try {
      // Simulate real gateway latency for authenticy
      await new Promise(r => setTimeout(r, 1200));

      const booking = await bookingService.createBooking({
        eventId: event.id,
        userId: user?.id,
        customerName: fullName.trim(),
        customerEmail: email.trim().toLowerCase(),
        customerPhone: phone.trim(),
        ticketTypeId: selectedTier.id,
        quantity,
        paymentGateway: isFree ? 'cash' : paymentGateway,
        promoCode: appliedPromo || undefined
      });

      toast.success('Payment verified! Tickets generated.', 'Booking Confirmed');
      navigate(`/booking/success/${booking.id}`);
    } catch (err: any) {
      toast.error(err.message || 'Payment or booking could not be processed.', 'Booking Failed');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header Bar */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <Link
          to={`/events/${event.slug || event.id}`}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Event</span>
        </Link>

        <div className="flex items-center gap-2 text-xs text-emerald-400">
          <ShieldCheck className="w-4 h-4" />
          <span className="font-semibold">256-Bit SSL Encrypted Checkout</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT 2 COLS: Attendee Information & Payment Method Selection */}
        <div className="lg:col-span-2 space-y-6">
          
          <form onSubmit={handleSubmitBooking} className="space-y-6">
            
            {/* 1. Attendee Contact Information */}
            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="flex items-center gap-2 text-white">
                <div className="w-6 h-6 rounded-full bg-purple-600 flex items-center justify-center text-xs font-bold">
                  1
                </div>
                <h3 className="text-base font-bold">Ticket Delivery & Attendee Details</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                    Primary Attendee Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Abebe Kebede"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                    Email Address (For Instant Tickets) *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. abebe@gmail.com"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                    Mobile Phone Number (SMS Ticket Alerts)
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+251 91 123 4567"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>
            </div>

            {/* 2. Payment Gateway Selection (Skipped if Free Ticket) */}
            {!isFree && (
              <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
                <div className="flex items-center gap-2 text-white">
                  <div className="w-6 h-6 rounded-full bg-purple-600 flex items-center justify-center text-xs font-bold">
                    2
                  </div>
                  <h3 className="text-base font-bold">Select Secure Payment Gateway</h3>
                </div>

                <p className="text-xs text-slate-400">
                  Select your preferred local or international payment method. Real-time verification ensures tickets are delivered immediately upon payment confirmation.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  {/* Telebirr */}
                  <div
                    onClick={() => setPaymentGateway('telebirr')}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                      paymentGateway === 'telebirr'
                        ? 'bg-purple-950/40 border-purple-500 shadow-md shadow-purple-950/40'
                        : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <Smartphone className="w-5 h-5 text-sky-400" />
                      {paymentGateway === 'telebirr' && <CheckCircle2 className="w-4 h-4 text-purple-400" />}
                    </div>
                    <h4 className="text-xs font-bold text-white">Telebirr</h4>
                    <p className="text-[10px] text-slate-400 mt-0.5">Instant Mobile PIN / QR</p>
                  </div>

                  {/* Chapa */}
                  <div
                    onClick={() => setPaymentGateway('chapa')}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                      paymentGateway === 'chapa'
                        ? 'bg-purple-950/40 border-purple-500 shadow-md shadow-purple-950/40'
                        : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <Building className="w-5 h-5 text-emerald-400" />
                      {paymentGateway === 'chapa' && <CheckCircle2 className="w-4 h-4 text-purple-400" />}
                    </div>
                    <h4 className="text-xs font-bold text-white">Chapa</h4>
                    <p className="text-[10px] text-slate-400 mt-0.5">CBE, Awash & Local Banks</p>
                  </div>

                  {/* Stripe / Card */}
                  <div
                    onClick={() => setPaymentGateway('stripe')}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                      paymentGateway === 'stripe'
                        ? 'bg-purple-950/40 border-purple-500 shadow-md shadow-purple-950/40'
                        : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <CreditCard className="w-5 h-5 text-purple-400" />
                      {paymentGateway === 'stripe' && <CheckCircle2 className="w-4 h-4 text-purple-400" />}
                    </div>
                    <h4 className="text-xs font-bold text-white">Credit / Debit Card</h4>
                    <p className="text-[10px] text-slate-400 mt-0.5">Visa, Mastercard, Amex</p>
                  </div>
                </div>

                {/* Gateway Detail Sub-Box */}
                <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs space-y-3 mt-4">
                  {paymentGateway === 'telebirr' && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-white">Telebirr Mobile Account:</span>
                        <Badge variant="cyan" size="sm">Auto Verification Active</Badge>
                      </div>
                      <input
                        type="text"
                        value={telebirrPhone}
                        onChange={(e) => setTelebirrPhone(e.target.value)}
                        placeholder="09XXXXXXXX"
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                      />
                      <p className="text-[10px] text-slate-400">
                        A USSD prompt or QR confirmation will be sent to your Telebirr app.
                      </p>
                    </div>
                  )}

                  {paymentGateway === 'chapa' && (
                    <div className="space-y-1">
                      <p className="font-semibold text-white">Chapa Multi-Bank Processing</p>
                      <p className="text-[11px] text-slate-400">
                        Supports Commercial Bank of Ethiopia (CBE Birr), Awash Birr, Dashen Bank, and Telebirr via Chapa’s PCI-DSS Level 1 gateway.
                      </p>
                    </div>
                  )}

                  {paymentGateway === 'stripe' && (
                    <div className="space-y-2">
                      <span className="font-semibold text-white block">Card Information (Test Mode Enabled):</span>
                      <input
                        type="text"
                        readOnly
                        value={cardNumber}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 font-mono"
                      />
                      <p className="text-[10px] text-slate-400">
                        Simulated card gateway authorized with 3D Secure protocol.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Submit CTA */}
            <button
              type="submit"
              disabled={isProcessing}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-sm shadow-xl shadow-purple-600/30 transition-all hover:scale-[1.01] flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Lock className="w-4 h-4" />
              <span>
                {isProcessing
                  ? 'Verifying Payment & Issuing Tickets...'
                  : isFree
                  ? 'Complete Free Registration'
                  : `Pay ${formatCurrency(totalAmount, currency)} & Get Tickets`}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* RIGHT COL: Order Summary Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-6">
            <h3 className="text-base font-bold text-white pb-3 border-b border-slate-800">
              Order Summary
            </h3>

            {/* Event Snippet */}
            <div className="flex gap-3">
              <img
                src={event.cover_image}
                alt={event.title}
                className="w-16 h-16 rounded-xl object-cover border border-slate-800 flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <h4 className="text-xs font-bold text-white truncate">{event.title}</h4>
                <p className="text-[11px] text-purple-400 mt-0.5">{formatDate(event.start_date)}</p>
                <p className="text-[10px] text-slate-400 truncate">{event.venue_name || event.city}</p>
              </div>
            </div>

            {/* Selected Tier & Quantity */}
            {selectedTier && (
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5 text-xs">
                <div className="flex items-center justify-between font-bold text-white">
                  <span>{selectedTier.name} × {quantity}</span>
                  <span>{formatCurrency(subtotal, currency)}</span>
                </div>
                <div className="text-[10px] text-slate-400">
                  {formatCurrency(selectedTier.price, currency)} per ticket
                </div>
              </div>
            )}

            {/* Promo Code Input */}
            <div>
              <form onSubmit={handleApplyPromo} className="flex gap-2">
                <input
                  type="text"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  placeholder="Promo Code (EVENTORA2026)"
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white uppercase placeholder-slate-500 focus:outline-none focus:border-purple-500"
                />
                <button
                  type="submit"
                  className="px-3 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-white transition-colors"
                >
                  Apply
                </button>
              </form>
              {appliedPromo && (
                <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 font-semibold mt-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Promo code '{appliedPromo}' active (-10%)</span>
                </div>
              )}
            </div>

            {/* Financial Breakdown */}
            <div className="space-y-2 pt-3 border-t border-slate-800 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Subtotal</span>
                <span className="text-slate-200">{formatCurrency(subtotal, currency)}</span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span>Discount</span>
                  <span>-{formatCurrency(discount, currency)}</span>
                </div>
              )}

              <div className="flex justify-between text-slate-400">
                <span>Platform Booking Fee</span>
                <span className="text-emerald-400 font-semibold">FREE (ETB 0.00)</span>
              </div>

              <div className="pt-2 border-t border-slate-800 flex justify-between text-sm font-extrabold text-white">
                <span>Total Amount</span>
                <span className="text-base text-purple-400 font-mono">
                  {formatCurrency(totalAmount, currency)}
                </span>
              </div>
            </div>

            <div className="text-[10px] text-slate-500 text-center leading-relaxed">
              By confirming your booking, you agree to Eventora's Terms of Service and Event Cancellation Policy.
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
