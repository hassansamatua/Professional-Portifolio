# 🧪 Email Verification Test - Step by Step

## Quick Test (5 minutes)

### Prerequisites

- ✅ Callback URL configured in Supabase: `http://localhost:3000/auth/callback`
- ✅ Dev server running: `npm run dev`
- ✅ Access to email inbox

### Test Steps

#### 1️⃣ Sign Up

```
1. Visit http://localhost:3000
2. Click "Sign Up" button
3. Enter your test email
4. Enter password (6+ characters)
5. Confirm password
6. Click "Sign Up" button
```

**Expected:** See "Account created! Check your email to verify your account."

#### 2️⃣ Check Email

```
1. Open your email inbox
2. Look for email from noreply@supabase.io
3. Subject should mention "Confirm your email"
4. If not in inbox, check spam/promotions folder
5. Wait up to 3 minutes if not there yet
```

**Expected:** Email arrives with a link

#### 3️⃣ Click Verification Link

```
1. Click the "Confirm your email" button/link in the email
2. Or copy-paste the link into browser
3. Wait for page to load
```

**Expected:** See "Verifying..." spinner briefly

#### 4️⃣ Verify Success

```
1. Page should show spinner momentarily
2. Then automatically redirect to dashboard
3. You should see your email on the dashboard
4. Should see "Authentication Status" success message
```

**Expected:** Dashboard loads, you're logged in ✅

#### 5️⃣ Test Login/Logout

```
1. Click "Sign Out" button
2. Should redirect to login page
3. Enter your email and password
4. Click "Sign In"
5. Should redirect to dashboard
```

**Expected:** Can log in and out successfully ✅

---

## Browser Console Debugging

### How to Open Console

1. Press **F12** on your keyboard
2. Go to **Console** tab
3. Keep console open while testing

### Good Log Messages (Expected)

```javascript
"Auth event: SIGNED_IN Session: true";
"Email verified successfully!";
```

→ Means verification is working!

### Bad Log Messages (Problematic)

```javascript
"No token in URL hash"
→ Email link is broken

"Verification timeout - no session created"
→ Token is invalid or Supabase config issue
```

---

## What to Test

### Test 1: Email Arrives

- [ ] Email arrives in inbox within 3 minutes
- [ ] Email is from noreply@supabase.io
- [ ] Email has a clickable link
- [ ] Link contains a token (starts with #access_token=)

### Test 2: Verification Works

- [ ] Click link takes you to callback page
- [ ] See "Verifying..." message
- [ ] Automatically redirects to dashboard
- [ ] No error messages appear

### Test 3: You're Logged In

- [ ] Dashboard shows your email
- [ ] Can see "Last Sign In" timestamp
- [ ] Can see "Authentication Status" success
- [ ] Can see "Sign Out" button

### Test 4: Login Works

- [ ] Click Sign Out
- [ ] Redirected to login page
- [ ] Can enter credentials
- [ ] Can log back in
- [ ] Dashboard loads again

---

## Troubleshooting During Test

### Issue: Email Doesn't Arrive

**Try:**

1. Check spam/promotions folder
2. Wait 3 minutes
3. Look for email from: noreply@supabase.io
4. Try different email address
5. Hard refresh email (Ctrl+Shift+R)

**If still doesn't work:**

- Check Supabase Dashboard → Logs for errors
- Verify email provider is enabled in Supabase
- Check callback URL is correct

### Issue: Click Link But Verify Fails

**Check:**

1. Browser console (F12) for error messages
2. Copy error message and search in [EMAIL_VERIFICATION_TROUBLESHOOTING.md](EMAIL_VERIFICATION_TROUBLESHOOTING.md)
3. Hard refresh (Ctrl+Shift+R)
4. Try with fresh email address

### Issue: Stuck on "Verifying..." Page

**Try:**

1. Wait 5 seconds (timeout limit)
2. Hard refresh (Ctrl+Shift+R)
3. Check browser console for errors
4. Close and reopen link from email

### Issue: Error Message Appears

**Do:**

1. Read the error message carefully
2. Check [EMAIL_VERIFICATION_TROUBLESHOOTING.md](EMAIL_VERIFICATION_TROUBLESHOOTING.md) for that specific error
3. Follow the suggested fix
4. Try again with new email

---

## Expected Timeline

```
Timeline of a Successful Test:

Time 0s:    Click "Sign Up"
Time 2s:    See "Account created!" message
Time 15s:   Email arrives in inbox
Time 20s:   Click verification link
Time 22s:   See "Verifying..." on callback page
Time 24s:   Redirect to dashboard
Time 25s:   See your email on dashboard ✅
```

---

## Multiple Test Scenarios

### Scenario 1: Fresh Signup

```
1. First time signing up with this email
2. Everything works as expected
3. Expected: ✅ Success
```

### Scenario 2: Already Verified

```
1. Click same verification link twice
2. Second time should fail (token used)
3. Expected: Error message (correct behavior)
```

### Scenario 3: Expired Link

```
1. Get verification email
2. Wait 24+ hours
3. Click old link
4. Expected: Error message (correct behavior)
```

### Scenario 4: Wrong Callback URL

```
1. If callback URL not in Supabase
2. Click verification link
3. Expected: Verification fails (use to test fix)
```

---

## Test Results Checklist

After completing test, check all boxes:

- [ ] Email signup creates account
- [ ] Verification email arrives within 3 minutes
- [ ] Email has valid verification link
- [ ] Click link loads callback page
- [ ] Callback page shows "Verifying..." spinner
- [ ] Spinner disappears and redirects to dashboard
- [ ] Dashboard shows your email
- [ ] Authentication Status shows success
- [ ] Can see "Last Sign In" timestamp
- [ ] Can click "Sign Out"
- [ ] After Sign Out, redirected to login
- [ ] Can log back in with email/password
- [ ] Browser console has no errors
- [ ] Console shows "Auth event: SIGNED_IN" message

**If all checked:** ✅ Email verification is working perfectly!

---

## Advanced Testing

### Test Console Output

Keep browser console open during entire flow:

```javascript
// At callback page, you should see:
"Auth event: SIGNED_IN Session: true";
"Email verified successfully!";

// Then page redirects (check DevTools Network tab to see redirect)
```

### Test Network Requests

In DevTools Network tab, you should see:

1. Initial page load: `/auth/callback`
2. Some requests to supabase.co (auth)
3. Redirect to `/dashboard` (check Response headers)

### Test Local Storage

In DevTools, Application → Local Storage → your domain:

```javascript
// You should see:
sb-{project-id}-auth-token (contains session)
```

---

## Performance Check

Good performance indicators:

- ⚡ Email arrives within 3 minutes
- ⚡ Verification completes in < 2 seconds
- ⚡ Redirect to dashboard is instant
- ⚡ No console errors
- ⚡ No network timeouts

If slow:

- Check internet connection
- Check if Supabase is responding
- Check browser network tab for slow requests

---

## Success Criteria

**Test is successful if:**

✅ Email verification works end-to-end
✅ No errors in browser console
✅ Proper log messages appear
✅ Redirect to dashboard works
✅ Session is created
✅ Can log in and out
✅ Dashboard shows user email

**Test is failed if:**

❌ Email doesn't arrive
❌ Error message on callback page
❌ Browser console has red errors
❌ Stuck on "Verifying..." forever
❌ Can't access dashboard after verification
❌ Can't log back in

---

## Common Test Mistakes

❌ **Don't:** Use same email repeatedly
→ Use different emails for each test

❌ **Don't:** Click multiple times on Sign Up
→ Wait for response before next action

❌ **Don't:** Close email immediately
→ Keep email open while testing

❌ **Don't:** Ignore console errors
→ Check F12 console for helpful error messages

✅ **Do:** Check spam folder
→ Email verification emails often go there

✅ **Do:** Wait 3 minutes for email
→ Sometimes emails are slow to arrive

✅ **Do:** Use valid email address
→ Must be email you can access

✅ **Do:** Hard refresh on errors
→ Ctrl+Shift+R to clear cache

---

## After Test

If everything works:

- ✅ Your auth system is production-ready!
- ✅ Ready to add features
- ✅ Ready to deploy

If something fails:

- 📖 Read [CALLBACK_FIX.md](CALLBACK_FIX.md)
- 📖 Read [EMAIL_VERIFICATION_TROUBLESHOOTING.md](EMAIL_VERIFICATION_TROUBLESHOOTING.md)
- 🔍 Check browser console errors (F12)
- 🐛 Use [DEBUGGING_GUIDE.md](DEBUGGING_GUIDE.md)

---

**Ready to test? Start with "Test Steps" section above! 🚀**
