-- Create contact_messages table
CREATE TABLE IF NOT EXISTS contact_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  subject VARCHAR(500) NOT NULL,
  message TEXT NOT NULL,
  attachments JSONB DEFAULT '[]'::jsonb,
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'replied', 'archived')),
  admin_reply TEXT,
  admin_reply_sent_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_contact_messages_status ON contact_messages(status);
CREATE INDEX IF NOT EXISTS idx_contact_messages_created_at ON contact_messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contact_messages_email ON contact_messages(email);

-- Enable RLS (Row Level Security)
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Create policy for authenticated users (admin) to read all messages
CREATE POLICY "Admins can view all messages" ON contact_messages
  FOR SELECT USING (
    auth.role() = 'authenticated' AND 
    auth.jwt() ->> 'email' = 'hanscodev@gmail.com'
  );

-- Create policy for authenticated users (admin) to update messages
CREATE POLICY "Admins can update messages" ON contact_messages
  FOR UPDATE USING (
    auth.role() = 'authenticated' AND 
    auth.jwt() ->> 'email' = 'hanscodev@gmail.com'
  );

-- Create policy for authenticated users (admin) to delete messages
CREATE POLICY "Admins can delete messages" ON contact_messages
  FOR DELETE USING (
    auth.role() = 'authenticated' AND 
    auth.jwt() ->> 'email' = 'hanscodev@gmail.com'
  );

-- Create policy for inserting messages (public access for contact form)
CREATE POLICY "Anyone can insert messages" ON contact_messages
  FOR INSERT WITH CHECK (true);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_contact_messages_updated_at
  BEFORE UPDATE ON contact_messages
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
