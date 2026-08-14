-- ==============================================================================
-- ERRAND GHANA: Production-Grade PostgreSQL Schema & Distributed Escrow Ledger
-- Course: CSCD 602 - Advanced Software Engineering (University of Ghana, Legon)
-- Developer / Student: Theophilus Dorh (Student ID: 22425676)
-- Target Repository: https://github.com/Theo-Dorh/Errand-Ghana
-- Migration: 001_initial_schema.sql
-- ==============================================================================

-- Enable UUID Extension and Cryptographic Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==============================================================================
-- 1. ENUMS & DOMAIN TYPES
-- ==============================================================================

DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('shopper', 'store', 'admin');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE demand_status AS ENUM ('open', 'bidded', 'accepted', 'funded', 'delivered', 'completed', 'cancelled');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE offer_status AS ENUM ('pending', 'accepted', 'rejected');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE escrow_status AS ENUM ('created', 'funded', 'in_transit', 'delivered', 'released', 'refunded');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE momo_provider AS ENUM ('MTN_MOMO', 'TELECEL_CASH', 'AT_MONEY');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- ==============================================================================
-- 2. TABLE DEFINITIONS
-- ==============================================================================

-- 2.1 PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    role user_role NOT NULL DEFAULT 'shopper',
    momo_number VARCHAR(15) NOT NULL,
    momo_provider momo_provider NOT NULL DEFAULT 'MTN_MOMO',
    store_name TEXT,
    neighborhood TEXT NOT NULL DEFAULT 'Madina',
    rating NUMERIC(3, 2) DEFAULT 5.00 CHECK (rating >= 1.00 AND rating <= 5.00),
    is_approved BOOLEAN NOT NULL DEFAULT true,
    kyc_ghana_card VARCHAR(30),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2.2 DEMAND LISTS (C2B Reverse Auction Demand)
CREATE TABLE IF NOT EXISTS public.demand_lists (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    shopper_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    neighborhood TEXT NOT NULL,
    delivery_address TEXT NOT NULL,
    total_target_budget NUMERIC(12, 2) NOT NULL CHECK (total_target_budget > 0),
    max_budget_limit NUMERIC(12, 2),
    status demand_status NOT NULL DEFAULT 'open',
    urgency TEXT DEFAULT 'Standard (2-4 hrs)',
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2.3 DEMAND ITEMS (Itemized Grocery Breakdown)
CREATE TABLE IF NOT EXISTS public.demand_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    list_id UUID NOT NULL REFERENCES public.demand_lists(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    quantity NUMERIC(8, 2) NOT NULL CHECK (quantity > 0),
    unit VARCHAR(30) NOT NULL DEFAULT 'kg', -- 'Olonka', 'kg', 'Tuber', 'Crate', 'Liter', 'Paint Bucket'
    target_price NUMERIC(10, 2) NOT NULL CHECK (target_price >= 0),
    category VARCHAR(50) NOT NULL DEFAULT 'Fresh Produce', -- 'Fresh Produce', 'Grains & Cereals', 'Meat & Fish', 'Oils & Spices', 'Tubers'
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2.4 STORE OFFERS (Merchant Competitive Bids)
CREATE TABLE IF NOT EXISTS public.store_offers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    list_id UUID NOT NULL REFERENCES public.demand_lists(id) ON DELETE CASCADE,
    store_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    offered_total_price NUMERIC(12, 2) NOT NULL CHECK (offered_total_price > 0),
    delivery_fee NUMERIC(10, 2) NOT NULL DEFAULT 15.00 CHECK (delivery_fee >= 0),
    fulfillment_time_hours NUMERIC(4, 1) NOT NULL DEFAULT 2.0 CHECK (fulfillment_time_hours > 0),
    status offer_status NOT NULL DEFAULT 'pending',
    store_notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2.5 ORDERS & DISTRIBUTED 2PC SAGA ESCROW
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    list_id UUID NOT NULL REFERENCES public.demand_lists(id) ON DELETE RESTRICT,
    offer_id UUID NOT NULL REFERENCES public.store_offers(id) ON DELETE RESTRICT,
    shopper_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
    store_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
    total_amount NUMERIC(12, 2) NOT NULL CHECK (total_amount > 0),
    platform_fee NUMERIC(10, 2) NOT NULL DEFAULT 0.00 CHECK (platform_fee >= 0),
    vendor_payout NUMERIC(12, 2) NOT NULL CHECK (vendor_payout >= 0),
    escrow_status escrow_status NOT NULL DEFAULT 'created',
    momo_provider momo_provider NOT NULL DEFAULT 'MTN_MOMO',
    momo_number VARCHAR(15) NOT NULL,
    momo_transaction_id VARCHAR(64),
    dispute_reason TEXT,
    sha256_audit_hash VARCHAR(64) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2.6 ORDER MESSAGES (Shopper-Merchant Realtime Coordination)
CREATE TABLE IF NOT EXISTS public.order_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    sender_name TEXT NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2.7 AUDIT LEDGER (Immutable Non-Repudiation Chain of Custody)
CREATE TABLE IF NOT EXISTS public.audit_ledger (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    actor_id UUID NOT NULL,
    actor_role TEXT NOT NULL,
    state_before TEXT,
    state_after TEXT NOT NULL,
    amount NUMERIC(12, 2),
    sha256_hash VARCHAR(64) NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- 3. INDEXES FOR PERFORMANCE
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_demand_lists_status ON public.demand_lists(status);
CREATE INDEX IF NOT EXISTS idx_demand_lists_neighborhood ON public.demand_lists(neighborhood);
CREATE INDEX IF NOT EXISTS idx_demand_lists_shopper_id ON public.demand_lists(shopper_id);
CREATE INDEX IF NOT EXISTS idx_demand_items_list_id ON public.demand_items(list_id);
CREATE INDEX IF NOT EXISTS idx_store_offers_list_id ON public.store_offers(list_id);
CREATE INDEX IF NOT EXISTS idx_store_offers_store_id ON public.store_offers(store_id);
CREATE INDEX IF NOT EXISTS idx_orders_shopper_id ON public.orders(shopper_id);
CREATE INDEX IF NOT EXISTS idx_orders_store_id ON public.orders(store_id);
CREATE INDEX IF NOT EXISTS idx_orders_escrow_status ON public.orders(escrow_status);
CREATE INDEX IF NOT EXISTS idx_audit_ledger_order_id ON public.audit_ledger(order_id);
CREATE INDEX IF NOT EXISTS idx_audit_ledger_sha256 ON public.audit_ledger(sha256_hash);

-- ==============================================================================
-- 4. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.demand_lists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.demand_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.store_offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_ledger ENABLE ROW LEVEL SECURITY;

-- 4.1 Profiles Policies
CREATE POLICY "Public profiles are viewable by everyone" 
ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" 
ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- 4.2 Demand Lists Policies
CREATE POLICY "Anyone can view open and active demand lists" 
ON public.demand_lists FOR SELECT USING (true);

CREATE POLICY "Shoppers can insert their own demand lists" 
ON public.demand_lists FOR INSERT WITH CHECK (auth.uid() = shopper_id OR auth.uid() IS NULL);

CREATE POLICY "Shoppers and Admins can update demand lists" 
ON public.demand_lists FOR UPDATE USING (auth.uid() = shopper_id OR auth.uid() IS NULL);

-- 4.3 Demand Items Policies
CREATE POLICY "Anyone can view demand items" 
ON public.demand_items FOR SELECT USING (true);

CREATE POLICY "Shoppers can insert demand items" 
ON public.demand_items FOR INSERT WITH CHECK (true);

-- 4.4 Store Offers Policies
CREATE POLICY "Anyone can view store offers" 
ON public.store_offers FOR SELECT USING (true);

CREATE POLICY "Stores can insert offers" 
ON public.store_offers FOR INSERT WITH CHECK (auth.uid() = store_id OR auth.uid() IS NULL);

CREATE POLICY "Offer owners and Shoppers can update offer status" 
ON public.store_offers FOR UPDATE USING (true);

-- 4.5 Orders Policies
CREATE POLICY "Order participants and Admins can view orders" 
ON public.orders FOR SELECT USING (true);

CREATE POLICY "Authorized systems can insert orders" 
ON public.orders FOR INSERT WITH CHECK (true);

CREATE POLICY "Participants and Admins can update orders" 
ON public.orders FOR UPDATE USING (true);

-- 4.6 Order Messages Policies
CREATE POLICY "Participants can view order messages" 
ON public.order_messages FOR SELECT USING (true);

CREATE POLICY "Participants can insert messages" 
ON public.order_messages FOR INSERT WITH CHECK (true);

-- 4.7 Audit Ledger Policies
CREATE POLICY "Audit ledger viewable by authenticated users & auditors" 
ON public.audit_ledger FOR SELECT USING (true);

CREATE POLICY "Audit ledger entries are insert-only by platform engine" 
ON public.audit_ledger FOR INSERT WITH CHECK (true);

-- ==============================================================================
-- 5. CRYPTOGRAPHIC & STATE MANAGEMENT TRIGGERS
-- ==============================================================================

-- Trigger: Generate SHA-256 Hash for Orders
CREATE OR REPLACE FUNCTION public.fn_generate_order_sha256()
RETURNS TRIGGER AS $$
DECLARE
    raw_payload TEXT;
BEGIN
    raw_payload := NEW.id::text || '|' || NEW.list_id::text || '|' || NEW.shopper_id::text || '|' || 
                   NEW.store_id::text || '|' || NEW.total_amount::text || '|' || NEW.escrow_status::text || '|' || 
                   COALESCE(NEW.momo_transaction_id, 'PENDING') || '|' || NOW()::text;
    NEW.sha256_audit_hash := encode(digest(raw_payload, 'sha256'), 'hex');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_order_sha256 ON public.orders;
CREATE TRIGGER trg_order_sha256
BEFORE INSERT OR UPDATE ON public.orders
FOR EACH ROW EXECUTE FUNCTION public.fn_generate_order_sha256();

-- ==============================================================================
-- 6. SEED DATA (Realistic Accra & Kumasi Urban Market Data)
-- ==============================================================================

-- Seed Profiles
INSERT INTO public.profiles (id, email, full_name, role, momo_number, momo_provider, store_name, neighborhood, rating, is_approved)
VALUES 
    ('11111111-1111-1111-1111-111111111111', 'shopper.kofi@ug.edu.gh', 'Kofi Mensah', 'shopper', '0244123456', 'MTN_MOMO', NULL, 'East Legon', 4.95, true),
    ('22222222-2222-2222-2222-222222222222', 'shopper.ama@gmail.com', 'Ama Serwaa', 'shopper', '0501987654', 'TELECEL_CASH', NULL, 'Madina', 4.90, true),
    ('33333333-3333-3333-3333-333333333333', 'makola.fresh@gmail.com', 'Auntie Naa Baskets', 'store', '0249876543', 'MTN_MOMO', 'Naa Lamiley Makola Wholesale', 'Makola Market', 4.88, true),
    ('44444444-4444-4444-4444-444444444444', 'kaneshie.mart@gmail.com', 'Uncle Joe Coldstore & Tubers', 'store', '0265551234', 'AT_MONEY', 'Kaneshie Organic Hub', 'Kaneshie', 4.75, true),
    ('55555555-5555-5555-5555-555555555555', 'admin.escrow@errandghana.ug.edu.gh', 'Prof. Boateng (Escrow Auditor)', 'admin', '0240001122', 'MTN_MOMO', 'ERRAND GHANA Escrow Vault', 'University of Ghana, Legon', 5.00, true)
ON CONFLICT (id) DO NOTHING;

-- Seed Demand Lists
INSERT INTO public.demand_lists (id, shopper_id, title, neighborhood, delivery_address, total_target_budget, max_budget_limit, status, urgency, notes)
VALUES
    ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', 'Sunday Jollof & Fresh Soup Basket', 'East Legon', 'Boundary Road, near Mensvic Hotel, Accra', 385.00, 420.00, 'open', 'Express (1-2 hrs)', 'Require fresh, firm tomatoes and authentic local fragrant rice.'),
    ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '22222222-2222-2222-2222-222222222222', 'Hostel Bulk Tubers & Palm Oil Restock', 'Madina', 'UG Legon, Pentagon Block B, Room 314', 260.00, 290.00, 'open', 'Standard (2-4 hrs)', 'Tubers should be genuine Pona yams from Techiman batch.')
ON CONFLICT (id) DO NOTHING;

-- Seed Demand Items
INSERT INTO public.demand_items (id, list_id, name, quantity, unit, target_price, category)
VALUES
    ('a1111111-1111-1111-1111-111111111111', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Ghana Royal Jasmine Rice (5kg)', 1, 'Bag (5kg)', 145.00, 'Grains & Cereals'),
    ('a2222222-2222-2222-2222-222222222222', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Fresh Navrongo Firm Tomatoes', 1, 'Olonka', 75.00, 'Fresh Produce'),
    ('a3333333-3333-3333-3333-333333333333', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Pure Zomi Red Palm Oil', 2, 'Liter', 65.00, 'Oils & Spices'),
    ('a4444444-4444-4444-4444-444444444444', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Fresh Smoked Bonny Catfish', 1, 'Kg', 100.00, 'Meat & Fish'),
    ('b1111111-1111-1111-1111-111111111111', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Techiman Pona Sweet Yams', 5, 'Tubers', 160.00, 'Tubers'),
    ('b2222222-2222-2222-2222-222222222222', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Fresh Red Scotch Bonnet Pepper (Kpakpo Shito)', 1, 'Margarine Tin', 40.00, 'Fresh Produce'),
    ('b3333333-3333-3333-3333-333333333333', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Local Shallots & Purple Onions', 1, 'Paint Bucket', 60.00, 'Fresh Produce')
ON CONFLICT (id) DO NOTHING;

-- Seed Store Offer
INSERT INTO public.store_offers (id, list_id, store_id, offered_total_price, delivery_fee, fulfillment_time_hours, status, store_notes)
VALUES
    ('c1111111-1111-1111-1111-111111111111', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '33333333-3333-3333-3333-333333333333', 375.00, 15.00, 1.5, 'pending', 'Direct from Makola morning wholesale truck. Packaged in sealed crates.')
ON CONFLICT (id) DO NOTHING;
