-- ============================================================
-- Blanks In Bulk — database schema
-- Run this entire file once in Supabase: SQL Editor -> New query
-- ============================================================

create extension if not exists "uuid-ossp";

-- ------------------------------------------------------------
-- ADMIN ACCESS CONTROL
-- Only email addresses listed in admin_emails can write data.
-- Add your own email here before running (or update it after).
-- ------------------------------------------------------------
create table if not exists admin_emails (
  email text primary key
);

-- >>> EDIT THIS LINE with your own email before running <<<
insert into admin_emails (email) values ('you@example.com')
  on conflict do nothing;

create or replace function is_admin()
returns boolean
language sql
security definer
stable
as $$
  select exists (
    select 1 from admin_emails
    where email = (auth.jwt() ->> 'email')
  );
$$;

-- ------------------------------------------------------------
-- CATEGORIES
-- ------------------------------------------------------------
create table if not exists categories (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text not null unique,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

-- ------------------------------------------------------------
-- PRODUCTS
-- ------------------------------------------------------------
create table if not exists products (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text not null unique,
  description text default '',
  category_id uuid references categories(id) on delete set null,
  price numeric(10,2) not null default 0,
  was_price numeric(10,2),
  sku text,
  sizes text[] default '{}',
  colours text[] default '{}',
  stock_status text not null default 'in_stock'
    check (stock_status in ('in_stock', 'low_stock', 'out_of_stock')),
  moq text not null default '1 unit',
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists products_category_idx on products(category_id);

-- ------------------------------------------------------------
-- PRODUCT MEDIA (images + one video per product, up to 5 images)
-- ------------------------------------------------------------
create table if not exists product_media (
  id uuid primary key default uuid_generate_v4(),
  product_id uuid not null references products(id) on delete cascade,
  media_type text not null check (media_type in ('image', 'video')),
  url text not null,
  position int not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists product_media_product_idx on product_media(product_id);

-- ------------------------------------------------------------
-- PRINTING SERVICES
-- ------------------------------------------------------------
create table if not exists printing_services (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  description text default '',
  starting_price text not null default 'Contact for pricing',
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists printing_service_media (
  id uuid primary key default uuid_generate_v4(),
  service_id uuid not null references printing_services(id) on delete cascade,
  media_type text not null check (media_type in ('image', 'video')),
  url text not null,
  position int not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists printing_media_service_idx on printing_service_media(service_id);

-- ------------------------------------------------------------
-- SITE SETTINGS (contact info) — single row
-- ------------------------------------------------------------
create table if not exists site_settings (
  id int primary key default 1,
  email text not null default 'blanksinbulk@gmail.com',
  phone text not null default '+27 73 876 6823',
  note text not null default 'Wholesale enquiries welcome. Nationwide delivery in 2-3 working days.',
  about_heading text not null default 'About Us',
  about_text text not null default 'Blanks In Bulk supplies premium blank apparel to brands, schools, churches, sports clubs and businesses across South Africa.',
  constraint single_row check (id = 1)
);

insert into site_settings (id) values (1) on conflict do nothing;

-- ------------------------------------------------------------
-- ROW LEVEL SECURITY
-- Public (anon) can read published data.
-- Only admin_emails can write anything.
-- ------------------------------------------------------------
alter table categories enable row level security;
alter table products enable row level security;
alter table product_media enable row level security;
alter table printing_services enable row level security;
alter table printing_service_media enable row level security;
alter table site_settings enable row level security;
alter table admin_emails enable row level security;

-- categories
create policy "categories_public_read" on categories for select using (true);
create policy "categories_admin_write" on categories for all using (is_admin()) with check (is_admin());

-- products (public only sees published ones; admin sees + edits everything)
create policy "products_public_read" on products for select using (is_published = true or is_admin());
create policy "products_admin_write" on products for all using (is_admin()) with check (is_admin());

-- product media
create policy "product_media_public_read" on product_media for select using (true);
create policy "product_media_admin_write" on product_media for all using (is_admin()) with check (is_admin());

-- printing services
create policy "printing_public_read" on printing_services for select using (true);
create policy "printing_admin_write" on printing_services for all using (is_admin()) with check (is_admin());

create policy "printing_media_public_read" on printing_service_media for select using (true);
create policy "printing_media_admin_write" on printing_service_media for all using (is_admin()) with check (is_admin());

-- settings
create policy "settings_public_read" on site_settings for select using (true);
create policy "settings_admin_write" on site_settings for all using (is_admin()) with check (is_admin());

-- admin_emails: nobody can read/write this via the API, only via SQL editor
create policy "admin_emails_no_access" on admin_emails for all using (false);

-- ------------------------------------------------------------
-- STARTER DATA (safe to delete later from the admin dashboard)
-- ------------------------------------------------------------
insert into categories (name, slug, sort_order) values
  ('Hoodies', 'hoodies', 1),
  ('T-Shirts', 't-shirts', 2),
  ('Long Sleeves', 'long-sleeves', 3),
  ('Caps', 'caps', 4)
on conflict (slug) do nothing;

insert into printing_services (name, description, starting_price, sort_order) values
  ('DTF Printing', 'Durable, vibrant transfers that handle multicolour designs and small batch runs with ease.', 'From R45 per print', 1),
  ('Sublimation', 'Full-colour, edge-to-edge prints dyed directly into the fabric for a finish that never cracks or peels.', 'From R60 per print', 2),
  ('Embroidery', 'Stitched detail for a premium, long-lasting finish, built for caps, hoodies and workwear.', 'From R80 per logo', 3)
on conflict do nothing;
