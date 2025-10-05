-- E-commerce extensions for digital/physical product sales

-- Add e-commerce fields to existing listings table
ALTER TABLE public.listings ADD COLUMN IF NOT EXISTS type TEXT DEFAULT 'classified';
ALTER TABLE public.listings ADD COLUMN IF NOT EXISTS delivery_title TEXT;
ALTER TABLE public.listings ADD COLUMN IF NOT EXISTS delivery_url TEXT;
ALTER TABLE public.listings ADD COLUMN IF NOT EXISTS delivery_mode TEXT CHECK (delivery_mode IN ('external', 'signed'));
ALTER TABLE public.listings ADD COLUMN IF NOT EXISTS delivery_token TEXT;
ALTER TABLE public.listings ADD COLUMN IF NOT EXISTS weight_grams INTEGER;
ALTER TABLE public.listings ADD COLUMN IF NOT EXISTS dims_cm JSONB;
ALTER TABLE public.listings ADD COLUMN IF NOT EXISTS hs_code TEXT;
ALTER TABLE public.listings ADD COLUMN IF NOT EXISTS origin_country TEXT;
ALTER TABLE public.listings ADD COLUMN IF NOT EXISTS inventory INTEGER;
ALTER TABLE public.listings ADD COLUMN IF NOT EXISTS featured_until TIMESTAMP WITH TIME ZONE;

-- Orders table
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  buyer_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  seller_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  listing_id UUID REFERENCES public.listings(id) ON DELETE SET NULL,
  qty INTEGER NOT NULL DEFAULT 1,
  subtotal_cents INTEGER NOT NULL,
  shipping_cents INTEGER NOT NULL DEFAULT 0,
  platform_fee_cents INTEGER NOT NULL,
  total_cents INTEGER NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  stripe_payment_intent TEXT,
  status TEXT NOT NULL DEFAULT 'created' CHECK (status IN ('created', 'paid_pending_fulfillment', 'shipped', 'in_transit', 'delivered', 'completed', 'cancelled', 'refunded')),
  kind TEXT NOT NULL CHECK (kind IN ('digital', 'physical', 'service')),
  delivery_link_hash TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Fulfillments table
CREATE TABLE IF NOT EXISTS public.fulfillments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  carrier TEXT CHECK (carrier IN ('DHL', 'FDX', 'UPS', 'Manual')),
  tracking_number TEXT,
  label_url TEXT,
  status TEXT NOT NULL DEFAULT 'label_created' CHECK (status IN ('label_created', 'shipped', 'in_transit', 'delivered', 'failed')),
  raw_events JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Seller balances
CREATE TABLE IF NOT EXISTS public.seller_balances (
  seller_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  available_cents INTEGER NOT NULL DEFAULT 0,
  on_hold_cents INTEGER NOT NULL DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Ledger entries
CREATE TABLE IF NOT EXISTS public.ledger_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
  type TEXT NOT NULL CHECK (type IN ('sale', 'commission', 'shipping', 'payout', 'refund')),
  amount_cents INTEGER NOT NULL,
  note TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Payout methods
CREATE TABLE IF NOT EXISTS public.payout_methods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('stripe_connect', 'wise', 'payoneer', 'remittance', 'manual_agent')),
  details JSONB NOT NULL,
  verified BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Payouts
CREATE TABLE IF NOT EXISTS public.payouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount_cents INTEGER NOT NULL,
  method_type TEXT NOT NULL,
  provider_ref TEXT,
  status TEXT NOT NULL DEFAULT 'queued' CHECK (status IN ('queued', 'sent', 'failed')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all new tables
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fulfillments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seller_balances ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ledger_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payout_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payouts ENABLE ROW LEVEL SECURITY;

-- RLS Policies for orders
CREATE POLICY "Buyers can view their own orders"
  ON public.orders FOR SELECT
  USING (auth.uid() = buyer_id);

CREATE POLICY "Sellers can view orders for their listings"
  ON public.orders FOR SELECT
  USING (auth.uid() = seller_id);

CREATE POLICY "Users can create orders"
  ON public.orders FOR INSERT
  WITH CHECK (auth.uid() = buyer_id);

CREATE POLICY "Sellers can update their orders"
  ON public.orders FOR UPDATE
  USING (auth.uid() = seller_id);

-- RLS Policies for fulfillments
CREATE POLICY "Users can view fulfillments for their orders"
  ON public.fulfillments FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.orders
    WHERE orders.id = fulfillments.order_id
    AND (orders.buyer_id = auth.uid() OR orders.seller_id = auth.uid())
  ));

CREATE POLICY "Sellers can create fulfillments"
  ON public.fulfillments FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.orders
    WHERE orders.id = fulfillments.order_id
    AND orders.seller_id = auth.uid()
  ));

CREATE POLICY "Sellers can update fulfillments"
  ON public.fulfillments FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM public.orders
    WHERE orders.id = fulfillments.order_id
    AND orders.seller_id = auth.uid()
  ));

-- RLS Policies for seller_balances
CREATE POLICY "Sellers can view their own balance"
  ON public.seller_balances FOR SELECT
  USING (auth.uid() = seller_id);

-- RLS Policies for ledger_entries
CREATE POLICY "Sellers can view their own ledger entries"
  ON public.ledger_entries FOR SELECT
  USING (auth.uid() = seller_id);

-- RLS Policies for payout_methods
CREATE POLICY "Sellers can manage their own payout methods"
  ON public.payout_methods FOR ALL
  USING (auth.uid() = seller_id);

-- RLS Policies for payouts
CREATE POLICY "Sellers can view their own payouts"
  ON public.payouts FOR SELECT
  USING (auth.uid() = seller_id);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_orders_buyer_id ON public.orders(buyer_id);
CREATE INDEX IF NOT EXISTS idx_orders_seller_id ON public.orders(seller_id);
CREATE INDEX IF NOT EXISTS idx_orders_listing_id ON public.orders(listing_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_fulfillments_order_id ON public.fulfillments(order_id);
CREATE INDEX IF NOT EXISTS idx_ledger_entries_seller_id ON public.ledger_entries(seller_id);
CREATE INDEX IF NOT EXISTS idx_ledger_entries_order_id ON public.ledger_entries(order_id);

-- Trigger for updated_at
CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_fulfillments_updated_at
  BEFORE UPDATE ON public.fulfillments
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_seller_balances_updated_at
  BEFORE UPDATE ON public.seller_balances
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_payouts_updated_at
  BEFORE UPDATE ON public.payouts
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();