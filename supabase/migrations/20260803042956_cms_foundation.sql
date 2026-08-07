-- Twentyone06 CMS foundation: tables, helper, RLS, storage

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- ---------------------------------------------------------------------------
-- admin_users (create before helper functions that reference it)
-- ---------------------------------------------------------------------------
CREATE TABLE public.admin_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_user_id uuid UNIQUE REFERENCES auth.users (id) ON DELETE SET NULL,
  email text NOT NULL UNIQUE,
  role text NOT NULL DEFAULT 'editor'
    CHECK (role IN ('owner', 'admin', 'editor', 'viewer')),
  is_active boolean NOT NULL DEFAULT true,
  display_name text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER admin_users_updated_at
  BEFORE UPDATE ON public.admin_users
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE OR REPLACE FUNCTION public.is_active_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.admin_users au
    WHERE au.is_active = true
      AND (
        au.auth_user_id = auth.uid()
        OR lower(au.email) = lower(COALESCE(auth.jwt() ->> 'email', ''))
      )
  );
$$;

REVOKE ALL ON FUNCTION public.is_active_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_active_admin() TO authenticated;

CREATE OR REPLACE FUNCTION public.is_admin_role(allowed text[])
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.admin_users au
    WHERE au.is_active = true
      AND au.role = ANY (allowed)
      AND (
        au.auth_user_id = auth.uid()
        OR lower(au.email) = lower(COALESCE(auth.jwt() ->> 'email', ''))
      )
  );
$$;

REVOKE ALL ON FUNCTION public.is_admin_role(text[]) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_admin_role(text[]) TO authenticated;

ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

CREATE POLICY admin_users_select_self_or_admin
  ON public.admin_users FOR SELECT TO authenticated
  USING (
    auth_user_id = auth.uid()
    OR lower(email) = lower(COALESCE(auth.jwt() ->> 'email', ''))
    OR public.is_admin_role(ARRAY['owner', 'admin'])
  );

CREATE POLICY admin_users_insert_owner_admin
  ON public.admin_users FOR INSERT TO authenticated
  WITH CHECK (public.is_admin_role(ARRAY['owner', 'admin']));

CREATE POLICY admin_users_update_owner_admin
  ON public.admin_users FOR UPDATE TO authenticated
  USING (public.is_admin_role(ARRAY['owner', 'admin']))
  WITH CHECK (public.is_admin_role(ARRAY['owner', 'admin']));

CREATE POLICY admin_users_delete_owner
  ON public.admin_users FOR DELETE TO authenticated
  USING (public.is_admin_role(ARRAY['owner']));

-- Allow first owner bootstrap: insert own row when table has no owners
CREATE POLICY admin_users_bootstrap_owner
  ON public.admin_users FOR INSERT TO authenticated
  WITH CHECK (
    NOT EXISTS (SELECT 1 FROM public.admin_users)
    AND lower(email) = lower(COALESCE(auth.jwt() ->> 'email', ''))
  );

-- ---------------------------------------------------------------------------
-- projects
-- ---------------------------------------------------------------------------
CREATE TABLE public.projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  location text NOT NULL DEFAULT '',
  price text NOT NULL DEFAULT '',
  category text NOT NULL DEFAULT 'Residential'
    CHECK (category IN ('Residential', 'Hospitality', 'Commercial')),
  year text NOT NULL DEFAULT '',
  client text NOT NULL DEFAULT '',
  area text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'Completed',
  duration text NOT NULL DEFAULT '',
  typologies jsonb NOT NULL DEFAULT '[]'::jsonb,
  scope jsonb NOT NULL DEFAULT '[]'::jsonb,
  materials jsonb NOT NULL DEFAULT '[]'::jsonb,
  finishes jsonb NOT NULL DEFAULT '[]'::jsonb,
  credits jsonb NOT NULL DEFAULT '[]'::jsonb,
  challenge text NOT NULL DEFAULT '',
  approach text NOT NULL DEFAULT '',
  outcome text NOT NULL DEFAULT '',
  excerpt text NOT NULL DEFAULT '',
  body jsonb NOT NULL DEFAULT '[]'::jsonb,
  hero text NOT NULL DEFAULT '',
  gallery jsonb NOT NULL DEFAULT '[]'::jsonb,
  span text NOT NULL DEFAULT 'tall' CHECK (span IN ('tall', 'short', 'wide')),
  featured boolean NOT NULL DEFAULT false,
  sort_order integer NOT NULL DEFAULT 0,
  published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX projects_published_sort_idx ON public.projects (published, sort_order);

CREATE TRIGGER projects_updated_at
  BEFORE UPDATE ON public.projects
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY projects_public_read
  ON public.projects FOR SELECT TO anon, authenticated
  USING (published = true OR public.is_active_admin());

CREATE POLICY projects_admin_write
  ON public.projects FOR ALL TO authenticated
  USING (public.is_active_admin())
  WITH CHECK (public.is_active_admin());

-- ---------------------------------------------------------------------------
-- journal_posts
-- ---------------------------------------------------------------------------
CREATE TABLE public.journal_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  excerpt text NOT NULL DEFAULT '',
  date text NOT NULL DEFAULT '',
  tag text NOT NULL DEFAULT '',
  image text NOT NULL DEFAULT '',
  body jsonb NOT NULL DEFAULT '[]'::jsonb,
  body_html text NOT NULL DEFAULT '',
  featured boolean NOT NULL DEFAULT false,
  sort_order integer NOT NULL DEFAULT 0,
  published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX journal_posts_published_sort_idx ON public.journal_posts (published, sort_order);

CREATE TRIGGER journal_posts_updated_at
  BEFORE UPDATE ON public.journal_posts
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.journal_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY journal_public_read
  ON public.journal_posts FOR SELECT TO anon, authenticated
  USING (published = true OR public.is_active_admin());

CREATE POLICY journal_admin_write
  ON public.journal_posts FOR ALL TO authenticated
  USING (public.is_active_admin())
  WITH CHECK (public.is_active_admin());

-- ---------------------------------------------------------------------------
-- faqs
-- ---------------------------------------------------------------------------
CREATE TABLE public.faq_topics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  label text NOT NULL,
  sort_order integer NOT NULL DEFAULT 0,
  published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER faq_topics_updated_at
  BEFORE UPDATE ON public.faq_topics
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.faq_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  topic_id uuid NOT NULL REFERENCES public.faq_topics (id) ON DELETE CASCADE,
  question text NOT NULL,
  answer text NOT NULL DEFAULT '',
  answer_html text NOT NULL DEFAULT '',
  link_label text,
  link_to text,
  sort_order integer NOT NULL DEFAULT 0,
  published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX faq_entries_topic_idx ON public.faq_entries (topic_id, sort_order);

CREATE TRIGGER faq_entries_updated_at
  BEFORE UPDATE ON public.faq_entries
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.faq_topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faq_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY faq_topics_public_read
  ON public.faq_topics FOR SELECT TO anon, authenticated
  USING (published = true OR public.is_active_admin());

CREATE POLICY faq_topics_admin_write
  ON public.faq_topics FOR ALL TO authenticated
  USING (public.is_active_admin())
  WITH CHECK (public.is_active_admin());

CREATE POLICY faq_entries_public_read
  ON public.faq_entries FOR SELECT TO anon, authenticated
  USING (published = true OR public.is_active_admin());

CREATE POLICY faq_entries_admin_write
  ON public.faq_entries FOR ALL TO authenticated
  USING (public.is_active_admin())
  WITH CHECK (public.is_active_admin());

-- ---------------------------------------------------------------------------
-- services
-- ---------------------------------------------------------------------------
CREATE TABLE public.services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  label text NOT NULL,
  index_label text NOT NULL DEFAULT '',
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  detail text NOT NULL DEFAULT '',
  intro text NOT NULL DEFAULT '',
  bullets jsonb NOT NULL DEFAULT '[]'::jsonb,
  cta text NOT NULL DEFAULT '',
  image text NOT NULL DEFAULT '',
  hero_image text NOT NULL DEFAULT '',
  sort_order integer NOT NULL DEFAULT 0,
  published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER services_updated_at
  BEFORE UPDATE ON public.services
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.service_capabilities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id uuid NOT NULL REFERENCES public.services (id) ON DELETE CASCADE,
  index_label text NOT NULL DEFAULT '',
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  image text NOT NULL DEFAULT '',
  sort_order integer NOT NULL DEFAULT 0,
  published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX service_capabilities_service_idx ON public.service_capabilities (service_id, sort_order);

CREATE TRIGGER service_capabilities_updated_at
  BEFORE UPDATE ON public.service_capabilities
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_capabilities ENABLE ROW LEVEL SECURITY;

CREATE POLICY services_public_read
  ON public.services FOR SELECT TO anon, authenticated
  USING (published = true OR public.is_active_admin());

CREATE POLICY services_admin_write
  ON public.services FOR ALL TO authenticated
  USING (public.is_active_admin())
  WITH CHECK (public.is_active_admin());

CREATE POLICY service_capabilities_public_read
  ON public.service_capabilities FOR SELECT TO anon, authenticated
  USING (published = true OR public.is_active_admin());

CREATE POLICY service_capabilities_admin_write
  ON public.service_capabilities FOR ALL TO authenticated
  USING (public.is_active_admin())
  WITH CHECK (public.is_active_admin());

-- ---------------------------------------------------------------------------
-- testimonials
-- ---------------------------------------------------------------------------
CREATE TABLE public.testimonials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  quote text NOT NULL,
  name text NOT NULL,
  role text NOT NULL DEFAULT '',
  image text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'approved'
    CHECK (status IN ('pending', 'approved', 'rejected')),
  sort_order integer NOT NULL DEFAULT 0,
  published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER testimonials_updated_at
  BEFORE UPDATE ON public.testimonials
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

CREATE POLICY testimonials_public_read
  ON public.testimonials FOR SELECT TO anon, authenticated
  USING (
    (published = true AND status = 'approved')
    OR public.is_active_admin()
  );

CREATE POLICY testimonials_admin_write
  ON public.testimonials FOR ALL TO authenticated
  USING (public.is_active_admin())
  WITH CHECK (public.is_active_admin());

-- ---------------------------------------------------------------------------
-- marketing_pages + site_settings
-- ---------------------------------------------------------------------------
CREATE TABLE public.marketing_pages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  title text NOT NULL DEFAULT '',
  content jsonb NOT NULL DEFAULT '{}'::jsonb,
  published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER marketing_pages_updated_at
  BEFORE UPDATE ON public.marketing_pages
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.marketing_pages ENABLE ROW LEVEL SECURITY;

CREATE POLICY marketing_pages_public_read
  ON public.marketing_pages FOR SELECT TO anon, authenticated
  USING (published = true OR public.is_active_admin());

CREATE POLICY marketing_pages_admin_write
  ON public.marketing_pages FOR ALL TO authenticated
  USING (public.is_active_admin())
  WITH CHECK (public.is_active_admin());

CREATE TABLE public.site_settings (
  key text PRIMARY KEY,
  value jsonb NOT NULL DEFAULT 'null'::jsonb,
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER site_settings_updated_at
  BEFORE UPDATE ON public.site_settings
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY site_settings_public_read
  ON public.site_settings FOR SELECT TO anon, authenticated
  USING (true);

CREATE POLICY site_settings_admin_write
  ON public.site_settings FOR ALL TO authenticated
  USING (public.is_active_admin())
  WITH CHECK (public.is_active_admin());

-- ---------------------------------------------------------------------------
-- cms_media
-- ---------------------------------------------------------------------------
CREATE TABLE public.cms_media (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  public_url text NOT NULL,
  storage_path text NOT NULL,
  folder text NOT NULL DEFAULT 'general',
  kind text NOT NULL DEFAULT 'image' CHECK (kind IN ('image', 'video', 'file')),
  file_name text NOT NULL DEFAULT '',
  mime_type text,
  size_bytes bigint,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER cms_media_updated_at
  BEFORE UPDATE ON public.cms_media
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.cms_media ENABLE ROW LEVEL SECURITY;

CREATE POLICY cms_media_public_read
  ON public.cms_media FOR SELECT TO anon, authenticated
  USING (true);

CREATE POLICY cms_media_admin_write
  ON public.cms_media FOR ALL TO authenticated
  USING (public.is_active_admin())
  WITH CHECK (public.is_active_admin());

-- ---------------------------------------------------------------------------
-- form_submissions
-- ---------------------------------------------------------------------------
CREATE TABLE public.form_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  form_name text NOT NULL DEFAULT 'contact',
  payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  status text NOT NULL DEFAULT 'new'
    CHECK (status IN ('new', 'read', 'archived')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER form_submissions_updated_at
  BEFORE UPDATE ON public.form_submissions
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.form_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY form_submissions_anon_insert
  ON public.form_submissions FOR INSERT TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY form_submissions_admin_read
  ON public.form_submissions FOR SELECT TO authenticated
  USING (public.is_active_admin());

CREATE POLICY form_submissions_admin_update
  ON public.form_submissions FOR UPDATE TO authenticated
  USING (public.is_active_admin())
  WITH CHECK (public.is_active_admin());

CREATE POLICY form_submissions_admin_delete
  ON public.form_submissions FOR DELETE TO authenticated
  USING (public.is_active_admin());

-- ---------------------------------------------------------------------------
-- Storage bucket
-- ---------------------------------------------------------------------------
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'cms-media',
  'cms-media',
  true,
  52428800,
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml', 'video/mp4', 'video/webm']
)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY cms_media_storage_public_read
  ON storage.objects FOR SELECT TO anon, authenticated
  USING (bucket_id = 'cms-media');

CREATE POLICY cms_media_storage_admin_insert
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'cms-media' AND public.is_active_admin());

CREATE POLICY cms_media_storage_admin_update
  ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'cms-media' AND public.is_active_admin())
  WITH CHECK (bucket_id = 'cms-media' AND public.is_active_admin());

CREATE POLICY cms_media_storage_admin_delete
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'cms-media' AND public.is_active_admin());

GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT INSERT ON public.form_submissions TO anon;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
