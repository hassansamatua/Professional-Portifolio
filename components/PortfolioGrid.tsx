"use client";

import { useEffect, useState } from "react";
import { getPortfolioItems, PortfolioItem } from "@/lib/supabase/portfolio";
import { PortfolioCard } from "./PortfolioCard";

interface PortfolioGridProps {
  filter?: "development" | "design" | "teaching" | null;
  featured?: boolean;
}

export function PortfolioGrid({ filter, featured }: PortfolioGridProps) {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadItems();
  }, [filter, featured]);

  const loadItems = async () => {
    try {
      setLoading(true);
      setError(null);
      let data = await getPortfolioItems();

      if (filter) {
        data = data.filter((item) => item.category === filter);
      }

      if (featured) {
        data = data.filter((item) => item.featured);
      }

      setItems(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      console.error("Portfolio loading error:", errorMessage);
      setError(errorMessage || "Failed to load portfolio items");
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="mb-4 inline-flex h-12 w-12 animate-spin rounded-full border-4 border-slate-700 border-t-emerald-500"></div>
          <p className="text-slate-400">Loading portfolio...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg bg-red-950/50 border border-red-700/50 p-6 text-center text-red-200">
        {error}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="rounded-lg bg-slate-800/30 border border-slate-700/50 p-12 text-center text-slate-400">
        No portfolio items found. Check back soon!
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-max">
      {items.map((item) => (
        <PortfolioCard key={item.id} item={item} />
      ))}
    </div>
  );
}
