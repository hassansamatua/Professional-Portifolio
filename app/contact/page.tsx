"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/supabase/auth-provider";

interface ContactForm {
  name: string;
  email: string;
  subject: string;
  message: string;
  attachments: File[];
}

export default function ContactPage() {
  const { user } = useAuth();
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [formData, setFormData] = useState<ContactForm>({
    name: "",
    email: "",
    subject: "",
    message: "",
    attachments: []
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [captchaToken, setCaptchaToken] = useState("");

  useEffect(() => {
    if (typeof window === "undefined") return;
    // Initialize from localStorage only (dark mode is default)
    const stored = window.localStorage.getItem("theme");
    if (stored === "dark" || stored === "light") {
      setTheme(stored);
    }
    // If no stored preference, keep dark mode as default
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem("theme", theme);
  }, [theme]);

  const isDark = theme === "dark";

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setFormData(prev => ({ ...prev, attachments: files }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("idle");
    setErrorMessage("");

    try {
      // Validate form
      if (!formData.name || !formData.email || !formData.subject || !formData.message) {
        throw new Error("Please fill in all required fields");
      }

      // Validate email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        throw new Error("Please enter a valid email address");
      }

      // Create FormData for file upload
      const submitData = new FormData();
      submitData.append("name", formData.name);
      submitData.append("email", formData.email);
      submitData.append("subject", formData.subject);
      submitData.append("message", formData.message);
      submitData.append("captchaToken", captchaToken);

      formData.attachments.forEach((file, index) => {
        submitData.append(`attachment_${index}`, file);
      });

      const response = await fetch("/api/contact", {
        method: "POST",
        body: submitData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to submit message");
      }

      setSubmitStatus("success");
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
        attachments: []
      });
      setCaptchaToken("");
    } catch (error) {
      setSubmitStatus("error");
      setErrorMessage(error instanceof Error ? error.message : "An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className={
        isDark
          ? "min-h-screen bg-gradient-to-br from-[#02050b] via-[#050c1d] to-[#071426] text-slate-100"
          : "min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200 text-slate-900"
      }
    >
      <nav
        className={
          isDark
            ? "sticky top-0 z-40 border-b border-slate-700/30 bg-[#02050b]/95 backdrop-blur-md"
            : "sticky top-0 z-40 border-b border-slate-200/60 bg-white/90 backdrop-blur-md"
        }
      >
        <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-500 to-emerald-300 bg-clip-text text-transparent">
              Hansco Dev
            </h1>
            <p className={isDark ? "text-xs text-slate-400" : "text-xs text-slate-600"}>
              Developer • Designer • Teacher
            </p>
          </div>
          <div
            className={
              isDark
                ? "hidden md:flex items-center gap-6 text-sm text-slate-300"
                : "hidden md:flex items-center gap-6 text-sm text-slate-700"
            }
          >
            <Link href="/about" className="hover:text-emerald-300 transition">
              About
            </Link>
            <Link href="/projects" className="hover:text-emerald-300 transition">
              Projects
            </Link>
            <Link href="/testimonies" className="hover:text-emerald-300 transition">
              Testimonials
            </Link>
            <Link href="/contact" className="hover:text-emerald-300 transition">
              Contact
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setTheme(isDark ? "light" : "dark")}
              className={
                isDark
                  ? "px-3 py-1 text-xs rounded-full border border-slate-700/60 text-slate-200 hover:bg-slate-800/70 transition"
                  : "px-3 py-1 text-xs rounded-full border border-slate-300 text-slate-700 hover:bg-slate-100 transition"
              }
            >
              {isDark ? "Light mode" : "Dark mode"}
            </button>
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
              <Link
                href="/auth/login"
                className="px-4 py-2 rounded-lg border border-emerald-700/50 text-emerald-200 hover:bg-emerald-900/20 transition font-medium text-sm"
              >
                Admin Login
              </Link>
            )}
          </div>
        </div>
      </nav>

      <div className="mx-auto max-w-5xl px-6 py-16 space-y-10">
        <header className="space-y-4">
          <p className="inline-flex items-center gap-2 rounded-full border border-emerald-700/40 bg-emerald-900/20 px-4 py-1 text-xs font-semibold text-emerald-300">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            Let&apos;s work together
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-white">Contact</h1>
          <p className="text-lg text-slate-300 max-w-2xl">
            Have a project in mind, or just want to say hi? Reach out and I&apos;ll get back
            to you as soon as I can.
          </p>
        </header>

        <section className="grid gap-8 lg:grid-cols-2">
          {/* Contact Form */}
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-white">Send a Message</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-2">
                    Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 rounded-lg bg-slate-800/50 border border-slate-700/50 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                    placeholder="John Doe"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 rounded-lg bg-slate-800/50 border border-slate-700/50 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-slate-300 mb-2">
                  Subject *
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 rounded-lg bg-slate-800/50 border border-slate-700/50 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                  placeholder="Project inquiry"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-slate-300 mb-2">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={5}
                  className="w-full px-4 py-3 rounded-lg bg-slate-800/50 border border-slate-700/50 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition resize-none"
                  placeholder="Tell me about your project..."
                />
              </div>

              <div>
                <label htmlFor="attachments" className="block text-sm font-medium text-slate-300 mb-2">
                  Attachments (optional)
                </label>
                <input
                  type="file"
                  id="attachments"
                  onChange={handleFileChange}
                  multiple
                  accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif"
                  className="w-full px-4 py-3 rounded-lg bg-slate-800/50 border border-slate-700/50 text-slate-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-emerald-600 file:text-white hover:file:bg-emerald-500 transition"
                />
                <p className="mt-1 text-xs text-slate-400">
                  Max 5 files, 10MB each. Supported: PDF, DOC, TXT, Images
                </p>
                {formData.attachments.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {formData.attachments.map((file, index) => (
                      <p key={index} className="text-xs text-slate-300">
                        📎 {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                      </p>
                    ))}
                  </div>
                )}
              </div>

              {/* Captcha Placeholder */}
              <div className="bg-slate-800/30 border border-slate-700/50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-300">
                    🤖 Verify you're human: 7 + 3 = ?
                  </span>
                  <input
                    type="text"
                    value={captchaToken}
                    onChange={(e) => setCaptchaToken(e.target.value)}
                    placeholder="Answer"
                    className="w-20 px-2 py-1 rounded bg-slate-700/50 border border-slate-600/50 text-white text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {submitStatus === "success" && (
                <div className="p-4 rounded-lg bg-emerald-900/30 border border-emerald-700/50 text-emerald-300">
                  ✅ Message sent successfully! I'll get back to you soon.
                </div>
              )}

              {submitStatus === "error" && (
                <div className="p-4 rounded-lg bg-red-900/30 border border-red-700/50 text-red-300">
                  ❌ {errorMessage}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full px-6 py-3 rounded-lg bg-gradient-to-r from-emerald-600 to-emerald-500 text-white font-semibold hover:from-emerald-500 hover:to-emerald-400 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-emerald-500/25"
              >
                {isSubmitting ? "Sending..." : "Send Message"}
              </button>
            </form>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-white">Get in Touch</h2>
              
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-slate-800/30 border border-slate-700/50">
                  <h3 className="text-lg font-medium text-white mb-2">📧 Email</h3>
                  <a
                    href="mailto:hanscodev@gmail.com"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600/20 text-emerald-300 font-semibold hover:bg-emerald-600/30 transition"
                  >
                    hanscodev@gmail.com
                  </a>
                </div>

                <div className="p-4 rounded-lg bg-slate-800/30 border border-slate-700/50">
                  <h3 className="text-lg font-medium text-white mb-2">⏱️ Response Time</h3>
                  <p className="text-slate-300">I typically respond within 1-2 business days.</p>
                </div>

                <div className="p-4 rounded-lg bg-slate-800/30 border border-slate-700/50">
                  <h3 className="text-lg font-medium text-white mb-3">📋 What to Include</h3>
                  <ul className="space-y-2 text-sm text-slate-300">
                    <li>• A brief summary of your project or problem</li>
                    <li>• Any links or references you already have</li>
                    <li>• Your preferred timeframe and budget</li>
                    <li>• Specific skills or technologies needed</li>
                  </ul>
                </div>

                <div className="p-4 rounded-lg bg-slate-800/30 border border-slate-700/50">
                  <h3 className="text-lg font-medium text-white mb-3">🚀 Services</h3>
                  <ul className="space-y-2 text-sm text-slate-300">
                    <li>• Full-stack web development</li>
                    <li>• UI/UX design and prototyping</li>
                    <li>• Technical consulting</li>
                    <li>• Code review and optimization</li>
                  </ul>
                </div>
              </div>
            </div>
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

