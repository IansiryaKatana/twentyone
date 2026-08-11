-- Public read for cms-media (bucket is public; anon/authenticated SELECT required)
DROP POLICY IF EXISTS cms_media_storage_public_read ON storage.objects;

CREATE POLICY cms_media_storage_public_read
  ON storage.objects FOR SELECT TO anon, authenticated
  USING (bucket_id = 'cms-media');
