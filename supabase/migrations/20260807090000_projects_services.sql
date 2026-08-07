-- Project ↔ service tags for filtering and service-page carousels
ALTER TABLE public.projects
  ADD COLUMN IF NOT EXISTS services jsonb NOT NULL DEFAULT '["interior-design"]'::jsonb;

COMMENT ON COLUMN public.projects.services IS
  'Service slugs this project showcases (interior-design, branding, design-management, design-strategy)';
