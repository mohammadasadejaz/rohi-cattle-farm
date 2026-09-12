
CREATE TYPE public.app_role AS ENUM ('admin');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users read own roles" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE OR REPLACE FUNCTION public.admin_exists()
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE role = 'admin')
$$;
GRANT EXECUTE ON FUNCTION public.admin_exists() TO anon, authenticated;

CREATE OR REPLACE FUNCTION public.handle_new_user_role()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.user_roles WHERE role = 'admin') THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'admin');
  END IF;
  RETURN NEW;
END;
$$;
CREATE TRIGGER on_auth_user_created_role
AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_role();

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

CREATE TABLE public.site_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  farm_name text NOT NULL DEFAULT 'Iqbal Cattle Farm (Rohi)',
  established_year text NOT NULL DEFAULT '2024',
  slogan text NOT NULL DEFAULT 'The Spirit of Cholistan, Delivered.',
  hero_heading text NOT NULL DEFAULT 'IQBAL CATTLE FARM (ROHI)',
  hero_description text NOT NULL DEFAULT 'Premium livestock from the heart of Cholistan — selected for Qurbani, meat and breeding.',
  hero_image_url text,
  hero_cta_primary text NOT NULL DEFAULT 'View Animals',
  hero_cta_secondary text NOT NULL DEFAULT 'Book an Animal',
  about_title text NOT NULL DEFAULT 'About Iqbal Cattle Farm',
  about_description text NOT NULL DEFAULT 'Iqbal Cattle Farm (Rohi) is based in the Cholistan region of Tehsil Yazman, District Bahawalpur. We focus on quality livestock, responsible animal care and superior genetics, offering animals for Qurbani, meat and breeding.',
  about_image_url text,
  contact_person text NOT NULL DEFAULT 'Lt. Col. Safdar Hayat (Retd.)',
  phone text NOT NULL DEFAULT '03218114646',
  whatsapp text NOT NULL DEFAULT '03218114646',
  email text,
  address text NOT NULL DEFAULT 'Track No. 5 (Wanga), Chak No. 340 HR, Tehsil Yazman, District Bahawalpur, Pakistan',
  location_description text NOT NULL DEFAULT 'Our farm is located in the Cholistan (Rohi) area near Yazman, Bahawalpur. Please call before visiting so we can guide you to the farm.',
  maps_url text,
  logo_url text,
  favicon_url text,
  facebook_url text,
  instagram_url text,
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.site_settings TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.site_settings TO authenticated;
GRANT ALL ON public.site_settings TO service_role;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "settings public read" ON public.site_settings FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "settings admin write" ON public.site_settings FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER site_settings_updated BEFORE UPDATE ON public.site_settings FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
INSERT INTO public.site_settings (id) VALUES (gen_random_uuid());

CREATE TABLE public.breeds (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text NOT NULL,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.breeds TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.breeds TO authenticated;
GRANT ALL ON public.breeds TO service_role;
ALTER TABLE public.breeds ENABLE ROW LEVEL SECURITY;
CREATE POLICY "breeds public read" ON public.breeds FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "breeds admin write" ON public.breeds FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
INSERT INTO public.breeds (name, category, sort_order) VALUES
  ('Pure Cholistani','Bulls / Cattle',1),
  ('Brahman','Bulls / Cattle',2),
  ('Gir','Bulls / Cattle',3),
  ('Kajla','Sheep',1),
  ('Bungi','Sheep',2),
  ('Makhi Cheeni','Goats',1),
  ('Rajanpuri','Goats',2),
  ('Kamori','Goats',3);

CREATE TABLE public.services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  image_url text,
  cta_label text,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.services TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.services TO authenticated;
GRANT ALL ON public.services TO service_role;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
CREATE POLICY "services public read" ON public.services FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "services admin write" ON public.services FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
INSERT INTO public.services (title, description, cta_label, sort_order) VALUES
  ('Premium Qurbani Animals','Quality livestock available for Qurbani with advance booking options.','Book for Qurbani',1),
  ('Embryo Transfer','Advanced reproductive technology services to help upgrade Cholistani herd genetics.',NULL,2),
  ('Home Delivery','Home delivery services are available at reasonable fares.','Ask About Delivery',3),
  ('Year-Round Vaccination','Animals receive regular vaccination and ongoing health care throughout the year.',NULL,4),
  ('Advance Qurbani Booking','Customers can reserve animals in advance for Qurbani.','Book in Advance',5);

CREATE TABLE public.animals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  category text NOT NULL,
  breed text,
  gender text NOT NULL DEFAULT 'Male',
  purpose text NOT NULL DEFAULT 'Qurbani',
  description text,
  price numeric,
  availability text NOT NULL DEFAULT 'Available',
  featured boolean NOT NULL DEFAULT false,
  photos text[] NOT NULL DEFAULT '{}',
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.animals TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.animals TO authenticated;
GRANT ALL ON public.animals TO service_role;
ALTER TABLE public.animals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "animals public read" ON public.animals FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "animals admin write" ON public.animals FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER animals_updated BEFORE UPDATE ON public.animals FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.gallery_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url text NOT NULL,
  caption text,
  category text NOT NULL DEFAULT 'Other',
  featured boolean NOT NULL DEFAULT false,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.gallery_images TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.gallery_images TO authenticated;
GRANT ALL ON public.gallery_images TO service_role;
ALTER TABLE public.gallery_images ENABLE ROW LEVEL SECURITY;
CREATE POLICY "gallery public read" ON public.gallery_images FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "gallery admin write" ON public.gallery_images FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TABLE public.inquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  phone text NOT NULL,
  whatsapp text,
  animal_type text NOT NULL,
  breed text,
  purpose text NOT NULL,
  quantity int NOT NULL DEFAULT 1,
  delivery text NOT NULL DEFAULT 'Farm Pickup',
  message text,
  status text NOT NULL DEFAULT 'New',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.inquiries TO anon, authenticated;
GRANT SELECT, UPDATE, DELETE ON public.inquiries TO authenticated;
GRANT ALL ON public.inquiries TO service_role;
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anyone can submit inquiry" ON public.inquiries FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "admins read inquiries" ON public.inquiries FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admins update inquiries" ON public.inquiries FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admins delete inquiries" ON public.inquiries FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER inquiries_updated BEFORE UPDATE ON public.inquiries FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE POLICY "media admin read" ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'media' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "media admin insert" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'media' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "media admin update" ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'media' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "media admin delete" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'media' AND public.has_role(auth.uid(), 'admin'));
