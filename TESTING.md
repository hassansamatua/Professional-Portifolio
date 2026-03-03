# Testing Guide - Complete Authentication System

## Manual Testing Workflow

### Test 1: Sign Up Flow

1. **Navigate to Sign Up Page**
   - Go to `http://localhost:3000`
   - Click "Sign Up" button or navigate to `/auth/signup`

2. **Create Account**
   - Enter your test email (use a real email you can access)
   - Enter password (must be 6+ characters)
   - Confirm password
   - Click "Sign Up"

3. **Verify Sign Up Success**
   - Should see "Account created! Check your email to verify your account."
   - Form fields should clear
   - No error message should appear

4. **Verify Email**
   - Check your email inbox (or spam folder)
   - Look for email from Supabase
   - Click the verification link in the email

5. **Verify Callback**
   - Should be redirected to `/auth/callback`
   - Should see "Verifying..." spinner
   - After verification, should redirect to `/dashboard`

---

### Test 2: Login Flow

1. **Navigate to Login Page**
   - Go to `/auth/login`

2. **Sign In**
   - Enter the email you just created
   - Enter the password you set
   - Click "Sign In"

3. **Verify Login Success**
   - Should redirect to `/dashboard`
   - Should see your email displayed
   - Should see "Authentication Status" success message

4. **Verify Dashboard**
   - Account information shows correct email
   - Last sign-in timestamp is recent
   - Sign Out button is present

---

### Test 3: Forgot Password Flow

1. **Navigate to Forgot Password Page**
   - Go to `/auth/forgot-password`
   - Or from login page, click "Forgot your password?"

2. **Request Password Reset**
   - Enter your registered email
   - Click "Send Reset Link"

3. **Verify Email Sent**
   - Should see "Check your email for a password reset link"
   - Check your email for reset link

4. **Reset Password**
   - Click link in password reset email
   - Should redirect to `/auth/reset-password`
   - Enter new password (6+ characters)
   - Confirm new password
   - Click "Reset Password"

5. **Verify Password Reset**
   - Should see "Password reset successfully!"
   - Should auto-redirect to `/auth/login`

6. **Login with New Password**
   - Sign in with new password
   - Should successfully log in

---

### Test 4: Session Persistence

1. **Login**
   - Sign in with your account
   - You should be on `/dashboard`

2. **Refresh Page**
   - Press F5 or refresh the page
   - Should remain on `/dashboard` (not redirect to login)
   - User information should still be visible

3. **Open New Tab**
   - In new tab, go to `http://localhost:3000/dashboard`
   - Should be logged in (session persists across tabs)

---

### Test 5: Protected Routes

1. **Try Accessing Dashboard Without Login**
   - Open new browser/clear cookies
   - Go directly to `http://localhost:3000/dashboard`
   - Should redirect to `/auth/login`

2. **Try Login When Already Logged In**
   - Login normally
   - Go directly to `http://localhost:3000/auth/login`
   - Should redirect to `/dashboard` (via middleware)

---

### Test 6: Error Handling

1. **Sign Up Errors**
   - Enter invalid email (no @)
   - Enter password < 6 characters
   - Enter mismatched passwords
   - Use already registered email
   - Verify error messages appear

2. **Login Errors**
   - Try wrong password
   - Try non-existent email
   - Verify error message: "Invalid email or password"

3. **Forgot Password Errors**
   - Try non-existent email
   - Should still show success (security best practice)

---

### Test 7: Sign Out

1. **From Dashboard**
   - Click "Sign Out" button
   - Should redirect to `/auth/login`
   - Should not be able to access `/dashboard`

2. **Sign Out and Login Again**
   - Sign out
   - Go to login
   - Sign in again
   - Verify new session is created

---

## Edge Cases to Test

### Test 8: Password Requirements

- ✓ Less than 6 characters - should show error
- ✓ Exactly 6 characters - should work
- ✓ Special characters - should work
- ✓ Spaces in password - should work

### Test 9: Email Validation

- ✓ Missing @ symbol - should error
- ✓ Missing domain - should error
- ✓ Valid email formats - should work
- ✓ Uppercase in email - should work (email is case-insensitive)

### Test 10: Session Timeout

- ✓ After 1 hour without activity - session should expire
- ✓ User redirected to login on next action
- ✓ Page refresh doesn't preserve expired session

### Test 11: Multiple Browser Tabs

- ✓ Sign in on tab 1
- ✓ Tab 2 should show signed-in state (after page load)
- ✓ Sign out on tab 1
- ✓ Tab 2 should show signed-out on next action/page load

### Test 12: Network Errors

- ✓ Disable internet, try to sign up
- ✓ Should show error message
- ✓ Re-enable internet and retry
- ✓ Should work normally

---

## Browser Developer Tools Testing

### Check Local Storage

```javascript
// In browser console
localStorage.getItem("sb-*-auth-token");
// Should contain session data when logged in
```

### Check Cookies

```javascript
// View auth cookies
document.cookie;
// Should contain Supabase session cookies
```

### Monitor Network Requests

1. Open DevTools → Network tab
2. Sign up - should see:
   - POST to Supabase auth endpoint
3. Login - should see:
   - POST to Supabase auth endpoint
4. Dashboard load - should see:
   - GET request with session validation

---

## Supabase Dashboard Verification

1. **Go to Supabase Dashboard**
2. **Check Authentication > Users**
   - Should see your test user(s)
   - Email confirmation status should show
   - Last sign-in should be recent

3. **Check Logs**
   - Go to Logs → Auth
   - Should see sign up, sign in events
   - Any errors would be shown here

---

## Automated Testing (Optional)

### Example with Playwright

```typescript
// tests/auth.spec.ts
import { test, expect } from "@playwright/test";

test("complete auth flow", async ({ page }) => {
  // Sign up
  await page.goto("http://localhost:3000/auth/signup");
  await page.fill('[type="email"]', "test@example.com");
  await page.fill('[type="password"]', "password123");
  await page.fill('[name="confirmPassword"]', "password123");
  await page.click('button[type="submit"]');

  // Verify success message
  await expect(page.locator("text=Account created")).toBeVisible();
});
```

---

## Common Issues & Debug Steps

### Issue: Email Not Received

1. Check spam folder
2. Verify email in Supabase dashboard
3. Wait 2-3 minutes
4. Check `.env.local` has correct Supabase URL and key
5. Check email configuration in Supabase dashboard

### Issue: Can't Log In

1. Verify email is confirmed (check Supabase Users)
2. Try password reset
3. Clear browser cookies and try again
4. Check if multiple accounts created with same email

### Issue: Session Not Persisting

1. Check if cookies are enabled in browser
2. Clear all cookies and refresh
3. Verify AuthProvider is in `app/layout.tsx`
4. Check browser console for errors

### Issue: Redirect Loop

1. Clear all cookies
2. Hard refresh (Ctrl+Shift+R)
3. Check middleware.ts is correct
4. Verify session is actually being created

---

## Performance Testing

1. **Measure Page Load Times**
   - Open DevTools → Performance tab
   - Sign up page load time
   - Login page load time
   - Dashboard load time

2. **Check Bundle Size**

   ```bash
   npm run build
   # Check .next output for bundle sizes
   ```

3. **Monitor Network Requests**
   - Should only see 1-2 auth API calls per action
   - No waterfall of requests

---

## Accessibility Testing

1. **Tab Navigation**
   - Should be able to tab through all form fields
   - Submit button should be reachable with Tab

2. **Keyboard Only**
   - Try using Tab, Shift+Tab to navigate
   - Try Enter to submit forms

3. **Screen Reader**
   - Use browser's accessibility inspector
   - Check all labels are properly associated with inputs
   - Check error messages are announced

---

## Checklist: Ready for Production

- [ ] All auth flows tested (signup, login, forgot password)
- [ ] Email verification working
- [ ] Session persistence working
- [ ] Protected routes working
- [ ] Error handling tested
- [ ] Password validation working
- [ ] Mobile responsive (tested on various screen sizes)
- [ ] No console errors
- [ ] Performance acceptable (< 3s load time)
- [ ] Supabase email configuration complete
- [ ] Redirect URLs configured in Supabase
- [ ] No hardcoded credentials in code
- [ ] Environment variables set correctly
- [ ] Terms of service / privacy policy reviewed
- [ ] Rate limiting considered (for production)

---

**✅ All tests passing? Ready to deploy!**
