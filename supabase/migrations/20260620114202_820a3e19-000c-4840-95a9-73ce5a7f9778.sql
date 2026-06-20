
-- ============ ENUM ============
CREATE TYPE public.app_role AS ENUM ('admin','customer');

-- ============ PROFILES ============
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- ============ USER ROLES ============
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role
  );
$$;

-- Profiles policies
CREATE POLICY "profiles_select_own" ON public.profiles FOR SELECT TO authenticated
  USING (id = auth.uid() OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE TO authenticated
  USING (id = auth.uid()) WITH CHECK (id = auth.uid());
CREATE POLICY "profiles_insert_self" ON public.profiles FOR INSERT TO authenticated
  WITH CHECK (id = auth.uid());

-- User roles policies
CREATE POLICY "user_roles_select_own_or_admin" ON public.user_roles FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "user_roles_admin_manage" ON public.user_roles FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

-- ============ TRIGGERS: new user => profile + role ============
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, phone)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.raw_user_meta_data ->> 'name'),
    NEW.raw_user_meta_data ->> 'phone'
  )
  ON CONFLICT (id) DO NOTHING;

  INSERT INTO public.user_roles (user_id, role)
  VALUES (
    NEW.id,
    CASE WHEN lower(NEW.email) = 'bhaktibb15@gmail.com'
         THEN 'admin'::public.app_role
         ELSE 'customer'::public.app_role
    END
  )
  ON CONFLICT (user_id, role) DO NOTHING;

  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============ UPDATED_AT helper ============
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

CREATE TRIGGER profiles_set_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============ PRODUCTS ============
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  materials TEXT NOT NULL DEFAULT '',
  care TEXT NOT NULL DEFAULT '',
  shipping TEXT NOT NULL DEFAULT '',
  price_inr INTEGER NOT NULL CHECK (price_inr >= 0),
  image_url TEXT NOT NULL DEFAULT '',
  alt_text TEXT NOT NULL DEFAULT '',
  tag TEXT NOT NULL DEFAULT 'New',
  bestseller BOOLEAN NOT NULL DEFAULT false,
  stock INTEGER NOT NULL DEFAULT 10,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.products TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.products TO authenticated;
GRANT ALL ON public.products TO service_role;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "products_public_read_active" ON public.products FOR SELECT
  USING (active OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "products_admin_insert" ON public.products FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE POLICY "products_admin_update" ON public.products FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE POLICY "products_admin_delete" ON public.products FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(),'admin'));

CREATE TRIGGER products_set_updated_at BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Seed initial products
INSERT INTO public.products (slug, name, category, description, materials, care, shipping, price_inr, image_url, alt_text, tag, bestseller) VALUES
('rohini-pendant','Rohini Pendant','Necklaces','A single uncut rose quartz, set in 22-karat gold, suspended on a hand-hammered chain. Designed to be layered or worn alone.','22k yellow gold · Uncut rose quartz · 18" adjustable chain · Total weight 11.4 g.','Store in the velvet pouch provided. Polish gently with a soft cotton cloth. Complimentary re-polish for life.','Free insured shipping across India in 4–6 days. International 7–10 days.',48500,'/seed/product-necklace.jpg','Rohini gold pendant with rose quartz','New',true),
('gulaab-drops','Gulaab Drops','Earrings','Pear-cut Burmese rubies cradled in milgrain gold petals — light enough for everyday, sharp enough for evening.','22k gold · Burmese ruby (1.2 ct total) · Screw backs · Weight 6.8 g per pair.','Avoid contact with perfume and chlorinated water. Polish with included cloth.','Free insured shipping in India in 4–6 days.',36200,'/seed/product-earrings.jpg','Gulaab gold drop earrings with rubies','Bestseller',true),
('sindoori-bangles','Sindoori Bangles','Bracelets','A pair of slim, hand-hammered bangles finished in our signature warm sindoori gold. Sold as a set of two.','22k gold · 2.4 mm width · Pair total weight 24 g.','Bangles soften with wear — re-polish annually with our complimentary care service.','Free insured shipping in India in 4–6 days.',62000,'/seed/product-bangles.jpg','Sindoori stacked gold bangles','Heritage',false),
('maharani-ring','Maharani Ring','Rings','A solitaire rose quartz haloed in pavé rubies — our most-requested statement ring, limited to 24 pieces a year.','22k gold · 4 ct rose quartz · 0.3 ct ruby pavé · Sizes US 4–9.','Remove before sleep and exercise. Annual complimentary re-rhodium.','Free insured shipping. Sizing & engraving included.',84900,'/seed/product-ring.jpg','Maharani statement gold ring','Limited',true),
('mogra-choker','Mogra Choker','Necklaces','A ceremonial choker of clustered gold mogra blossoms with ruby centres. Worn high, on the throat.','22k gold · Rubies & freshwater pearls · 14" + 2" extender.','Hand-clean only. Store flat in the box provided.','Free insured shipping in India in 5–7 days.',72000,'/seed/product-desidiva.jpg','Mogra ceremonial gold choker','New',false),
('panna-studs','Panna Studs','Earrings','Small, perfect, every-day. Bezel-set rose quartz studs in brushed 22k gold.','22k gold · Rose quartz (0.8 ct each) · Push backs.','Wipe with soft cloth after each wear.','Free insured shipping in India in 4–6 days.',28900,'/seed/product-earrings.jpg','Panna gold stud earrings','Sale',false),
('kundan-kada','Kundan Kada','Bracelets','A single solitaire rose quartz set in traditional kundan, on a slim hinged gold cuff.','22k gold · Rose quartz solitaire · Hinged opening with safety clasp.','Avoid water and impact. Re-set complimentary for life.','Free insured shipping in India.',55500,'/seed/product-bracelet.jpg','Kundan kada bracelet with rose quartz','Heritage',false),
('surya-band','Surya Band','Rings','A sunray-engraved band — quiet enough to stack, distinct enough to stand alone.','22k gold · 4 mm width · Sizes US 4–10.','Polish with included cloth.','Free insured shipping in India.',41000,'/seed/product-ring.jpg','Surya band ring in gold','Bestseller',true);

-- ============ ORDERS ============
CREATE TYPE public.order_status AS ENUM ('pending','paid','shipped','delivered','cancelled');

CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status public.order_status NOT NULL DEFAULT 'pending',
  subtotal_inr INTEGER NOT NULL DEFAULT 0,
  tax_inr INTEGER NOT NULL DEFAULT 0,
  shipping_inr INTEGER NOT NULL DEFAULT 0,
  total_inr INTEGER NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'INR',
  shipping_address JSONB NOT NULL DEFAULT '{}'::jsonb,
  contact_email TEXT,
  contact_phone TEXT,
  tracking_number TEXT,
  courier TEXT,
  notes TEXT,
  stripe_session_id TEXT,
  stripe_payment_intent TEXT,
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.orders TO authenticated;
GRANT ALL ON public.orders TO service_role;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "orders_select_own_or_admin" ON public.orders FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "orders_insert_own" ON public.orders FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());
CREATE POLICY "orders_update_own_pending_or_admin" ON public.orders FOR UPDATE TO authenticated
  USING (
    public.has_role(auth.uid(),'admin')
    OR (user_id = auth.uid() AND status = 'pending')
  )
  WITH CHECK (
    public.has_role(auth.uid(),'admin')
    OR (user_id = auth.uid() AND status = 'pending')
  );

CREATE TRIGGER orders_set_updated_at BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============ ORDER ITEMS ============
CREATE TABLE public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  image_url TEXT NOT NULL DEFAULT '',
  price_inr INTEGER NOT NULL,
  qty INTEGER NOT NULL CHECK (qty > 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.order_items TO authenticated;
GRANT ALL ON public.order_items TO service_role;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "order_items_select_own_or_admin" ON public.order_items FOR SELECT TO authenticated
  USING (
    public.has_role(auth.uid(),'admin')
    OR EXISTS (SELECT 1 FROM public.orders o WHERE o.id = order_id AND o.user_id = auth.uid())
  );
CREATE POLICY "order_items_insert_own_pending" ON public.order_items FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.orders o WHERE o.id = order_id AND o.user_id = auth.uid() AND o.status = 'pending')
  );

CREATE INDEX orders_user_idx ON public.orders(user_id);
CREATE INDEX order_items_order_idx ON public.order_items(order_id);
CREATE INDEX products_active_idx ON public.products(active);
