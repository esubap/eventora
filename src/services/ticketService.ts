// ==============================================================================
// TICKET SERVICE & QR VERIFICATION ENGINE
// Secure QR code verification, duplicate check-in prevention, and attendee check-in audit
// ==============================================================================

import { storage } from '../lib/storage';
import { Ticket, CheckIn, UserProfile } from '../types';

export interface VerifyTicketResult {
  success: boolean;
  status: 'VALID' | 'ALREADY_USED' | 'INVALID' | 'UNAUTHORIZED' | 'REVOKED';
  message: string;
  ticket?: Ticket;
  checkIn?: CheckIn;
}

export const ticketService = {
  // 1. Get Tickets for a Customer
  async getUserTickets(userId: string): Promise<Ticket[]> {
    const userBookings = storage.getBookings().filter(b => b.user_id === userId);
    const bookingIds = new Set(userBookings.map(b => b.id));
    return storage.getTickets().filter(t => bookingIds.has(t.booking_id));
  },

  // 2. Get Tickets for an Event (For Organizers)
  async getEventTickets(eventId: string): Promise<Ticket[]> {
    return storage.getTickets().filter(t => t.event_id === eventId);
  },

  // 3. Secure Verification and Check-in by QR Token or Ticket Number
  async verifyAndCheckIn(
    qrTokenOrNumber: string,
    scannedBy: UserProfile,
    targetEventId?: string
  ): Promise<VerifyTicketResult> {
    const trimmedCode = qrTokenOrNumber.trim();
    const ticket = storage.getTicketByQrToken(trimmedCode);

    if (!ticket) {
      return {
        success: false,
        status: 'INVALID',
        message: 'No matching ticket found. The QR code or ticket number is invalid.'
      };
    }

    // If scanning for a specific event, verify the ticket belongs to this event
    if (targetEventId && ticket.event_id !== targetEventId) {
      return {
        success: false,
        status: 'INVALID',
        message: 'Ticket is for a different event! It cannot be checked in here.'
      };
    }

    // Role authorization check: Must be the organizer of this event or an admin
    const event = storage.getEventById(ticket.event_id);
    const isAuthorized = 
      scannedBy.role === 'admin' || 
      (event && event.organizer_id === scannedBy.id);

    if (!isAuthorized) {
      return {
        success: false,
        status: 'UNAUTHORIZED',
        message: 'You are not authorized to check in tickets for this event.'
      };
    }

    // Duplicate Check-in Guard
    if (ticket.status === 'checked_in') {
      const allCheckins = storage.getCheckIns();
      const existingCheckIn = allCheckins.find(c => c.ticket_id === ticket.id);

      return {
        success: false,
        status: 'ALREADY_USED',
        message: `⚠️ ALREADY USED! This ticket was previously checked in at ${
          existingCheckIn ? new Date(existingCheckIn.check_in_time).toLocaleTimeString() : 'an earlier time'
        }. Duplicate entry denied.`,
        ticket,
        checkIn: existingCheckIn
      };
    }

    if (ticket.status !== 'valid') {
      return {
        success: false,
        status: 'REVOKED',
        message: `Ticket is marked as ${ticket.status}. Check-in rejected.`,
        ticket
      };
    }

    // Perform Check-in
    const nowIso = new Date().toISOString();
    storage.updateTicket(ticket.id, {
      status: 'checked_in',
      checked_in_at: nowIso
    });

    const checkInRecord: CheckIn = {
      id: `chk-${Date.now().toString(36)}`,
      ticket_id: ticket.id,
      event_id: ticket.event_id,
      scanned_by: scannedBy.id,
      scanner_name: scannedBy.full_name,
      check_in_time: nowIso,
      device_info: 'Camera QR Scanner'
    };

    storage.addCheckIn(checkInRecord);

    return {
      success: true,
      status: 'VALID',
      message: `✅ Check-in Approved! Welcome, ${ticket.attendee_name}.`,
      ticket: { ...ticket, status: 'checked_in', checked_in_at: nowIso },
      checkIn: checkInRecord
    };
  }
};
