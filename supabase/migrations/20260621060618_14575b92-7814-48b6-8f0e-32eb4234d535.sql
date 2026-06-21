
CREATE TABLE public.home_slides (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url TEXT NOT NULL DEFAULT '',
  alt_text TEXT NOT NULL DEFAULT '',
  headline TEXT NOT NULL DEFAULT '',
  subtext TEXT NOT NULL DEFAULT '',
  link_url TEXT NOT NULL DEFAULT '/collections',
  sort INTEGER NOT NULL DEFAULT 0,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.home_slides TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.home_slides TO authenticated;
GRANT ALL ON public.home_slides TO service_role;
ALTER TABLE public.home_slides ENABLE ROW LEVEL SECURITY;
CREATE POLICY "slides_public_read" ON public.home_slides FOR SELECT
  USING (active OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "slides_admin_insert" ON public.home_slides FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE POLICY "slides_admin_update" ON public.home_slides FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE POLICY "slides_admin_delete" ON public.home_slides FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER home_slides_set_updated_at BEFORE UPDATE ON public.home_slides
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.site_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  label TEXT NOT NULL,
  image_url TEXT NOT NULL DEFAULT '',
  sort INTEGER NOT NULL DEFAULT 0,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.site_categories TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.site_categories TO authenticated;
GRANT ALL ON public.site_categories TO service_role;
ALTER TABLE public.site_categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "cats_public_read" ON public.site_categories FOR SELECT
  USING (active OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "cats_admin_insert" ON public.site_categories FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE POLICY "cats_admin_update" ON public.site_categories FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE POLICY "cats_admin_delete" ON public.site_categories FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER site_categories_set_updated_at BEFORE UPDATE ON public.site_categories
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

INSERT INTO public.site_categories (slug, label, image_url, sort) VALUES
  ('Necklaces','Necklaces','/seed/product-necklace.jpg',1),
  ('Earrings','Earrings','/seed/product-earrings.jpg',2),
  ('Bracelets','Bracelets','/seed/product-bangles.jpg',3),
  ('Rings','Rings','/seed/product-ring.jpg',4),
  ('Desi Divas','Desi Divas','/seed/product-desidiva.jpg',5);
