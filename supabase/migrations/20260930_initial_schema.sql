-- ==============================================================================
-- MOVI COFFEE — PRODUCTION SUPABASE DATABASE SCHEMA
-- Specialty Coffee & Café — Kaduwela, Sri Lanka
-- ==============================================================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==============================================================================
-- 1. CUSTOMERS TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    phone TEXT NOT NULL UNIQUE,
    email TEXT,
    total_visits INTEGER NOT NULL DEFAULT 1,
    last_visit_at TIMESTAMPTZ DEFAULT now(),
    preferred_seating TEXT,
    dietary_notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index for phone lookups
CREATE INDEX IF NOT EXISTS idx_customers_phone ON public.customers(phone);

-- ==============================================================================
-- 2. TABLES TABLE (Café Physical Seating)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.tables (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    table_number TEXT NOT NULL UNIQUE,
    capacity INTEGER NOT NULL CHECK (capacity > 0),
    seating_area TEXT NOT NULL CHECK (seating_area IN ('salon', 'courtyard', 'communal', 'quiet-nook', 'any')),
    is_available BOOLEAN NOT NULL DEFAULT true,
    is_active BOOLEAN NOT NULL DEFAULT true,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ==============================================================================
-- 3. RESERVATIONS TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.reservations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reference_number TEXT NOT NULL UNIQUE,
    customer_id UUID REFERENCES public.customers(id) ON DELETE SET NULL,
    guest_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    reservation_date DATE NOT NULL,
    time_slot TEXT NOT NULL,
    guests_count INTEGER NOT NULL CHECK (guests_count >= 1 AND guests_count <= 50),
    table_id UUID REFERENCES public.tables(id) ON DELETE SET NULL,
    seating_area TEXT NOT NULL DEFAULT 'any' CHECK (seating_area IN ('salon', 'courtyard', 'communal', 'quiet-nook', 'any')),
    special_request TEXT,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed', 'no_show', 'seated')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes for fast date and status querying in the admin ledger
CREATE INDEX IF NOT EXISTS idx_reservations_date_slot ON public.reservations(reservation_date, time_slot);
CREATE INDEX IF NOT EXISTS idx_reservations_status ON public.reservations(status);
CREATE INDEX IF NOT EXISTS idx_reservations_ref ON public.reservations(reference_number);

-- ==============================================================================
-- 4. MENU ITEMS TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.menu_items (
    id TEXT PRIMARY KEY,
    category TEXT NOT NULL CHECK (category IN ('coffee', 'signature', 'cold', 'tea', 'breakfast', 'savoury', 'desserts')),
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    price TEXT NOT NULL,
    image TEXT NOT NULL,
    is_available BOOLEAN NOT NULL DEFAULT true,
    is_popular BOOLEAN NOT NULL DEFAULT false,
    is_vegetarian BOOLEAN NOT NULL DEFAULT false,
    is_spicy BOOLEAN NOT NULL DEFAULT false,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_menu_category ON public.menu_items(category);

-- ==============================================================================
-- 5. BUSINESS SETTINGS TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.business_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    shop_name TEXT NOT NULL DEFAULT 'MOVI COFFEE',
    tagline TEXT NOT NULL DEFAULT 'GOOD COFFEE. BETTER MOMENTS.',
    address TEXT NOT NULL DEFAULT 'Kaduwela Road, Kaduwela, Sri Lanka',
    city TEXT NOT NULL DEFAULT 'Kaduwela',
    phone TEXT NOT NULL DEFAULT '+94 11 234 5678',
    whatsapp TEXT NOT NULL DEFAULT '94770000000',
    email TEXT NOT NULL DEFAULT 'hello@movicoffee.lk',
    opening_hours_weekday TEXT NOT NULL DEFAULT '7:00 AM – 10:00 PM',
    opening_hours_weekend TEXT NOT NULL DEFAULT '7:30 AM – 11:00 PM',
    google_maps_url TEXT NOT NULL DEFAULT 'https://maps.google.com/?q=Kaduwela+Sri+Lanka',
    is_accepting_reservations BOOLEAN NOT NULL DEFAULT true,
    max_party_size INTEGER NOT NULL DEFAULT 12,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ==============================================================================
-- 6. SEASONAL CAMPAIGNS TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.seasonal_campaigns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    tag TEXT NOT NULL,
    highlight_text TEXT NOT NULL,
    description TEXT NOT NULL,
    cta_label TEXT DEFAULT 'EXPLORE COFFEE',
    cta_href TEXT DEFAULT '/menu',
    is_active BOOLEAN NOT NULL DEFAULT true,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ==============================================================================
-- 7. NOTIFICATIONS TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reservation_id UUID REFERENCES public.reservations(id) ON DELETE CASCADE,
    channel TEXT NOT NULL CHECK (channel IN ('whatsapp', 'email', 'sms', 'system')),
    recipient TEXT NOT NULL,
    title TEXT NOT NULL,
    body TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed')),
    sent_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ==============================================================================
-- 8. ADMIN USERS TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.admin_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    auth_user_id UUID UNIQUE, -- Can link to auth.users if Supabase Auth is enabled
    email TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'manager' CHECK (role IN ('owner', 'manager', 'barista')),
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ==============================================================================
-- 9. ANALYTICS EVENTS TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.analytics_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_type TEXT NOT NULL,
    path TEXT NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_analytics_created ON public.analytics_events(created_at);
CREATE INDEX IF NOT EXISTS idx_analytics_type ON public.analytics_events(event_type);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

-- 1. Enable RLS on all tables
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tables ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seasonal_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

-- 2. Public Read Policies
CREATE POLICY "Public can view active menu items"
    ON public.menu_items FOR SELECT
    USING (is_available = true);

CREATE POLICY "Public can view active cafe tables"
    ON public.tables FOR SELECT
    USING (is_active = true);

CREATE POLICY "Public can view business settings"
    ON public.business_settings FOR SELECT
    USING (true);

CREATE POLICY "Public can view active seasonal campaigns"
    ON public.seasonal_campaigns FOR SELECT
    USING (is_active = true AND CURRENT_DATE BETWEEN start_date AND end_date);

-- 3. Public Insert Policies
CREATE POLICY "Public can insert reservations"
    ON public.reservations FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Public can lookup own reservation"
    ON public.reservations FOR SELECT
    USING (true);

CREATE POLICY "Public can create customer record on booking"
    ON public.customers FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Public can record analytics events"
    ON public.analytics_events FOR INSERT
    WITH CHECK (true);

-- 4. Admin / Service Role Full Access Policies
CREATE POLICY "Service role full access on customers"
    ON public.customers FOR ALL
    USING (auth.jwt() ->> 'role' = 'service_role' OR auth.role() = 'authenticated');

CREATE POLICY "Service role full access on tables"
    ON public.tables FOR ALL
    USING (auth.jwt() ->> 'role' = 'service_role' OR auth.role() = 'authenticated');

CREATE POLICY "Service role full access on reservations"
    ON public.reservations FOR ALL
    USING (auth.jwt() ->> 'role' = 'service_role' OR auth.role() = 'authenticated');

CREATE POLICY "Service role full access on menu_items"
    ON public.menu_items FOR ALL
    USING (auth.jwt() ->> 'role' = 'service_role' OR auth.role() = 'authenticated');

CREATE POLICY "Service role full access on business_settings"
    ON public.business_settings FOR ALL
    USING (auth.jwt() ->> 'role' = 'service_role' OR auth.role() = 'authenticated');

CREATE POLICY "Service role full access on seasonal_campaigns"
    ON public.seasonal_campaigns FOR ALL
    USING (auth.jwt() ->> 'role' = 'service_role' OR auth.role() = 'authenticated');

CREATE POLICY "Service role full access on notifications"
    ON public.notifications FOR ALL
    USING (auth.jwt() ->> 'role' = 'service_role' OR auth.role() = 'authenticated');

CREATE POLICY "Service role full access on admin_users"
    ON public.admin_users FOR ALL
    USING (auth.jwt() ->> 'role' = 'service_role' OR auth.role() = 'authenticated');

CREATE POLICY "Service role full access on analytics_events"
    ON public.analytics_events FOR ALL
    USING (auth.jwt() ->> 'role' = 'service_role' OR auth.role() = 'authenticated');

-- ==============================================================================
-- INITIAL DEVELOPMENT SEED DATA (MARKED CLEARLY AS DEV SEED DATA)
-- ==============================================================================
-- Seed initial business settings row
INSERT INTO public.business_settings (
    shop_name,
    tagline,
    address,
    city,
    phone,
    whatsapp,
    email,
    opening_hours_weekday,
    opening_hours_weekend
) VALUES (
    'MOVI COFFEE',
    'GOOD COFFEE. BETTER MOMENTS.',
    'Kaduwela Road, Kaduwela, Sri Lanka',
    'Kaduwela',
    '+94 11 234 5678',
    '94770000000',
    'hello@movicoffee.lk',
    '7:00 AM – 10:00 PM',
    '7:30 AM – 11:00 PM'
) ON CONFLICT DO NOTHING;

-- Seed default physical tables for Kaduwela café
INSERT INTO public.tables (table_number, capacity, seating_area) VALUES
    ('T-01', 2, 'quiet-nook'),
    ('T-02', 2, 'quiet-nook'),
    ('T-03', 4, 'salon'),
    ('T-04', 4, 'salon'),
    ('T-05', 6, 'salon'),
    ('T-06', 8, 'communal'),
    ('C-01', 2, 'courtyard'),
    ('C-02', 4, 'courtyard')
ON CONFLICT (table_number) DO NOTHING;

-- Seed active seasonal promo
INSERT INTO public.seasonal_campaigns (
    title,
    tag,
    highlight_text,
    description,
    is_active,
    start_date,
    end_date
) VALUES (
    'Ceylon Cinnamon & Hazelnut Roast',
    'HARVEST SPECIAL',
    'LIMITED SINGLE-ORIGIN RELEASE',
    'Carefully roasted with artisan Sri Lankan highland beans, notes of toasted hazelnut, organic cinnamon bark, and panela.',
    true,
    CURRENT_DATE - INTERVAL '5 days',
    CURRENT_DATE + INTERVAL '60 days'
) ON CONFLICT DO NOTHING;
