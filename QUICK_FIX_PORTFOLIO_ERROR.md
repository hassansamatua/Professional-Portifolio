# ⚡ Portfolio Error - Quick Fix Guide

## You're Getting This Error:

```
Error fetching portfolio items: {}
```

## Immediate Actions (Try These First)

### 1️⃣ Restart Dev Server (60 seconds)

```bash
# Stop: Ctrl+C
# Then:
npm run dev
```

### 2️⃣ Clear Browser Cache (30 seconds)

- Browser: `Ctrl+Shift+Delete`
- Select "All time"
- Click "Clear data"
- Reload page

### 3️⃣ Check Browser Console (1 minute)

1. Press `F12` to open console
2. Look for error message (should be more detailed now)
3. Read the actual error text
4. Follow the solution below

---

## Solutions by Error Message

### ❌ Error: "relation 'portfolio_items' does not exist"

**Problem:** Database tables not created
**Fix:** Run [SUPABASE_SETUP.sql](SUPABASE_SETUP.sql) in Supabase SQL Editor

- Go to https://app.supabase.com
- Click `SQL Editor` → `+ New Query`
- Paste entire SUPABASE_SETUP.sql
- Click `Run`

### ❌ Error: "permission denied" or "row-level security policy"

**Problem:** RLS policies not set up correctly
**Fix:**

1. Run SUPABASE_SETUP.sql again
2. Verify in Supabase: Table Editor → Each table → Security → "Enable RLS" toggle ON
3. Restart: `npm run dev`

### ❌ Error: "failed to connect" or "invalid credentials"

**Problem:** .env.local has wrong Supabase keys
**Fix:**

1. Get correct keys from Supabase Dashboard → Settings → API
2. Copy `Project URL` to `.env.local` as `NEXT_PUBLIC_SUPABASE_URL`
3. Copy `anon` key to `.env.local` as `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Save file
5. Restart: `npm run dev`

### ❌ Error: "no rows returned" (but query works)

**Problem:** No portfolio items in database
**Fix:** Add sample item:

1. Supabase Dashboard → Table Editor → portfolio_items
2. Click `Insert row`
3. Fill: title, description, category, featured=true, display_order=1
4. Click Save
5. Reload page

### ❌ Error: Still getting empty "{}"

**Problem:** Error details not loading yet with new code
**Fix:**

1. Verify you have the latest code with better error handling
2. Make sure `.next` folder is deleted: `rm -r .next` (or delete folder in Windows)
3. Restart dev server: `npm run dev`
4. Check console again

---

## Verification Checklist

Before you conclude it's an error, verify:

- [ ] You ran SUPABASE_SETUP.sql
- [ ] 5 tables exist in Supabase Table Editor
- [ ] RLS is enabled on each table
- [ ] .env.local has correct Supabase credentials
- [ ] Dev server restarted after env change
- [ ] Browser cache cleared
- [ ] Portfolio items exist in database
- [ ] Console shows detailed error (not just "{}")

---

## Most Common Causes

1. **MOST COMMON:** Haven't run SUPABASE_SETUP.sql yet
   → Solution: [Run the SQL script](SUPABASE_QUICK_SETUP.md#phase-1-database-setup)

2. **Very Common:** Wrong credentials in .env.local
   → Solution: Copy correct values from Supabase Dashboard

3. **Common:** Database exists but is empty
   → Solution: Add at least 1 portfolio item

4. **Less Common:** RLS policies misconfigured
   → Solution: Run SUPABASE_SETUP.sql again

---

## 🎯 Step-by-Step Fix

### If You Haven't Set Up Database Yet:

1. **Go to:** https://app.supabase.com
2. **Click:** SQL Editor → + New Query
3. **Open:** [SUPABASE_SETUP.sql](SUPABASE_SETUP.sql) from your project
4. **Copy:** All the SQL code
5. **Paste:** Into the SQL Editor
6. **Click:** Run button
7. **Wait:** For "Success" message
8. **Verify:** Table Editor shows 5 tables now exist
9. **Add Sample Item:**
   - Table Editor → portfolio_items
   - Insert row: title="Test", description="Test project", category="development", featured=true, display_order=1
   - Save
10. **Restart Dev Server:**
    - Ctrl+C to stop
    - `npm run dev` to restart
11. **Test:**
    - Go to http://localhost:3000
    - Should see portfolio items now
    - If not, check console for detailed error

### If You Already Have Database:

1. **Check Console** (F12) for detailed error message
2. **Follow solution above** based on the error text
3. **Restart dev server** after making changes
4. **Clear cache** before testing
5. **Reload page** and check console again

---

## 💻 File Locations

| What             | Where                                                      |
| ---------------- | ---------------------------------------------------------- |
| SQL Setup Script | `SUPABASE_SETUP.sql`                                       |
| Setup Guide      | [SUPABASE_QUICK_SETUP.md](SUPABASE_QUICK_SETUP.md)         |
| Detailed Help    | [PORTFOLIO_FETCHING_ERROR.md](PORTFOLIO_FETCHING_ERROR.md) |
| Environment File | `.env.local`                                               |
| Portfolio Code   | `lib/supabase/portfolio.ts`                                |

---

## 🔗 Quick Links

- **Supabase Dashboard:** https://app.supabase.com
- **Full Setup Guide:** [SUPABASE_QUICK_SETUP.md](SUPABASE_QUICK_SETUP.md)
- **Complete Diagnostics:** [PORTFOLIO_FETCHING_ERROR.md](PORTFOLIO_FETCHING_ERROR.md)
- **Command Reference:** [COMMAND_REFERENCE.md](COMMAND_REFERENCE.md)

---

**Still stuck? Check the detailed guide:** [PORTFOLIO_FETCHING_ERROR.md](PORTFOLIO_FETCHING_ERROR.md)
