-- Run this entire file in Supabase Dashboard > SQL Editor.
create extension if not exists pgcrypto;

create table if not exists public.services (
 id uuid primary key default gen_random_uuid(),
 title text not null,
 description text not null default '',
 category text,
 image_url text,
 active boolean not null default true,
 created_at timestamptz not null default now()
);
create table if not exists public.packages (
 id uuid primary key default gen_random_uuid(),
 title text not null,
 description text not null default '',
 price text,
 delivery text,
 active boolean not null default true,
 created_at timestamptz not null default now()
);
create table if not exists public.portfolio (
 id uuid primary key default gen_random_uuid(),
 title text not null,
 description text not null default '',
 category text,
 image_url text,
 active boolean not null default true,
 created_at timestamptz not null default now()
);
create table if not exists public.messages (
 id uuid primary key default gen_random_uuid(),
 name text not null,
 email text not null,
 service text,
 message text not null,
 created_at timestamptz not null default now()
);

alter table public.services enable row level security;
alter table public.packages enable row level security;
alter table public.portfolio enable row level security;
alter table public.messages enable row level security;

-- Public visitors can read active content.
create policy "Public read active services" on public.services for select using (active = true);
create policy "Public read active packages" on public.packages for select using (active = true);
create policy "Public read active portfolio" on public.portfolio for select using (active = true);
-- Visitors can send contact messages. No public read/update/delete.
create policy "Public submit messages" on public.messages for insert with check (true);

-- Authenticated admin users can manage content and read messages.
create policy "Authenticated manage services" on public.services for all to authenticated using (true) with check (true);
create policy "Authenticated manage packages" on public.packages for all to authenticated using (true) with check (true);
create policy "Authenticated manage portfolio" on public.portfolio for all to authenticated using (true) with check (true);
create policy "Authenticated read messages" on public.messages for select to authenticated using (true);
create policy "Authenticated delete messages" on public.messages for delete to authenticated using (true);

-- Create a PUBLIC storage bucket named 'portfolio' in Storage, then apply:
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('portfolio', 'portfolio', true, 10485760, array['image/jpeg','image/png','image/webp'])
on conflict (id) do nothing;

create policy "Public view portfolio images" on storage.objects for select using (bucket_id = 'portfolio');
create policy "Authenticated upload portfolio images" on storage.objects for insert to authenticated with check (bucket_id = 'portfolio');
create policy "Authenticated update portfolio images" on storage.objects for update to authenticated using (bucket_id = 'portfolio') with check (bucket_id = 'portfolio');
create policy "Authenticated delete portfolio images" on storage.objects for delete to authenticated using (bucket_id = 'portfolio');
