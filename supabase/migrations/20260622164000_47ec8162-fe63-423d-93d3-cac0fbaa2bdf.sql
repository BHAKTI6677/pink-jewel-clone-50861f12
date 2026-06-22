ALTER TABLE public.home_slides ADD COLUMN IF NOT EXISTS placement text NOT NULL DEFAULT 'hero';
CREATE INDEX IF NOT EXISTS home_slides_placement_idx ON public.home_slides (placement, sort);