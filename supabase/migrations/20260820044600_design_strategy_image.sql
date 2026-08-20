UPDATE public.services
SET
  image = '/services/design-strategy.jpg',
  hero_image = '/services/design-strategy.jpg',
  updated_at = now()
WHERE slug = 'design-strategy';
