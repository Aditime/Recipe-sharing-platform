-- Run this in Supabase: SQL Editor → New query → Paste → Run
-- Adds a Postgres text[] column for free-form tags (vegan, comfort food, etc.)

alter table public.recipes
add column if not exists tags text[] not null default '{}';

comment on column public.recipes.tags is 'Diet/mood labels e.g. vegan, gluten-free, comfort food';
