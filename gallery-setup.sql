-- ============================================================
-- AROMA CHAI — Cover photo + Gallery columns
-- Paste this whole file into: Supabase → SQL Editor → Run
-- ============================================================

alter table outlets add column if not exists cover text;
alter table outlets add column if not exists gallery jsonb not null default '[]'::jsonb;

-- Move existing photos: first photo becomes the cover,
-- the rest become the gallery.
update outlets
set cover = images->>0
where cover is null and jsonb_array_length(images) > 0;

update outlets
set gallery = images - 0
where jsonb_array_length(images) > 1 and jsonb_array_length(gallery) = 0;
