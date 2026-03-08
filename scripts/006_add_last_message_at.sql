-- Add last_message_at column if it doesn't exist
ALTER TABLE conversations 
ADD COLUMN IF NOT EXISTS last_message_at TIMESTAMPTZ DEFAULT NOW();

-- Update existing rows to have a value
UPDATE conversations 
SET last_message_at = COALESCE(updated_at, created_at, NOW()) 
WHERE last_message_at IS NULL;
