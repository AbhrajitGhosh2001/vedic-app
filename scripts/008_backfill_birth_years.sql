-- Backfill birth_year from birth_date for existing profiles
UPDATE profiles
SET birth_year = EXTRACT(YEAR FROM birth_date::date)
WHERE birth_date IS NOT NULL 
  AND birth_year IS NULL;
