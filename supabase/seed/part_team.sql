-- Seed Our Team members (photos uploaded later via admin)
INSERT INTO public.team_members (id, name, title, image, linkedin, instagram, sort_order, published) VALUES
('a1111111-1111-4111-8111-111111111101', 'Govind Shepley', 'Founder and Creative Director', '', 'https://www.linkedin.com/in/govind-shepley-98869b38/', 'https://www.instagram.com/govind_shepley/', 0, true),
('a1111111-1111-4111-8111-111111111102', 'Mike Kobzar', 'Brand Director', '', 'https://www.linkedin.com/in/mike-kobzar-35b926107/', 'https://www.instagram.com/thebearhands/', 1, true),
('a1111111-1111-4111-8111-111111111103', 'Clarice Tungol', 'Interior Design Manager', '', 'https://www.linkedin.com/in/clarice-t-912862122/', '', 2, true),
('a1111111-1111-4111-8111-111111111104', 'Sabiha Yusuf Timalia', 'Interior Designer', '', 'https://www.linkedin.com/in/sabihayusuf/', '', 3, true),
('a1111111-1111-4111-8111-111111111105', 'Janell Voi Cipriano', 'Technical Design Manager', '', '', '', 4, true),
('a1111111-1111-4111-8111-111111111106', 'Minerva Farag', 'Marketing Manager', '', 'https://www.linkedin.com/in/minerva-farag-00356087/', 'https://www.instagram.com/minervafarag/', 5, true)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  title = EXCLUDED.title,
  linkedin = EXCLUDED.linkedin,
  instagram = EXCLUDED.instagram,
  sort_order = EXCLUDED.sort_order,
  published = EXCLUDED.published,
  updated_at = now();
