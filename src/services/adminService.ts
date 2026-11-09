// ==============================================================================
// ADMINISTRATOR SERVICE
// Platform Analytics, User Management, Event Moderation, and System Settings
// ==============================================================================

import { storage } from '../lib/storage';
import type { UserProfile, Event, Booking, Payment, PlatformSetting } from '../types';

export interface PlatformStats {
  totalUsers: number;
  totalCustomers: number;
  totalOrganizers: number;
  totalEvents: number;
  pendingEvents: number;
  approvedEvents: number;
  rejectedEvents: number;
  totalBookings: number;
  totalTicketsSold: number;
  totalGrossRevenue: number;
  totalPlatformRevenue: number;
  currency: string;
}

export const adminService = {
  // 1. Calculate Comprehensive Platform Statistics
  getPlatformStats(): PlatformStats {
    const users = storage.getUsers();
    const events = storage.getEvents();
    const bookings = storage.getBookings();
    const settings = storage.getSettings();

    const commissionSetting = settings.find(s => s.key === 'platform_fee_percent');
    const commissionRate = commissionSetting ? parseFloat(commissionSetting.value) / 100 : 0.05;

    const customers = users.filter(u => u.role === 'customer');
    const organizers = users.filter(u => u.role === 'organizer');

    const pending = events.filter(e => e.status === 'pending_approval');
    const approved = events.filter(e => e.status === 'published' || e.status === 'approved');
    const rejected = events.filter(e => e.status === 'rejected');

    const confirmedBookings = bookings.filter(b => b.status === 'confirmed');
    const totalTicketsSold = confirmedBookings.reduce((sum, b) => sum + b.total_tickets, 0);
    const totalGrossRevenue = confirmedBookings.reduce((sum, b) => sum + b.total_amount, 0);
    const totalPlatformRevenue = Math.round(totalGrossRevenue * commissionRate);

    return {
      totalUsers: users.length,
      totalCustomers: customers.length,
      totalOrganizers: organizers.length,
      totalEvents: events.length,
      pendingEvents: pending.length,
      approvedEvents: approved.length,
      rejectedEvents: rejected.length,
      totalBookings: confirmedBookings.length,
      totalTicketsSold,
      totalGrossRevenue,
      totalPlatformRevenue,
      currency: 'ETB'
    };
  },

  // 2. User Management
  getAllUsers(): UserProfile[] {
    return storage.getUsers();
  },

  toggleUserStatus(userId: string): UserProfile | null {
    const user = storage.getUserById(userId);
    if (!user) return null;
    const newStatus = user.status === 'active' ? 'suspended' : 'active';
    return storage.updateUser(userId, { status: newStatus });
  },

  // 3. Event Moderation
  getPendingEvents(): Event[] {
    return storage.getEvents().filter(e => e.status === 'pending_approval');
  },

  approveEvent(eventId: string): Event | null {
    const updated = storage.updateEvent(eventId, { 
      status: 'published',
      rejection_reason: undefined 
    });

    if (updated) {
      storage.addNotification({
        id: `notif-app-${Date.now()}`,
        user_id: updated.organizer_id,
        title: 'Event Approved! 🎉',
        message: `Your event "${updated.title}" has been reviewed, approved, and is now live on EVENTORA.`,
        type: 'success',
        is_read: false,
        link: `/events/${updated.slug}`,
        created_at: new Date().toISOString()
      });
    }

    return updated;
  },

  rejectEvent(eventId: string, reason: string): Event | null {
    const updated = storage.updateEvent(eventId, { 
      status: 'rejected',
      rejection_reason: reason 
    });

    if (updated) {
      storage.addNotification({
        id: `notif-rej-${Date.now()}`,
        user_id: updated.organizer_id,
        title: 'Event Needs Revision',
        message: `Your event submission "${updated.title}" was rejected: ${reason}`,
        type: 'warning',
        is_read: false,
        link: `/dashboard/organizer`,
        created_at: new Date().toISOString()
      });
    }

    return updated;
  },

  toggleFeatureEvent(eventId: string): Event | null {
    const event = storage.getEventById(eventId);
    if (!event) return null;
    return storage.updateEvent(eventId, { featured: !event.featured });
  },

  // 4. Financial & Payment Ledger
  getAllPayments(): { payment: Payment; booking: Booking }[] {
    const bookings = storage.getBookings();
    const list: { payment: Payment; booking: Booking }[] = [];
    for (const b of bookings) {
      if (b.payment) {
        list.push({ payment: b.payment, booking: b });
      }
    }
    return list;
  },

  // 5. System Settings
  getSettings(): PlatformSetting[] {
    return storage.getSettings();
  },

  updateSetting(key: string, value: string): void {
    storage.updateSetting(key, value);
  }
};
