-- ============================================================
-- MIGRATION: Website Sekolah PPDB System
-- Jalankan di Supabase SQL Editor (idempotent / aman diulang)
-- ============================================================

-- ============================================================
-- 0. FUNGSI BANTUAN
-- ============================================================
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- ============================================================
-- 1. TABEL PROFILES
-- ============================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL DEFAULT '',
  phone TEXT NOT NULL DEFAULT '',
  role TEXT NOT NULL DEFAULT 'peserta' CHECK (role IN ('peserta', 'admin')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Hindari rekursi RLS pada profiles. Create this after profiles exists.
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'
  );
$$;

CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, phone, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', ''),
    COALESCE(NEW.raw_user_meta_data ->> 'phone', ''),
    'peserta'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

DROP TRIGGER IF EXISTS profiles_updated_at ON public.profiles;
CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admin can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile (not role)" ON public.profiles;

CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Admin can view all profiles"
  ON public.profiles FOR SELECT
  USING (public.is_admin());

CREATE POLICY "Users can update own profile (not role)"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id AND role = (SELECT p.role FROM public.profiles p WHERE p.id = auth.uid()));

-- ============================================================
-- 2. TABEL PPDB_SETTINGS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.ppdb_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  period_name TEXT NOT NULL,
  academic_year TEXT NOT NULL,
  open_date DATE NOT NULL,
  close_date DATE NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_ppdb_settings_active
  ON public.ppdb_settings (is_active) WHERE is_active = true;

CREATE UNIQUE INDEX IF NOT EXISTS idx_ppdb_settings_period
  ON public.ppdb_settings (period_name, academic_year);

DROP TRIGGER IF EXISTS ppdb_settings_updated_at ON public.ppdb_settings;
CREATE TRIGGER ppdb_settings_updated_at
  BEFORE UPDATE ON public.ppdb_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

ALTER TABLE public.ppdb_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can read ppdb_settings" ON public.ppdb_settings;
CREATE POLICY "Anyone can read ppdb_settings"
  ON public.ppdb_settings FOR SELECT
  USING (true);

-- ============================================================
-- 3. TABEL PPDB_APPLICATIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.ppdb_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  registration_number TEXT UNIQUE NOT NULL,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  period_id UUID REFERENCES public.ppdb_settings(id),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL DEFAULT '',
  nisn TEXT NOT NULL,
  birth_place TEXT NOT NULL,
  birth_date DATE NOT NULL,
  gender TEXT NOT NULL CHECK (gender IN ('Laki-laki', 'Perempuan')),
  address TEXT NOT NULL,
  previous_school TEXT NOT NULL,
  phone TEXT NOT NULL,
  parent_name TEXT NOT NULL,
  parent_phone TEXT NOT NULL,
  major_choice TEXT,
  status TEXT NOT NULL DEFAULT 'menunggu' CHECK (status IN ('menunggu', 'berhasil', 'diterima', 'ditolak')),
  is_draft BOOLEAN NOT NULL DEFAULT false,
  admin_notes TEXT DEFAULT '',
  submitted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.ppdb_applications ADD COLUMN IF NOT EXISTS email TEXT NOT NULL DEFAULT '';
ALTER TABLE public.ppdb_applications ADD COLUMN IF NOT EXISTS is_draft BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE public.ppdb_applications DROP CONSTRAINT IF EXISTS ppdb_applications_status_check;
UPDATE public.ppdb_applications SET status = 'berhasil' WHERE status = 'diproses';
ALTER TABLE public.ppdb_applications
  ADD CONSTRAINT ppdb_applications_status_check
  CHECK (status IN ('menunggu', 'berhasil', 'diterima', 'ditolak'));

CREATE INDEX IF NOT EXISTS idx_ppdb_user_id ON public.ppdb_applications(user_id);
CREATE INDEX IF NOT EXISTS idx_ppdb_status ON public.ppdb_applications(status);
CREATE INDEX IF NOT EXISTS idx_ppdb_period_id ON public.ppdb_applications(period_id);
CREATE INDEX IF NOT EXISTS idx_ppdb_created_at ON public.ppdb_applications(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ppdb_registration_number ON public.ppdb_applications(registration_number);
CREATE INDEX IF NOT EXISTS idx_ppdb_email ON public.ppdb_applications(email);
CREATE INDEX IF NOT EXISTS idx_ppdb_nisn ON public.ppdb_applications(nisn);

CREATE UNIQUE INDEX IF NOT EXISTS idx_ppdb_user_period
  ON public.ppdb_applications(user_id, period_id);

DROP TRIGGER IF EXISTS ppdb_applications_updated_at ON public.ppdb_applications;
CREATE TRIGGER ppdb_applications_updated_at
  BEFORE UPDATE ON public.ppdb_applications
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

ALTER TABLE public.ppdb_applications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Peserta can view own applications" ON public.ppdb_applications;
DROP POLICY IF EXISTS "Admin can view all applications" ON public.ppdb_applications;
DROP POLICY IF EXISTS "Peserta can insert own application" ON public.ppdb_applications;
DROP POLICY IF EXISTS "Peserta can update own draft application" ON public.ppdb_applications;
DROP POLICY IF EXISTS "Admin can update any application" ON public.ppdb_applications;

CREATE POLICY "Peserta can view own applications"
  ON public.ppdb_applications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admin can view all applications"
  ON public.ppdb_applications FOR SELECT
  USING (public.is_admin());

CREATE POLICY "Peserta can insert own application"
  ON public.ppdb_applications FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Peserta can update own draft application"
  ON public.ppdb_applications FOR UPDATE
  USING (auth.uid() = user_id AND (is_draft = true OR status = 'menunggu'))
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admin can update any application"
  ON public.ppdb_applications FOR UPDATE
  USING (public.is_admin());

-- ============================================================
-- 4. TABEL NEWS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.news (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT NOT NULL DEFAULT '',
  content TEXT NOT NULL DEFAULT '',
  cover_image_path TEXT DEFAULT '',
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  author_id UUID NOT NULL REFERENCES public.profiles(id),
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_news_status ON public.news(status);
CREATE INDEX IF NOT EXISTS idx_news_slug ON public.news(slug);
CREATE INDEX IF NOT EXISTS idx_news_published_at ON public.news(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_news_author_id ON public.news(author_id);

DROP TRIGGER IF EXISTS news_updated_at ON public.news;
CREATE TRIGGER news_updated_at
  BEFORE UPDATE ON public.news
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can read published news" ON public.news;
DROP POLICY IF EXISTS "Admin can read all news" ON public.news;
DROP POLICY IF EXISTS "Admin can insert news" ON public.news;
DROP POLICY IF EXISTS "Admin can update news" ON public.news;
DROP POLICY IF EXISTS "Admin can delete news" ON public.news;

CREATE POLICY "Anyone can read published news"
  ON public.news FOR SELECT
  USING (status = 'published');

CREATE POLICY "Admin can read all news"
  ON public.news FOR SELECT
  USING (public.is_admin());

CREATE POLICY "Admin can insert news"
  ON public.news FOR INSERT
  WITH CHECK (public.is_admin());

CREATE POLICY "Admin can update news"
  ON public.news FOR UPDATE
  USING (public.is_admin());

CREATE POLICY "Admin can delete news"
  ON public.news FOR DELETE
  USING (public.is_admin());

-- ============================================================
-- 5. SUPABASE STORAGE
-- ============================================================
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'news-images',
  'news-images',
  true,
  5242880,
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public, file_size_limit)
VALUES ('ppdb-documents', 'ppdb-documents', false, 10485760)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Public read news images" ON storage.objects;
DROP POLICY IF EXISTS "Admin upload news images" ON storage.objects;
DROP POLICY IF EXISTS "Admin update news images" ON storage.objects;
DROP POLICY IF EXISTS "Admin delete news images" ON storage.objects;
DROP POLICY IF EXISTS "Users upload own ppdb documents" ON storage.objects;
DROP POLICY IF EXISTS "Owner or admin read ppdb documents" ON storage.objects;
DROP POLICY IF EXISTS "Owner or admin delete ppdb documents" ON storage.objects;

CREATE POLICY "Public read news images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'news-images');

CREATE POLICY "Admin upload news images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'news-images' AND public.is_admin());

CREATE POLICY "Admin update news images"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'news-images' AND public.is_admin());

CREATE POLICY "Admin delete news images"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'news-images' AND public.is_admin());

CREATE POLICY "Users upload own ppdb documents"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'ppdb-documents'
    AND auth.uid() IS NOT NULL
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Owner or admin read ppdb documents"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'ppdb-documents'
    AND (
      public.is_admin()
      OR (storage.foldername(name))[1] = auth.uid()::text
    )
  );

CREATE POLICY "Owner or admin delete ppdb documents"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'ppdb-documents'
    AND (
      public.is_admin()
      OR (storage.foldername(name))[1] = auth.uid()::text
    )
  );

-- ============================================================
-- 6. SEED DATA: Periode PPDB aktif
-- ============================================================
UPDATE public.ppdb_settings
SET is_active = false
WHERE is_active = true
  AND (period_name, academic_year) <> ('PPDB Gelombang 1', '2026/2027');

INSERT INTO public.ppdb_settings (period_name, academic_year, open_date, close_date, is_active)
VALUES ('PPDB Gelombang 1', '2026/2027', '2026-10-26', '2026-12-25', true)
ON CONFLICT (period_name, academic_year) DO UPDATE SET
  open_date = EXCLUDED.open_date,
  close_date = EXCLUDED.close_date,
  is_active = EXCLUDED.is_active,
  updated_at = now();

-- ============================================================
-- 7. PROSEDUR: Membuat Admin Pertama
-- ============================================================
CREATE OR REPLACE FUNCTION public.promote_to_admin(target_email TEXT)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  target_id UUID;
BEGIN
  SELECT id INTO target_id FROM auth.users WHERE email = target_email;
  IF target_id IS NULL THEN
    RAISE EXCEPTION 'User with email % not found', target_email;
  END IF;
  UPDATE public.profiles SET role = 'admin' WHERE id = target_id;
END;
$$;

REVOKE ALL ON FUNCTION public.promote_to_admin(TEXT) FROM PUBLIC, anon, authenticated;

-- Contoh: SELECT public.promote_to_admin('admin@sekolah.id');
