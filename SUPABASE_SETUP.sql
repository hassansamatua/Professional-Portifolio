-- ============================================================================
-- HANSCO DEV PORTFOLIO - SUPABASE DATABASE SETUP
-- ============================================================================
-- This SQL script creates all necessary tables for the Hansco Dev portfolio
-- and admin panel. Run this in your Supabase SQL editor.
-- ============================================================================

-- 1. PORTFOLIO_ITEMS TABLE
-- Stores all portfolio projects (development, design, teaching)
CREATE TABLE
IF NOT EXISTS public.portfolio_items
(
  id UUID DEFAULT gen_random_uuid
() PRIMARY KEY,
  
  -- Project Information
  title VARCHAR
(255) NOT NULL,
  description TEXT NOT NULL,
  category VARCHAR
(50) NOT NULL CHECK
(category IN
('development', 'design', 'teaching')),
  
  -- Media & Links
  image_url TEXT,
  link VARCHAR
(255),
  
  -- Technical Details
  technologies TEXT[], -- Array of tech stack
  year INTEGER,
  
  -- Display Settings
  featured BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  
  -- Timestamps
  created_at TIMESTAMP
WITH TIME ZONE DEFAULT NOW
(),
  updated_at TIMESTAMP
WITH TIME ZONE DEFAULT NOW
(),
  
  -- Metadata
  created_by UUID REFERENCES auth.users
(id) ON
DELETE
SET NULL
,
  tags TEXT[]
);

-- Index for faster queries
CREATE INDEX
IF NOT EXISTS idx_portfolio_category ON public.portfolio_items
(category);
CREATE INDEX
IF NOT EXISTS idx_portfolio_featured ON public.portfolio_items
(featured);
CREATE INDEX
IF NOT EXISTS idx_portfolio_display_order ON public.portfolio_items
(display_order);
CREATE INDEX
IF NOT EXISTS idx_portfolio_year ON public.portfolio_items
(year);

-- ============================================================================

-- 2. ADMIN_SETTINGS TABLE
-- Stores global portfolio settings
CREATE TABLE
IF NOT EXISTS public.admin_settings
(
  id UUID DEFAULT gen_random_uuid
() PRIMARY KEY,
  
  -- Portfolio Info
  portfolio_title VARCHAR
(255) NOT NULL DEFAULT 'Hansco Dev',
  portfolio_description TEXT,
  portfolio_subtitle VARCHAR
(255),
  
  -- Admin Email
  admin_email VARCHAR
(255) NOT NULL,
  
  -- Branding
  primary_color VARCHAR
(7) DEFAULT '#10b981', -- Emerald
  accent_color VARCHAR
(7) DEFAULT '#0ea5e9', -- Cyan
  
  -- Social Links
  github_url VARCHAR
(255),
  linkedin_url VARCHAR
(255),
  twitter_url VARCHAR
(255),
  email_address VARCHAR
(255),
  
  -- Settings
  show_featured_only BOOLEAN DEFAULT false,
  items_per_page INTEGER DEFAULT 12,
  enable_contact_form BOOLEAN DEFAULT true,
  
  -- Timestamps
  created_at TIMESTAMP
WITH TIME ZONE DEFAULT NOW
(),
  updated_at TIMESTAMP
WITH TIME ZONE DEFAULT NOW
(),
  updated_by UUID REFERENCES auth.users
(id) ON
DELETE
SET NULL
);

-- ============================================================================

-- 3. PORTFOLIO_CATEGORIES TABLE
-- Stores category information with descriptions
CREATE TABLE
IF NOT EXISTS public.portfolio_categories
(
  id UUID DEFAULT gen_random_uuid
() PRIMARY KEY,
  
  name VARCHAR
(50) NOT NULL UNIQUE,
  display_name VARCHAR
(100) NOT NULL,
  description TEXT,
  icon VARCHAR
(50),
  color VARCHAR
(7),
  
  display_order INTEGER DEFAULT 0,
  
  created_at TIMESTAMP
WITH TIME ZONE DEFAULT NOW
(),
  updated_at TIMESTAMP
WITH TIME ZONE DEFAULT NOW
()
);

-- Insert default categories
INSERT INTO public.portfolio_categories
    (name, display_name, description, color, display_order)
VALUES
    ('development', 'Development', 'Web development and coding projects', '#3b82f6', 1),
    ('design', 'Design', 'Graphic design and UI/UX work', '#ec4899', 2),
    ('teaching', 'Teaching', 'Computer science teaching resources', '#f59e0b', 3)
ON CONFLICT DO NOTHING;

-- ============================================================================

-- 4. ADMIN_LOGS TABLE
-- Tracks all admin actions for security audit
CREATE TABLE
IF NOT EXISTS public.admin_logs
(
  id UUID DEFAULT gen_random_uuid
() PRIMARY KEY,
  
  admin_id UUID REFERENCES auth.users
(id) ON
DELETE
SET NULL
,
  action VARCHAR
(100) NOT NULL,
  entity_type VARCHAR
(50), -- portfolio_item, settings, etc
  entity_id UUID,
  
  changes JSONB, -- JSON diff of changes
  ip_address VARCHAR
(45),
  user_agent TEXT,
  
  created_at TIMESTAMP
WITH TIME ZONE DEFAULT NOW
()
);

-- Index for searching logs
CREATE INDEX
IF NOT EXISTS idx_admin_logs_admin_id ON public.admin_logs
(admin_id);
CREATE INDEX
IF NOT EXISTS idx_admin_logs_action ON public.admin_logs
(action);
CREATE INDEX
IF NOT EXISTS idx_admin_logs_created_at ON public.admin_logs
(created_at);

-- ============================================================================

-- 5. ADMIN_USERS TABLE
-- Stores admin user information and permissions
CREATE TABLE
IF NOT EXISTS public.admin_users
(
  id UUID DEFAULT gen_random_uuid
() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users
(id) ON
DELETE CASCADE,
  
  -- Admin Info
  role VARCHAR(50)
NOT NULL DEFAULT 'admin' CHECK
(role IN
('admin', 'editor')),
  is_active BOOLEAN DEFAULT true,
  
  -- Permissions
  can_manage_portfolio BOOLEAN DEFAULT true,
  can_manage_settings BOOLEAN DEFAULT true,
  can_view_logs BOOLEAN DEFAULT true,
  
  -- Timestamps
  created_at TIMESTAMP
WITH TIME ZONE DEFAULT NOW
(),
  updated_at TIMESTAMP
WITH TIME ZONE DEFAULT NOW
(),
  created_by UUID REFERENCES auth.users
(id) ON
DELETE
SET NULL
);

-- Index
CREATE INDEX
IF NOT EXISTS idx_admin_users_user_id ON public.admin_users
(user_id);
CREATE INDEX
IF NOT EXISTS idx_admin_users_role ON public.admin_users
(role);

-- ============================================================================

-- 6. STORAGE - Portfolio Images
-- Create storage bucket for portfolio images
INSERT INTO storage.buckets
    (id, name, public)
VALUES
    ('portfolio', 'portfolio', true)
ON CONFLICT DO NOTHING;

-- ============================================================================

-- 7. ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- PORTFOLIO_ITEMS - Everyone can view
ALTER TABLE public.portfolio_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view portfolio items"
  ON public.portfolio_items
  FOR
SELECT
    USING (true);

CREATE POLICY "Only admins can insert portfolio items"
  ON public.portfolio_items
  FOR
INSERT
  WITH CHECK
    (
    EXISTS (
    SELECT
1 FROM public.admin_use
WHERE user_id = auth.uid()
    AND is_active = true
    AND can_manage_portfolio = true
    )
);

CREATE POLICY "Only admins can update portfolio items"
  ON public.portfolio_items
  FOR
UPDATE
  USING (
    EXISTS (
      SELECT 1
FROM public.admin_users
WHERE user_id = auth.uid()
    AND is_active = true
    AND can_manage_portfolio = true
    )
);

CREATE POLICY "Only admins can delete portfolio items"
  ON public.portfolio_items
  FOR
DELETE
  USING (
    EXISTS
(
      SELECT 1
FROM public.admin_users
WHERE user_id = auth.uid()
    AND is_active = true
    AND can_manage_portfolio = true
    )
);

-- ============================================================================

-- ADMIN_SETTINGS - Everyone can view
ALTER TABLE public.admin_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view admin settings"
  ON public.admin_settings
  FOR
SELECT
    USING (true);

CREATE POLICY "Only admins can update admin settings"
  ON public.admin_settings
  FOR
UPDATE
  USING (
    EXISTS (
      SELECT 1
FROM public.admin_users
WHERE user_id = auth.uid()
    AND is_active = true
    AND can_manage_settings = true
    )
);

-- ============================================================================

-- PORTFOLIO_CATEGORIES - Everyone can view
ALTER TABLE public.portfolio_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view portfolio categories"
  ON public.portfolio_categories
  FOR
SELECT
    USING (true);

-- ============================================================================

-- ADMIN_LOGS - Only authenticated users can view (their own or if admin)
ALTER TABLE public.admin_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view all logs"
  ON public.admin_logs
  FOR
SELECT
    USING (
    EXISTS (
      SELECT 1
    FROM public.admin_users
    WHERE user_id = auth.uid()
        AND is_active = true
        AND can_view_logs = true
    )
  );

CREATE POLICY "Only system can insert logs"
  ON public.admin_logs
  FOR
INSERT
  WITH CHECK
    (true)
;

-- ============================================================================

-- ADMIN_USERS - Only admins can view
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view admin users"
  ON public.admin_users
  FOR
SELECT
    USING (
    EXISTS (
      SELECT 1
    FROM public.admin_users
    WHERE user_id = auth.uid()
        AND is_active = true
        AND role = 'admin'
    )
  );

-- ============================================================================

-- 8. STORAGE BUCKET POLICIES
-- ============================================================================

-- Allow anyone to view portfolio images
CREATE POLICY "Public read access to portfolio"
  ON storage.objects
  FOR
SELECT
    USING (bucket_id = 'portfolio');

-- Allow authenticated admins to upload
CREATE POLICY "Admins can upload portfolio images"
  ON storage.objects
  FOR
INSERT
  WITH CHECK
    (
    bucket_id
= 'portfolio'
    AND auth.role
() = 'authenticated'
    AND EXISTS
(
      SELECT 1
FROM public.admin_users
WHERE user_id = auth.uid()
    AND is_active = true
    AND can_manage_portfolio = true
    )
);

-- Allow authenticated admins to delete their uploads
CREATE POLICY "Admins can delete portfolio images"
  ON storage.objects
  FOR
DELETE
  USING (
    bucket_id
= 'portfolio'
    AND auth.role
() = 'authenticated'
    AND EXISTS
(
      SELECT 1
FROM public.admin_users
WHERE user_id = auth.uid()
    AND is_active = true
    AND can_manage_portfolio = true
    )
);

-- ============================================================================

-- 9. FUNCTIONS FOR COMMON OPERATIONS
-- ============================================================================

-- Function to get portfolio items by category with pagination
CREATE OR REPLACE FUNCTION get_portfolio_by_category
(
  p_category VARCHAR,
  p_limit INT DEFAULT 12,
  p_offset INT DEFAULT 0
)
RETURNS TABLE
(
  id UUID,
  title VARCHAR,
  description TEXT,
  category VARCHAR,
  image_url TEXT,
  link VARCHAR,
  technologies TEXT[],
  year INTEGER,
  featured BOOLEAN,
  display_order INTEGER,
  created_at TIMESTAMP
WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        portfolio_items.id,
        portfolio_items.title,
        portfolio_items.description,
        portfolio_items.category,
        portfolio_items.image_url,
        portfolio_items.link,
        portfolio_items.technologies,
        portfolio_items.year,
        portfolio_items.featured,
        portfolio_items.display_order,
        portfolio_items.created_at
    FROM public.portfolio_items
    WHERE portfolio_items.category = p_category
    ORDER BY portfolio_items.display_order ASC, portfolio_items.created_at DESC
  LIMIT p_limit OFFSET
    p_offset;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================

-- 10. INITIAL DATA
-- ============================================================================

-- Insert default portfolio settings
INSERT INTO public.admin_settings
    (
    portfolio_title,
    portfolio_description,
    portfolio_subtitle,
    admin_email,
    primary_color,
    accent_color,
    github_url,
    linkedin_url,
    twitter_url
    )
VALUES
    (
        'Hansco Dev',
        'Full-stack Developer | Graphic Designer | Computer Science Teacher',
        'Creating Amazing Digital Experiences',
        'hanscodev@gmail.com',
        '#10b981',
        '#0ea5e9',
        'https://github.com',
        'https://linkedin.com',
        'https://twitter.com'
)
ON CONFLICT DO NOTHING;

-- ============================================================================
-- SETUP COMPLETE
-- ============================================================================
-- Your database is now configured for the Hansco Dev portfolio system!
-- Next steps:
-- 1. Set your admin email in the admin_settings table
-- 2. Add yourself as an admin user via Supabase Auth
-- 3. Create admin_users entry for your account
-- 4. Start adding portfolio items
-- ============================================================================
