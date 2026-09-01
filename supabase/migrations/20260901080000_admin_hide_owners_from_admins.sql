-- Admins can manage staff accounts but cannot see, create, or edit owners.

DROP POLICY IF EXISTS admin_users_select_self_or_admin ON public.admin_users;
CREATE POLICY admin_users_select_self_or_admin
  ON public.admin_users FOR SELECT TO authenticated
  USING (
    auth_user_id = (SELECT auth.uid())
    OR lower(email) = lower(COALESCE((SELECT auth.jwt() ->> 'email'), ''))
    OR public.is_admin_role(ARRAY['owner'])
    OR (
      public.is_admin_role(ARRAY['admin'])
      AND role <> 'owner'
    )
  );

DROP POLICY IF EXISTS admin_users_insert_owner_admin ON public.admin_users;
CREATE POLICY admin_users_insert_owner_admin
  ON public.admin_users FOR INSERT TO authenticated
  WITH CHECK (
    public.is_admin_role(ARRAY['owner'])
    OR (
      public.is_admin_role(ARRAY['admin'])
      AND role <> 'owner'
    )
  );

DROP POLICY IF EXISTS admin_users_update_owner_admin ON public.admin_users;
CREATE POLICY admin_users_update_owner_admin
  ON public.admin_users FOR UPDATE TO authenticated
  USING (
    public.is_admin_role(ARRAY['owner'])
    OR (
      public.is_admin_role(ARRAY['admin'])
      AND role <> 'owner'
    )
  )
  WITH CHECK (
    public.is_admin_role(ARRAY['owner'])
    OR (
      public.is_admin_role(ARRAY['admin'])
      AND role <> 'owner'
    )
  );
