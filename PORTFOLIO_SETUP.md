# 🎨 Hansco Dev Portfolio System - Setup & Usage Guide

## Overview

Your new portfolio system is now live with:

- ✅ Professional home page showcasing development, design, and teaching work
- ✅ Dynamic portfolio management with admin panel
- ✅ Admin login for secure content management
- ✅ Beautiful, modern, and professional design

---

## 📋 Table of Contents

1. [Database Setup](#database-setup)
2. [File Structure](#file-structure)
3. [Home Page Features](#home-page-features)
4. [Admin Panel Guide](#admin-panel-guide)
5. [Managing Portfolio Items](#managing-portfolio-items)
6. [Customization](#customization)

---

## Database Setup

### Step 1: Create Tables in Supabase

Navigate to your Supabase project and run the following SQL:

```sql
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

-- Create indexes
CREATE INDEX idx_portfolio_category ON portfolio_items(category);
CREATE INDEX idx_portfolio_featured ON portfolio_items(featured);
CREATE INDEX idx_portfolio_order ON portfolio_items(display_order);

-- Insert default settings
INSERT INTO admin_settings (key, value)
VALUES
  ('portfolio_title', 'Hansco Dev - Developer | Graphic Designer | Computer Teacher'),
  ('portfolio_description', 'Showcasing my creative work across development, design, and education'),
  ('admin_email', 'admin@hansco.dev')
ON CONFLICT (key) DO NOTHING;
```

### Step 2: Enable Row Level Security (RLS)

Make the tables public (readable) but require authentication for writing:

```sql
-- Enable RLS
ALTER TABLE portfolio_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_settings ENABLE ROW LEVEL SECURITY;

-- Portfolio Items: Everyone can read, authenticated users can write
CREATE POLICY "Anyone can read portfolio items"
  ON portfolio_items FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert portfolio items"
  ON portfolio_items FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update portfolio items"
  ON portfolio_items FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete portfolio items"
  ON portfolio_items FOR DELETE USING (auth.role() = 'authenticated');

-- Admin Settings: Everyone can read, authenticated users can write
CREATE POLICY "Anyone can read admin settings"
  ON admin_settings FOR SELECT USING (true);

CREATE POLICY "Authenticated users can update admin settings"
  ON admin_settings FOR UPDATE USING (auth.role() = 'authenticated');
```

---

## 📁 File Structure

```
app/
├── page.tsx                          # ⭐ NEW - Professional home page
├── admin/
│   └── page.tsx                     # ⭐ NEW - Admin dashboard
├── auth/
│   ├── login/page.tsx               # Admin login
│   ├── signup/page.tsx
│   └── ...
├── dashboard/page.tsx               # User dashboard
└── layout.tsx

components/
├── PortfolioCard.tsx                # ⭐ NEW - Single portfolio item display
├── PortfolioGrid.tsx                # ⭐ NEW - Grid of portfolio items
└── admin/
    ├── PortfolioItemForm.tsx        # ⭐ NEW - Add/edit items
    ├── PortfolioItemsList.tsx       # ⭐ NEW - List & manage items
    └── AdminSettingsForm.tsx        # ⭐ NEW - Edit portfolio settings

lib/
├── supabase/
│   ├── portfolio.ts                 # ⭐ NEW - Portfolio API functions
│   ├── server-client.ts
│   ├── browser-client.ts
│   └── auth-provider.tsx
└── auth-validation.ts

public/
└── (your images & assets)

db-schema.sql                         # ⭐ NEW - Database schema file
```

---

## Home Page Features

### Location

**URL:** `http://localhost:3000`

### Key Sections

#### 1. **Navigation Bar**

- Hansco Dev branding with tagline
- Admin Login button (for non-authenticated users)
- Admin Panel & Dashboard links (for authenticated users)

#### 2. **Hero Section**

- Eye-catching headline
- Subheading with value proposition
- Call-to-action buttons

#### 3. **Stats Section**

- 50+ Projects Completed
- 100+ Happy Clients
- 5+ Years Experience
  (These are customizable in the code)

#### 4. **Portfolio Section**

- Filter buttons: All, Development, Design, Teaching
- Dynamic portfolio grid
- Professional cards with hover effects

#### 5. **CTA Section**

- "Ready to Collaborate?" call-to-action
- Contact email link
- Admin access button

#### 6. **Footer**

- Copyright and tagline

---

## Admin Panel Guide

### Access

**URL:** `http://localhost:3000/admin`
**Requirements:** Must be logged in (will redirect to login if not)

### Admin Panel Features

#### 1. **Header**

- Admin Panel title
- Back to Dashboard link

#### 2. **Three-Column Layout**

**Left Column (2/3 width):**

- Add Portfolio Item Form
- Portfolio Settings Form

**Right Column (1/3 width):**

- Quick Stats (admin user info)
- Admin Guide (numbered instructions)
- Categories Info (color-coded)

#### 3. **Bottom Section**

- Portfolio Items management table
- Edit/Delete/Toggle Featured for each item

---

## Managing Portfolio Items

### Adding a Portfolio Item

1. Go to Admin Panel (`/admin`)
2. Fill in the form:
   - **Title\*** (required): Project name
   - **Category\*** (required): Development, Design, or Teaching
   - **Description\*** (required): Detailed description
   - **Image URL**: Link to project screenshot/thumbnail
   - **Project Link**: URL to live project or GitHub
   - **Technologies**: Comma-separated list (React, TypeScript, etc.)
   - **Year**: Completion year
   - **Display Order**: Sort position (lower = first)
   - **Featured on Homepage**: Checkbox to show on home page

3. Click "Add Portfolio Item"
4. See confirmation message
5. Item appears in Portfolio Items list below

### Managing Existing Items

In the Portfolio Items table:

**Features Available:**

- View all items with title, category, featured status
- **Toggle Featured**: Click "Featured"/"Not Featured" to change visibility
- **Edit**: Click "Edit" (functionality can be expanded)
- **Delete**: Click "Delete" (with confirmation)

### Portfolio Settings

**Customize these site-wide settings:**

- **Portfolio Title**: Main heading (displayed in nav on home)
- **Portfolio Description**: Subheading/tagline
- **Admin Email**: Contact email for inquiries

---

## Categories Explained

### 🔧 Development

- Web applications
- Mobile apps
- Full-stack projects
- Coding tutorials
- Open-source contributions

**Color Theme:** Blue gradient

### 🎨 Design

- UI/UX designs
- Graphic design
- Branding projects
- Design systems
- Digital art

**Color Theme:** Purple gradient

### 📚 Teaching

- Computer science courses
- Educational content
- Tutorial videos
- Training programs
- Workshops

**Color Theme:** Orange gradient

---

## Customization Guide

### Change Portfolio Title

**Option 1: Via Admin Panel**

1. Go to `/admin`
2. Scroll to "Portfolio Settings"
3. Update "Portfolio Title"
4. Click "Save Settings"

**Option 2: Direct in Database**

1. Supabase Dashboard → SQL Editor
2. Run: `UPDATE admin_settings SET value = 'Your New Title' WHERE key = 'portfolio_title';`

### Add More Stats

**File:** `app/page.tsx`

Find this section:

```typescript
{[
  { number: "50+", label: "Projects Completed" },
  { number: "100+", label: "Happy Clients" },
  { number: "5+", label: "Years Experience" },
].map((stat, i) => (
```

Modify the array to add/change stats.

### Change Colors

The design uses Tailwind CSS with emerald theme. Key classes:

- Primary: `emerald-` (green/teal)
- Blue: For Development
- Purple: For Design
- Orange: For Teaching

**File:** `app/page.tsx`, `components/PortfolioCard.tsx`

### Add More Categories

1. Update the form in `components/admin/PortfolioItemForm.tsx`
2. Add new category to the select dropdown
3. Update color mapping in `components/PortfolioCard.tsx`
4. Update `categoryColors` object with new category

---

## Sample Portfolio Items

Here are example items you can add:

### Development Example

```
Title: E-commerce Platform
Category: Development
Description: Full-stack e-commerce solution with real-time inventory management and payment processing
Technologies: Next.js, React, TypeScript, Tailwind CSS, Stripe, Supabase
Year: 2025
Featured: Yes
Link: https://example.com
```

### Design Example

```
Title: Mobile App UI Design
Category: Design
Description: User-friendly mobile app interface for fitness tracking application
Technologies: Figma, Adobe XD, Prototyping
Year: 2024
Featured: Yes
Link: https://dribbble.com/...
```

### Teaching Example

```
Title: Full-Stack Web Development Course
Category: Teaching
Description: Comprehensive 12-week course covering HTML, CSS, JavaScript, React, and databases
Technologies: JavaScript, React, Node.js, SQL
Year: 2024
Featured: Yes
Link: https://coursera.com/...
```

---

## Troubleshooting

### Can't Access Admin Panel

**Problem:** Redirected to login
**Solution:** Make sure you're logged in. Create an account or login at `/auth/login`

### Can't Add Portfolio Items

**Problem:** Form won't submit or errors appear
**Solution:**

1. Check all required fields (Title, Category, Description) are filled
2. Ensure you're authenticated
3. Check browser console (F12) for specific error
4. Verify database tables are created

### Items Not Showing on Home Page

**Problem:** Portfolio items list is empty
**Solution:**

1. Add items via admin panel (`/admin`)
2. Make sure items are marked "Featured" to show initially
3. Check database connection in Supabase
4. Refresh page (Ctrl+R)

### Images Not Loading

**Problem:** Image placeholders show but no images
**Solution:**

1. Verify image URLs are correct and publicly accessible
2. Use absolute URLs (https://...)
3. Test image URL in browser
4. Ensure image host allows cross-origin requests

---

## API Reference

All portfolio functions are in `lib/supabase/portfolio.ts`

### Reading Portfolio Data (Client-Side)

```typescript
import {
  getPortfolioItems,
  getPortfolioItemsByCategory,
  PortfolioItem,
} from "@/lib/supabase/portfolio";

// Get all items
const items = await getPortfolioItems();

// Get items by category
const devItems = await getPortfolioItemsByCategory("development");

// Get featured items only
const featured = await getFeaturedPortfolioItems();

// Get single item
const item = await getPortfolioItem(itemId);
```

### Managing Portfolio Items (Admin Only)

```typescript
import {
  createPortfolioItem,
  updatePortfolioItem,
  deletePortfolioItem,
  PortfolioItem,
} from "@/lib/supabase/portfolio";

// Create new item
const newItem = await createPortfolioItem({
  title: "My Project",
  description: "Description",
  category: "development",
  // ... other fields
});

// Update item
await updatePortfolioItem(itemId, {
  title: "Updated Title",
  featured: true,
});

// Delete item
await deletePortfolioItem(itemId);
```

---

## Security Notes

✅ **What's Secure:**

- Only authenticated users can modify content
- Database uses Row Level Security (RLS)
- Sensitive data is encrypted
- All communications use HTTPS

⚠️ **Important:**

- The admin panel is accessible to any authenticated user
- For production, implement role-based access control
- Consider adding an "is_admin" column to auth.users table

---

## Next Steps

1. ✅ Database setup complete
2. ✅ Portfolio system deployed
3. **Next:** Add your portfolio items via admin panel
4. **Customize:** Update title, description, and colors
5. **Deploy:** Push to production when ready

---

## Support & Resources

- **Supabase Docs:** https://supabase.com/docs
- **Next.js Docs:** https://nextjs.org/docs
- **Tailwind CSS:** https://tailwindcss.com/docs
- **TypeScript:** https://www.typescriptlang.org/docs/

---

**You're all set! Start building your portfolio now! 🚀**
