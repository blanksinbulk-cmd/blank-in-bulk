-- ============================================================
-- Migration 2 — bulk pricing note, VAT note, size chart,
-- customer artwork uploads.
-- Run this once in Supabase: SQL Editor -> New query
-- (Safe to run even if some of these already exist.)
-- ============================================================

alter table products add column if not exists bulk_note text;

alter table site_settings add column if not exists prices_note text
  default 'Prices exclude VAT. Printing and branding quoted separately.';
alter table site_settings add column if not exists size_chart_text text
  default 'Size guide coming soon — contact us for exact measurements.';

-- Let anyone (not just the admin) upload a file into the "artwork" folder
-- of the existing media bucket, so customers can attach their logo/design
-- to an order without needing to log in. They can still only write into
-- that one folder — everything else in the bucket stays admin-only.
drop policy if exists "media_public_insert_artwork" on storage.objects;
create policy "media_public_insert_artwork"
  on storage.objects for insert
  with check (bucket_id = 'media' and (storage.foldername(name))[1] = 'artwork');
