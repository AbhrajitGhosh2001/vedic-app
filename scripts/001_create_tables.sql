-- Create profiles table with profile picture URL
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name TEXT,
  last_name TEXT,
  email TEXT NOT NULL,
  profile_picture_url TEXT,
  bio TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create astrology_data table to store birth chart information
CREATE TABLE IF NOT EXISTS public.astrology_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date_of_birth DATE NOT NULL,
  time_of_birth TIME NOT NULL,
  place_of_birth TEXT NOT NULL,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  sun_sign TEXT,
  moon_sign TEXT,
  rising_sign TEXT,
  nakshatra TEXT,
  gana TEXT,
  nadi TEXT,
  yoni TEXT,
  varna TEXT,
  temperament TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Enable RLS on astrology_data
ALTER TABLE public.astrology_data ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "profiles_select_own" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "profiles_select_all" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "profiles_insert_own" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "profiles_delete_own" ON public.profiles FOR DELETE USING (auth.uid() = id);

-- Create RLS policies for astrology_data
CREATE POLICY "astrology_select_own" ON public.astrology_data FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "astrology_select_public" ON public.astrology_data FOR SELECT USING (true);
CREATE POLICY "astrology_insert_own" ON public.astrology_data FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "astrology_update_own" ON public.astrology_data FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "astrology_delete_own" ON public.astrology_data FOR DELETE USING (auth.uid() = user_id);
