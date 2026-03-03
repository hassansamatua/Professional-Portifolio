# Supabase Database Setup - Hansco Dev Portfolio

## Overview

This guide walks you through setting up your Supabase database to store all portfolio data, admin settings, and user information. Everything will be stored in Supabase with proper security rules.

## Prerequisites

- ✅ Supabase Project created
- ✅ Supabase credentials in `.env.local`
- ✅ Admin account ready

## Step 1: Create Database Tables

### Option A: Using SQL Editor (Recommended)

1. **Go to Supabase Dashboard**
   - Visit [https://app.supabase.com](https://app.supabase.com)
   - Open your project
   - Click `SQL Editor` in left sidebar

2. **Create New Query**
   - Click `+ New Query`
   - Name it: `Setup Portfolio Database`

3. **Copy and Paste SQL**
   - Open `SUPABASE_SETUP.sql` from your project
   - Copy all content
   - Paste into Supabase SQL Editor

4. **Execute**
   - Click `Run` button (or press `Ctrl+Enter`)
   - Wait for success message
   - Should see: "Success. No rows returned"

### Option B: Step by Step

If you prefer to run tables one by one:

1. **Portfolio Items Table**

   ```sql
   -- Paste the portfolio_items table creation from SUPABASE_SETUP.sql
   ```

2. **Admin Settings Table**

   ```sql
   -- Paste the admin_settings table creation
   ```

3. **Continue with remaining tables**

## Step 2: Verify Tables Were Created

1. **In Supabase Dashboard**
   - Click `Table Editor` in left sidebar
   - You should see these tables:
     - `portfolio_items`
     - `admin_settings`
     - `portfolio_categories`
     - `admin_logs`
     - `admin_users`

2. **Check Column Structure**
   - Click each table
   - Verify columns match the SQL script

## Step 3: Configure Storage Bucket

1. **Go to Storage Section**
   - In Supabase Dashboard, click `Storage`
   - You should see `portfolio` bucket already created

2. **Check Bucket Settings**
   - Click on `portfolio` bucket
   - Click `Policies` tab
   - Verify these policies exist:
     - Public read access
     - Admin upload access
     - Admin delete access

3. **If Policies Missing**
   - The SQL script should have created them
   - If not, you can add them via Storage UI

## Step 4: Configure Security Policies

The SQL script creates Row Level Security (RLS) policies. Verify they're enabled:

1. **Check RLS is Enabled**
   - For each table in Table Editor
   - Click the table → `Security` button
   - Verify "Enable RLS" toggle is ON

2. **View Policies**
   - Click `Policies` button
   - You should see policies for:
     - portfolio_items (read, insert, update, delete)
     - admin_settings (read, update)
     - portfolio_categories (read)
     - admin_logs (read, insert)
     - admin_users (read)

### RLS Policies Explained

**Portfolio Items:**

- ✅ **Anyone** can view public portfolio items
- 🔒 **Only Admins** can create, edit, delete items

**Admin Settings:**

- ✅ **Anyone** can view settings (non-sensitive data)
- 🔒 **Only Admins** can update settings

**Admin Users:**

- 🔒 **Only Admins** can view other admins

**Admin Logs:**

- 🔒 **Only Admins** can view logs
- ✅ **System** can write logs automatically

**Storage (Portfolio Images):**

- ✅ **Anyone** can view images
- 🔒 **Only Admins** can upload/delete images

## Step 5: Add Yourself as Admin

### Method 1: Using Supabase Auth (Recommended)

1. **Create Auth Account**
   - In your app, go to `/auth/signup`
   - Create account with your email
   - Verify email (check email inbox)

2. **Get Your User ID**
   - Go to Supabase Dashboard
   - Click `Authentication` → `Users`
   - Find your user
   - Copy the `UUID` from the `id` column

3. **Add to Admin Users**
   - Go to Table Editor
   - Click `admin_users` table
   - Click `Insert row`
   - Fill in:
     - `user_id`: Your UUID from step 2
     - `role`: `admin`
     - `is_active`: `true`
     - `can_manage_portfolio`: `true`
     - `can_manage_settings`: `true`
     - `can_view_logs`: `true`
   - Click `Save`

### Method 2: Using SQL

```sql
-- First, get your user ID from auth.users
SELECT id, email FROM auth.users WHERE email = 'your-email@example.com';

-- Then insert into admin_users (replace UUID with your id)
INSERT INTO admin_users (user_id, role, is_active, can_manage_portfolio, can_manage_settings, can_view_logs)
VALUES ('your-uuid-here', 'admin', true, true, true, true);
```

## Step 6: Update Admin Settings

1. **Go to Supabase Dashboard**
   - Table Editor → `admin_settings`

2. **Edit Default Record**
   - Click the first (and only) row
   - Update these fields:
     - `admin_email`: Your email address
     - `portfolio_title`: `Hansco Dev` (or your name)
     - `portfolio_description`: Your professional description
     - `github_url`: Your GitHub profile
     - `linkedin_url`: Your LinkedIn profile
     - `twitter_url`: Your Twitter (optional)
     - `email_address`: Contact email

3. **Save Changes**
   - Click outside fields to auto-save
   - Data will now appear on home page

## Step 7: Add Portfolio Items (Optional Setup)

You can add sample items now or do it through the admin panel later.

### Option A: Through Admin Panel (Easier)

1. Run app: `npm run dev`
2. Go to `/dashboard`
3. Click "Admin Panel" → "Manage Portfolio"
4. Click "Add New Item"
5. Fill in details and save

### Option B: Directly in Supabase

1. Table Editor → `portfolio_items`
2. Click `Insert row`
3. Fill in required fields:
   - `title`: Project name
   - `description`: Project details
   - `category`: development/design/teaching
   - `featured`: true/false
   - `display_order`: 1, 2, 3...

## Step 8: Verify Everything Works

### Test Home Page

```bash
npm run dev
```

1. Visit `http://localhost:3000`
2. Verify you see:
   - Your portfolio title from `admin_settings`
   - Your description
   - All portfolio items from database
   - Categories working correctly

### Test Admin Login

1. Go to `http://localhost:3000`
2. Scroll to "Admin Access"
3. Click "Login" button
4. Sign in with your account
5. Should redirect to `/dashboard`
6. Should see admin panel

### Test Admin Panel

1. In dashboard, click "Admin Panel"
2. Verify you can:
   - View all portfolio items
   - Add new item
   - Edit existing item
   - Delete item
   - Update portfolio settings
   - View admin logs

## Troubleshooting

### "No portfolio items showing"

- **Check:** Items exist in `portfolio_items` table
- **Fix:** Add items through admin panel
- **Debug:** Check RLS policies are correct

### "Can't access admin panel"

- **Check:** You're added as admin user
- **Fix:** Verify entry in `admin_users` table
- **Debug:** Check `user_id` matches your auth user

### "Images not uploading"

- **Check:** `portfolio` storage bucket exists
- **Fix:** Recreate bucket if missing
- **Debug:** Check storage policies are enabled

### "Getting RLS policy errors"

- **Check:** Policies are set up correctly
- **Fix:** Run the SQL script again
- **Debug:** View Policies tab in Supabase

### "Settings not showing on home page"

- **Check:** Record exists in `admin_settings`
- **Fix:** Insert default record if missing
- **Debug:** Query table directly in SQL editor

## Email Verification Error - If You See "No session after retry"

This error indicates the callback page is trying to verify session before the token is processed.

### Solution:

1. **File:** `app/auth/callback/page.tsx`
2. **Status:** Already fixed in your codebase
3. **How it works:**
   - Uses `onAuthStateChange` listener
   - Waits for `SIGNED_IN` event
   - 5-second timeout protection
   - Proper cleanup to prevent memory leaks

### If Still Getting Error:

1. Clear browser cache: `Ctrl+Shift+Delete`
2. Restart dev server: Stop and `npm run dev`
3. Sign up again with new email
4. Check console (F12) for detailed errors
5. Check Supabase dashboard for auth logs

## Security Best Practices Enabled

✅ **Row Level Security (RLS)**

- All tables have RLS enabled
- Policies restrict admin operations
- Public data remains viewable

✅ **Storage Security**

- Public read-only for images
- Admin-only upload/delete
- Bucket policies enforced

✅ **Authentication**

- User verification via email
- Session management with cookies
- Secure admin roles

✅ **Audit Logging**

- `admin_logs` table tracks all admin actions
- Timestamp and user ID recorded
- Helpful for security review

## Environment Variables Needed

Your `.env.local` should have:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-public-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key (optional, for server functions)
```

## API Functions Available

Your portfolio functions automatically use Supabase:

```typescript
// lib/supabase/portfolio.ts

// Get all portfolio items
getPortfolioItems()

// Get items by category
getPortfolioItemsByCategory('development')

// Get featured items only
getFeaturedPortfolioItems()

// Create new item (admin only)
createPortfolioItem({...})

// Update item (admin only)
updatePortfolioItem(id, {...})

// Delete item (admin only)
deletePortfolioItem(id)

// Get settings
getAdminSettings()

// Update settings (admin only)
updateAdminSettings({...})
```

All these automatically use Supabase and apply RLS policies!

## Next Steps

1. ✅ Run the SQL script
2. ✅ Verify tables exist
3. ✅ Add yourself as admin
4. ✅ Update portfolio settings
5. ✅ Test home page
6. ✅ Test admin panel
7. ✅ Add portfolio items
8. ✅ Deploy to production

## Helpful Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Storage Documentation](https://supabase.com/docs/guides/storage)
- [SQL Reference](https://supabase.com/docs/guides/database)

## Support

If you encounter issues:

1. **Check Error Message**
   - Browser console (F12)
   - Supabase dashboard logs

2. **Review Documentation**
   - This guide
   - SQL script comments
   - Code comments in project

3. **Common Solutions**
   - Clear cache and restart
   - Re-run SQL script
   - Check Supabase credentials
   - Verify RLS policies

---

**Status:** ✅ Database setup complete!
**Your portfolio is now powered by Supabase!**
