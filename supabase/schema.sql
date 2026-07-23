-- ============================================================================
-- TEMPLE ADMIN PANEL — SUPABASE SCHEMA
-- Roles: super_admin, admin
-- All public-facing content fields are bilingual: *_kn (Kannada, default) / *_en
-- ============================================================================

create extension if not exists "uuid-ossp";
create extension if not exists pgcrypto;

-- ----------------------------------------------------------------------------
-- ROLE ENUM
-- ----------------------------------------------------------------------------
create type public.admin_role as enum ('super_admin', 'admin');

-- ----------------------------------------------------------------------------
-- ADMINS (extends auth.users) — super_admin manages this table
-- ----------------------------------------------------------------------------
create table public.admin_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  email text not null unique,
  role public.admin_role not null default 'admin',
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_admin_profiles_role on public.admin_profiles(role);

-- Helper: current user's role (security definer avoids RLS recursion)
create or replace function public.current_admin_role()
returns public.admin_role
language sql security definer stable as $$
  select role from public.admin_profiles where id = auth.uid();
$$;

create or replace function public.is_super_admin()
returns boolean
language sql security definer stable as $$
  select coalesce((select role = 'super_admin' from public.admin_profiles where id = auth.uid()), false);
$$;

create or replace function public.is_admin_user()
returns boolean
language sql security definer stable as $$
  select exists(select 1 from public.admin_profiles where id = auth.uid() and is_active = true);
$$;

-- ----------------------------------------------------------------------------
-- TEMPLE PROFILE (singleton row) — name, address, contact
-- ----------------------------------------------------------------------------
create table public.temple_profile (
  id uuid primary key default uuid_generate_v4(),
  name_kn text not null default '',
  name_en text not null default '',
  address_kn text not null default '',
  address_en text not null default '',
  phone text,
  alt_phone text,
  email text,
  whatsapp text,
  map_link text,
  logo_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- SEVAS (bookable/display rituals)
-- ----------------------------------------------------------------------------
create table public.sevas (
  id uuid primary key default uuid_generate_v4(),
  title_kn text not null,
  title_en text not null,
  description_kn text default '',
  description_en text default '',
  price numeric(10,2) default 0,
  image_url text,
  is_active boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_sevas_active_order on public.sevas(is_active, sort_order);

-- ----------------------------------------------------------------------------
-- MEDIA (images & videos) — single library, `kind` distinguishes type
-- ----------------------------------------------------------------------------
create type public.media_kind as enum ('image', 'video');

create table public.media_items (
  id uuid primary key default uuid_generate_v4(),
  kind public.media_kind not null,
  url text not null,
  thumbnail_url text,
  caption_kn text default '',
  caption_en text default '',
  alt_text_kn text default '',
  alt_text_en text default '',
  album text default 'general',
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create index idx_media_kind_album on public.media_items(kind, album);

-- ----------------------------------------------------------------------------
-- HISTORY (rich text, single/multi section entries)
-- ----------------------------------------------------------------------------
create table public.temple_history (
  id uuid primary key default uuid_generate_v4(),
  title_kn text not null,
  title_en text not null,
  content_kn text default '',
  content_en text default '',
  era_year text,               -- e.g. "1520 CE" for timeline ordering display
  image_url text,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_history_order on public.temple_history(sort_order);

-- ----------------------------------------------------------------------------
-- EVENTS / FESTIVALS
-- ----------------------------------------------------------------------------
create table public.events (
  id uuid primary key default uuid_generate_v4(),
  title_kn text not null,
  title_en text not null,
  description_kn text default '',
  description_en text default '',
  location_kn text default '',
  location_en text default '',
  image_url text,
  event_date date not null,
  event_time time,
  status text not null default 'upcoming' check (status in ('upcoming','ongoing','completed','cancelled')),
  is_featured boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_events_date_status on public.events(event_date, status);

-- ----------------------------------------------------------------------------
-- NOTIFICATIONS (site-wide announcement banners / alerts)
-- ----------------------------------------------------------------------------
create table public.notifications (
  id uuid primary key default uuid_generate_v4(),
  title_kn text not null,
  title_en text not null,
  message_kn text default '',
  message_en text default '',
  is_active boolean not null default true,
  starts_at timestamptz default now(),
  ends_at timestamptz,
  created_at timestamptz not null default now()
);

create index idx_notifications_active on public.notifications(is_active, starts_at, ends_at);

-- ----------------------------------------------------------------------------
-- COMMITTEE MEMBERS
-- ----------------------------------------------------------------------------
create table public.committee_members (
  id uuid primary key default uuid_generate_v4(),
  name_kn text not null,
  name_en text not null,
  designation_kn text default '',
  designation_en text default '',
  photo_url text,
  phone text,
  sort_order int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_committee_order on public.committee_members(sort_order);

-- ----------------------------------------------------------------------------
-- updated_at trigger helper
-- ----------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

do $$
declare t text;
begin
  for t in select unnest(array['temple_profile','sevas','temple_history','events','committee_members','admin_profiles'])
  loop
    execute format('create trigger trg_set_updated_at before update on public.%I for each row execute function public.set_updated_at();', t);
  end loop;
end $$;

-- ============================================================================
-- ROW LEVEL SECURITY
-- Rule: any active admin (admin or super_admin) can read/write content tables.
--       Only super_admin can read/write admin_profiles.
--       Public/anon read access is granted separately (see public_read policies)
--       for the site's public-facing pages.
-- ============================================================================

alter table public.admin_profiles enable row level security;
alter table public.temple_profile enable row level security;
alter table public.sevas enable row level security;
alter table public.media_items enable row level security;
alter table public.temple_history enable row level security;
alter table public.events enable row level security;
alter table public.notifications enable row level security;
alter table public.committee_members enable row level security;

-- admin_profiles: super_admin full control; a user can read their own row
create policy admin_profiles_self_read on public.admin_profiles
  for select using (auth.uid() = id or public.is_super_admin());
create policy admin_profiles_super_write on public.admin_profiles
  for insert with check (public.is_super_admin());
create policy admin_profiles_super_update on public.admin_profiles
  for update using (public.is_super_admin());
create policy admin_profiles_super_delete on public.admin_profiles
  for delete using (public.is_super_admin());

-- Generic pattern applied to every content table below:
--   * any active admin can select/insert/update/delete
--   * anonymous (public site) can only select
do $$
declare
  tbl text;
  tables text[] := array['temple_profile','sevas','media_items','temple_history','events','notifications','committee_members'];
begin
  foreach tbl in array tables loop
    execute format($f$
      create policy %I_admin_all on public.%I
        for all using (public.is_admin_user()) with check (public.is_admin_user());
    $f$, tbl, tbl);

    execute format($f$
      create policy %I_public_read on public.%I
        for select using (true);
    $f$, tbl, tbl);
  end loop;
end $$;

-- ============================================================================
-- SEED: create the singleton temple_profile row if none exists
-- ============================================================================
insert into public.temple_profile (name_kn, name_en)
select '', ''
where not exists (select 1 from public.temple_profile);

-- ============================================================================
-- STORAGE BUCKET (run once) — for images/videos/logo uploads
-- ============================================================================
insert into storage.buckets (id, name, public)
values ('temple-media', 'temple-media', true)
on conflict (id) do nothing;

create policy "public read temple-media" on storage.objects
  for select using (bucket_id = 'temple-media');
create policy "admins write temple-media" on storage.objects
  for insert with check (bucket_id = 'temple-media' and public.is_admin_user());
create policy "admins update temple-media" on storage.objects
  for update using (bucket_id = 'temple-media' and public.is_admin_user());
create policy "admins delete temple-media" on storage.objects
  for delete using (bucket_id = 'temple-media' and public.is_admin_user());
