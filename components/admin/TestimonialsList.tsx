"use client";

import { useEffect, useState } from "react";
import {
  getTestimonials,
  updateTestimonial,
  deleteTestimonial,
  Testimonial,
} from "@/lib/supabase/testimonials";

export function TestimonialsList() {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<Testimonial> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    try {
      setLoading(true);
      const data = await getTestimonials();
      setItems(data);
      setError(null);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load testimonials"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (
      !confirm(
        `Are you sure you want to delete the testimonial from "${name}"? This action cannot be undone.`
      )
    )
      return;

    try {
      await deleteTestimonial(id);
      setItems(items.filter((item) => item.id !== id));
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to delete testimonial"
      );
    }
  };

  const startEdit = (item: Testimonial) => {
    setEditingId(item.id);
    setEditData({ ...item });
    setError(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditData(null);
  };

  const handleToggleFeatured = async (item: Testimonial) => {
    try {
      await updateTestimonial(item.id, { featured: !item.featured });
      setItems(
        items.map((i) =>
          i.id === item.id ? { ...i, featured: !i.featured } : i
        )
      );
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to update testimonial"
      );
    }
  };

  const handleSaveEdit = async () => {
    if (!editingId || !editData) return;

    try {
      setUpdating(true);
      setError(null);

      const updatePayload: any = {};
      const originalItem = items.find((i) => i.id === editingId);

      if (editData.name !== originalItem?.name) updatePayload.name = editData.name;
      if (editData.role !== originalItem?.role) updatePayload.role = editData.role;
      if (editData.company !== originalItem?.company) updatePayload.company = editData.company;
      if (editData.message !== originalItem?.message) updatePayload.message = editData.message;
      if (editData.avatar_url !== originalItem?.avatar_url) updatePayload.avatar_url = editData.avatar_url;
      if (editData.rating !== originalItem?.rating) updatePayload.rating = editData.rating;
      if (editData.display_order !== originalItem?.display_order) {
        updatePayload.display_order = editData.display_order;
      }
      if (editData.featured !== originalItem?.featured) {
        updatePayload.featured = editData.featured;
      }

      if (Object.keys(updatePayload).length === 0) {
        cancelEdit();
        return;
      }

      await updateTestimonial(editingId, updatePayload);

      setItems(
        items.map((i) => (i.id === editingId ? { ...i, ...editData } : i))
      );

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      cancelEdit();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to update testimonial"
      );
    } finally {
      setUpdating(false);
    }
  };

  if (loading)
    return (
      <div className="text-center py-8 text-slate-300">
        Loading testimonials...
      </div>
    );

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-950/50 border border-red-700/50 text-red-200 p-4 rounded-lg">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-emerald-950/50 border border-emerald-700/50 text-emerald-200 p-4 rounded-lg">
          ✓ Testimonial updated successfully!
        </div>
      )}

      <div className="bg-slate-800/30 border border-slate-700/50 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-900/50 border-b border-slate-700/50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase">
                Company
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase">
                Featured
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/30">
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-slate-800/20 transition">
                <td className="px-6 py-4 text-slate-200">{item.name}</td>
                <td className="px-6 py-4 text-slate-300">
                  {item.company || "-"}
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => handleToggleFeatured(item)}
                    className={`px-3 py-1 rounded text-xs font-medium transition ${
                      item.featured
                        ? "bg-emerald-900/50 text-emerald-200 border border-emerald-700/50"
                        : "bg-slate-800/50 text-slate-300 border border-slate-700/50 hover:bg-slate-800"
                    }`}
                  >
                    {item.featured ? "★ Featured" : "Not Featured"}
                  </button>
                </td>
                <td className="px-6 py-4 space-x-2">
                  <button
                    onClick={() => startEdit(item)}
                    className="text-emerald-300 hover:text-emerald-200 transition text-sm font-medium"
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item.id, item.name)}
                    className="text-red-400 hover:text-red-300 transition text-sm font-medium"
                  >
                    🗑️ Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {items.length === 0 && (
          <div className="px-6 py-8 text-center text-slate-400">
            No testimonials yet. Add your first one!
          </div>
        )}
      </div>

      {editingId && editData && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-800 border border-slate-700/50 rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-2xl font-bold text-white mb-6">
              Edit Testimonial
            </h3>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Name *
                  </label>
                  <input
                    type="text"
                    value={editData.name || ""}
                    onChange={(e) =>
                      setEditData({ ...editData, name: e.target.value })
                    }
                    className="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg px-4 py-2 text-slate-100 focus:outline-none focus:border-emerald-500/50 transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Role
                  </label>
                  <input
                    type="text"
                    value={editData.role || ""}
                    onChange={(e) =>
                      setEditData({ ...editData, role: e.target.value })
                    }
                    className="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg px-4 py-2 text-slate-100 focus:outline-none focus:border-emerald-500/50 transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Company
                  </label>
                  <input
                    type="text"
                    value={editData.company || ""}
                    onChange={(e) =>
                      setEditData({ ...editData, company: e.target.value })
                    }
                    className="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg px-4 py-2 text-slate-100 focus:outline-none focus:border-emerald-500/50 transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Avatar URL
                  </label>
                  <input
                    type="url"
                    value={editData.avatar_url || ""}
                    onChange={(e) =>
                      setEditData({ ...editData, avatar_url: e.target.value })
                    }
                    className="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg px-4 py-2 text-slate-100 focus:outline-none focus:border-emerald-500/50 transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Rating (1-5)
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={5}
                    value={editData.rating ?? 5}
                    onChange={(e) =>
                      setEditData({
                        ...editData,
                        rating: parseInt(e.target.value || "0", 10),
                      })
                    }
                    className="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg px-4 py-2 text-slate-100 focus:outline-none focus:border-emerald-500/50 transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={editData.display_order ?? 0}
                    onChange={(e) =>
                      setEditData({
                        ...editData,
                        display_order: parseInt(e.target.value || "0", 10),
                      })
                    }
                    className="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg px-4 py-2 text-slate-100 focus:outline-none focus:border-emerald-500/50 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Testimonial *
                </label>
                <textarea
                  value={editData.message || ""}
                  onChange={(e) =>
                    setEditData({ ...editData, message: e.target.value })
                  }
                  rows={4}
                  className="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg px-4 py-2 text-slate-100 focus:outline-none focus:border-emerald-500/50 transition"
                />
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="featured-edit"
                  checked={editData.featured ?? false}
                  onChange={(e) =>
                    setEditData({
                      ...editData,
                      featured: e.target.checked,
                    })
                  }
                  className="w-4 h-4 rounded border-slate-700/50 bg-slate-900/50 text-emerald-500 cursor-pointer"
                />
                <label
                  htmlFor="featured-edit"
                  className="text-sm font-medium text-slate-300 cursor-pointer"
                >
                  Featured on Homepage
                </label>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleSaveEdit}
                disabled={updating}
                className="flex-1 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-semibold py-2 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {updating ? "Saving..." : "Save Changes"}
              </button>
              <button
                onClick={cancelEdit}
                disabled={updating}
                className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-semibold py-2 rounded-lg transition disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

