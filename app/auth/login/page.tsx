"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "@/lib/supabase/auth";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const router = useRouter();

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Initialize from localStorage only (dark mode is default)
    const stored = window.localStorage.getItem("theme");
    if (stored === "dark" || stored === "light") {
      setTheme(stored);
    }
    // If no stored preference, keep dark mode as default
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem("theme", theme);
  }, [theme]);

  const isDark = theme === "dark";

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { error: loginError } = await signIn(email, password);

      if (loginError) {
        setError(loginError.message);
      } else {
        router.push("/admin");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={
        isDark
          ? "min-h-screen bg-gradient-to-br from-[#02050b] via-[#050c1d] to-[#071426] text-slate-100 flex items-center justify-center px-4"
          : "min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 flex items-center justify-center px-4"
      }
    >
      <div className="w-full max-w-md">
        {/* Theme Toggle */}
        <div className="flex justify-end mb-4">
          <button
            type="button"
            onClick={() => setTheme(isDark ? "light" : "dark")}
            className={
              isDark
                ? "px-3 py-1 text-xs rounded-full border border-slate-700/60 text-slate-200 hover:bg-slate-800/70 transition"
                : "px-3 py-1 text-xs rounded-full border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
            }
          >
            {isDark ? "Light mode" : "Dark mode"}
          </button>
        </div>

        <div className={isDark ? "bg-slate-800/90 border border-slate-700/50 rounded-2xl p-8 shadow-2xl backdrop-blur-sm" : "bg-white border border-gray-200 rounded-2xl p-8 shadow-2xl"}>
          {/* Logo/Brand */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-600 to-emerald-400 rounded-2xl mb-4">
              <span className="text-2xl font-bold text-white">HD</span>
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-500 to-emerald-300 bg-clip-text text-transparent mb-2">
              Admin Login
            </h1>
            <p className={isDark ? "text-slate-300" : "text-slate-600"}>
              Sign in to manage your portfolio
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className={isDark 
              ? "mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg"
              : "mb-6 p-4 bg-red-50 border border-red-200 rounded-lg"
            }>
              <p className="text-red-700 dark:text-red-300 text-sm font-medium">
                {error}
              </p>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className={isDark ? "block text-sm font-medium text-slate-300 mb-2" : "block text-sm font-medium text-gray-700 mb-2"}>
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                required
                className={isDark 
                  ? "w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-400 focus:outline-none transition-all duration-200"
                  : "w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:outline-none transition-all duration-200"
                }
              />
            </div>

            <div>
              <label className={isDark ? "block text-sm font-medium text-slate-300 mb-2" : "block text-sm font-medium text-gray-700 mb-2"}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                className={isDark 
                  ? "w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-400 focus:outline-none transition-all duration-200"
                  : "w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:outline-none transition-all duration-200"
                }
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 disabled:from-gray-400 disabled:to-gray-500 text-white font-medium rounded-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </span>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className={isDark ? "text-sm text-slate-400" : "text-sm text-gray-600"}>
              <Link
                href="/auth/forgot-password"
                className="font-medium text-emerald-600 dark:text-emerald-400 hover:text-emerald-300 transition"
              >
                Forgot your password?
              </Link>
            </p>
          </div>

          {/* Security Notice */}
          <div className={isDark 
            ? "mt-6 p-4 bg-emerald-900/20 border border-emerald-700/50 rounded-lg"
            : "mt-6 p-4 bg-emerald-50 border border-emerald-200 rounded-lg"
          }>
            <p className="text-xs text-emerald-700 dark:text-emerald-300 text-center">
              🔒 This is a secure admin portal. Unauthorized access is prohibited.
            </p>
          </div>
        </div>

        {/* Footer Link */}
        <div className="mt-8 text-center">
          <Link
            href="/"
            className={isDark 
              ? "inline-flex items-center text-sm text-slate-400 hover:text-emerald-300 transition"
              : "inline-flex items-center text-sm text-gray-600 hover:text-emerald-600 transition"
            }
          >
            <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Portfolio
          </Link>
        </div>
      </div>
    </div>
  );
}
