# 🐛 Complete Debugging Guide

## Email Verification "Failed to verify email" Error

### Quick Diagnosis

```
Verification Failed
↓
Check these in order:
1. Callback URL configured in Supabase? ← Most common issue
2. Email received in inbox/spam?
3. User created in Supabase Users table?
4. Browser console shows errors?
5. Supabase logs show errors?
```

---

## 🔍 Diagnostic Checklist

### 1️⃣ Supabase Redirect URL Configuration

**Most common cause of verification failures!**

Go to: **Supabase Dashboard → Authentication → URL Configuration**

Check:

- [ ] `http://localhost:3000/auth/callback` is listed
- [ ] No extra slashes: ❌ `http://localhost:3000/auth/callback/`
- [ ] Correct protocol: ✅ `http://` (not `https://` for localhost)
- [ ] For production: `https://yourdomain.com/auth/callback`
- [ ] Click **Save** button after adding

If missing:

1. Add the URL to "Redirect URLs" section
2. Click Save
3. Try signing up again

---

### 2️⃣ Email Delivery Check

**Second most common issue**

1. **Check your email inbox**
   - From: `noreply@supabase.io` or `noreply@example.com`
   - Subject: Contains "Confirm your email"
   - Look in: Inbox, Spam, Promotions, Updates folders

2. **If email not found:**
   - Wait 3 minutes (emails can be slow)
   - Try signing up with different email (test@gmail.com)
   - Check email provider's spam settings

3. **Email is there but link expired?**
   - Links expire after 24 hours
   - Sign up again to get new link
   - Verify new email immediately

---

### 3️⃣ Check User in Supabase Dashboard

Go to: **Supabase Dashboard → Authentication → Users**

Look for:

- [ ] Your email address appears
- [ ] Check "Email Confirmed At" column
- [ ] If null/empty: email verification hasn't completed
- [ ] If has timestamp: verification succeeded (but app didn't redirect)

---

### 4️⃣ Browser Console Errors

**Open Browser DevTools (F12)**

Go to: **Console tab**

Try signing up again and look for:

- [ ] Red error messages
- [ ] Network errors
- [ ] Auth errors

**Copy any error message and check solutions below**

---

### 5️⃣ Supabase Logs

Go to: **Supabase Dashboard → Logs** (or Auth Logs)

Look for:

- [ ] Recent auth events
- [ ] Error messages with details
- [ ] Timestamp should be recent

---

## 🔧 Step-by-Step Fix Guide

### Fix #1: Configure Redirect URL (Most Common)

1. Open https://supabase.com/dashboard
2. Select your project
3. Click **Authentication** in sidebar
4. Click **URL Configuration**
5. Under "Redirect URLs", paste: `http://localhost:3000/auth/callback`
6. Click **Save** (important!)
7. Go back to your app
8. Try signing up again

**Test after fix:**

- Sign up → Receive email → Click link → Should redirect to dashboard

---

### Fix #2: Email Not Arriving

**Check Spam Folder:**

1. Gmail: Check Spam, All Mail, Updates tabs
2. Outlook: Check Junk folder
3. Add `noreply@supabase.io` to contacts

**Try Different Email:**

1. Use Gmail, Outlook, or Yahoo
2. Some work email domains block verification emails

**Check Email Configuration in Supabase:**

1. Go to **Project Settings → Email**
2. Verify sender email is configured
3. If using custom SMTP, check credentials

---

### Fix #3: Email Confirmed But App Error

**Problem:** User created in Supabase (email confirmed) but app shows verification error

**Solution:**

Update `app/auth/callback/page.tsx` - should already be fixed, but verify it has:

```typescript
// Wait for session to be processed
await new Promise((resolve) => setTimeout(resolve, 1000));

// Retry getting session
const { data: retryData } = await supabase.auth.getSession();
if (retryData.session) {
  router.push("/dashboard");
}
```

---

### Fix #4: Browser Console Errors

**Error: "Failed to verify email"**
→ Callback URL not in Supabase redirect URLs

**Error: "Invalid redirect URL"**
→ Callback URL format incorrect (check for spaces, slashes, etc.)

**Error: "Unauthorized"**
→ Token expired or invalid

**Error: "Network Error"**
→ Check internet connection, network tab in DevTools

---

## 📊 Testing Matrix

Test each combination:

| Step                        | Expected               | Actual | Status |
| --------------------------- | ---------------------- | ------ | ------ |
| 1. Visit `/auth/signup`     | Form loads             | ?      | ⬜     |
| 2. Enter email & password   | No errors              | ?      | ⬜     |
| 3. Click "Sign Up"          | Success message        | ?      | ⬜     |
| 4. Check email (wait 3 min) | Email arrives          | ?      | ⬜     |
| 5. Click verification link  | Redirects to callback  | ?      | ⬜     |
| 6. Callback processes       | Redirects to dashboard | ?      | ⬜     |
| 7. On dashboard             | Logged in              | ?      | ⬜     |

---

## 🎯 Specific Scenarios

### Scenario 1: Works in Dev, Not in Production

**Check:**

1. Production URL added to redirect URLs
2. Using HTTPS (not HTTP)
3. Domain DNS is set up correctly
4. Environment variables correct in production

**Fix:**

1. Supabase: Add `https://yourdomain.com/auth/callback`
2. Set: `NEXT_PUBLIC_SUPABASE_URL=` to production URL
3. Deploy code with correct environment variables

---

### Scenario 2: Email Works, But Stuck on Callback Page

**Problem:** Email verification link works, but callback page shows loading spinner forever

**Causes:**

1. Session not being created
2. User not found in database
3. Network request timing out

**Debug:**

1. Check browser console (F12) for errors
2. Check Supabase logs for errors
3. Check if user exists in Users table
4. Hard refresh browser (Ctrl+Shift+R)

---

### Scenario 3: Multiple Accounts Created, Can't Verify

**Problem:** Signed up multiple times, now all emails have different links

**Solution:**

1. Delete old accounts in Supabase Users table
2. Keep only the latest one
3. Check latest email for verification link
4. Click only the latest link

**Prevention:**

1. Wait for email before trying again
2. Each signup creates new token
3. Only latest token works

---

## 🧪 Manual Testing Steps

### Test Without Email (for Development Only)

In Supabase, disable email confirmation temporarily:

1. Go to **Authentication > Providers > Email**
2. Uncheck **"Confirm email"**
3. Sign up now creates account immediately
4. ⚠️ Re-enable before going to production!

**Verify this works:**

1. Sign up → No email sent → Redirect to dashboard immediately
2. Account appears in Users table with email confirmed

---

### Test Email Manually

```bash
# In terminal, use curl to test Supabase auth endpoint
curl -X POST https://[PROJECT_ID].supabase.co/auth/v1/signup \
  -H "Content-Type: application/json" \
  -H "apikey: [ANON_KEY]" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "data": {}
  }'
```

---

## 📋 Pre-Deployment Checklist

Before going to production:

- [ ] All email verification tests pass locally
- [ ] Email arrives consistently
- [ ] Callback URL works
- [ ] Redirect to dashboard works
- [ ] Supabase email provider configured
- [ ] Production redirect URL added
- [ ] Environment variables set correctly
- [ ] Email confirmation enabled in Supabase
- [ ] No console errors
- [ ] No network errors in DevTools

---

## 🆘 Still Having Issues?

### Get Help:

1. **Check Files:**
   - `EMAIL_VERIFICATION_TROUBLESHOOTING.md` ← Read this first
   - `AUTHENTICATION.md` ← API reference
   - `QUICKSTART.md` ← Setup guide

2. **Check Supabase:**
   - https://supabase.com/docs/guides/auth
   - https://supabase.com/docs/learn/auth-deep-dive

3. **Check Your Setup:**
   - Verify `.env.local` has correct URL and key
   - Verify callback URL is exactly: `http://localhost:3000/auth/callback`
   - Verify email is not in spam

4. **Check Supabase Dashboard:**
   - Are users being created?
   - Are any errors in logs?
   - Is email provider enabled?

5. **Get Professional Help:**
   - Supabase Support: https://supabase.com/support
   - Include: Project ID, email tried, redirect URL set, error messages

---

## 📝 Notes for Debugging

Save this information when troubleshooting:

```
Project ID: _______________________
Redirect URL Set: __________________
Email Address Tested: ________________
Error Message: ______________________
Browser: ___________________________
OS: ________________________________
Time Attempted: _____________________
```

---

**Remember: Email verification is usually just a missing redirect URL in Supabase!**
