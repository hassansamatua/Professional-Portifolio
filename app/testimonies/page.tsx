"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/supabase/auth-provider";
import { getTestimonials, Testimonial } from "@/lib/supabase/testimonials";
import { PublicTestimonialForm } from "@/components/PublicTestimonialForm";

export default function TestimoniesPage() {
  const { user } = useAuth();
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [items, setItems] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getTestimonials();
        setItems(data);
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        setError(msg || "Failed to load testimonials");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

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

      <div className="mx-auto max-w-7xl px-6 py-16 space-y-12">
        <header className="space-y-4 text-center md:text-left">
          <p className="inline-flex items-center gap-2 rounded-full border border-emerald-700/40 bg-emerald-900/20 px-4 py-1 text-xs font-semibold text-emerald-300">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            Testimonials
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-white">
            Words from clients and collaborators.
          </h1>
          <p className="text-lg text-slate-300 max-w-2xl">
            Read what others have said about working with me, or leave your own testimonial
            below.
          </p>
        </header>

        <div className="grid gap-10 lg:grid-cols-[minmax(0,2fr)_minmax(0,1.4fr)] items-start">
          <section className="space-y-6">
            {loading && (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="mb-4 inline-flex h-10 w-10 animate-spin rounded-full border-4 border-slate-700 border-t-emerald-500" />
                  <p className="text-slate-400">Loading testimonials...</p>
                </div>
              </div>
            )}

            {error && !loading && (
              <div className="rounded-lg bg-red-950/50 border border-red-700/50 p-6 text-center text-red-200">
                {error}
              </div>
            )}

            {!loading && !error && items.length === 0 && (
              <div className="rounded-lg bg-slate-800/40 border border-slate-700/60 p-8 text-center text-slate-300">
                No testimonials yet. Be the first to share your experience!
              </div>
            )}

            {!loading && !error && items.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {items.map((t) => (
                  <article
                    key={t.id}
                    className="relative flex flex-col gap-4 rounded-2xl border border-emerald-700/30 bg-gradient-to-br from-emerald-900/20 to-emerald-800/10 p-6 shadow-lg"
                  >
                    <div className="flex items-center gap-4">
                      {t.avatar_url ? (
                        <div className="h-12 w-12 rounded-full overflow-hidden border border-emerald-500/40 bg-slate-900/60">
                          <img
                            src={t.avatar_url}
                            alt={t.name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="h-12 w-12 rounded-full bg-emerald-700/40 flex items-center justify-center text-lg font-semibold text-white">
                          {t.name.charAt(0).toUpperCase()}
                        </div>
                      )}

                      <div>
                        <h3 className="text-lg font-semibold text-white">{t.name}</h3>
                        <p className="text-sm text-slate-300">
                          {[t.role, t.company].filter(Boolean).join(" • ")}
                        </p>
                        {typeof t.rating === "number" && t.rating > 0 && (
                          <p className="text-sm text-emerald-300 mt-1">
                            {"★".repeat(Math.min(5, t.rating))}
                          </p>
                        )}
                      </div>
                    </div>

                    <p className="text-sm text-slate-100 leading-relaxed">
                      &ldquo;{t.message}&rdquo;
                    </p>
                  </article>
                ))}
              </div>
            )}
          </section>

          <section>
            <PublicTestimonialForm />
          </section>
        </div>

        <footer className="pt-6 border-t border-slate-700/40 flex flex-wrap items-center justify-between gap-4 text-sm text-slate-300">
          <span>Thank you to everyone who takes the time to share feedback.</span>
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

