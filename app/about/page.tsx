"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/supabase/auth-provider";

export default function AboutPage() {
  const { user } = useAuth();
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem("theme");
    if (stored === "dark" || stored === "light") {
      setTheme(stored);
      return;
    }
    const prefersDark = window.matchMedia?.("(prefers-color-scheme: dark)").matches;
    setTheme(prefersDark ? "dark" : "light");
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem("theme", theme);
  }, [theme]);

  const isDark = theme === "dark";

  return (
    <div
      className={
        isDark
          ? "min-h-screen bg-gradient-to-br from-[#02050b] via-[#050c1d] to-[#071426] text-slate-100"
          : "min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200 text-slate-900"
      }
    >
      <nav
        className={
          isDark
            ? "sticky top-0 z-40 border-b border-slate-700/30 bg-[#02050b]/95 backdrop-blur-md"
            : "sticky top-0 z-40 border-b border-slate-200/60 bg-white/90 backdrop-blur-md"
        }
      >
        <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-500 to-emerald-300 bg-clip-text text-transparent">
              Hansco Dev
            </h1>
            <p className={isDark ? "text-xs text-slate-400" : "text-xs text-slate-600"}>
              Developer • Designer • Teacher
            </p>
          </div>
          <div
            className={
              isDark
                ? "hidden md:flex items-center gap-6 text-sm text-slate-300"
                : "hidden md:flex items-center gap-6 text-sm text-slate-700"
            }
          >
            <Link href="/about" className="hover:text-emerald-300 transition">
              About
            </Link>
            <Link href="/projects" className="hover:text-emerald-300 transition">
              Projects
            </Link>
            <Link href="/testimonies" className="hover:text-emerald-300 transition">
              Testimonials
            </Link>
            <Link href="/contact" className="hover:text-emerald-300 transition">
              Contact
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setTheme(isDark ? "light" : "dark")}
              className={
                isDark
                  ? "px-3 py-1 text-xs rounded-full border border-slate-700/60 text-slate-200 hover:bg-slate-800/70 transition"
                  : "px-3 py-1 text-xs rounded-full border border-slate-300 text-slate-700 hover:bg-slate-100 transition"
              }
            >
              {isDark ? "Light mode" : "Dark mode"}
            </button>
            {user ? (
              <>
                <Link
                  href="/admin"
                  className="px-4 py-2 rounded-lg border border-emerald-700/50 bg-emerald-900/20 text-emerald-200 hover:bg-emerald-900/40 transition font-medium text-sm"
                >
                  Admin Panel
                </Link>
                <Link
                  href="/"
                  className="px-4 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-500 transition font-medium text-sm"
                >
                  Home
                </Link>
              </>
            ) : (
              <Link
                href="/auth/login"
                className="px-4 py-2 rounded-lg border border-emerald-700/50 text-emerald-200 hover:bg-emerald-900/20 transition font-medium text-sm"
              >
                Admin Login
              </Link>
            )}
          </div>
        </div>
      </nav>

      <div className="mx-auto max-w-5xl px-6 py-16 space-y-10">
        <header className="space-y-4">
          <p className="inline-flex items-center gap-2 rounded-full border border-emerald-700/40 bg-emerald-900/20 px-4 py-1 text-xs font-semibold text-emerald-300">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            About Hansco Dev
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-white">
            Building thoughtful digital experiences.
          </h1>
          <p className="text-lg text-slate-300 max-w-2xl">
            I&apos;m a developer, designer, and computer science teacher focused on creating
            clean, performant interfaces and reliable backends. I love turning complex ideas
            into simple, beautiful products.
          </p>
        </header>

        <section className="grid gap-8 md:grid-cols-2">
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-white">What I do</h2>
            <ul className="space-y-3 text-sm text-slate-200">
              <li>– Full‑stack web applications with modern JavaScript/TypeScript.</li>
              <li>– Design systems and front‑end architectures that scale.</li>
              <li>– Educational content and mentoring in computer science.</li>
            </ul>
          </div>
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-white">How I work</h2>
            <p className="text-sm text-slate-300">
              I value clarity, communication, and craftsmanship. Whether it&apos;s a solo
              project or part of a bigger team, I aim to ship work that is maintainable,
              well‑tested, and pleasant to use.
            </p>
          </div>
        </section>

        <footer className="pt-6 border-t border-slate-700/40 flex flex-wrap items-center justify-between gap-4 text-sm text-slate-300">
          <span>Based on the web, working with clients worldwide.</span>
          <Link
            href="/"
            className="px-4 py-2 rounded-lg border border-emerald-700/50 bg-emerald-900/20 text-emerald-200 hover:bg-emerald-900/40 transition font-medium"
          >
            ← Back to Home
          </Link>
        </footer>
      </div>
    </div>
  );
}

