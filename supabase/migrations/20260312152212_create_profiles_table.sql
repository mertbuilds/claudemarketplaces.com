-- Profiles table for public user profiles
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique not null,
  full_name text,
  avatar_url text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Enable RLS
alter table public.profiles enable row level security;

-- Anyone can view profiles
create policy "Profiles are publicly viewable"
  on public.profiles for select
  using (true);

-- Users can update their own profile
create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Index for fast username lookups
create index profiles_username_idx on public.profiles (username);

-- Function to generate username from auth metadata
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
declare
  new_username text;
  provider text;
  base_username text;
  suffix int;
begin
  provider := new.raw_app_meta_data ->> 'provider';

  if provider = 'github' then
    -- Use GitHub username directly
    base_username := new.raw_user_meta_data ->> 'user_name';
    if base_username is null then
      base_username := new.raw_user_meta_data ->> 'preferred_username';
    end if;
  elsif provider = 'google' then
    -- Derive from full name: kebab-case + random number
    base_username := new.raw_user_meta_data ->> 'full_name';
    if base_username is not null then
      base_username := lower(regexp_replace(trim(base_username), '\s+', '-', 'g'));
      base_username := regexp_replace(base_username, '[^a-z0-9-]', '', 'g');
      base_username := base_username || '-' || floor(random() * 9000 + 1000)::int;
    end if;
  end if;

  -- Fallback: use email prefix
  if base_username is null or base_username = '' then
    base_username := split_part(new.email, '@', 1);
    base_username := lower(regexp_replace(base_username, '[^a-z0-9-]', '', 'g'));
  end if;

  -- Ensure uniqueness
  new_username := base_username;
  suffix := 1;
  while exists (select 1 from public.profiles where username = new_username) loop
    new_username := base_username || '-' || suffix;
    suffix := suffix + 1;
  end loop;

  insert into public.profiles (id, username, full_name, avatar_url)
  values (
    new.id,
    new_username,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name'),
    new.raw_user_meta_data ->> 'avatar_url'
  );

  return new;
end;
$$;

-- Trigger on new user creation
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
