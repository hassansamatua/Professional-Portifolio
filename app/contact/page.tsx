"use client";

import Link from "next/link";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#02050b] via-[#050c1d] to-[#071426] text-slate-100">
      <div className="mx-auto max-w-5xl px-6 py-16 space-y-10">
        <header className="space-y-4">
          <p className="inline-flex items-center gap-2 rounded-full border border-emerald-700/40 bg-emerald-900/20 px-4 py-1 text-xs font-semibold text-emerald-300">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            Let&apos;s work together
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-white">
            Contact
          </h1>
          <p className="text-lg text-slate-300 max-w-2xl">
            Have a project in mind, or just want to say hi? Reach out and
            I&apos;ll get back to you as soon as I can.
          </p>
        </header>

        <section className="grid gap-8 md:grid-cols-2">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-white">Email</h2>
            <a
              href="mailto:hanscodev@gmail.com"
              className="inline-flex items-center gap-2 px-4 py-3 rounded-lg bg-emerald-600 text-white font-semibold hover:bg-emerald-500 transition"
            >
              hanscodev@gmail.com
            </a>
            <p className="text-sm text-slate-400">
              Include a short description of your idea, timeline, and budget if
              you have one.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-white">What to include</h2>
            <ul className="space-y-2 text-sm text-slate-300">
              <li>– A brief summary of your project or problem.</li>
              <li>– Any links or references you already have.</li>
              <li>– Your preferred timeframe.</li>
            </ul>
          </div>
        </section>

        <footer className="pt-6 border-t border-slate-700/40 flex flex-wrap items-center justify-between gap-4 text-sm text-slate-300">
          <span>I typically respond within 1–2 business days.</span>
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

