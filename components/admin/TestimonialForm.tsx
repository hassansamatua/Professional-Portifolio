"use client";

import { useState } from "react";
import { createTestimonial } from "@/lib/supabase/testimonials";

export function TestimonialForm() {
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    company: "",
    message: "",
    avatar_url: "",
    rating: 5,
    featured: true,
    display_order: 0,
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
        avatar_url: formData.avatar_url || undefined,
        rating: formData.rating || undefined,
        featured: formData.featured,
        display_order: formData.display_order,
      });

      setSuccess(true);
      setFormData({
        name: "",
        role: "",
        company: "",
        message: "",
        avatar_url: "",
        rating: 5,
        featured: true,
        display_order: 0,
      });

      setTimeout(() => setSuccess(false), 2000);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to create testimonial"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 bg-slate-800/30 border border-slate-700/50 rounded-lg p-6"
    >
      <h3 className="text-xl font-semibold text-emerald-100">
        Add Testimonial
      </h3>

      {error && (
        <div className="bg-red-950/50 border border-red-700/50 text-red-200 p-4 rounded-lg">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-emerald-950/50 border border-emerald-700/50 text-emerald-200 p-4 rounded-lg">
          Testimonial created successfully!
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Name *
          </label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
            }
            className="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg px-4 py-2 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/30 transition"
            placeholder="Client name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Role / Position
          </label>
          <input
            type="text"
            value={formData.role}
            onChange={(e) =>
              setFormData({ ...formData, role: e.target.value })
            }
            className="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg px-4 py-2 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/30 transition"
            placeholder="e.g. Product Manager"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Company
          </label>
          <input
            type="text"
            value={formData.company}
            onChange={(e) =>
              setFormData({ ...formData, company: e.target.value })
            }
            className="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg px-4 py-2 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/30 transition"
            placeholder="Company name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Avatar Image URL
          </label>
          <input
            type="url"
            value={formData.avatar_url}
            onChange={(e) =>
              setFormData({ ...formData, avatar_url: e.target.value })
            }
            className="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg px-4 py-2 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/30 transition"
            placeholder="https://..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
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
            className="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg px-4 py-2 text-slate-100 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/30 transition"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Display Order
          </label>
          <input
            type="number"
            value={formData.display_order}
            onChange={(e) =>
              setFormData({
                ...formData,
                display_order: parseInt(e.target.value || "0", 10),
              })
            }
            className="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg px-4 py-2 text-slate-100 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/30 transition"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">
          Testimonial *
        </label>
        <textarea
          required
          value={formData.message}
          onChange={(e) =>
            setFormData({ ...formData, message: e.target.value })
          }
          rows={4}
          className="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg px-4 py-2 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/30 transition"
          placeholder="What did the client say?"
        />
      </div>

      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          id="featured-testimonial"
          checked={formData.featured}
          onChange={(e) =>
            setFormData({ ...formData, featured: e.target.checked })
          }
          className="w-4 h-4 rounded border-slate-700/50 bg-slate-900/50 text-emerald-500 focus:ring-emerald-500/30 cursor-pointer"
        />
        <label
          htmlFor="featured-testimonial"
          className="text-sm font-medium text-slate-300 cursor-pointer"
        >
          Featured on homepage
        </label>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Creating..." : "Add Testimonial"}
      </button>
    </form>
  );
}

