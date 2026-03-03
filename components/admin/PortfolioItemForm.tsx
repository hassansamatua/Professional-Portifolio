"use client";

import { useState } from "react";
import { createPortfolioItem, PortfolioItem, uploadPortfolioImage } from "@/lib/supabase/portfolio";

export function PortfolioItemForm() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "development" as "development" | "design" | "teaching",
    image_url: "",
    link: "",
    technologies: "",
    year: new Date().getFullYear(),
    featured: false,
    display_order: 0,
  });

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("Image size must be less than 5MB");
      return;
    }

    try {
      setUploading(true);
      setError(null);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Upload to Supabase Storage
      const imageUrl = await uploadPortfolioImage(file);
      setFormData({ ...formData, image_url: imageUrl });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const techArray = formData.technologies
        .split(",")
        .map((t) => t.trim())
        .filter((t) => t);

      await createPortfolioItem({
        title: formData.title,
        description: formData.description,
        category: formData.category,
        image_url: formData.image_url || undefined,
        link: formData.link || undefined,
        technologies: techArray,
        year: formData.year,
        featured: formData.featured,
        display_order: formData.display_order,
      });

      setSuccess(true);
      setFormData({
        title: "",
        description: "",
        category: "development",
        image_url: "",
        link: "",
        technologies: "",
        year: new Date().getFullYear(),
        featured: false,
        display_order: 0,
      });
      setImagePreview(null);

      setTimeout(() => {
        setSuccess(false);
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create portfolio item");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-slate-800/30 border border-slate-700/50 rounded-lg p-6">
      <h3 className="text-xl font-semibold text-emerald-100">Add Portfolio Item</h3>

      {error && (
        <div className="bg-red-950/50 border border-red-700/50 text-red-200 p-4 rounded-lg">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-emerald-950/50 border border-emerald-700/50 text-emerald-200 p-4 rounded-lg">
          Portfolio item created successfully!
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Title *
          </label>
          <input
            type="text"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg px-4 py-2 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/30 transition"
            placeholder="Project Title"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Category *
          </label>
          <select
            value={formData.category}
            onChange={(e) =>
              setFormData({
                ...formData,
                category: e.target.value as "development" | "design" | "teaching",
              })
            }
            className="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg px-4 py-2 text-slate-100 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/30 transition"
          >
            <option value="development">Development</option>
            <option value="design">Design</option>
            <option value="teaching">Teaching</option>
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Description *
          </label>
          <textarea
            required
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={4}
            className="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg px-4 py-2 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/30 transition"
            placeholder="Describe your project..."
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-slate-300 mb-2">
            📸 Project Image (Upload from Computer)
          </label>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploading}
                className="flex-1 bg-slate-900/50 border border-slate-700/50 rounded-lg px-4 py-2 text-slate-100 file:bg-emerald-600 file:text-white file:rounded file:border-0 file:px-3 file:py-1 file:cursor-pointer file:hover:bg-emerald-500 cursor-pointer disabled:opacity-50"
              />
              {uploading && <span className="text-sm text-emerald-300">Uploading...</span>}
            </div>
            {imagePreview && (
              <div className="relative w-full h-48 rounded-lg overflow-hidden border border-emerald-700/50">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <p className="text-xs text-slate-400">
              Max size: 5MB. Supported: JPG, PNG, WebP, GIF
            </p>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Or Paste Image URL
          </label>
          <input
            type="url"
            value={formData.image_url}
            onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
            className="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg px-4 py-2 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/30 transition"
            placeholder="https://..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Project Link
          </label>
          <input
            type="url"
            value={formData.link}
            onChange={(e) => setFormData({ ...formData, link: e.target.value })}
            className="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg px-4 py-2 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/30 transition"
            placeholder="https://..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Technologies (comma-separated)
          </label>
          <input
            type="text"
            value={formData.technologies}
            onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
            className="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg px-4 py-2 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/30 transition"
            placeholder="React, TypeScript, Tailwind"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Year
          </label>
          <input
            type="number"
            value={formData.year}
            onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
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
              setFormData({ ...formData, display_order: parseInt(e.target.value) })
            }
            className="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg px-4 py-2 text-slate-100 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/30 transition"
          />
        </div>

        <div className="flex items-center gap-3 md:col-span-2">
          <input
            type="checkbox"
            id="featured"
            checked={formData.featured}
            onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
            className="w-4 h-4 rounded border-slate-700/50 bg-slate-900/50 text-emerald-500 focus:ring-emerald-500/30 cursor-pointer"
          />
          <label htmlFor="featured" className="text-sm font-medium text-slate-300 cursor-pointer">
            Featured on Homepage
          </label>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Creating..." : "Add Portfolio Item"}
      </button>
    </form>
  );
}
