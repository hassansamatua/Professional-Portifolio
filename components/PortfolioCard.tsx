"use client";

import { PortfolioItem } from "@/lib/supabase/portfolio";
import Link from "next/link";

interface PortfolioCardProps {
  item: PortfolioItem;
}

const categoryColors = {
  development: {
    bg: "from-blue-900/20 to-blue-800/10",
    border: "border-blue-700/30",
    badge: "bg-blue-900/50 text-blue-200",
    icon: "🔧",
  },
  design: {
    bg: "from-purple-900/20 to-purple-800/10",
    border: "border-purple-700/30",
    badge: "bg-purple-900/50 text-purple-200",
    icon: "🎨",
  },
  teaching: {
    bg: "from-orange-900/20 to-orange-800/10",
    border: "border-orange-700/30",
    badge: "bg-orange-900/50 text-orange-200",
    icon: "📚",
  },
};

export function PortfolioCard({ item }: PortfolioCardProps) {
  const colors = categoryColors[item.category];

  return (
    <div
      className={`group relative isolate flex flex-col overflow-hidden rounded-2xl transition-all duration-300 hover:-translate-y-2 border ${colors.border} bg-gradient-to-br ${colors.bg} shadow-lg hover:shadow-2xl hover:shadow-emerald-500/10`}
    >
      {/* Image Container */}
      {item.image_url && (
        <div className="relative h-48 w-full overflow-hidden bg-slate-900/50">
          <img
            src={item.image_url}
            alt={item.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
        </div>
      )}

      {/* Content */}
      <div className="flex flex-1 flex-col gap-4 p-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">{colors.icon}</span>
              <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${colors.badge}`}>
                {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
              </span>
            </div>
            <h3 className="text-xl font-bold text-white group-hover:text-emerald-200 transition">
              {item.title}
            </h3>
            {item.year && <p className="text-sm text-slate-400 mt-1">{item.year}</p>}
          </div>
          {item.featured && (
            <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-emerald-900/40 border border-emerald-700/50">
              <span className="text-lg">⭐</span>
            </div>
          )}
        </div>

        {/* Description */}
        <p className="text-sm text-slate-300 line-clamp-3 flex-1">{item.description}</p>

        {/* Technologies */}
        {item.technologies && item.technologies.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {item.technologies.slice(0, 4).map((tech) => (
              <span
                key={tech}
                className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-slate-800/50 text-slate-300 border border-slate-700/50"
              >
                {tech}
              </span>
            ))}
            {item.technologies.length > 4 && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-slate-800/50 text-slate-400 border border-slate-700/50">
                +{item.technologies.length - 4} more
              </span>
            )}
          </div>
        )}

        {/* Link */}
        {item.link && (
          <Link
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-emerald-600/80 hover:bg-emerald-500 text-white font-semibold transition-all duration-300 group-hover:gap-3"
          >
            View Project
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </Link>
        )}
      </div>
    </div>
  );
}
