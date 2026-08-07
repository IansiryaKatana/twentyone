INSERT INTO public.why_us (id, title, body, sort_order, published) VALUES
('c1111111-1111-4111-8111-111111111101', 'People-First. Always.', 'Every design starts with the people who will use the space. Not the brief. Not the budget. The people.', 0, true),
('c1111111-1111-4111-8111-111111111102', 'Multi-Award Winning', 'Locally and internationally recognised across CID MENA, CID Hospitality, Design Middle East, and Luxuri Magazine. 38+ nominations. 6 confirmed wins.', 1, true),
('c1111111-1111-4111-8111-111111111103', 'Client-Centric by Design', 'We adapt to each client''s vision, timeline, and constraints, and we stay accountable throughout, not just at handover.', 2, true),
('c1111111-1111-4111-8111-111111111104', 'Research-Led, Result-Driven', 'Our designs are grounded in real market knowledge. We understand F&B, hospitality, and commercial sectors from the inside.', 3, true),
('c1111111-1111-4111-8111-111111111105', 'Designed to Perform.', 'We design with functionality, durability, and operational efficiency at the centre. Beautiful is the baseline. Functional is the standard.', 4, true),
('c1111111-1111-4111-8111-111111111106', 'Full-Service. One Studio.', 'Interior Design, Branding, Design Project Management, and Design Strategy. One team, four service lines, one accountable partner.', 5, true)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  body = EXCLUDED.body,
  sort_order = EXCLUDED.sort_order,
  published = EXCLUDED.published,
  updated_at = now();
