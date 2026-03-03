"use client";

import { useEffect, useState } from "react";
import { getFeaturedTestimonials, Testimonial } from "@/lib/supabase/testimonials";

export function TestimonialsSection() {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadTestimonials();
  }, []);

  const loadTestimonials = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getFeaturedTestimonials();
      setItems(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      console.error("Testimonials loading error:", message);
      setError(message || "Failed to load testimonials");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="mt-20">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="mb-4 inline-flex h-10 w-10 animate-spin rounded-full border-4 border-slate-700 border-t-emerald-500"></div>
            <p className="text-slate-400">Loading testimonials...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="mt-20">
        <div className="rounded-lg bg-red-950/50 border border-red-700/50 p-6 text-center text-red-200">
          {error}
        </div>
      </section>
    );
  }

  if (items.length === 0) {
    return null;
  }

  return (
    <section className="mt-20 space-y-10">
      <div className="space-y-4 text-center">
        <h2 className="text-4xl font-bold text-white">What Clients Say</h2>
        <p className="text-lg text-slate-300 max-w-2xl mx-auto">
          Testimonials from people I&apos;ve had the pleasure to collaborate with.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
    </section>
  );
}

