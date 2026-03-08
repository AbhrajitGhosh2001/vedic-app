-- Create happenings_conversations table to store chat sessions
CREATE TABLE IF NOT EXISTS happenings_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  philosopher_id TEXT NOT NULL,
  philosopher_name TEXT NOT NULL,
  title TEXT DEFAULT 'New Conversation',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(id, user_id)
);

-- Create happenings_messages table to store individual messages
CREATE TABLE IF NOT EXISTS happenings_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES happenings_conversations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_happenings_conversations_user_id ON happenings_conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_happenings_conversations_updated_at ON happenings_conversations(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_happenings_messages_conversation_id ON happenings_messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_happenings_messages_created_at ON happenings_messages(created_at);

-- Enable RLS
ALTER TABLE happenings_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE happenings_messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies for happenings_conversations
CREATE POLICY "Users can view own happenings conversations" ON happenings_conversations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create happenings conversations" ON happenings_conversations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own happenings conversations" ON happenings_conversations FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own happenings conversations" ON happenings_conversations FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for happenings_messages
CREATE POLICY "Users can view messages in own conversations" ON happenings_messages FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM happenings_conversations 
    WHERE id = happenings_messages.conversation_id 
    AND user_id = auth.uid()
  ));

CREATE POLICY "Users can insert messages in own conversations" ON happenings_messages FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM happenings_conversations 
    WHERE id = conversation_id 
    AND user_id = auth.uid()
  ) AND user_id = auth.uid());

-- Update trigger for happenings_conversations
CREATE OR REPLACE FUNCTION update_happenings_conversations_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER happenings_conversations_update_timestamp
  BEFORE UPDATE ON happenings_conversations
  FOR EACH ROW
  EXECUTE FUNCTION update_happenings_conversations_timestamp();
