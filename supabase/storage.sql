-- ============================================================
-- Storage setup — run this AFTER schema.sql
-- Creates one public bucket for all product/printing media.
-- ============================================================

insert into storage.buckets (id, name, public, file_size_limit)
values ('media', 'media', true, 104857600) -- 100MB per file limit
on conflict (id) do nothing;

-- Anyone can view files (needed so product photos/videos load on the site)
create policy "media_public_read"
  on storage.objects for select
  using (bucket_id = 'media');

-- Only admin can upload
create policy "media_admin_insert"
  on storage.objects for insert
  with check (bucket_id = 'media' and is_admin());

-- Only admin can update
create policy "media_admin_update"
  on storage.objects for update
  using (bucket_id = 'media' and is_admin());

-- Only admin can delete
create policy "media_admin_delete"
  on storage.objects for delete
  using (bucket_id = 'media' and is_admin());
