-- Temporary fix: Disable RLS for contact_messages table
-- This allows public access for testing
-- Remove this migration once proper RLS is configured

ALTER TABLE contact_messages DISABLE ROW LEVEL SECURITY;

-- Note: This is a temporary fix for testing
-- In production, you should enable RLS with proper policies
