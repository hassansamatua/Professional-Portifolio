# 🔧 Email Verification Troubleshooting Guide

## Problem: "Verification Failed" Message

If you're seeing "Failed to verify email. Please try signing up again." on the callback page, here's how to fix it.

---

## ✅ Step 1: Check Supabase Configuration

### Verify Email Provider is Enabled

1. Go to your **Supabase Dashboard**
2. Navigate to **Authentication > Providers**
3. Ensure **Email** provider is **Enabled**

### Check Email Template

1. Go to **Authentication > Email Templates**
2. Verify **Confirm signup** template exists
3. Ensure it contains the magic link

---

## ✅ Step 2: Verify Redirect URLs

This is the most common issue!

1. Go to **Authentication > URL Configuration**
2. Under **Redirect URLs**, add:
   - `http://localhost:3000/auth/callback` (for development)
   - `https://yourdomain.com/auth/callback` (for production)
   - `http://localhost:3000` (fallback)

3. Click **Save**

**Important**: The callback URL must match EXACTLY. Common issues:

- ❌ `http://localhost:3000/auth/callback/` (extra slash)
- ❌ `https://localhost:3000/auth/callback` (https instead of http for localhost)
- ❌ `localhost:3000/auth/callback` (missing http)
- ✅ `http://localhost:3000/auth/callback` (correct)

---

## ✅ Step 3: Check Email Delivery

### Check Spam/Promotions Folder

- Verification emails often go to spam
- Add noreply@supabase.io to your contacts
- Check all email folders

### Wait for Email

- Emails can take 2-3 minutes to arrive
- Don't click submit multiple times (creates multiple verification links)
- Check junk/spam folders first

### Verify Email Address in Supabase

1. Go to **Supabase Dashboard > Authentication > Users**
2. Look for your email address
3. Check if it's in the list
4. Note the "Email Confirmed" status

---

## ✅ Step 4: Test with a Different Email

Try creating an account with a different email address:

- Use Gmail, Outlook, or another provider
- This helps identify if it's a specific email provider issue

---

## ✅ Step 5: Check Browser Console

1. Open **Browser DevTools** (F12)
2. Go to **Console** tab
3. Try signing up again
4. Look for error messages
5. Copy any errors and check below

### Common Console Errors

**Error: "Failed to verify email"**
→ Callback URL not configured in Supabase

**Error: "Invalid redirect URL"**
→ Callback URL doesn't match Supabase settings

**Error: "Session not found"**
→ Token expired or invalid

---

## ✅ Step 6: Check Supabase Logs

1. Go to **Supabase Dashboard**
2. Select your project
3. Go to **Logs** (or **Auth Logs**)
4. Look for recent activity
5. Check for error messages

---

## ✅ Step 7: Verify Email Settings

### Check Email Configuration

1. Go to **Project Settings > Email**
2. Verify sender email is configured
3. If using custom SMTP, verify credentials

### For Development (Testing without emails)

In Supabase, you can disable email confirmation:

1. Go to **Authentication > Providers > Email**
2. Uncheck **Confirm email** (for testing only!)
3. ⚠️ Re-enable this for production!

---

## 🔄 Manual Testing Workflow

If emails aren't working, you can test manually:

### Step 1: Create Account (with email disabled)

1. Temporarily disable email confirmation in Supabase
2. Sign up normally
3. Account creates immediately
4. Re-enable email confirmation after testing

### Step 2: Test Callback URL

1. Visit callback URL manually: `http://localhost:3000/auth/callback`
2. Should redirect to dashboard if session exists
3. Should redirect to signup if no session

---

## 💡 Common Issues & Solutions

### Issue 1: Email Never Arrives

**Solution:**

1. Check spam folder
2. Wait 3 minutes
3. Try different email provider (Gmail, Outlook)
4. Check Supabase logs for errors

### Issue 2: Link Expires Quickly

**Solution:**

1. Supabase links expire after 24 hours
2. Request new email if older
3. Check system clock (time sync issues)

### Issue 3: Works in Dev, Not in Production

**Solution:**

1. Add production URL to Supabase redirect URLs
2. Use HTTPS for production
3. Verify domain DNS is set up

### Issue 4: "Invalid Redirect" Error

**Solution:**

1. Check callback URL matches exactly
2. No trailing slashes
3. Correct HTTP/HTTPS protocol
4. No extra parameters in URL

### Issue 5: Multiple Sign Ups Create Multiple Accounts

**Solution:**

1. Each signup creates new verification token
2. Old links become invalid
3. Only latest email link works
4. Wait for email before retrying signup

---

## 📋 Configuration Checklist

- [ ] Email provider enabled in Supabase
- [ ] Email templates exist and configured
- [ ] Redirect URL added: `http://localhost:3000/auth/callback`
- [ ] Redirect URL added: Production URL
- [ ] Email not in spam folder
- [ ] Waited 2-3 minutes for email
- [ ] Checked Supabase Users table
- [ ] Checked Supabase Logs for errors
- [ ] Browser console shows no errors
- [ ] System clock is correct
- [ ] Not using VPN that blocks emails

---

## 🧪 Advanced Testing

### Check Network Requests

1. Open DevTools → Network tab
2. Go to signup
3. Sign up with test email
4. Look for requests to `supabase.co`
5. Check response status codes (200 = good, 400+ = error)

### Monitor Supabase Real-time

1. Go to Supabase Dashboard
2. Navigate to **SQL Editor**
3. Run: `SELECT * FROM auth.users ORDER BY created_at DESC LIMIT 5;`
4. Check if your user was created
5. Note the `email_confirmed_at` value

### Test Email Function Directly

```javascript
// In browser console
import { createSupabaseBrowserClient } from "@/lib/supabase/browser-client";
const supabase = createSupabaseBrowserClient();

const { data, error } = await supabase.auth.signUp({
  email: "test@example.com",
  password: "password123",
});

console.log("Signup result:", { data, error });
```

---

## 🔧 If All Else Fails

### Option 1: Disable Email Confirmation (Testing Only)

```
Supabase Dashboard > Authentication > Providers > Email
Uncheck "Confirm email"
⚠️ Only for development/testing!
```

### Option 2: Use Alternative Auth Method

- Test with password-less magic links instead
- Use phone number authentication
- Add OAuth (Google, GitHub) as alternative

### Option 3: Contact Supabase Support

- Go to https://supabase.com/support
- Provide:
  - Project ID
  - Email address used
  - Redirect URL configured
  - Error messages from logs
  - Steps to reproduce

---

## 📝 Quick Reference

### Correct Redirect URL Format

```
http://localhost:3000/auth/callback
```

### When Adding to Supabase

1. Dashboard → Authentication → URL Configuration
2. Paste in "Redirect URLs" section
3. Click Save (very important!)

### Email Not Received?

1. Check spam folder
2. Wait 3 minutes
3. Try different email
4. Check Supabase logs

### Verification Failed Page?

1. Check callback URL in Supabase
2. Check browser console for errors
3. Try signing up again
4. Check Supabase Users table

---

## ✅ Success Indicators

✓ Email arrives within 2-3 minutes
✓ Email has "Verify email" button/link
✓ Clicking link redirects to dashboard
✓ No error messages
✓ User appears in Supabase Users table
✓ "Email Confirmed" status is checked

---

**If you're still having issues after following these steps, check the AUTHENTICATION.md file for more detailed setup information.**
