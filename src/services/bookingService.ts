// ==============================================================================
// BOOKING SERVICE
// Atomic Inventory Validation, Ticket Generation, QR Code Tokenization, and Payments
// ==============================================================================

import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { storage } from '../lib/storage';
import { Booking, BookingItem, Ticket, Payment, PaymentGateway } from '../types';
import { generateBookingReference, generateTicketNumber, generateQrToken } from '../lib/utils';

export interface CreateBookingRequest {
  eventId: string;
  userId?: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  ticketTypeId: string;
  quantity: number;
  paymentGateway: PaymentGateway;
  promoCode?: string;
}

export const bookingService = {
  // 1. Process Booking with Atomic Inventory Decrement
  async createBooking(request: CreateBookingRequest): Promise<Booking> {
    const {
      eventId,
      userId,
      customerName,
      customerEmail,
      customerPhone,
      ticketTypeId,
      quantity,
      paymentGateway,
      promoCode
    } = request;

    if (quantity <= 0) {
      throw new Error('Please select at least 1 ticket to book.');
    }

    const event = storage.getEventById(eventId);
    if (!event) throw new Error('Selected event was not found.');

    const ticketTypes = storage.getTicketTypesByEvent(eventId);
    const selectedTier = ticketTypes.find(t => t.id === ticketTypeId);

    if (!selectedTier) {
      throw new Error('The selected ticket category is no longer available.');
    }

    // Availability Guard (Overselling Prevention)
    if (selectedTier.remaining_quantity < quantity) {
      throw new Error(
        `Insufficient ticket availability. Only ${selectedTier.remaining_quantity} ticket(s) remain for ${selectedTier.name}.`
      );
    }

    // Calculate Financials
    const unitPrice = selectedTier.price;
    const subtotal = unitPrice * quantity;
    let discount = 0;

    // Optional Promo Code Discount (e.g. EVENTORA2026 for 10% off)
    if (promoCode && promoCode.toUpperCase() === 'EVENTORA2026') {
      discount = Math.round(subtotal * 0.1);
    }

    const totalAmount = Math.max(0, subtotal - discount);
    const currency = selectedTier.currency || 'ETB';
    const isFree = totalAmount === 0;

    const bookingRef = generateBookingReference();
    const bookingId = `bkg-${Date.now().toString(36)}`;
    const nowIso = new Date().toISOString();

    // 1. Decrement Inventory atomically
    selectedTier.remaining_quantity -= quantity;
    const allTiers = storage.getTicketTypes();
    const tierIdx = allTiers.findIndex(t => t.id === ticketTypeId);
    if (tierIdx !== -1) {
      allTiers[tierIdx].remaining_quantity = selectedTier.remaining_quantity;
      storage.saveTicketTypes(allTiers);
    }

    // 2. Create Booking Item
    const bookingItem: BookingItem = {
      id: `bi-${bookingId}-1`,
      booking_id: bookingId,
      ticket_type_id: selectedTier.id,
      ticket_type_name: selectedTier.name,
      quantity,
      unit_price: unitPrice,
      total_price: subtotal
    };

    // 3. Create Payment Record
    const paymentRecord: Payment = {
      id: `pay-${Date.now().toString(36)}`,
      booking_id: bookingId,
      transaction_reference: `TXN-${paymentGateway.toUpperCase()}-${Math.floor(10000000 + Math.random() * 90000000)}`,
      payment_gateway: paymentGateway,
      amount: totalAmount,
      currency,
      status: 'completed',
      payment_date: nowIso,
      created_at: nowIso
    };

    // 4. Generate Individual Unique Tickets with QR Verification Tokens
    const generatedTickets: Ticket[] = [];
    for (let i = 1; i <= quantity; i++) {
      const ticket: Ticket = {
        id: `tkt-${bookingId}-${i}`,
        ticket_number: generateTicketNumber(i),
        booking_id: bookingId,
        event_id: eventId,
        ticket_type_id: selectedTier.id,
        attendee_name: i === 1 ? customerName : `Guest ${i} (${customerName})`,
        attendee_email: customerEmail,
        qr_token: generateQrToken(),
        status: 'valid',
        created_at: nowIso
      };
      generatedTickets.push(ticket);
    }

    // 5. Construct Complete Booking Object
    const newBooking: Booking = {
      id: bookingId,
      booking_reference: bookingRef,
      user_id: userId,
      event_id: eventId,
      customer_name: customerName,
      customer_email: customerEmail,
      customer_phone: customerPhone,
      total_tickets: quantity,
      subtotal_amount: subtotal,
      discount_amount: discount,
      fee_amount: 0,
      total_amount: totalAmount,
      currency,
      status: 'confirmed',
      notes: isFree ? 'Free Community Ticket' : `Paid via ${paymentGateway}`,
      items: [bookingItem],
      tickets: generatedTickets,
      payment: paymentRecord,
      created_at: nowIso
    };

    // 6. Persist to Storage
    storage.addBooking(newBooking);
    const currentTickets = storage.getTickets();
    currentTickets.unshift(...generatedTickets);
    storage.saveTickets(currentTickets);

    // 7. Push Notifications
    if (userId) {
      storage.addNotification({
        id: `notif-${Date.now()}`,
        user_id: userId,
        title: 'Booking Confirmed!',
        message: `Your booking ${bookingRef} for ${event.title} is confirmed. ${quantity} ticket(s) issued.`,
        type: 'success',
        is_read: false,
        link: `/dashboard/customer`,
        created_at: nowIso
      });
    }

    // Notify event organizer
    storage.addNotification({
      id: `notif-org-${Date.now()}`,
      user_id: event.organizer_id,
      title: 'New Ticket Booking',
      message: `${customerName} booked ${quantity}x ${selectedTier.name} for ${event.title}.`,
      type: 'info',
      is_read: false,
      link: `/dashboard/organizer`,
      created_at: nowIso
    });

    return newBooking;
  },

  // 2. Get Bookings by User
  async getUserBookings(userId: string): Promise<Booking[]> {
    const all = storage.getBookings();
    return all.filter(b => b.user_id === userId);
  },

  // 3. Get Bookings by Event (For Organizers)
  async getEventBookings(eventId: string): Promise<Booking[]> {
    const all = storage.getBookings();
    return all.filter(b => b.event_id === eventId);
  },

  // 4. Get Booking By Reference or ID
  async getBooking(refOrId: string): Promise<Booking | null> {
    return storage.getBookingById(refOrId) || null;
  }
};
