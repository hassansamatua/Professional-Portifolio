# Quick Start Guide - Authentication Setup

## 5-Minute Setup

### Step 1: Verify Credentials

Check that your `.env.local` has:

```env
NEXT_PUBLIC_SUPABASE_URL=https://oipslqkpwsthkzsiqopb.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_jbpKw_l3khMFqKnIi0tU3g_zmyWv9K4
```

### Step 2: Configure Supabase URLs

1. Go to https://supabase.com → Your Project
2. Settings → Authentication → URL Configuration
3. Add these Redirect URLs:
   - `http://localhost:3000/auth/callback` (development)
   - `https://yourdomain.com/auth/callback` (production)

### Step 3: Start the App

```bash
npm run dev
```

### Step 4: Test the Flow

1. Visit `http://localhost:3000`
2. Click "Sign Up" and create an account
3. Check your email for verification link
4. Click the link to verify
5. Click "Sign In" and log in
6. You'll be redirected to `/dashboard`

## File Overview

### Pages

- `app/page.tsx` - Home page with links to auth pages
- `app/auth/signup/page.tsx` - Create account
- `app/auth/login/page.tsx` - Sign in to account
- `app/auth/forgot-password/page.tsx` - Request password reset
- `app/auth/reset-password/page.tsx` - Create new password
- `app/auth/callback/page.tsx` - Email verification callback
- `app/dashboard/page.tsx` - Protected user dashboard

### Libraries

- `lib/supabase/server-client.ts` - Server-side Supabase client
- `lib/supabase/browser-client.ts` - Client-side Supabase client
- `lib/supabase/auth.ts` - Authentication functions
- `lib/supabase/auth-provider.tsx` - React Context provider
- `lib/auth-validation.ts` - Validation utilities

### Components

- `components/AuthGuard.tsx` - Route protection wrapper

### Other

- `middleware.ts` - Next.js middleware for route protection

## Common Tasks

### Add Auth to a New Page

```typescript
import { useAuth } from '@/lib/supabase/auth-provider';

export default function MyPage() {
  const { user, session, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!session) return <div>Please sign in</div>;

  return <div>Welcome, {user?.email}!</div>;
}
```

### Protect a Route with AuthGuard

```typescript
import { AuthGuard } from '@/components/AuthGuard';

export default function ProtectedPage() {
  return (
    <AuthGuard>
      <h1>This page is protected</h1>
    </AuthGuard>
  );
}
```

### Sign Out User

```typescript
import { useAuth } from '@/lib/supabase/auth-provider';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const { signOut } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push('/auth/login');
  };

  return <button onClick={handleSignOut}>Sign Out</button>;
}
```

## Testing Credentials

After creating an account during testing:

- **Email**: use a real email you have access to
- **Password**: any password meeting requirements (6+ chars)
- Check spam folder for verification emails

## Email Configuration

### Using Supabase Email Service

Default provider - works out of the box but limited sending rate.

### Using Custom SMTP

1. Go to Supabase Dashboard → Project Settings
2. Under Auth → Email Provider
3. Configure SMTP credentials
4. Customize email templates

## Troubleshooting

### Issue: Redirect loop

**Solution**: Clear cookies and verify session is active

```javascript
// In browser console
document.cookie.split(";").forEach((c) => {
  document.cookie = c
    .replace(/^ +/, "")
    .replace(/=.*/, `=;expires=${new Date().toUTCString()};path=/`);
});
```

### Issue: Email not received

**Solution**:

1. Check spam/promotions folder
2. Wait 2-3 minutes
3. Verify email in Supabase dashboard → Auth → Users
4. Check that callback URL is configured

### Issue: Password reset not working

**Solution**:

1. Ensure redirect URL includes `/auth/reset-password`
2. Link expires after 24 hours
3. Request new reset link

### Issue: Session not persisting

**Solution**:

1. Ensure AuthProvider wraps entire app in layout.tsx
2. Check browser cookies are enabled
3. Verify session stored in localStorage

## Next Steps

1. Customize the UI in the page components
2. Add database schema in Supabase
3. Create user profiles table
4. Add more auth methods (Google, GitHub)
5. Implement email templates
6. Add rate limiting
7. Deploy to production

## Documentation

- **Supabase Auth**: https://supabase.com/docs/guides/auth
- **Next.js**: https://nextjs.org/docs
- **Tailwind CSS**: https://tailwindcss.com/docs

## Support

For issues:

1. Check the AUTHENTICATION.md file
2. Review Supabase dashboard for errors
3. Check browser console for error messages
4. Verify environment variables are set
