"use client";

import Link from "next/link";
import { useState } from "react";
import { PortfolioGrid } from "@/components/PortfolioGrid";

export default function ProjectsPage() {
  const [activeFilter, setActiveFilter] = useState<"development" | "design" | "teaching" | null>(
    null
  );

  const categories = [
    { id: "development", label: "Development", icon: "🔧" },
    { id: "design", label: "Design", icon: "🎨" },
    { id: "teaching", label: "Teaching", icon: "📚" },
  ] as const;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#02050b] via-[#050c1d] to-[#071426] text-slate-100">
      <div className="mx-auto max-w-7xl px-6 py-16 space-y-10">
        <header className="space-y-4">
          <p className="inline-flex items-center gap-2 rounded-full border border-emerald-700/40 bg-emerald-900/20 px-4 py-1 text-xs font-semibold text-emerald-300">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            Selected Work
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-white">
            Projects
          </h1>
          <p className="text-lg text-slate-300 max-w-2xl">
            A broader view of the projects I&apos;ve built across development,
            design, and teaching.
          </p>
        </header>

        <section className="space-y-8">
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setActiveFilter(null)}
              className={`px-6 py-2 rounded-full font-semibold text-sm transition-all duration-300 ${
                activeFilter === null
                  ? "bg-gradient-to-r from-emerald-600 to-emerald-500 text-white shadow-lg shadow-emerald-500/25"
                  : "border border-slate-700/50 bg-slate-800/30 text-slate-300 hover:bg-slate-800/50"
              }`}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveFilter(cat.id)}
                className={`px-6 py-2 rounded-full font-semibold text-sm transition-all duration-300 flex items-center gap-2 ${
                  activeFilter === cat.id
                    ? "bg-gradient-to-r from-emerald-600 to-emerald-500 text-white shadow-lg shadow-emerald-500/25"
                    : "border border-slate-700/50 bg-slate-800/30 text-slate-300 hover:bg-slate-800/50"
                }`}
              >
                <span>{cat.icon}</span>
                {cat.label}
              </button>
            ))}
          </div>

          <PortfolioGrid filter={activeFilter} />
        </section>

        <footer className="pt-6 border-t border-slate-700/40 flex flex-wrap items-center justify-between gap-4 text-sm text-slate-300">
          <span>More case studies coming soon.</span>
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

