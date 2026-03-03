# 📋 Quick Reference Card

## 🚀 Getting Started in 3 Steps

```bash
# 1. Verify environment variables
cat .env.local

# 2. Start development server
npm run dev

# 3. Open browser
# http://localhost:3000
```

---

## 🗂️ File Quick Reference

### Pages

| Route                   | File                                | Purpose              |
| ----------------------- | ----------------------------------- | -------------------- |
| `/`                     | `app/page.tsx`                      | Home with auth links |
| `/auth/signup`          | `app/auth/signup/page.tsx`          | Create account       |
| `/auth/login`           | `app/auth/login/page.tsx`           | Sign in              |
| `/auth/forgot-password` | `app/auth/forgot-password/page.tsx` | Request reset        |
| `/auth/reset-password`  | `app/auth/reset-password/page.tsx`  | Set new password     |
| `/auth/callback`        | `app/auth/callback/page.tsx`        | Verify email         |
| `/dashboard`            | `app/dashboard/page.tsx`            | Protected dashboard  |

### Libraries

| File                             | Purpose                |
| -------------------------------- | ---------------------- |
| `lib/supabase/auth.ts`           | Auth functions         |
| `lib/supabase/auth-provider.tsx` | useAuth hook & context |
| `lib/supabase/server-client.ts`  | Server-side client     |
| `lib/supabase/browser-client.ts` | Client-side client     |
| `lib/auth-validation.ts`         | Form validation        |
| `lib/constants.ts`               | Routes & messages      |

### Components

| File                       | Purpose        |
| -------------------------- | -------------- |
| `components/AuthGuard.tsx` | Protect routes |

---

## 🔑 API Quick Reference

### useAuth Hook

```typescript
import { useAuth } from "@/lib/supabase/auth-provider";

const { user, session, loading, signOut } = useAuth();
```

### Auth Functions

```typescript
import {
  signUp,
  signIn,
  signOut,
  resetPassword,
  updatePassword,
} from "@/lib/supabase/auth";

await signUp("email@example.com", "password123");
await signIn("email@example.com", "password123");
await signOut();
await resetPassword("email@example.com");
await updatePassword("newpassword123");
```

### AuthGuard Component

```typescript
import { AuthGuard } from '@/components/AuthGuard';

<AuthGuard>
  <ProtectedContent />
</AuthGuard>
```

---

## 🛡️ Protect a Route

### Option 1: Client-Side with Hook

```typescript
import { useAuth } from '@/lib/supabase/auth-provider';
import { useRouter } from 'next/navigation';

export default function ProtectedPage() {
  const { session } = useAuth();
  const router = useRouter();

  if (!session) {
    return router.push('/auth/login');
  }

  return <div>Protected Content</div>;
}
```

### Option 2: With AuthGuard Component

```typescript
import { AuthGuard } from '@/components/AuthGuard';

export default function ProtectedPage() {
  return (
    <AuthGuard>
      <div>Protected Content</div>
    </AuthGuard>
  );
}
```

### Option 3: Middleware (Server-Side)

Edit `middleware.ts` - already protects `/dashboard`

---

## 📝 Form Validation

```typescript
import {
  validateEmail,
  validatePassword,
  validatePasswordMatch,
} from "@/lib/auth-validation";

const emailError = validateEmail(email);
const passwordError = validatePassword(password);
const matchError = validatePasswordMatch(password, confirmPassword);
```

---

## 🎨 Customization

### Change Button Color

In page components, update Tailwind classes:

```typescript
// Change from emerald to blue
className = "bg-blue-600 hover:bg-blue-700";
```

### Change Theme Colors

Edit Tailwind classes in all page components:

- `from-[#02050b]` - Dark blue background
- `text-emerald-300` - Emerald text
- `border-emerald-400/30` - Border color

### Customize Messages

Edit `lib/constants.ts` to change error/success messages

---

## 🐛 Debugging

### Check if User is Logged In

```typescript
const { user, session } = useAuth();
console.log("User:", user?.email);
console.log("Session:", session?.access_token);
```

### View Auth State

```typescript
import { createSupabaseBrowserClient } from "@/lib/supabase/browser-client";

const supabase = createSupabaseBrowserClient();
const { data } = await supabase.auth.getSession();
console.log("Current session:", data.session);
```

### Check Browser Storage

```javascript
// In browser console
localStorage.getItem("sb-*-auth-token");
document.cookie;
```

---

## ✅ Before Deploying

- [ ] Test signup flow
- [ ] Verify email works
- [ ] Test login/logout
- [ ] Test forgot password
- [ ] Update Supabase redirect URLs
- [ ] Configure production email
- [ ] Review security settings
- [ ] Test on mobile
- [ ] Check performance
- [ ] Review error messages

---

## 🆘 Common Issues

### Email not received

→ Check spam folder, verify email config in Supabase

### Can't login

→ Verify email is confirmed in Supabase Users table

### Session lost on refresh

→ Check cookies enabled, verify AuthProvider in layout

### Redirect loop

→ Clear cookies, hard refresh, check middleware.ts

---

## 📞 Documentation

| Document                  | When to Use                |
| ------------------------- | -------------------------- |
| **README_AUTH_SYSTEM.md** | Overview of entire system  |
| **AUTHENTICATION.md**     | Full API reference & setup |
| **QUICKSTART.md**         | 5-minute quick start       |
| **TESTING.md**            | Test the system            |
| **SETUP_COMPLETE.md**     | What was created           |

---

## 🔗 Useful Links

- Supabase Dashboard: https://supabase.com/dashboard
- Supabase Docs: https://supabase.com/docs
- Next.js Docs: https://nextjs.org/docs
- React Docs: https://react.dev

---

## 📊 Architecture at a Glance

```
User Interface (React Components)
         ↓
    useAuth Hook (Context)
         ↓
Auth Functions (lib/supabase/auth.ts)
         ↓
Supabase Client (browser/server)
         ↓
Supabase Backend (Auth + Database)
```

---

**Print this card and keep it handy while developing!**
