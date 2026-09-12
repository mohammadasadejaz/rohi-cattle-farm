CREATE TABLE public.animal_cards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  category text NOT NULL DEFAULT 'Bulls / Cattle',
  description text NOT NULL DEFAULT '',
  image_url text,
  cta_label text NOT NULL DEFAULT 'Inquire',
  sort_order integer NOT NULL DEFAULT 0,
  featured boolean NOT NULL DEFAULT false,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.animal_cards TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.animal_cards TO authenticated;
GRANT ALL ON public.animal_cards TO service_role;

ALTER TABLE public.animal_cards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "animal cards public read" ON public.animal_cards
  FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "animal cards admin write" ON public.animal_cards
  FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER animal_cards_updated BEFORE UPDATE ON public.animal_cards
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.site_settings
  ADD COLUMN animals_eyebrow text NOT NULL DEFAULT 'Our Livestock',
  ADD COLUMN animals_title text NOT NULL DEFAULT 'Animals at the Farm',
  ADD COLUMN animals_description text NOT NULL DEFAULT 'Cholistani cattle, sheep and goats raised on the farm. Contact us for current availability, sizes and pricing.';

INSERT INTO public.animal_cards (title, category, description, cta_label, sort_order) VALUES
  ('Premium Bulls', 'Bulls / Cattle', 'Meat animals are available.', 'Inquire About Bulls', 1),
  ('Premium Sheep', 'Sheep', 'Selected males for Qurbani, females for breeding.', 'Inquire About Sheep', 2),
  ('Premium Goats', 'Goats', 'Selected males for Qurbani, females for breeding.', 'Inquire About Goats', 3);