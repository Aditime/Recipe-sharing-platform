-- Favorites: run in Supabase SQL Editor if you do not use CLI migrations.
-- Requires public.recipes(id) to exist.

create table if not exists public.favorites (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  recipe_id uuid not null references public.recipes (id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, recipe_id)
);

create index if not exists favorites_user_id_idx on public.favorites (user_id);
create index if not exists favorites_recipe_id_idx on public.favorites (recipe_id);

alter table public.favorites enable row level security;

create policy "Users can read own favorites"
on public.favorites
for select
to authenticated
using (auth.uid() = user_id);

create policy "Users can insert own favorites"
on public.favorites
for insert
to authenticated
with check (auth.uid() = user_id);

create policy "Users can delete own favorites"
on public.favorites
for delete
to authenticated
using (auth.uid() = user_id);
