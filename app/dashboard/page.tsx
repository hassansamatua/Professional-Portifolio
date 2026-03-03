"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/supabase/auth-provider";

export default function DashboardPage() {
  const { user, session, loading, signOut } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !session) {
      router.push("/auth/login");
    }
  }, [loading, session, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#02050b] via-[#050c1d] to-[#071426] flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const handleSignOut = async () => {
    await signOut();
    router.push("/auth/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#02050b] via-[#050c1d] to-[#071426] text-slate-100">
      <nav className="border-b border-slate-700/50 bg-slate-800/30 backdrop-blur-sm">
        <div className="mx-auto max-w-5xl px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-white">Dashboard</h2>
          </div>
          <button
            onClick={handleSignOut}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition duration-200"
          >
            Sign Out
          </button>
        </div>
      </nav>

      <div className="mx-auto max-w-5xl px-6 py-16">
        <div className="space-y-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-4">
              Welcome back!
            </h1>
            <p className="text-lg text-slate-400">
              You are successfully logged in to your account.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-white mb-4">
                Account Information
              </h3>
              <div className="space-y-2">
                <div>
                  <p className="text-sm text-slate-400">Email</p>
                  <p className="text-white font-medium">{user?.email}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-400">User ID</p>
                  <p className="text-white font-mono text-sm break-all">
                    {user?.id}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-400">Last Sign In</p>
                  <p className="text-white">
                    {user?.last_sign_in_at
                      ? new Date(user.last_sign_in_at).toLocaleString()
                      : "N/A"}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-white mb-4">
                Quick Actions
              </h3>
              <div className="space-y-3">
                <Link
                  href="/auth/forgot-password"
                  className="block w-full px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-lg text-center transition duration-200"
                >
                  Change Password
                </Link>
                <button
                  onClick={handleSignOut}
                  className="w-full px-4 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-300 border border-red-500/50 font-medium rounded-lg transition duration-200"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>

          <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-emerald-300 mb-2">
              ✓ Authentication Status
            </h3>
            <p className="text-emerald-200">
              Your session is active and secure. You have access to all protected features.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
