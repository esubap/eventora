// ==============================================================================
// EVENT SERVICE
// Manages Event Listings, Filters, Search, CRUD, Categories & Reviews
// ==============================================================================

import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { storage } from '../lib/storage';
import type { Event, EventCategory, TicketType, FilterOptions, Review } from '../types';

export const eventService = {
  // 1. Get Categories
  async getCategories(): Promise<EventCategory[]> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('event_categories')
        .select('*')
        .order('display_order', { ascending: true });
      if (!error && data) return data;
    }
    return storage.getCategories();
  },

  // 2. Get Events with Filters & Sorting
  async getEvents(filters?: FilterOptions): Promise<Event[]> {
    let events: Event[] = [];

    if (isSupabaseConfigured && supabase) {
      let query = supabase
        .from('events')
        .select(`
          *,
          category:event_categories(*),
          organizer:profiles(*),
          ticket_types(*)
        `)
        .eq('status', 'published');

      if (filters?.category && filters.category !== 'all') {
        query = query.eq('category.slug', filters.category);
      }

      const { data, error } = await query;
      if (!error && data) {
        events = data as Event[];
      } else {
        events = storage.getEvents().filter(e => e.status === 'published');
      }
    } else {
      events = storage.getEvents().filter(e => e.status === 'published');
    }

    // Apply Client Filters
    if (filters) {
      if (filters.searchQuery) {
        const q = filters.searchQuery.toLowerCase();
        events = events.filter(e => 
          e.title.toLowerCase().includes(q) ||
          e.description.toLowerCase().includes(q) ||
          (e.city && e.city.toLowerCase().includes(q)) ||
          (e.venue_name && e.venue_name.toLowerCase().includes(q)) ||
          (e.category && e.category.name.toLowerCase().includes(q))
        );
      }

      if (filters.category && filters.category !== 'all') {
        events = events.filter(e => 
          e.category?.slug === filters.category || 
          e.category?.id === filters.category ||
          e.category?.name.toLowerCase() === filters.category.toLowerCase()
        );
      }

      if (filters.location && filters.location !== 'all') {
        const loc = filters.location.toLowerCase();
        events = events.filter(e => 
          (e.city && e.city.toLowerCase().includes(loc)) ||
          (e.venue_name && e.venue_name.toLowerCase().includes(loc))
        );
      }

      if (filters.priceType && filters.priceType !== 'all') {
        if (filters.priceType === 'free') {
          events = events.filter(e => 
            e.ticket_types?.some(t => t.price === 0)
          );
        } else if (filters.priceType === 'paid') {
          events = events.filter(e => 
            e.ticket_types?.some(t => t.price > 0)
          );
        }
      }

      // Sorting
      if (filters.sortBy) {
        switch (filters.sortBy) {
          case 'newest':
            events.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
            break;
          case 'date_asc':
            events.sort((a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime());
            break;
          case 'price_low':
            events.sort((a, b) => {
              const minA = Math.min(...(a.ticket_types?.map(t => t.price) || [0]));
              const minB = Math.min(...(b.ticket_types?.map(t => t.price) || [0]));
              return minA - minB;
            });
            break;
          case 'price_high':
            events.sort((a, b) => {
              const maxA = Math.max(...(a.ticket_types?.map(t => t.price) || [0]));
              const maxB = Math.max(...(b.ticket_types?.map(t => t.price) || [0]));
              return maxB - maxA;
            });
            break;
          case 'popular':
          default:
            events.sort((a, b) => (b.reviews_count || 0) - (a.reviews_count || 0));
            break;
        }
      }
    }

    return events;
  },

  // 3. Get Featured & Trending Events
  async getFeaturedEvents(): Promise<Event[]> {
    const events = await this.getEvents();
    return events.filter(e => e.featured);
  },

  async getTrendingEvents(): Promise<Event[]> {
    const events = await this.getEvents();
    return events.filter(e => e.trending);
  },

  // 4. Get Event By ID or Slug
  async getEventById(idOrSlug: string): Promise<Event | null> {
    if (isSupabaseConfigured && supabase) {
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(idOrSlug);
      const query = supabase
        .from('events')
        .select(`
          *,
          category:event_categories(*),
          organizer:profiles(*),
          ticket_types(*)
        `);

      const { data, error } = isUuid 
        ? await query.eq('id', idOrSlug).single()
        : await query.eq('slug', idOrSlug).single();

      if (!error && data) return data as Event;
    }

    return storage.getEventById(idOrSlug) || null;
  },

  // 5. Get Events Created by an Organizer
  async getOrganizerEvents(organizerId: string): Promise<Event[]> {
    const all = storage.getEvents();
    return all.filter(e => e.organizer_id === organizerId);
  },

  // 6. Create Event with Ticket Types
  async createEvent(
    eventData: Omit<Event, 'id' | 'created_at' | 'slug'>,
    ticketTypesData: Omit<TicketType, 'id' | 'event_id'>[]
  ): Promise<Event> {
    const eventId = `evt-${Date.now().toString(36)}`;
    const slug = eventData.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    const newTicketTypes: TicketType[] = ticketTypesData.map((t, idx) => ({
      ...t,
      id: `tt-${eventId}-${idx + 1}`,
      event_id: eventId,
      remaining_quantity: t.quantity,
      is_active: true
    }));

    const newEvent: Event = {
      ...eventData,
      id: eventId,
      slug,
      status: 'pending_approval', // Sent for admin review by default
      ticket_types: newTicketTypes,
      reviews_count: 0,
      average_rating: 0,
      created_at: new Date().toISOString()
    };

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('events')
        .insert({
          id: eventId,
          organizer_id: eventData.organizer_id,
          category_id: eventData.category_id,
          title: eventData.title,
          slug,
          short_description: eventData.short_description,
          description: eventData.description,
          cover_image: eventData.cover_image,
          event_type: eventData.event_type,
          online_url: eventData.online_url,
          venue_name: eventData.venue_name,
          city: eventData.city,
          address: eventData.address,
          country: eventData.country || 'Ethiopia',
          start_date: eventData.start_date,
          start_time: eventData.start_time,
          end_date: eventData.end_date,
          end_time: eventData.end_time,
          capacity: eventData.capacity,
          status: 'pending_approval'
        })
        .select()
        .single();

      if (!error && data) {
        // Insert ticket types
        await supabase.from('ticket_types').insert(
          newTicketTypes.map(t => ({
            ...t,
            event_id: data.id
          }))
        );
      }
    }

    storage.addEvent(newEvent, newTicketTypes);
    return newEvent;
  },

  // 7. Update Event
  async updateEvent(id: string, updates: Partial<Event>): Promise<Event | null> {
    if (isSupabaseConfigured && supabase) {
      await supabase.from('events').update(updates).eq('id', id);
    }
    return storage.updateEvent(id, updates);
  },

  // 8. Delete Event
  async deleteEvent(id: string): Promise<boolean> {
    if (isSupabaseConfigured && supabase) {
      await supabase.from('events').delete().eq('id', id);
    }
    return storage.deleteEvent(id);
  },

  // 9. Reviews
  async getReviews(eventId: string): Promise<Review[]> {
    return storage.getReviews(eventId);
  },

  async addReview(review: Omit<Review, 'id' | 'created_at'>): Promise<Review> {
    const newReview: Review = {
      ...review,
      id: `rev-${Date.now()}`,
      created_at: new Date().toISOString()
    };
    storage.addReview(newReview);
    return newReview;
  }
};
