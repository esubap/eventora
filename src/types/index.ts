// ==============================================================================
// EVENTORA TYPE DEFINITIONS
// ==============================================================================

export type UserRole = 'customer' | 'organizer' | 'admin';

export type UserStatus = 'active' | 'suspended';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  phone?: string;
  avatar_url?: string;
  role: UserRole;
  status: UserStatus;
  organization_name?: string;
  bio?: string;
  created_at: string;
  updated_at?: string;
}

export interface EventCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  image_url?: string;
  display_order?: number;
}

export type EventFormat = 'physical' | 'online' | 'hybrid';

export type EventStatus = 
  | 'draft' 
  | 'pending_approval' 
  | 'approved' 
  | 'published' 
  | 'rejected' 
  | 'cancelled';

export interface TicketType {
  id: string;
  event_id: string;
  name: string; // e.g. "Early Bird", "Regular", "VIP", "Free"
  price: number;
  currency: string; // e.g. "ETB", "USD"
  quantity: number;
  remaining_quantity: number;
  description?: string;
  perks?: string[];
  sales_start?: string;
  sales_end?: string;
  max_per_order?: number;
  is_active?: boolean;
}

export interface EventImage {
  id: string;
  event_id: string;
  image_url: string;
  caption?: string;
  display_order?: number;
}

export interface Event {
  id: string;
  organizer_id: string;
  organizer?: UserProfile;
  category_id?: string;
  category?: EventCategory;
  title: string;
  slug: string;
  short_description?: string;
  description: string;
  cover_image: string;
  gallery?: string[];
  event_type: EventFormat;
  online_url?: string;
  venue_name?: string;
  city?: string;
  address?: string;
  country: string;
  start_date: string; // YYYY-MM-DD
  start_time: string; // HH:mm
  end_date?: string;
  end_time?: string;
  capacity: number;
  status: EventStatus;
  rejection_reason?: string;
  featured: boolean;
  trending: boolean;
  sales_start_date?: string;
  sales_end_date?: string;
  terms_and_conditions?: string;
  ticket_types?: TicketType[];
  reviews_count?: number;
  average_rating?: number;
  created_at: string;
  updated_at?: string;
}

export type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'refunded';

export interface BookingItem {
  id: string;
  booking_id: string;
  ticket_type_id: string;
  ticket_type_name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

export interface Booking {
  id: string;
  booking_reference: string;
  user_id?: string;
  event_id: string;
  event?: Event;
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  total_tickets: number;
  subtotal_amount: number;
  discount_amount: number;
  fee_amount: number;
  total_amount: number;
  currency: string;
  status: BookingStatus;
  notes?: string;
  items?: BookingItem[];
  tickets?: Ticket[];
  payment?: Payment;
  created_at: string;
  updated_at?: string;
}

export type TicketStatus = 'valid' | 'checked_in' | 'cancelled' | 'refunded';

export interface Ticket {
  id: string;
  ticket_number: string;
  booking_id: string;
  event_id: string;
  event?: Event;
  ticket_type_id?: string;
  ticket_type?: TicketType;
  attendee_name: string;
  attendee_email?: string;
  qr_token: string;
  status: TicketStatus;
  checked_in_at?: string;
  created_at: string;
}

export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded';

export type PaymentGateway = 'telebirr' | 'chapa' | 'stripe' | 'cash' | 'test';

export interface Payment {
  id: string;
  booking_id: string;
  transaction_reference: string;
  payment_gateway: PaymentGateway;
  amount: number;
  currency: string;
  status: PaymentStatus;
  gateway_response?: Record<string, any>;
  payment_date?: string;
  created_at: string;
}

export interface CheckIn {
  id: string;
  ticket_id: string;
  event_id: string;
  scanned_by?: string;
  scanner_name?: string;
  check_in_time: string;
  device_info?: string;
  notes?: string;
}

export interface Review {
  id: string;
  event_id: string;
  user_id: string;
  user_name: string;
  user_avatar?: string;
  rating: number;
  comment: string;
  is_verified_attendee: boolean;
  created_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  is_read: boolean;
  link?: string;
  created_at: string;
}

export interface PlatformSetting {
  key: string;
  value: string;
  description?: string;
  updated_at?: string;
}

export interface FilterOptions {
  searchQuery?: string;
  category?: string;
  location?: string;
  dateFilter?: 'all' | 'today' | 'tomorrow' | 'this_weekend' | 'this_month';
  priceType?: 'all' | 'free' | 'paid';
  sortBy?: 'popular' | 'newest' | 'date_asc' | 'price_low' | 'price_high';
}
