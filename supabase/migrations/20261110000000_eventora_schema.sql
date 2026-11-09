-- ==============================================================================
-- EVENTORA COMPLETE DATABASE SCHEMA & MIGRATIONS
-- Master PostgreSQL Script for Supabase (Tables, Triggers, RLS, Procedures & Seed)
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. CUSTOM TYPES & ENUMS
DO $$ BEGIN
    CREATE TYPE user_role_type AS ENUM ('customer', 'organizer', 'admin');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE event_status_type AS ENUM ('draft', 'pending_approval', 'approved', 'published', 'rejected', 'cancelled');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE event_format_type AS ENUM ('physical', 'online', 'hybrid');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE booking_status_type AS ENUM ('pending', 'confirmed', 'cancelled', 'refunded');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE payment_status_type AS ENUM ('pending', 'completed', 'failed', 'refunded');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE ticket_status_type AS ENUM ('valid', 'checked_in', 'cancelled', 'refunded');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 3. PROFILES TABLE (Linked with auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    phone TEXT,
    avatar_url TEXT,
    role user_role_type NOT NULL DEFAULT 'customer',
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'suspended')),
    organization_name TEXT,
    bio TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. USER ROLES AUDIT TABLE
CREATE TABLE IF NOT EXISTS public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    role user_role_type NOT NULL,
    granted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    granted_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    UNIQUE (user_id, role)
);

-- 5. EVENT CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS public.event_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    icon TEXT,
    image_url TEXT,
    display_order INT DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. EVENTS TABLE
CREATE TABLE IF NOT EXISTS public.events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organizer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    category_id UUID REFERENCES public.event_categories(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    slug TEXT UNIQUE,
    short_description TEXT,
    description TEXT NOT NULL,
    cover_image TEXT NOT NULL,
    event_type event_format_type NOT NULL DEFAULT 'physical',
    online_url TEXT,
    venue_name TEXT,
    city TEXT,
    address TEXT,
    country TEXT NOT NULL DEFAULT 'Ethiopia',
    start_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_date DATE,
    end_time TIME,
    capacity INT NOT NULL DEFAULT 100 CHECK (capacity > 0),
    status event_status_type NOT NULL DEFAULT 'draft',
    rejection_reason TEXT,
    featured BOOLEAN NOT NULL DEFAULT FALSE,
    trending BOOLEAN NOT NULL DEFAULT FALSE,
    sales_start_date TIMESTAMPTZ,
    sales_end_date TIMESTAMPTZ,
    terms_and_conditions TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. EVENT IMAGES (Gallery)
CREATE TABLE IF NOT EXISTS public.event_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    caption TEXT,
    display_order INT DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. TICKET TYPES TABLE
CREATE TABLE IF NOT EXISTS public.ticket_types (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    price NUMERIC(12, 2) NOT NULL DEFAULT 0.00 CHECK (price >= 0),
    currency TEXT NOT NULL DEFAULT 'ETB',
    quantity INT NOT NULL CHECK (quantity >= 0),
    remaining_quantity INT NOT NULL CHECK (remaining_quantity >= 0),
    description TEXT,
    perks JSONB DEFAULT '[]'::jsonb,
    sales_start TIMESTAMPTZ,
    sales_end TIMESTAMPTZ,
    max_per_order INT NOT NULL DEFAULT 10,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9. BOOKINGS TABLE
CREATE TABLE IF NOT EXISTS public.bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_reference TEXT NOT NULL UNIQUE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    customer_phone TEXT,
    total_tickets INT NOT NULL DEFAULT 1 CHECK (total_tickets > 0),
    subtotal_amount NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    discount_amount NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    fee_amount NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    total_amount NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    currency TEXT NOT NULL DEFAULT 'ETB',
    status booking_status_type NOT NULL DEFAULT 'pending',
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 10. BOOKING ITEMS TABLE
CREATE TABLE IF NOT EXISTS public.booking_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
    ticket_type_id UUID REFERENCES public.ticket_types(id) ON DELETE SET NULL,
    ticket_type_name TEXT NOT NULL,
    quantity INT NOT NULL CHECK (quantity > 0),
    unit_price NUMERIC(12, 2) NOT NULL,
    total_price NUMERIC(12, 2) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 11. TICKETS TABLE
CREATE TABLE IF NOT EXISTS public.tickets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ticket_number TEXT NOT NULL UNIQUE,
    booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
    event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
    ticket_type_id UUID REFERENCES public.ticket_types(id) ON DELETE SET NULL,
    attendee_name TEXT NOT NULL,
    attendee_email TEXT,
    qr_token TEXT NOT NULL UNIQUE,
    status ticket_status_type NOT NULL DEFAULT 'valid',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 12. PAYMENTS TABLE
CREATE TABLE IF NOT EXISTS public.payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
    transaction_reference TEXT NOT NULL UNIQUE,
    payment_gateway TEXT NOT NULL, -- 'telebirr', 'chapa', 'stripe', 'cash', 'test'
    amount NUMERIC(12, 2) NOT NULL,
    currency TEXT NOT NULL DEFAULT 'ETB',
    status payment_status_type NOT NULL DEFAULT 'pending',
    gateway_response JSONB,
    payment_date TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 13. CHECK-INS AUDIT TABLE
CREATE TABLE IF NOT EXISTS public.check_ins (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ticket_id UUID NOT NULL REFERENCES public.tickets(id) ON DELETE CASCADE,
    event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
    scanned_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    check_in_time TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    device_info TEXT,
    notes TEXT
);

-- 14. FAVORITES TABLE
CREATE TABLE IF NOT EXISTS public.favorites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (user_id, event_id)
);

-- 15. NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT NOT NULL DEFAULT 'info',
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    link TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 16. REVIEWS TABLE
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    is_verified_attendee BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 17. PLATFORM SETTINGS TABLE
CREATE TABLE IF NOT EXISTS public.platform_settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    description TEXT,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- INDEXES FOR MAXIMUM PERFORMANCE
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_events_status ON public.events(status);
CREATE INDEX IF NOT EXISTS idx_events_category ON public.events(category_id);
CREATE INDEX IF NOT EXISTS idx_events_organizer ON public.events(organizer_id);
CREATE INDEX IF NOT EXISTS idx_events_start_date ON public.events(start_date);
CREATE INDEX IF NOT EXISTS idx_ticket_types_event ON public.ticket_types(event_id);
CREATE INDEX IF NOT EXISTS idx_bookings_user ON public.bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_event ON public.bookings(event_id);
CREATE INDEX IF NOT EXISTS idx_bookings_reference ON public.bookings(booking_reference);
CREATE INDEX IF NOT EXISTS idx_tickets_booking ON public.tickets(booking_id);
CREATE INDEX IF NOT EXISTS idx_tickets_qr ON public.tickets(qr_token);
CREATE INDEX IF NOT EXISTS idx_check_ins_ticket ON public.check_ins(ticket_id);
CREATE INDEX IF NOT EXISTS idx_favorites_user ON public.favorites(user_id);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ticket_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.booking_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.check_ins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.platform_settings ENABLE ROW LEVEL SECURITY;

-- Helper security functions
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role = 'admin'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.is_organizer()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND (role = 'organizer' OR role = 'admin')
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Profiles Policies
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Admins have full access to profiles" ON public.profiles;
CREATE POLICY "Admins have full access to profiles" ON public.profiles
    FOR ALL USING (public.is_admin());

-- Event Categories Policies
DROP POLICY IF EXISTS "Categories viewable by everyone" ON public.event_categories;
CREATE POLICY "Categories viewable by everyone" ON public.event_categories
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins manage categories" ON public.event_categories;
CREATE POLICY "Admins manage categories" ON public.event_categories
    FOR ALL USING (public.is_admin());

-- Events Policies
DROP POLICY IF EXISTS "Public can view published events" ON public.events;
CREATE POLICY "Public can view published events" ON public.events
    FOR SELECT USING (status = 'published' OR auth.uid() = organizer_id OR public.is_admin());

DROP POLICY IF EXISTS "Organizers can create events" ON public.events;
CREATE POLICY "Organizers can create events" ON public.events
    FOR INSERT WITH CHECK (auth.uid() = organizer_id AND public.is_organizer());

DROP POLICY IF EXISTS "Organizers can update own events" ON public.events;
CREATE POLICY "Organizers can update own events" ON public.events
    FOR UPDATE USING (auth.uid() = organizer_id OR public.is_admin());

DROP POLICY IF EXISTS "Organizers can delete own draft events" ON public.events;
CREATE POLICY "Organizers can delete own draft events" ON public.events
    FOR DELETE USING ((auth.uid() = organizer_id AND status = 'draft') OR public.is_admin());

-- Ticket Types Policies
DROP POLICY IF EXISTS "Ticket types viewable by everyone" ON public.ticket_types;
CREATE POLICY "Ticket types viewable by everyone" ON public.ticket_types
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Organizers manage ticket types" ON public.ticket_types;
CREATE POLICY "Organizers manage ticket types" ON public.ticket_types
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.events e
            WHERE e.id = event_id AND (e.organizer_id = auth.uid() OR public.is_admin())
        )
    );

-- Bookings Policies
DROP POLICY IF EXISTS "Customers view own bookings" ON public.bookings;
CREATE POLICY "Customers view own bookings" ON public.bookings
    FOR SELECT USING (
        auth.uid() = user_id OR
        EXISTS (
            SELECT 1 FROM public.events e
            WHERE e.id = event_id AND (e.organizer_id = auth.uid() OR public.is_admin())
        )
    );

DROP POLICY IF EXISTS "Customers can create bookings" ON public.bookings;
CREATE POLICY "Customers can create bookings" ON public.bookings
    FOR INSERT WITH CHECK (true);

-- Tickets Policies
DROP POLICY IF EXISTS "Users view own tickets" ON public.tickets;
CREATE POLICY "Users view own tickets" ON public.tickets
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.bookings b
            WHERE b.id = booking_id AND (b.user_id = auth.uid() OR public.is_admin())
        ) OR
        EXISTS (
            SELECT 1 FROM public.events e
            WHERE e.id = event_id AND (e.organizer_id = auth.uid() OR public.is_admin())
        )
    );

-- Check-ins Policies
DROP POLICY IF EXISTS "Organizers can insert check-ins" ON public.check_ins;
CREATE POLICY "Organizers can insert check-ins" ON public.check_ins
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.events e
            WHERE e.id = event_id AND (e.organizer_id = auth.uid() OR public.is_admin())
        )
    );

DROP POLICY IF EXISTS "Organizers and Admins can view check-ins" ON public.check_ins;
CREATE POLICY "Organizers and Admins can view check-ins" ON public.check_ins
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.events e
            WHERE e.id = event_id AND (e.organizer_id = auth.uid() OR public.is_admin())
        )
    );

-- Reviews Policies
DROP POLICY IF EXISTS "Reviews viewable by everyone" ON public.reviews;
CREATE POLICY "Reviews viewable by everyone" ON public.reviews
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can create reviews" ON public.reviews;
CREATE POLICY "Users can create reviews" ON public.reviews
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Favorites Policies
DROP POLICY IF EXISTS "Users manage own favorites" ON public.favorites;
CREATE POLICY "Users manage own favorites" ON public.favorites
    FOR ALL USING (auth.uid() = user_id);

-- Notifications Policies
DROP POLICY IF EXISTS "Users view own notifications" ON public.notifications;
CREATE POLICY "Users view own notifications" ON public.notifications
    FOR ALL USING (auth.uid() = user_id);

-- Platform Settings Policies
DROP POLICY IF EXISTS "Settings viewable by everyone" ON public.platform_settings;
CREATE POLICY "Settings viewable by everyone" ON public.platform_settings
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Only admins modify settings" ON public.platform_settings;
CREATE POLICY "Only admins modify settings" ON public.platform_settings
    FOR ALL USING (public.is_admin());

-- ==============================================================================
-- AUTOMATED PROFILE CREATION ON USER SIGNUP (TRIGGER)
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name, email, phone, role, status, organization_name)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
        NEW.email,
        NEW.raw_user_meta_data->>'phone',
        COALESCE((NEW.raw_user_meta_data->>'role')::user_role_type, 'customer'::user_role_type),
        'active',
        NEW.raw_user_meta_data->>'organization_name'
    )
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ==============================================================================
-- ATOMIC BOOKING PROCEDURE (PREVENTS OVERSELLING & RACE CONDITIONS)
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.process_event_booking(
    p_booking_reference TEXT,
    p_user_id UUID,
    p_event_id UUID,
    p_customer_name TEXT,
    p_customer_email TEXT,
    p_customer_phone TEXT,
    p_ticket_type_id UUID,
    p_quantity INT,
    p_payment_gateway TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_ticket_type RECORD;
    v_event RECORD;
    v_booking_id UUID;
    v_total_price NUMERIC(12, 2);
    v_ticket_idx INT;
    v_ticket_id UUID;
    v_ticket_number TEXT;
    v_qr_token TEXT;
    v_result JSONB;
BEGIN
    -- Lock ticket row for update to eliminate race conditions
    SELECT * INTO v_ticket_type
    FROM public.ticket_types
    WHERE id = p_ticket_type_id AND event_id = p_event_id
    FOR UPDATE;

    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'error', 'Ticket type does not exist.');
    END IF;

    SELECT * INTO v_event FROM public.events WHERE id = p_event_id;
    IF v_event.status != 'published' THEN
        RETURN jsonb_build_object('success', false, 'error', 'Event is not accepting bookings.');
    END IF;

    IF v_ticket_type.remaining_quantity < p_quantity THEN
        RETURN jsonb_build_object('success', false, 'error', 'Only ' || v_ticket_type.remaining_quantity || ' ticket(s) remain.');
    END IF;

    v_total_price := v_ticket_type.price * p_quantity;

    -- Decrement stock atomically
    UPDATE public.ticket_types
    SET remaining_quantity = remaining_quantity - p_quantity,
        updated_at = NOW()
    WHERE id = p_ticket_type_id;

    -- Create Booking
    INSERT INTO public.bookings (
        booking_reference,
        user_id,
        event_id,
        customer_name,
        customer_email,
        customer_phone,
        total_tickets,
        subtotal_amount,
        discount_amount,
        fee_amount,
        total_amount,
        currency,
        status
    ) VALUES (
        p_booking_reference,
        p_user_id,
        p_event_id,
        p_customer_name,
        p_customer_email,
        p_customer_phone,
        p_quantity,
        v_total_price,
        0.00,
        0.00,
        v_total_price,
        v_ticket_type.currency,
        CASE WHEN v_total_price = 0 THEN 'confirmed'::booking_status_type ELSE 'pending'::booking_status_type END
    ) RETURNING id INTO v_booking_id;

    -- Create Booking Item
    INSERT INTO public.booking_items (
        booking_id,
        ticket_type_id,
        ticket_type_name,
        quantity,
        unit_price,
        total_price
    ) VALUES (
        v_booking_id,
        p_ticket_type_id,
        v_ticket_type.name,
        p_quantity,
        v_ticket_type.price,
        v_total_price
    );

    -- Generate Individual Tickets with QR Verification Tokens
    FOR v_ticket_idx IN 1..p_quantity LOOP
        v_ticket_number := 'TKT-' || UPPER(SUBSTRING(MD5(RANDOM()::TEXT), 1, 8)) || '-' || LPAD(v_ticket_idx::TEXT, 2, '0');
        v_qr_token := encode(digest(v_booking_id::TEXT || '-' || v_ticket_number || '-' || RANDOM()::TEXT, 'sha256'), 'hex');

        INSERT INTO public.tickets (
            ticket_number,
            booking_id,
            event_id,
            ticket_type_id,
            attendee_name,
            attendee_email,
            qr_token,
            status
        ) VALUES (
            v_ticket_number,
            v_booking_id,
            p_event_id,
            p_ticket_type_id,
            p_customer_name,
            p_customer_email,
            v_qr_token,
            'valid'
        ) RETURNING id INTO v_ticket_id;
    END LOOP;

    v_result := jsonb_build_object(
        'success', true,
        'booking_id', v_booking_id,
        'booking_reference', p_booking_reference,
        'total_amount', v_total_price,
        'status', CASE WHEN v_total_price = 0 THEN 'confirmed' ELSE 'pending' END
    );

    RETURN v_result;
END;
$$;

-- ==============================================================================
-- QR CODE CHECK-IN & GATE VERIFICATION PROCEDURE
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.verify_and_check_in_ticket(
    p_qr_token TEXT,
    p_scanned_by UUID,
    p_device_info TEXT DEFAULT 'Camera Scanner'
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_ticket RECORD;
    v_event RECORD;
    v_checkin_count INT;
BEGIN
    SELECT t.*, b.customer_name, b.customer_email, tt.name as ticket_tier
    INTO v_ticket
    FROM public.tickets t
    JOIN public.bookings b ON b.id = t.booking_id
    LEFT JOIN public.ticket_types tt ON tt.id = t.ticket_type_id
    WHERE t.qr_token = p_qr_token;

    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'status', 'INVALID', 'message', 'Ticket QR code is not recognized.');
    END IF;

    SELECT * INTO v_event FROM public.events WHERE id = v_ticket.event_id;
    IF v_event.organizer_id != p_scanned_by AND NOT public.is_admin() THEN
        RETURN jsonb_build_object('success', false, 'status', 'UNAUTHORIZED', 'message', 'You are not authorized for this event.');
    END IF;

    -- Duplicate Check-in Prevention
    IF v_ticket.status = 'checked_in' THEN
        RETURN jsonb_build_object(
            'success', false,
            'status', 'ALREADY_USED',
            'message', 'Ticket was ALREADY CHECKED IN! Duplicate entry denied.',
            'ticket_number', v_ticket.ticket_number,
            'attendee_name', v_ticket.customer_name,
            'ticket_tier', v_ticket.ticket_tier
        );
    END IF;

    IF v_ticket.status != 'valid' THEN
        RETURN jsonb_build_object(
            'success', false,
            'status', 'REVOKED',
            'message', 'Ticket is revoked (' || v_ticket.status || ').'
        );
    END IF;

    -- Mark checked in
    UPDATE public.tickets
    SET status = 'checked_in',
        updated_at = NOW()
    WHERE id = v_ticket.id;

    -- Audit log
    INSERT INTO public.check_ins (
        ticket_id,
        event_id,
        scanned_by,
        check_in_time,
        device_info
    ) VALUES (
        v_ticket.id,
        v_ticket.event_id,
        p_scanned_by,
        NOW(),
        p_device_info
    );

    RETURN jsonb_build_object(
        'success', true,
        'status', 'VALID',
        'message', 'Check-in successful! Welcome, ' || v_ticket.customer_name,
        'ticket_id', v_ticket.id,
        'ticket_number', v_ticket.ticket_number,
        'attendee_name', v_ticket.customer_name,
        'ticket_tier', v_ticket.ticket_tier,
        'event_title', v_event.title,
        'checked_in_at', NOW()
    );
END;
$$;

-- ==============================================================================
-- DEFAULT SEED DATA (CATEGORIES & PLATFORM SETTINGS)
-- ==============================================================================
INSERT INTO public.event_categories (id, name, slug, description, icon, image_url, display_order)
VALUES
    ('c0000001-0000-0000-0000-000000000001', 'Music & Concerts', 'music-concerts', 'Live concerts, music festivals, acoustics, and DJ shows', 'Music', 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1200&q=80', 1),
    ('c0000001-0000-0000-0000-000000000002', 'Technology & Startups', 'technology', 'Hackathons, tech conferences, developer summits, and AI expos', 'Laptop', 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80', 2),
    ('c0000001-0000-0000-0000-000000000003', 'Business & Conferences', 'business', 'Corporate summits, trade expos, networking, and business forums', 'Briefcase', 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=1200&q=80', 3),
    ('c0000001-0000-0000-0000-000000000004', 'Education & Workshops', 'education', 'Hands-on bootcamps, masterclasses, and certified seminars', 'GraduationCap', 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1200&q=80', 4),
    ('c0000001-0000-0000-0000-000000000005', 'Sports & Fitness', 'sports', 'Marathons, football championships, yoga retreats, and fitness cups', 'Trophy', 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=1200&q=80', 5),
    ('c0000001-0000-0000-0000-000000000006', 'Festivals & Culture', 'festivals', 'Cultural festivals, heritage carnivals, and holiday galas', 'Sparkles', 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&w=1200&q=80', 6),
    ('c0000001-0000-0000-0000-000000000007', 'Entertainment & Comedy', 'entertainment', 'Standup comedy, theatre acts, movie premieres, and magic shows', 'Theater', 'https://images.unsplash.com/photo-1514306191717-452ec28c7814?auto=format&fit=crop&w=1200&q=80', 7),
    ('c0000001-0000-0000-0000-000000000008', 'Workshops & Masterclasses', 'workshops', 'Skill-building, photography workshops, design and culinary art', 'Layers', 'https://images.unsplash.com/photo-1531058020387-3be344556be6?auto=format&fit=crop&w=1200&q=80', 8)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.platform_settings (key, value, description)
VALUES
    ('platform_name', 'EVENTORA', 'Official platform brand name'),
    ('default_currency', 'ETB', 'Primary default operating currency'),
    ('platform_fee_percent', '5.0', 'Platform commission per ticket (5%)'),
    ('support_email', 'support@eventora.com', 'System support and notifications email'),
    ('telebirr_enabled', 'true', 'Telebirr Mobile Payment integration status'),
    ('chapa_enabled', 'true', 'Chapa Payment Gateway integration status'),
    ('stripe_enabled', 'true', 'Stripe Card processing status'),
    ('require_event_approval', 'true', 'Whether events require admin approval before listing'),
    ('sms_provider', 'none', 'Configured SMS provider')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;
