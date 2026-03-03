"use client";

import { useState, useEffect } from "react";
import {
  getPortfolioItems,
  updatePortfolioItem,
  deletePortfolioItem,
  PortfolioItem,
} from "@/lib/supabase/portfolio";

export function PortfolioItemsList() {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<PortfolioItem> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    try {
      setLoading(true);
      const data = await getPortfolioItems();
      setItems(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load items");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"? This action cannot be undone.`)) return;

    try {
      await deletePortfolioItem(id);
      setItems(items.filter((item) => item.id !== id));
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete item");
    }
  };

  const handleToggleFeatured = async (item: PortfolioItem) => {
    try {
      await updatePortfolioItem(item.id, { featured: !item.featured });
      setItems(
        items.map((i) => (i.id === item.id ? { ...i, featured: !i.featured } : i))
      );
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update item");
    }
  };

  const startEdit = (item: PortfolioItem) => {
    setEditingId(item.id);
    setEditData({ ...item });
    setError(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditData(null);
  };

  const handleSaveEdit = async () => {
    if (!editingId || !editData) return;

    try {
      setUpdating(true);
      setError(null);

      // Prepare update data
      const updatePayload: any = {};
      const originalItem = items.find((i) => i.id === editingId);

      if (editData.title !== originalItem?.title) updatePayload.title = editData.title;
      if (editData.description !== originalItem?.description) updatePayload.description = editData.description;
      if (editData.category !== originalItem?.category) updatePayload.category = editData.category;
      if (editData.image_url !== originalItem?.image_url) updatePayload.image_url = editData.image_url;
      if (editData.link !== originalItem?.link) updatePayload.link = editData.link;
      if (editData.year !== originalItem?.year) updatePayload.year = editData.year;
      if (editData.featured !== originalItem?.featured) updatePayload.featured = editData.featured;
      if (editData.display_order !== originalItem?.display_order) updatePayload.display_order = editData.display_order;

      if (Object.keys(updatePayload).length === 0) {
        cancelEdit();
        return;
      }

      await updatePortfolioItem(editingId, updatePayload);

      // Update local state
      setItems(
        items.map((i) => (i.id === editingId ? { ...i, ...editData } : i))
      );

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      cancelEdit();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update item");
    } finally {
      setUpdating(false);
    }
  };

  if (loading)
    return <div className="text-center py-8 text-slate-300">Loading portfolio items...</div>;

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-950/50 border border-red-700/50 text-red-200 p-4 rounded-lg">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-emerald-950/50 border border-emerald-700/50 text-emerald-200 p-4 rounded-lg">
          ✓ Portfolio item updated successfully!
        </div>
      )}

      <div className="bg-slate-800/30 border border-slate-700/50 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-900/50 border-b border-slate-700/50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase">
                Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase">
                Category
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
                <td className="px-6 py-4 text-slate-200">{item.title}</td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-emerald-900/30 text-emerald-200 border border-emerald-700/30">
                    {item.category}
                  </span>
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
                    onClick={() => handleDelete(item.id, item.title)}
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
            No portfolio items yet. Create your first one!
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editingId && editData && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-800 border border-slate-700/50 rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-2xl font-bold text-white mb-6">Edit Portfolio Item</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  value={editData.title || ""}
                  onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                  className="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg px-4 py-2 text-slate-100 focus:outline-none focus:border-emerald-500/50 transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Category *
                </label>
                <select
                  value={editData.category || "development"}
                  onChange={(e) => setEditData({ ...editData, category: e.target.value as any })}
                  className="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg px-4 py-2 text-slate-100 focus:outline-none focus:border-emerald-500/50 transition"
                >
                  <option value="development">Development</option>
                  <option value="design">Design</option>
                  <option value="teaching">Teaching</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Description *
                </label>
                <textarea
                  value={editData.description || ""}
                  onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                  rows={4}
                  className="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg px-4 py-2 text-slate-100 focus:outline-none focus:border-emerald-500/50 transition"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Image URL
                  </label>
                  <input
                    type="url"
                    value={editData.image_url || ""}
                    onChange={(e) => setEditData({ ...editData, image_url: e.target.value })}
                    className="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg px-4 py-2 text-slate-100 focus:outline-none focus:border-emerald-500/50 transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Project Link
                  </label>
                  <input
                    type="url"
                    value={editData.link || ""}
                    onChange={(e) => setEditData({ ...editData, link: e.target.value })}
                    className="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg px-4 py-2 text-slate-100 focus:outline-none focus:border-emerald-500/50 transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Year
                  </label>
                  <input
                    type="number"
                    value={editData.year || new Date().getFullYear()}
                    onChange={(e) => setEditData({ ...editData, year: parseInt(e.target.value) })}
                    className="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg px-4 py-2 text-slate-100 focus:outline-none focus:border-emerald-500/50 transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={editData.display_order || 0}
                    onChange={(e) => setEditData({ ...editData, display_order: parseInt(e.target.value) })}
                    className="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg px-4 py-2 text-slate-100 focus:outline-none focus:border-emerald-500/50 transition"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="featured"
                  checked={editData.featured || false}
                  onChange={(e) => setEditData({ ...editData, featured: e.target.checked })}
                  className="w-4 h-4 rounded border-slate-700/50 bg-slate-900/50 text-emerald-500 cursor-pointer"
                />
                <label htmlFor="featured" className="text-sm font-medium text-slate-300 cursor-pointer">
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
