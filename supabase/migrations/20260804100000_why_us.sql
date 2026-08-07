CREATE TABLE public.why_us (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  body text NOT NULL DEFAULT '',
  sort_order integer NOT NULL DEFAULT 0,
  published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER why_us_updated_at
  BEFORE UPDATE ON public.why_us
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.why_us ENABLE ROW LEVEL SECURITY;

CREATE POLICY why_us_public_read
  ON public.why_us FOR SELECT TO anon, authenticated
  USING (published = true OR public.is_active_admin());

CREATE POLICY why_us_admin_write
  ON public.why_us FOR ALL TO authenticated
  USING (public.is_active_admin())
  WITH CHECK (public.is_active_admin());
