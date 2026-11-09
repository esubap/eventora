// ==============================================================================
// RESILIENT REACTIVE STORAGE ENGINE FOR EVENTORA
// Provides persistent localStorage with initial mock seeding & reactive synchronization
// ==============================================================================

import type { 
  UserProfile, 
  EventCategory, 
  Event, 
  TicketType, 
  Booking, 
  Ticket, 
  Payment, 
  CheckIn, 
  Review, 
  Notification,
  PlatformSetting 
} from '../types';

import {
  INITIAL_CATEGORIES,
  INITIAL_USERS,
  INITIAL_TICKETS_TYPES,
  INITIAL_EVENTS,
  INITIAL_BOOKINGS,
  INITIAL_TICKETS,
  INITIAL_REVIEWS,
  INITIAL_NOTIFICATIONS,
  INITIAL_SETTINGS
} from './mockData';

const STORAGE_KEYS = {
  USERS: 'eventora_users_v1',
  CURRENT_USER: 'eventora_session_user_v1',
  CATEGORIES: 'eventora_categories_v1',
  EVENTS: 'eventora_events_v1',
  TICKET_TYPES: 'eventora_ticket_types_v1',
  BOOKINGS: 'eventora_bookings_v1',
  TICKETS: 'eventora_tickets_v1',
  PAYMENTS: 'eventora_payments_v1',
  CHECK_INS: 'eventora_checkins_v1',
  REVIEWS: 'eventora_reviews_v1',
  NOTIFICATIONS: 'eventora_notifications_v1',
  SETTINGS: 'eventora_settings_v1',
  FAVORITES: 'eventora_favorites_v1',
};

// Initialize Storage if empty
function initializeStorage() {
  if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(INITIAL_USERS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.CATEGORIES)) {
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(INITIAL_CATEGORIES));
  }
  if (!localStorage.getItem(STORAGE_KEYS.TICKET_TYPES)) {
    localStorage.setItem(STORAGE_KEYS.TICKET_TYPES, JSON.stringify(INITIAL_TICKETS_TYPES));
  }
  if (!localStorage.getItem(STORAGE_KEYS.EVENTS)) {
    localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(INITIAL_EVENTS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.BOOKINGS)) {
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(INITIAL_BOOKINGS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.TICKETS)) {
    localStorage.setItem(STORAGE_KEYS.TICKETS, JSON.stringify(INITIAL_TICKETS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.REVIEWS)) {
    localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(INITIAL_REVIEWS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS)) {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(INITIAL_NOTIFICATIONS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.SETTINGS)) {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(INITIAL_SETTINGS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.FAVORITES)) {
    localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(['evt-tech-summit-2026']));
  }
}

initializeStorage();

// Storage helper functions
export const storage = {
  // USERS
  getUsers(): UserProfile[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.USERS);
      return data ? JSON.parse(data) : INITIAL_USERS;
    } catch {
      return INITIAL_USERS;
    }
  },
  saveUsers(users: UserProfile[]) {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    window.dispatchEvent(new CustomEvent('eventora:users-updated'));
  },
  getUserById(id: string): UserProfile | undefined {
    return this.getUsers().find(u => u.id === id);
  },
  getUserByEmail(email: string): UserProfile | undefined {
    return this.getUsers().find(u => u.email.toLowerCase() === email.toLowerCase());
  },
  addUser(user: UserProfile) {
    const users = this.getUsers();
    users.push(user);
    this.saveUsers(users);
  },
  updateUser(id: string, updates: Partial<UserProfile>): UserProfile | null {
    const users = this.getUsers();
    const index = users.findIndex(u => u.id === id);
    if (index === -1) return null;
    users[index] = { ...users[index], ...updates, updated_at: new Date().toISOString() };
    this.saveUsers(users);

    const currentUser = this.getCurrentUser();
    if (currentUser && currentUser.id === id) {
      this.setCurrentUser(users[index]);
    }
    return users[index];
  },

  // CURRENT SESSION USER
  getCurrentUser(): UserProfile | null {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },
  setCurrentUser(user: UserProfile | null) {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    }
    window.dispatchEvent(new CustomEvent('eventora:auth-changed'));
  },

  // CATEGORIES
  getCategories(): EventCategory[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
      return data ? JSON.parse(data) : INITIAL_CATEGORIES;
    } catch {
      return INITIAL_CATEGORIES;
    }
  },
  saveCategories(categories: EventCategory[]) {
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
    window.dispatchEvent(new CustomEvent('eventora:categories-updated'));
  },

  // TICKET TYPES
  getTicketTypes(): TicketType[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.TICKET_TYPES);
      return data ? JSON.parse(data) : INITIAL_TICKETS_TYPES;
    } catch {
      return INITIAL_TICKETS_TYPES;
    }
  },
  saveTicketTypes(types: TicketType[]) {
    localStorage.setItem(STORAGE_KEYS.TICKET_TYPES, JSON.stringify(types));
    window.dispatchEvent(new CustomEvent('eventora:tickets-updated'));
  },
  getTicketTypesByEvent(eventId: string): TicketType[] {
    return this.getTicketTypes().filter(t => t.event_id === eventId);
  },

  // EVENTS
  getEvents(): Event[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.EVENTS);
      const events: Event[] = data ? JSON.parse(data) : INITIAL_EVENTS;
      const allTicketTypes = this.getTicketTypes();
      const allCategories = this.getCategories();
      const allUsers = this.getUsers();

      return events.map(e => ({
        ...e,
        category: allCategories.find(c => c.id === e.category_id),
        organizer: allUsers.find(u => u.id === e.organizer_id) || e.organizer,
        ticket_types: allTicketTypes.filter(t => t.event_id === e.id)
      }));
    } catch {
      return INITIAL_EVENTS;
    }
  },
  saveEvents(events: Event[]) {
    localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(events));
    window.dispatchEvent(new CustomEvent('eventora:events-updated'));
  },
  getEventById(id: string): Event | undefined {
    return this.getEvents().find(e => e.id === id || e.slug === id);
  },
  addEvent(event: Event, ticketTypes: TicketType[] = []) {
    const events = this.getEvents();
    events.unshift(event);
    this.saveEvents(events);

    if (ticketTypes.length > 0) {
      const allTypes = this.getTicketTypes();
      allTypes.push(...ticketTypes);
      this.saveTicketTypes(allTypes);
    }
  },
  updateEvent(id: string, updates: Partial<Event>): Event | null {
    const events = this.getEvents();
    const index = events.findIndex(e => e.id === id);
    if (index === -1) return null;
    events[index] = { ...events[index], ...updates, updated_at: new Date().toISOString() };
    this.saveEvents(events);
    return events[index];
  },
  deleteEvent(id: string): boolean {
    const events = this.getEvents();
    const filtered = events.filter(e => e.id !== id);
    if (filtered.length === events.length) return false;
    this.saveEvents(filtered);
    return true;
  },

  // BOOKINGS
  getBookings(): Booking[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.BOOKINGS);
      const bookings: Booking[] = data ? JSON.parse(data) : INITIAL_BOOKINGS;
      const events = this.getEvents();
      const tickets = this.getTickets();

      return bookings.map(b => ({
        ...b,
        event: events.find(e => e.id === b.event_id),
        tickets: tickets.filter(t => t.booking_id === b.id)
      }));
    } catch {
      return INITIAL_BOOKINGS;
    }
  },
  saveBookings(bookings: Booking[]) {
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));
    window.dispatchEvent(new CustomEvent('eventora:bookings-updated'));
  },
  getBookingById(id: string): Booking | undefined {
    return this.getBookings().find(b => b.id === id || b.booking_reference === id);
  },
  addBooking(booking: Booking) {
    const bookings = this.getBookings();
    bookings.unshift(booking);
    this.saveBookings(bookings);
  },

  // TICKETS
  getTickets(): Ticket[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.TICKETS);
      const tickets: Ticket[] = data ? JSON.parse(data) : INITIAL_TICKETS;
      const events = this.getEvents();
      const allTicketTypes = this.getTicketTypes();

      return tickets.map(t => ({
        ...t,
        event: events.find(e => e.id === t.event_id),
        ticket_type: allTicketTypes.find(tt => tt.id === t.ticket_type_id)
      }));
    } catch {
      return INITIAL_TICKETS;
    }
  },
  saveTickets(tickets: Ticket[]) {
    localStorage.setItem(STORAGE_KEYS.TICKETS, JSON.stringify(tickets));
    window.dispatchEvent(new CustomEvent('eventora:tickets-updated'));
  },
  getTicketByQrToken(qrToken: string): Ticket | undefined {
    return this.getTickets().find(t => t.qr_token === qrToken || t.ticket_number === qrToken);
  },
  updateTicket(id: string, updates: Partial<Ticket>): Ticket | null {
    const tickets = this.getTickets();
    const index = tickets.findIndex(t => t.id === id);
    if (index === -1) return null;
    tickets[index] = { ...tickets[index], ...updates };
    this.saveTickets(tickets);
    return tickets[index];
  },

  // CHECK INS
  getCheckIns(): CheckIn[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CHECK_INS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },
  addCheckIn(checkIn: CheckIn) {
    const list = this.getCheckIns();
    list.unshift(checkIn);
    localStorage.setItem(STORAGE_KEYS.CHECK_INS, JSON.stringify(list));
    window.dispatchEvent(new CustomEvent('eventora:checkin-recorded'));
  },

  // REVIEWS
  getReviews(eventId?: string): Review[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.REVIEWS);
      const reviews: Review[] = data ? JSON.parse(data) : INITIAL_REVIEWS;
      return eventId ? reviews.filter(r => r.event_id === eventId) : reviews;
    } catch {
      return INITIAL_REVIEWS;
    }
  },
  addReview(review: Review) {
    const list = this.getReviews();
    list.unshift(review);
    localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(list));
    window.dispatchEvent(new CustomEvent('eventora:reviews-updated'));
  },

  // FAVORITES
  getFavorites(): string[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.FAVORITES);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },
  toggleFavorite(eventId: string): boolean {
    const favs = this.getFavorites();
    const idx = favs.indexOf(eventId);
    let isFav = false;
    if (idx === -1) {
      favs.push(eventId);
      isFav = true;
    } else {
      favs.splice(idx, 1);
      isFav = false;
    }
    localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favs));
    window.dispatchEvent(new CustomEvent('eventora:favorites-updated'));
    return isFav;
  },

  // NOTIFICATIONS
  getNotifications(userId: string): Notification[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
      const list: Notification[] = data ? JSON.parse(data) : INITIAL_NOTIFICATIONS;
      return list.filter(n => n.user_id === userId);
    } catch {
      return INITIAL_NOTIFICATIONS;
    }
  },
  addNotification(notification: Notification) {
    const list = this.getNotifications('');
    list.unshift(notification);
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(list));
    window.dispatchEvent(new CustomEvent('eventora:notifs-updated'));
  },
  markNotificationRead(id: string) {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
      const list: Notification[] = data ? JSON.parse(data) : [];
      const item = list.find(n => n.id === id);
      if (item) item.is_read = true;
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(list));
      window.dispatchEvent(new CustomEvent('eventora:notifs-updated'));
    } catch {}
  },

  // SETTINGS
  getSettings(): PlatformSetting[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      return data ? JSON.parse(data) : INITIAL_SETTINGS;
    } catch {
      return INITIAL_SETTINGS;
    }
  },
  updateSetting(key: string, value: string) {
    const settings = this.getSettings();
    const item = settings.find(s => s.key === key);
    if (item) {
      item.value = value;
      item.updated_at = new Date().toISOString();
    } else {
      settings.push({ key, value, updated_at: new Date().toISOString() });
    }
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    window.dispatchEvent(new CustomEvent('eventora:settings-updated'));
  }
};
