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
  const [error, setError] = useState<string | null>(null);

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

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this item?")) return;

    try {
      await deletePortfolioItem(id);
      setItems(items.filter((item) => item.id !== id));
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
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update item");
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
                    {item.featured ? "Featured" : "Not Featured"}
                  </button>
                </td>
                <td className="px-6 py-4 space-x-2">
                  <button
                    onClick={() => setEditingId(item.id)}
                    className="text-emerald-300 hover:text-emerald-200 transition text-sm font-medium"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="text-red-400 hover:text-red-300 transition text-sm font-medium"
                  >
                    Delete
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
    </div>
  );
}
