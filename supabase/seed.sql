-- ==============================================================================
-- EVENTORA SEED DATA
-- Default Categories, Platform Settings, and Sample Data
-- ==============================================================================

-- 1. SEED CATEGORIES
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

-- 2. SEED PLATFORM SETTINGS
INSERT INTO public.platform_settings (key, value, description)
VALUES
    ('platform_name', 'EVENTORA', 'Official name of the event and ticketing platform'),
    ('default_currency', 'ETB', 'Primary default operating currency'),
    ('platform_fee_percent', '5.0', 'Platform commission charged per ticket transaction (5%)'),
    ('support_email', 'support@eventora.com', 'System support and notification contact'),
    ('telebirr_enabled', 'true', 'Telebirr Mobile Payment integration status'),
    ('chapa_enabled', 'true', 'Chapa Payment Gateway integration status'),
    ('stripe_enabled', 'true', 'Stripe International Card processing status'),
    ('require_event_approval', 'true', 'Whether events require admin approval before public listing'),
    ('sms_provider', 'none', 'SMS Provider configured: none, twilio, infobip')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;
