# 💻 Command Reference - Quick Copy-Paste Guide

## Terminal Commands

### Start Development Server

```bash
npm run dev
```

Then visit: `http://localhost:3000`

### Build for Production

```bash
npm run build
```

### Check for Errors

```bash
npm run lint
```

---

## Supabase URL (Bookmark This!)

Go to your Supabase project:

```
https://app.supabase.com
```

1. Login with your account
2. Select your project
3. You'll see your project dashboard

---

## Key URLs While Testing

| What              | URL                                        |
| ----------------- | ------------------------------------------ |
| Home Page         | http://localhost:3000                      |
| Sign Up           | http://localhost:3000/auth/signup          |
| Login             | http://localhost:3000/auth/login           |
| Forgot Password   | http://localhost:3000/auth/forgot-password |
| Dashboard (Admin) | http://localhost:3000/dashboard            |
| Admin Panel       | http://localhost:3000/admin/panel          |

---

## Supabase Dashboard Navigation

### Create Database Tables

1. Open Supabase Dashboard
2. Left sidebar → `SQL Editor`
3. Click `+ New Query`
4. Copy-paste from `SUPABASE_SETUP.sql`
5. Click `Run` button

### View Tables

1. Supabase Dashboard
2. Left sidebar → `Table Editor`
3. Click table name to view data

### View Users

1. Supabase Dashboard
2. Left sidebar → `Authentication`
3. Click `Users` tab

### View Storage

1. Supabase Dashboard
2. Left sidebar → `Storage`
3. Look for `portfolio` bucket

---

## Browser Developer Tools

### Open Console

- **Windows/Linux:** `F12` or `Ctrl+Shift+J`
- **Mac:** `Cmd+Option+J`

### Check for Errors

1. Open console
2. Look for red error messages
3. Click to expand and read details
4. Check Network tab for failed requests

### Clear Cache

- **Chrome:** `Ctrl+Shift+Delete`
- **Firefox:** `Ctrl+Shift+Delete`
- **Safari:** Develop → Empty Web Storage

---

## Environment Variables (Already Set)

Your `.env.local` should have:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

**Don't modify unless changing Supabase project!**

---

## Git Commands (If Using Git)

### Check Status

```bash
git status
```

### Add Changes

```bash
git add .
```

### Commit Changes

```bash
git commit -m "Update portfolio items"
```

### Push to GitHub

```bash
git push
```

---

## Docker (For Deployment)

### Build Docker Image

```bash
docker build -t hansco-portfolio .
```

### Run Container

```bash
docker run -p 3000:3000 hansco-portfolio
```

---

## Deployment Commands

### Deploy to Vercel

```bash
npm install -g vercel
vercel
```

Then follow prompts

### Deploy to Netlify

```bash
npm install -g netlify-cli
netlify deploy
```

---

## Database Queries (SQL)

### View All Portfolio Items

```sql
SELECT * FROM portfolio_items ORDER BY display_order;
```

### View Admin Settings

```sql
SELECT * FROM admin_settings;
```

### View Admin Users

```sql
SELECT * FROM admin_users;
```

### Count Items by Category

```sql
SELECT category, COUNT(*) FROM portfolio_items GROUP BY category;
```

### View Admin Logs (Last 10)

```sql
SELECT * FROM admin_logs ORDER BY created_at DESC LIMIT 10;
```

---

## File Editing

### Where to Edit Home Page

File: `app/page.tsx`

- Edit colors, layout, text
- Changes reload automatically

### Where to Edit Styles

File: `app/globals.css`

- Edit CSS styles
- Apply to whole site

### Where to Edit Auth Pages

Files: `app/auth/*/page.tsx`

- Sign up: `app/auth/signup/page.tsx`
- Login: `app/auth/login/page.tsx`
- etc.

### Where to Edit Database Functions

File: `lib/supabase/portfolio.ts`

- Add new functions
- Modify queries
- Change data structure

---

## Testing Workflows

### Test Sign Up Flow

1. Go to `http://localhost:3000`
2. Click "Sign Up" button
3. Enter email and password
4. Check email for verification link
5. Click link
6. Should redirect to dashboard

### Test Admin Panel

1. Login to dashboard
2. Look for "Admin Panel" button
3. Click to access management
4. Add/edit/delete items
5. Verify changes on home page

### Test Portfolio Display

1. Add portfolio item in admin
2. Go to home page
3. Verify item appears
4. Check correct category
5. Click item to view details

---

## Debugging Workflow

### If Something Breaks

1. **Check Console** (F12)
   - Look for red error messages
   - Click to expand details
2. **Check Supabase**
   - Go to dashboard
   - Look for errors in logs
3. **Restart Server**
   - Stop: `Ctrl+C`
   - Start: `npm run dev`
4. **Clear Cache**
   - Browser: `Ctrl+Shift+Delete`
   - Browser console: Type `localStorage.clear()`
5. **Check Documentation**
   - [DEBUGGING_GUIDE.md](DEBUGGING_GUIDE.md)
   - [SUPABASE_DATABASE_SETUP.md](SUPABASE_DATABASE_SETUP.md)

---

## NPM Package Commands

### Install Dependencies

```bash
npm install
```

### Update Packages

```bash
npm update
```

### Install Specific Package

```bash
npm install package-name
```

### Remove Package

```bash
npm uninstall package-name
```

---

## Environment Setup

### Windows PowerShell

```powershell
# Navigate to project
cd C:\Users\user\Desktop\nextjs\auth

# Start server
npm run dev

# Stop server
Ctrl+C
```

### Mac/Linux Terminal

```bash
# Navigate to project
cd ~/Desktop/nextjs/auth

# Start server
npm run dev

# Stop server
Ctrl+C
```

---

## Quick Copy-Paste SQL

### Insert Sample Portfolio Item

```sql
INSERT INTO portfolio_items
  (title, description, category, featured, display_order)
VALUES
  ('My First Project', 'Amazing project description', 'development', true, 1);
```

### Update Your Info

```sql
UPDATE admin_settings
SET
  portfolio_title = 'Your Name Here',
  portfolio_description = 'Your professional description',
  admin_email = 'your@email.com'
WHERE id = (SELECT id FROM admin_settings LIMIT 1);
```

### Check Your Admin Status

```sql
SELECT user_id, role, is_active FROM admin_users;
```

---

## Important Keyboard Shortcuts

| Action        | Shortcut            |
| ------------- | ------------------- |
| Open console  | F12                 |
| Clear cache   | Ctrl+Shift+Delete   |
| Reload page   | F5 or Ctrl+R        |
| Hard reload   | Ctrl+Shift+R        |
| Find on page  | Ctrl+F              |
| Open terminal | Ctrl+` (in VS Code) |

---

## Quick Troubleshooting Commands

### Check Node Version

```bash
node --version
```

### Check NPM Version

```bash
npm --version
```

### List Running Processes

```bash
npm list --depth=0
```

### Check Disk Space

```bash
# Windows
wmic logicaldisk get name, size, freespace

# Mac/Linux
df -h
```

---

## File Paths

### Project Root

```
c:\Users\user\Desktop\nextjs\auth\
```

### Source Code

```
c:\Users\user\Desktop\nextjs\auth\app\
```

### Libraries

```
c:\Users\user\Desktop\nextjs\auth\lib\
```

### Components

```
c:\Users\user\Desktop\nextjs\auth\components\
```

### Documentation

```
c:\Users\user\Desktop\nextjs\auth\*.md
```

---

## Useful VS Code Extensions

### Install in VS Code:

1. Open VS Code
2. Extensions (Ctrl+Shift+X)
3. Search and install:
   - ES7+ React/Redux snippets
   - Tailwind CSS IntelliSense
   - Thunder Client (or Postman)
   - SQLTools
   - Prettier

---

## Configuration Files

### .env.local

- Supabase credentials
- Environment variables
- DO NOT commit to Git

### next.config.ts

- Next.js settings
- Image optimization
- Build settings

### tsconfig.json

- TypeScript settings
- Type checking

### tailwind.config.js

- Tailwind CSS settings
- Color customization
- Font settings

---

## Common Error Messages & Fixes

| Error                      | Fix                               |
| -------------------------- | --------------------------------- |
| "Cannot find module"       | `npm install`                     |
| "Port 3000 already in use" | `npm run dev` uses different port |
| "RLS policy error"         | Check Supabase RLS is enabled     |
| "No session"               | Clear cache, restart server       |
| "Image not found"          | Check file path, rebuild          |

---

## Performance Commands

### Check Build Size

```bash
npm run build
```

### Analyze Bundle

```bash
npm install --save-dev @next/bundle-analyzer
npm run build
```

---

## Useful Links

- **Supabase:** https://app.supabase.com
- **GitHub:** https://github.com (if using)
- **Vercel:** https://vercel.com (for deployment)
- **NPM:** https://www.npmjs.com
- **Node.js:** https://nodejs.org

---

## Final Notes

- **Save work frequently** - `Ctrl+S`
- **Use version control** - `git add . && git commit -m "message"`
- **Clear cache if stuck** - `Ctrl+Shift+Delete`
- **Restart server often** - Stop and `npm run dev`
- **Check console for errors** - F12 → Console tab
- **Read documentation** - Before asking questions

---

**Everything you need in one place! 🚀**
