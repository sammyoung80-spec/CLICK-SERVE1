-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. PROFILES (Extends auth.users)
create table public.profiles (
  id uuid references auth.users not null primary key,
  email text,
  role text check (role in ('buyer', 'supplier', 'admin_manager', 'admin_auditor', 'admin_ceo')),
  full_name text,
  business_name text,
  city text,
  phone text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS for Profiles
alter table public.profiles enable row level security;

create policy "Public profiles are viewable by everyone"
  on profiles for select
  using ( true );

create policy "Users can insert their own profile"
  on profiles for insert
  with check ( auth.uid() = id );

create policy "Users can update own profile"
  on profiles for update
  using ( auth.uid() = id );


-- 2. SUPPLIERS (Store persistent supplier data)
create table public.suppliers (
  id uuid default uuid_generate_v4() primary key,
  profile_id uuid references public.profiles(id),
  name text not null,
  city text not null,
  price_per_liter numeric not null,
  density numeric,
  eta_minutes integer,
  rating numeric default 5.0,
  available_liters numeric default 0,
  is_verified boolean default false,
  verification_status text default 'Pending',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS for Suppliers
alter table public.suppliers enable row level security;

create policy "Suppliers are viewable by everyone"
  on suppliers for select
  using ( true );

create policy "Suppliers can update their own data"
  on suppliers for update
  using ( auth.uid() = profile_id );

create policy "Suppliers can insert their own data"
  on suppliers for insert
  with check ( auth.uid() = profile_id );


-- 3. ORDERS (Transaction history)
create table public.orders (
  id uuid default uuid_generate_v4() primary key,
  buyer_id uuid references public.profiles(id),
  supplier_id uuid references public.suppliers(id),
  liters numeric not null,
  distance_km numeric,
  total_cost numeric not null,
  status text check (status in ('Pending', 'In Transit', 'Delivered', 'Paid')) default 'Pending',
  payment_method text,
  priority text default 'Normal',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS for Orders
alter table public.orders enable row level security;

create policy "Users can see their own orders (as buyer or supplier)"
  on orders for select
  using ( 
    auth.uid() = buyer_id OR 
    auth.uid() in (select profile_id from suppliers where id = supplier_id)
  );

create policy "Buyers can create orders"
  on orders for insert
  with check ( auth.uid() = buyer_id );


-- 4. STORAGE BUCKETS (for Documents)
-- Note: You must create a bucket named 'documents' in the Supabase Dashboard manually, 
-- or use the storage API. SQL cannot create buckets directly in standard Supabase setup easily without extensions.

-- 5. FUNCTION to handle new user signup (Trigger)
create or replace function public.handle_new_user() 
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'role');
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to call the function
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
