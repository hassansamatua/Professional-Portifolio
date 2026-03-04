-- Fix RLS policies for contact_messages table
-- Drop existing policies and recreate them correctly

-- Drop existing policies
DROP POLICY IF EXISTS "Admins can view all messages" ON contact_messages;
DROP POLICY IF EXISTS "Admins can update messages" ON contact_messages;
DROP POLICY IF EXISTS "Admins can delete messages" ON contact_messages;
DROP POLICY IF EXISTS "Anyone can insert messages" ON contact_messages;

-- Recreate policies with correct structure

-- Public INSERT policy (anyone can insert messages)
CREATE POLICY "Allow public insert" ON contact_messages
  FOR INSERT WITH CHECK (true);

-- Admin-only policies for SELECT, UPDATE, DELETE
CREATE POLICY "Allow admin select" ON contact_messages
  FOR SELECT USING (
    auth.role() = 'authenticated' AND 
    auth.email() = 'hanscodev@gmail.com'
  );

CREATE POLICY "Allow admin update" ON contact_messages
  FOR UPDATE USING (
    auth.role() = 'authenticated' AND 
    auth.email() = 'hanscodev@gmail.com'
  );

CREATE POLICY "Allow admin delete" ON contact_messages
  FOR DELETE USING (
    auth.role() = 'authenticated' AND 
    auth.email() = 'hanscodev@gmail.com'
  );
