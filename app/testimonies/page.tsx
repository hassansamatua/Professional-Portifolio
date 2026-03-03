"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getTestimonials, Testimonial } from "@/lib/supabase/testimonials";
import { PublicTestimonialForm } from "@/components/PublicTestimonialForm";

export default function TestimoniesPage() {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#02050b] via-[#050c1d] to-[#071426] text-slate-100">
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
            Read what others have said about working with me, or leave your own
            testimonial below.
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
                        <h3 className="text-lg font-semibold text-white">
                          {t.name}
                        </h3>
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

