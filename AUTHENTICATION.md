# Full Authentication System with Supabase & Next.js

A complete authentication system built with Supabase and Next.js 16, featuring sign up, login, forgot password, and session management.

## Features

✅ **Sign Up** - Create new accounts with email verification
✅ **Login** - Secure login with email and password
✅ **Forgot Password** - Email-based password reset flow
✅ **Password Reset** - Update password with verification link
✅ **Session Management** - AuthProvider for global auth state
✅ **Protected Routes** - Dashboard accessible only to authenticated users
✅ **Error Handling** - Comprehensive error messages
✅ **Responsive Design** - Beautiful UI with Tailwind CSS

## Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript
- **Authentication**: Supabase Auth
- **Database**: Supabase PostgreSQL
- **Styling**: Tailwind CSS
- **State Management**: React Context API

## Project Structure

```
app/
├── page.tsx                    # Home page with auth links
├── layout.tsx                  # Root layout with AuthProvider
├── dashboard/
│   └── page.tsx               # Protected dashboard page
├── auth/
│   ├── signup/
│   │   └── page.tsx           # Sign up form
│   ├── login/
│   │   └── page.tsx           # Login form
│   ├── forgot-password/
│   │   └── page.tsx           # Forgot password request
│   ├── reset-password/
│   │   └── page.tsx           # Password reset form
│   └── callback/
│       └── page.tsx           # Email verification callback

lib/supabase/
├── server-client.ts           # Server-side Supabase client
├── browser-client.ts          # Client-side Supabase client
├── auth.ts                    # Auth utility functions
└── auth-provider.tsx          # React Context for auth state
```

## Setup Instructions

### 1. Clone or Setup the Project

```bash
cd nextjs/auth
npm install
```

### 2. Configure Supabase

Create a `.env.local` file with your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

You can get these from your Supabase project settings.

### 3. Configure Email Provider (Optional but Recommended)

In Supabase dashboard:

1. Go to **Authentication > Email Templates**
2. Customize email templates for password reset
3. Configure SMTP settings or use Supabase's email service

### 4. Set Up Redirect URLs

In Supabase dashboard > Authentication > URL Configuration:

- Add `http://localhost:3000/auth/callback` for development
- Add `https://yourdomain.com/auth/callback` for production

### 5. Run the Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` to see the application.

## How It Works

### Sign Up Flow

1. User navigates to `/auth/signup`
2. Enters email and password
3. Account created with Supabase Auth
4. Verification email sent to user
5. User clicks link in email to verify
6. Redirected to `/auth/callback` which confirms verification
7. User can now log in

### Login Flow

1. User navigates to `/auth/login`
2. Enters credentials
3. Session created in Supabase
4. Redirected to `/dashboard`
5. AuthProvider maintains session state

### Forgot Password Flow

1. User navigates to `/auth/forgot-password`
2. Enters email address
3. Password reset email sent
4. User clicks link in email
5. Redirected to `/auth/reset-password`
6. User enters new password
7. Password updated in Supabase
8. Redirected back to login

## API Reference

### Authentication Functions

#### `signUp(email, password)`

Creates a new account with email verification.

```typescript
const { data, error } = await signUp("user@example.com", "password123");
```

#### `signIn(email, password)`

Signs in an existing user.

```typescript
const { data, error } = await signIn("user@example.com", "password123");
```

#### `signOut()`

Signs out the current user.

```typescript
const { error } = await signOut();
```

#### `resetPassword(email)`

Sends a password reset email.

```typescript
const { data, error } = await resetPassword("user@example.com");
```

#### `updatePassword(newPassword)`

Updates the user's password.

```typescript
const { data, error } = await updatePassword("newpassword123");
```

### Auth Context Hook

Use the `useAuth()` hook in client components:

```typescript
import { useAuth } from '@/lib/supabase/auth-provider';

export default function MyComponent() {
  const { user, session, loading, signOut } = useAuth();

  return (
    <div>
      {user?.email}
    </div>
  );
}
```

## Protected Routes

The dashboard page is protected using the `useAuth()` hook:

```typescript
useEffect(() => {
  if (!loading && !session) {
    router.push("/auth/login");
  }
}, [loading, session, router]);
```

## Security Best Practices

✅ Passwords validated on client-side (6+ characters)
✅ Email verification required for account activation
✅ Password reset links are time-limited (Supabase default: 24 hours)
✅ Session tokens stored in secure HTTP-only cookies
✅ Server-side Supabase client for protected operations
✅ CSRF protection through Next.js

## Environment Variables

| Variable                        | Required | Description                 |
| ------------------------------- | -------- | --------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`      | Yes      | Your Supabase project URL   |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes      | Your Supabase anonymous key |

## Troubleshooting

### Email not received

- Check spam folder
- Verify email configuration in Supabase dashboard
- Ensure redirect URL is configured correctly

### Redirect loop on dashboard

- Clear browser cookies
- Verify session is being created correctly
- Check Supabase dashboard for auth errors

### Verification link not working

- Ensure callback URL is correctly configured
- Link may have expired (24 hours default)
- Request new verification email

## Production Deployment

1. Update redirect URLs in Supabase for your domain
2. Set environment variables in your hosting platform
3. Deploy using: `npm run build && npm start`
4. Configure email provider for production
5. Enable HTTPS on your domain

## License

MIT

## Support

For issues with Supabase, visit: https://supabase.com/docs
For Next.js documentation: https://nextjs.org/docs
