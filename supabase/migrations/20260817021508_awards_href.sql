-- Optional source URL for About awards list
ALTER TABLE public.awards
  ADD COLUMN IF NOT EXISTS href text;
