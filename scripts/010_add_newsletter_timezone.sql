-- Add timezone to newsletter_subscribers
ALTER TABLE newsletter_subscribers
ADD COLUMN IF NOT EXISTS timezone TEXT DEFAULT 'America/New_York',
ADD COLUMN IF NOT EXISTS preferred_send_hour INTEGER DEFAULT 6;

-- Create index for efficient timezone-based queries
CREATE INDEX IF NOT EXISTS idx_newsletter_timezone ON newsletter_subscribers(timezone, status) WHERE status = 'active';
