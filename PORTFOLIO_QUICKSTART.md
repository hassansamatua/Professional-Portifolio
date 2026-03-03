# 🚀 Portfolio System - Quick Start (5 minutes)

## What You Just Got

A complete portfolio website for Hansco Dev with:

- Professional home page (localhost:3000)
- Admin panel for managing content
- Beautiful portfolio gallery
- Admin login system

---

## Quick Setup (Copy-Paste Ready!)

### 1. Database SQL (1 minute)

Copy this entire block and run it in Supabase SQL Editor:

```sql
-- Create Portfolio Items Table
CREATE TABLE IF NOT EXISTS portfolio_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  category VARCHAR(50) NOT NULL,
  image_url VARCHAR(500),
  link VARCHAR(500),
  technologies TEXT[],
  year INTEGER,
  featured BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create Admin Settings Table
CREATE TABLE IF NOT EXISTS admin_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key VARCHAR(100) UNIQUE NOT NULL,
  value TEXT,
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create Indexes
CREATE INDEX idx_portfolio_category ON portfolio_items(category);
CREATE INDEX idx_portfolio_featured ON portfolio_items(featured);
CREATE INDEX idx_portfolio_order ON portfolio_items(display_order);

-- Insert Default Settings
INSERT INTO admin_settings (key, value) VALUES
  ('portfolio_title', 'Hansco Dev - Developer | Graphic Designer | Computer Teacher'),
  ('portfolio_description', 'Showcasing my creative work across development, design, and education'),
  ('admin_email', 'admin@hansco.dev')
ON CONFLICT (key) DO NOTHING;

-- Enable Row Level Security
ALTER TABLE portfolio_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_settings ENABLE ROW LEVEL SECURITY;

-- Create Policies
CREATE POLICY "Anyone can read portfolio items" ON portfolio_items FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert portfolio items" ON portfolio_items FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update portfolio items" ON portfolio_items FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can delete portfolio items" ON portfolio_items FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Anyone can read admin settings" ON admin_settings FOR SELECT USING (true);
CREATE POLICY "Authenticated users can update admin settings" ON admin_settings FOR UPDATE USING (auth.role() = 'authenticated');
```

✅ **Done!** No errors = success!

---

### 2. Start Your Server (30 seconds)

```bash
npm run dev
```

Visit: **http://localhost:3000**

---

### 3. Add Your First Portfolio Item (2 minutes)

1. Go to **http://localhost:3000**
2. Click **"Admin Login"** button
3. Login (or create account if first time)
4. Click **"Admin Panel"** button
5. Fill the form:
   - **Title:** "My First Project"
   - **Category:** Development
   - **Description:** "This is an amazing project I built"
   - **Image URL:** (leave blank for now)
   - **Technologies:** React, TypeScript
   - **Featured:** Check this box
6. Click **"Add Portfolio Item"**
7. Done! 🎉

---

### 4. View Your Portfolio (30 seconds)

Go back to home page:
**http://localhost:3000**

You should see:

- Your project in the portfolio section
- Filter buttons (Development, Design, Teaching)
- Beautiful professional layout

---

## URLs You Now Have

| URL                                | Purpose                   | Auth Required |
| ---------------------------------- | ------------------------- | ------------- |
| `http://localhost:3000`            | Home - Portfolio showcase | No            |
| `http://localhost:3000/auth/login` | Admin login               | No            |
| `http://localhost:3000/admin`      | Manage portfolio items    | Yes           |
| `http://localhost:3000/dashboard`  | User dashboard            | Yes           |

---

## Adding More Items (30 seconds each)

1. Go to Admin Panel (`/admin`)
2. Fill the form again with new project details
3. Click "Add Portfolio Item"
4. Refresh home page to see it

**Pro Tips:**

- Use **Display Order** to sort items (lower number = shows first)
- Check **Featured** to show on homepage
- Add **Image URL** for portfolio thumbnails
- Add **Project Link** to make cards clickable

---

## Categories

| Icon | Category    | Use For                       |
| ---- | ----------- | ----------------------------- |
| 🔧   | Development | Web apps, coding projects     |
| 🎨   | Design      | UI/UX, graphics, branding     |
| 📚   | Teaching    | Courses, tutorials, education |

---

## Customize Title & Description

**In Admin Panel:**

1. Scroll down to "Portfolio Settings"
2. Update title and description
3. Click "Save Settings"

**That's it!** Changes appear everywhere.

---

## Troubleshooting

### "Can't access admin panel"

- Make sure you're logged in
- Try logging out and back in
- Clear browser cache (Ctrl+Shift+Del)

### "Portfolio items won't show"

- Make sure item is marked "Featured"
- Check you clicked "Add Portfolio Item"
- Refresh the page (Ctrl+R)
- Check database tables were created

### "Images not loading"

- Use full URLs: `https://...`
- Make sure image is publicly accessible
- Test image URL in browser first

---

## Sample Content to Add

Copy-paste these to quickly populate your portfolio:

### Development Project

```
Title: Full Stack E-Commerce Platform
Category: Development
Description: Built a complete e-commerce solution with real-time inventory, payment processing, and admin dashboard
Technologies: Next.js, React, TypeScript, Tailwind CSS, Supabase, Stripe
Year: 2025
Featured: Yes
Link: https://github.com/hansco/ecommerce
Image: https://via.placeholder.com/600x400?text=E-Commerce
```

### Design Project

```
Title: Mobile Banking App Design
Category: Design
Description: Designed intuitive user interface for mobile banking application with 50+ screens
Technologies: Figma, Adobe XD, Prototyping, User Research
Year: 2024
Featured: Yes
Link: https://dribbble.com/hans-banking-app
Image: https://via.placeholder.com/600x400?text=Banking+App
```

### Teaching Project

```
Title: 12-Week Web Development Bootcamp
Category: Teaching
Description: Comprehensive course teaching HTML, CSS, JavaScript, React, and full-stack development to 500+ students
Technologies: JavaScript, React, Node.js, SQL, Next.js
Year: 2024
Featured: Yes
Link: https://example.com/courses/webdev
Image: https://via.placeholder.com/600x400?text=Web+Dev+Course
```

---

## What Each File Does

| File                           | Purpose                           |
| ------------------------------ | --------------------------------- |
| `app/page.tsx`                 | Home page with portfolio showcase |
| `app/admin/page.tsx`           | Admin panel for managing content  |
| `components/PortfolioCard.tsx` | Single portfolio item card        |
| `components/PortfolioGrid.tsx` | Grid of portfolio items           |
| `lib/supabase/portfolio.ts`    | Database functions                |
| `PORTFOLIO_SETUP.md`           | Detailed setup guide              |
| `db-schema.sql`                | Database schema                   |

---

## You're Done! 🎉

Your portfolio system is ready to use:

✅ Home page created
✅ Admin panel setup
✅ Database configured
✅ Authentication working

**Next steps:**

1. Add your portfolio items
2. Update title and description
3. Add images to projects
4. Share your portfolio!

---

**Questions?** Check PORTFOLIO_SETUP.md for detailed instructions.
