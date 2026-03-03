# 🚀 Supabase Setup - Quick Checklist

## Your Portfolio System Overview

Your Hansco Dev portfolio now consists of:

- **Home Page** (`/`) - Displays portfolio items from Supabase
- **Admin Login** - On home page, scroll to bottom
- **Admin Dashboard** (`/dashboard`) - Manage everything
- **Admin Panel** - Upload projects, manage settings
- **Supabase Database** - Stores all data

---

## Setup Checklist (Do This Now!)

### Phase 1: Create Database Tables ⏱️ (5 minutes)

- [ ] **Go to Supabase Dashboard**
  - URL: https://app.supabase.com
  - Open your project

- [ ] **Open SQL Editor**
  - Left sidebar → `SQL Editor`
  - Click `+ New Query`

- [ ] **Run Setup SQL**
  - Open `SUPABASE_SETUP.sql` from your project
  - Copy all content
  - Paste into SQL Editor
  - Click `Run` button
  - Wait for success message

- [ ] **Verify Tables Created**
  - Click `Table Editor` in sidebar
  - You should see 5 tables:
    - ✅ `portfolio_items`
    - ✅ `admin_settings`
    - ✅ `portfolio_categories`
    - ✅ `admin_logs`
    - ✅ `admin_users`

### Phase 2: Add Yourself as Admin ⏱️ (3 minutes)

- [ ] **Create Your Account**
  - Start dev server: `npm run dev`
  - Go to: `http://localhost:3000`
  - Click `Sign Up` button
  - Enter your email and password
  - Check your email for verification link
  - Click link in email to verify

- [ ] **Get Your User ID**
  - Supabase Dashboard → `Authentication` → `Users`
  - Find your email address
  - Copy the `UUID` from `id` column
  - Paste it somewhere safe (you'll need it next)

- [ ] **Add to Admin Users**
  - Supabase Dashboard → `Table Editor`
  - Click `admin_users` table
  - Click `Insert row` button
  - Fill in these fields:
    - `user_id`: Your UUID from previous step
    - `role`: `admin`
    - `is_active`: toggle ON
    - `can_manage_portfolio`: toggle ON
    - `can_manage_settings`: toggle ON
    - `can_view_logs`: toggle ON
  - Click Save button

### Phase 3: Update Your Portfolio Settings ⏱️ (2 minutes)

- [ ] **Update Admin Settings**
  - Supabase Dashboard → `Table Editor`
  - Click `admin_settings` table
  - Click the first row to edit
  - Update these fields:

| Field                   | Example Value                                                        |
| ----------------------- | -------------------------------------------------------------------- |
| `admin_email`           | your@email.com                                                       |
| `portfolio_title`       | Hansco Dev                                                           |
| `portfolio_description` | Full-stack Developer \| Graphic Designer \| Computer Science Teacher |
| `portfolio_subtitle`    | Creating Amazing Digital Experiences                                 |
| `github_url`            | https://github.com/yourname                                          |
| `linkedin_url`          | https://linkedin.com/in/yourname                                     |
| `twitter_url`           | https://twitter.com/yourname                                         |
| `email_address`         | contact@yoursite.com                                                 |

- Click outside fields to save

### Phase 4: Test Everything Works ⏱️ (5 minutes)

- [ ] **Restart Dev Server**
  - Stop current server (Ctrl+C in terminal)
  - Run: `npm run dev`
  - Wait for "ready on" message

- [ ] **Check Home Page**
  - Visit: `http://localhost:3000`
  - Verify you see:
    - ✅ Your portfolio title from settings
    - ✅ Your description
    - ✅ Portfolio categories (Development, Design, Teaching)
    - ✅ Portfolio items (if any added)
    - ✅ Admin login section at bottom

- [ ] **Test Admin Login**
  - Scroll to bottom of home page
  - Look for "Admin Access" section
  - Click "Login" button
  - Sign in with your account
  - Should redirect to `/dashboard`
  - Should show admin panel

- [ ] **Test Admin Panel Features**
  - Click "Admin Panel" button
  - Verify you can:
    - ✅ View portfolio items
    - ✅ Click "Add New Item" button
    - ✅ View portfolio settings
    - ✅ Access all features

### Phase 5: Add Sample Portfolio Items ⏱️ (Optional)

- [ ] **Add First Project (Development)**
  - In admin panel, click "Add New Item"
  - Fill in:
    - `Title`: "E-commerce Platform"
    - `Description`: "Full-stack Next.js e-commerce with Stripe integration"
    - `Category`: Development
    - `Technologies`: Next.js, TypeScript, Tailwind, Supabase
    - `Year`: 2026
    - `Featured`: Toggle ON
    - `Display Order`: 1
  - Click "Save"

- [ ] **Add Second Project (Design)**
  - Click "Add New Item"
  - Fill in:
    - `Title`: "Brand Identity Design"
    - `Description`: "Complete brand identity including logo, color palette, typography"
    - `Category`: Design
    - `Featured`: Toggle ON
    - `Display Order`: 2
  - Click "Save"

- [ ] **Add Third Project (Teaching)**
  - Click "Add New Item"
  - Fill in:
    - `Title`: "Web Development Course"
    - `Description`: "Comprehensive course teaching HTML, CSS, JavaScript, and React"
    - `Category`: Teaching
    - `Featured`: Toggle ON
    - `Display Order`: 3
  - Click "Save"

- [ ] **View on Home Page**
  - Go to `http://localhost:3000`
  - Scroll down
  - Your portfolio items should appear
  - Click items to verify they work

---

## Verification Checklist

When everything is set up correctly, you should see:

### Home Page (`http://localhost:3000`)

- [ ] Portfolio title: "Hansco Dev"
- [ ] Portfolio description visible
- [ ] Three category sections (Development, Design, Teaching)
- [ ] Portfolio items displayed in their categories
- [ ] Admin login section at bottom
- [ ] All colors look professional

### Admin Panel (`http://localhost:3000/dashboard`)

- [ ] Admin login required (if not already logged in)
- [ ] Dashboard shows greeting
- [ ] "Admin Panel" button visible
- [ ] Can click to manage portfolio
- [ ] Can add, edit, delete items
- [ ] Can update settings
- [ ] Can view logs

### Database Tables

- [ ] 5 tables exist in Supabase
- [ ] `portfolio_items` has your projects
- [ ] `admin_settings` has your info
- [ ] `admin_users` has your account marked as admin
- [ ] `portfolio_categories` has 3 categories
- [ ] Storage bucket `portfolio` exists

### Security

- [ ] Can't access admin without login
- [ ] Can't view admin logs without permission
- [ ] Only you can modify portfolio items
- [ ] Anyone can view home page
- [ ] Images upload to storage bucket

---

## If Something Doesn't Work

### "Page is blank / no portfolio items showing"

1. Check `portfolio_items` table in Supabase
2. Make sure items exist
3. Clear browser cache: `Ctrl+Shift+Delete`
4. Restart dev server
5. Refresh page

### "Can't login to admin panel"

1. Verify your account exists in Supabase Auth
2. Check `admin_users` table - your `user_id` should be there
3. Make sure `is_active` is enabled
4. Try logging out and back in
5. Check browser console (F12) for errors

### "Settings not showing on home page"

1. Check `admin_settings` table has a record
2. Make sure fields are filled in (not NULL)
3. Restart dev server
4. Clear browser cache
5. Check console for errors

### "Getting database errors"

1. Check RLS is enabled on tables
2. Verify policies were created (run SQL script again)
3. Check your Supabase credentials in `.env.local`
4. Look at Supabase dashboard for error messages
5. Check browser console (F12)

### "Email verification not working"

- **This should be fixed!** Your callback page uses the latest event-driven approach
- If still seeing "No session after retry" error:
  1. Clear browser cache completely
  2. Restart dev server completely
  3. Try signing up with new email address
  4. Check browser console (F12) for detailed error
  5. Check Supabase auth logs

---

## File Reference

### Main Files You Need to Know

| File                         | Purpose                     |
| ---------------------------- | --------------------------- |
| `SUPABASE_SETUP.sql`         | Creates all database tables |
| `SUPABASE_DATABASE_SETUP.md` | Detailed setup instructions |
| `app/page.tsx`               | Home page with portfolio    |
| `app/dashboard/page.tsx`     | Admin dashboard             |
| `app/admin/...`              | Admin panel pages           |
| `lib/supabase/portfolio.ts`  | Database functions          |
| `.env.local`                 | Supabase credentials        |

### Key Configuration

All Supabase credentials should be in `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

---

## Success Indicators ✅

When you see ALL of these, you're done:

- [ ] Home page displays portfolio beautifully
- [ ] Portfolio items come from Supabase
- [ ] Can log in as admin
- [ ] Can add/edit/delete portfolio items
- [ ] Can update portfolio settings
- [ ] Settings appear on home page
- [ ] No console errors
- [ ] Everything loads quickly
- [ ] Responsive on mobile
- [ ] Admin panel is professional-looking

---

## Next Steps

1. ✅ **Complete this checklist**
2. ✅ **Test everything works**
3. ✅ **Add your real portfolio items**
4. ✅ **Update your information**
5. ✅ **Upload project images** (optional)
6. ✅ **Deploy to production**

---

## Quick Command Reference

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Check for errors
npm run lint

# Open Supabase dashboard
# https://app.supabase.com
```

---

## Support Resources

- **Supabase Docs**: https://supabase.com/docs
- **Next.js Docs**: https://nextjs.org/docs
- **Tailwind CSS**: https://tailwindcss.com/docs

---

**You're all set! Time to showcase your amazing work! 🎉**

**Questions?** Check [SUPABASE_DATABASE_SETUP.md](SUPABASE_DATABASE_SETUP.md) for detailed instructions.
