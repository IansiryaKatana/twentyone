-- Fix anon 401s on team_members / awards / why_us:
-- 1) Grant table SELECT (tables created after foundation GRANT ALL TABLES)
-- 2) Stop requiring EXECUTE on is_active_admin() for public published reads

GRANT SELECT ON public.team_members TO anon, authenticated;
GRANT SELECT ON public.awards TO anon, authenticated;
GRANT SELECT ON public.why_us TO anon, authenticated;

GRANT INSERT, UPDATE, DELETE ON public.team_members TO authenticated;
GRANT INSERT, UPDATE, DELETE ON public.awards TO authenticated;
GRANT INSERT, UPDATE, DELETE ON public.why_us TO authenticated;

-- Allow anon to evaluate policies that still use OR is_active_admin()
-- (returns false for anonymous JWT; SECURITY DEFINER only checks admin_users)
GRANT EXECUTE ON FUNCTION public.is_active_admin() TO anon;
GRANT EXECUTE ON FUNCTION public.is_admin_role(text[]) TO anon;

-- Prefer published-only public read so anon never needs the admin helper
DROP POLICY IF EXISTS team_members_public_read ON public.team_members;
CREATE POLICY team_members_public_read
  ON public.team_members FOR SELECT TO anon, authenticated
  USING (published = true);
CREATE POLICY team_members_admin_read
  ON public.team_members FOR SELECT TO authenticated
  USING (public.is_active_admin());

DROP POLICY IF EXISTS awards_public_read ON public.awards;
CREATE POLICY awards_public_read
  ON public.awards FOR SELECT TO anon, authenticated
  USING (published = true);
CREATE POLICY awards_admin_read
  ON public.awards FOR SELECT TO authenticated
  USING (public.is_active_admin());

DROP POLICY IF EXISTS why_us_public_read ON public.why_us;
CREATE POLICY why_us_public_read
  ON public.why_us FOR SELECT TO anon, authenticated
  USING (published = true);
CREATE POLICY why_us_admin_read
  ON public.why_us FOR SELECT TO authenticated
  USING (public.is_active_admin());
