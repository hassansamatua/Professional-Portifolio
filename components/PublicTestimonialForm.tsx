"use client";

import { useState } from "react";
import { createTestimonial } from "@/lib/supabase/testimonials";

export function PublicTestimonialForm() {
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    company: "",
    message: "",
    rating: 5,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await createTestimonial({
        name: formData.name,
        role: formData.role || undefined,
        company: formData.company || undefined,
        message: formData.message,
        rating: formData.rating || undefined,
        featured: false,
        display_order: 0,
        avatar_url: undefined,
      });

      setSuccess(true);
      setFormData({
        name: "",
        role: "",
        company: "",
        message: "",
        rating: 5,
      });

      setTimeout(() => setSuccess(false), 2500);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to submit testimonial. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 bg-slate-900/40 border border-slate-700/60 rounded-2xl p-6 md:p-8"
    >
      <h2 className="text-2xl font-bold text-white mb-2">
        Share Your Experience
      </h2>
      <p className="text-sm text-slate-300 mb-4">
        If we&apos;ve worked together, I&apos;d love to hear your feedback.
      </p>

      {error && (
        <div className="bg-red-950/50 border border-red-700/50 text-red-200 p-4 rounded-lg text-sm">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-emerald-950/50 border border-emerald-700/50 text-emerald-200 p-4 rounded-lg text-sm">
          Thank you! Your testimonial has been submitted.
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-200 mb-2">
            Name *
          </label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full bg-slate-950/60 border border-slate-700/70 rounded-lg px-4 py-2 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/30 transition"
            placeholder="Your name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-200 mb-2">
            Role / Position
          </label>
          <input
            type="text"
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            className="w-full bg-slate-950/60 border border-slate-700/70 rounded-lg px-4 py-2 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/30 transition"
            placeholder="e.g. Product Manager"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-200 mb-2">
            Company
          </label>
          <input
            type="text"
            value={formData.company}
            onChange={(e) =>
              setFormData({ ...formData, company: e.target.value })
            }
            className="w-full bg-slate-950/60 border border-slate-700/70 rounded-lg px-4 py-2 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/30 transition"
            placeholder="Company name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-200 mb-2">
            Rating (1-5)
          </label>
          <input
            type="number"
            min={1}
            max={5}
            value={formData.rating}
            onChange={(e) =>
              setFormData({
                ...formData,
                rating: parseInt(e.target.value || "0", 10),
              })
            }
            className="w-full bg-slate-950/60 border border-slate-700/70 rounded-lg px-4 py-2 text-slate-100 focus:outline-none focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/30 transition"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-200 mb-2">
          Testimonial *
        </label>
        <textarea
          required
          value={formData.message}
          onChange={(e) =>
            setFormData({ ...formData, message: e.target.value })
          }
          rows={4}
          className="w-full bg-slate-950/60 border border-slate-700/70 rounded-lg px-4 py-2 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/30 transition"
          placeholder="Share a few sentences about your experience working with me…"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Submitting..." : "Submit Testimonial"}
      </button>
    </form>
  );
}

