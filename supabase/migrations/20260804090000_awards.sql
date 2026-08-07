-- Awards / Recognition list for About page
CREATE TABLE public.awards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  status text NOT NULL DEFAULT 'winner'
    CHECK (status IN ('winner', 'highly_commended', 'shortlisted', 'editorial')),
  title text NOT NULL,
  sort_order integer NOT NULL DEFAULT 0,
  published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER awards_updated_at
  BEFORE UPDATE ON public.awards
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.awards ENABLE ROW LEVEL SECURITY;

CREATE POLICY awards_public_read
  ON public.awards FOR SELECT TO anon, authenticated
  USING (published = true OR public.is_active_admin());

CREATE POLICY awards_admin_write
  ON public.awards FOR ALL TO authenticated
  USING (public.is_active_admin())
  WITH CHECK (public.is_active_admin());
