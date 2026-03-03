"use client";

import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#02050b] via-[#050c1d] to-[#071426] text-slate-100">
      <div className="mx-auto max-w-5xl px-6 py-16 space-y-10">
        <header className="space-y-4">
          <p className="inline-flex items-center gap-2 rounded-full border border-emerald-700/40 bg-emerald-900/20 px-4 py-1 text-xs font-semibold text-emerald-300">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            About Hansco Dev
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-white">
            Building thoughtful digital experiences.
          </h1>
          <p className="text-lg text-slate-300 max-w-2xl">
            I&apos;m a developer, designer, and computer science teacher focused on
            creating clean, performant interfaces and reliable backends. I love
            turning complex ideas into simple, beautiful products.
          </p>
        </header>

        <section className="grid gap-8 md:grid-cols-2">
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-white">What I do</h2>
            <ul className="space-y-3 text-sm text-slate-200">
              <li>– Full‑stack web applications with modern JavaScript/TypeScript.</li>
              <li>– Design systems and front‑end architectures that scale.</li>
              <li>– Educational content and mentoring in computer science.</li>
            </ul>
          </div>
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-white">How I work</h2>
            <p className="text-sm text-slate-300">
              I value clarity, communication, and craftsmanship. Whether it&apos;s a
              solo project or part of a bigger team, I aim to ship work that is
              maintainable, well‑tested, and pleasant to use.
            </p>
          </div>
        </section>

        <footer className="pt-6 border-t border-slate-700/40 flex flex-wrap items-center justify-between gap-4 text-sm text-slate-300">
          <span>Based on the web, working with clients worldwide.</span>
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

