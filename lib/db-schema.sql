-- Portfolio Items Table
CREATE TABLE IF NOT EXISTS portfolio_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  category VARCHAR(50) NOT NULL, -- 'development', 'design', 'teaching'
  image_url VARCHAR(500),
  link VARCHAR(500),
  technologies TEXT[], -- Array of tech tags
  year INTEGER,
  featured BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Admin Settings Table
CREATE TABLE IF NOT EXISTS admin_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key VARCHAR(100) UNIQUE NOT NULL,
  value TEXT,
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for faster queries
CREATE INDEX idx_portfolio_category ON portfolio_items(category);
CREATE INDEX idx_portfolio_featured ON portfolio_items(featured);
CREATE INDEX idx_portfolio_order ON portfolio_items(display_order);

-- Insert default portfolio categories
INSERT INTO admin_settings (key, value) 
VALUES 
  ('portfolio_title', 'Hansco Dev - Developer | Graphic Designer | Computer Teacher'),
  ('portfolio_description', 'Showcasing my creative work across development, design, and education'),
  ('admin_email', 'admin@hansco.dev')
ON CONFLICT (key) DO NOTHING;
