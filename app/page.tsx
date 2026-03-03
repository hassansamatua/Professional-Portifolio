"use client";

import Link from "next/link";
import { useState } from "react";
import { PortfolioGrid } from "@/components/PortfolioGrid";
import { useAuth } from "@/lib/supabase/auth-provider";

export default function Home() {
  const { user } = useAuth();
  const [activeFilter, setActiveFilter] = useState<"development" | "design" | "teaching" | null>(
    null
  );

  const categories = [
    { id: "development", label: "Development", icon: "🔧", color: "blue" },
    { id: "design", label: "Design", icon: "🎨", color: "purple" },
    { id: "teaching", label: "Teaching", icon: "📚", color: "orange" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#02050b] via-[#050c1d] to-[#071426] text-slate-100">
      {/* Navigation */}
      <nav className="sticky top-0 z-40 border-b border-slate-700/30 bg-[#02050b]/95 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-emerald-200 bg-clip-text text-transparent">
              Hansco Dev
            </h1>
            <p className="text-xs text-slate-400">Developer • Designer • Teacher</p>
          </div>
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <Link
                  href="/admin"
                  className="px-4 py-2 rounded-lg border border-emerald-700/50 bg-emerald-900/20 text-emerald-200 hover:bg-emerald-900/40 transition font-medium text-sm"
                >
                  Admin Panel
                </Link>
                <Link
                  href="/"
                  className="px-4 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-500 transition font-medium text-sm"
                >
                  Home
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="px-4 py-2 rounded-lg border border-emerald-700/50 text-emerald-200 hover:bg-emerald-900/20 transition font-medium text-sm"
                >
                  Admin Login
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      <div className="mx-auto w-full max-w-7xl px-6 py-20">
        {/* Hero Section */}
        <header className="mb-20 space-y-6 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-700/30 bg-emerald-900/20 px-4 py-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <p className="text-sm text-emerald-300">Welcome to my portfolio</p>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold text-white drop-shadow-lg">
            Creative Solutions for the <span className="bg-gradient-to-r from-emerald-400 to-emerald-200 bg-clip-text text-transparent">Modern Web</span>
          </h1>

          <p className="mx-auto max-w-2xl text-lg text-slate-300">
            Showcasing my expertise in full-stack development, modern design, and computer science education. 
            Building amazing digital experiences that inspire and engage.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
            <a
              href="#portfolio"
              className="inline-flex items-center gap-2 px-8 py-3 rounded-lg bg-gradient-to-r from-emerald-600 to-emerald-500 text-white font-semibold hover:from-emerald-500 hover:to-emerald-400 transition-all duration-300 shadow-lg hover:shadow-emerald-500/25"
            >
              View My Work
              <span>↓</span>
            </a>
            {!user && (
              <Link
                href="/auth/login"
                className="inline-flex items-center gap-2 px-8 py-3 rounded-lg border border-emerald-700/50 bg-emerald-900/20 text-emerald-200 font-semibold hover:bg-emerald-900/40 transition-all duration-300"
              >
                Admin Login
                <span>→</span>
              </Link>
            )}
          </div>
        </header>

        {/* Stats */}
        <div className="mb-20 grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { number: "50+", label: "Projects Completed" },
            { number: "100+", label: "Happy Clients" },
            { number: "5+", label: "Years Experience" },
          ].map((stat, i) => (
            <div
              key={i}
              className="group relative isolate flex flex-col items-center rounded-2xl border border-emerald-700/30 bg-gradient-to-br from-emerald-900/20 to-emerald-800/10 p-8 transition hover:border-emerald-600/50 hover:-translate-y-1"
            >
              <p className="text-4xl font-bold text-emerald-300 group-hover:text-emerald-200">
                {stat.number}
              </p>
              <p className="mt-2 text-slate-300">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Portfolio Section */}
        <section id="portfolio" className="space-y-12">
          <div className="space-y-4">
            <h2 className="text-4xl font-bold text-white">Featured Work</h2>
            <p className="text-lg text-slate-300">
              A curated selection of my best projects across design, development, and education
            </p>
          </div>

          {/* Filter Buttons */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setActiveFilter(null)}
              className={`px-6 py-2 rounded-full font-semibold transition-all duration-300 ${
                activeFilter === null
                  ? "bg-gradient-to-r from-emerald-600 to-emerald-500 text-white shadow-lg shadow-emerald-500/25"
                  : "border border-slate-700/50 bg-slate-800/30 text-slate-300 hover:bg-slate-800/50"
              }`}
            >
              All Projects
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveFilter(cat.id as any)}
                className={`px-6 py-2 rounded-full font-semibold transition-all duration-300 flex items-center gap-2 ${
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

          {/* Portfolio Grid */}
          <PortfolioGrid filter={activeFilter} />
        </section>

        {/* CTA Section */}
        <section className="mt-20 rounded-2xl border border-emerald-700/30 bg-gradient-to-r from-emerald-900/20 to-emerald-800/10 p-12 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Collaborate?</h2>
          <p className="text-lg text-slate-300 mb-8">
            Let's work together to bring your ideas to life
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="mailto:hanscodev@gmail.com"
              className="inline-flex items-center gap-2 px-8 py-3 rounded-lg bg-emerald-600 text-white font-semibold hover:bg-emerald-500 transition-all"
            >
              Get in Touch
              <span>→</span>
            </a>
            {!user && (
              <Link
                href="/auth/login"
                className="inline-flex items-center gap-2 px-8 py-3 rounded-lg border border-emerald-700/50 text-emerald-200 font-semibold hover:bg-emerald-900/20 transition-all"
              >
                Admin Access
              </Link>
            )}
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-20 border-t border-slate-700/30 pt-12 text-center text-slate-400">
          <p>© 2026 Hansco Dev. All rights reserved.</p>
          <p className="text-sm mt-2">Developer • Graphic Designer • Computer Science Teacher</p>
        </footer>
      </div>
    </div>
  );
}
