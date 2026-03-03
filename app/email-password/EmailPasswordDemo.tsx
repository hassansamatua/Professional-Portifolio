"use client";
import { User } from "@supabase/supabase-js";

type EmailPasswordDemoProps = {
  user: User;
};

export default function EmailPasswordDemo({ user }: EmailPasswordDemoProps) {
  return (
      <div className="flex h-full flex-col items-center justify-center gap-6 rounded-lg bg-slate-900/60 p-6 text-center">
        <h2 className="text-2xl font-semibold text-white">Welcome, {user.email}!</h2>
        <p className="text-sm text-slate-400">
          You have successfully signed in with email and password.  This is a protected page that only authenticated users can access.
        </p>
      </div>
  );
}   