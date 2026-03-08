-- Add Chinese zodiac columns to profiles table
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS birth_year INTEGER,
ADD COLUMN IF NOT EXISTS chinese_zodiac_animal TEXT,
ADD COLUMN IF NOT EXISTS chinese_zodiac_element TEXT;

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_profiles_birth_year ON profiles(birth_year);
CREATE INDEX IF NOT EXISTS idx_profiles_chinese_zodiac_animal ON profiles(chinese_zodiac_animal);
