ALTER TABLE public.gallery_images
  ADD COLUMN IF NOT EXISTS media_type text NOT NULL DEFAULT 'photo',
  ADD COLUMN IF NOT EXISTS is_active boolean NOT NULL DEFAULT true;