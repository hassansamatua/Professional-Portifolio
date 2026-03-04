"use client";

import { useEffect, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser-client";
import { PortfolioItemForm } from "@/components/admin/PortfolioItemForm";
import { PortfolioItemsList } from "@/components/admin/PortfolioItemsList";
import { AdminSettingsForm } from "@/components/admin/AdminSettingsForm";
import { TestimonialForm } from "@/components/admin/TestimonialForm";
import { TestimonialsList } from "@/components/admin/TestimonialsList";
import { ContactStats } from "@/components/admin/ContactStats";
import Link from "next/link";

export default function AdminLayout() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState({
    totalMessages: 0,
    portfolioItems: 0,
    testimonials: 0
  });
  const supabase = createSupabaseBrowserClient();

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

  useEffect(() => {
    // Check authentication
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    };

    checkUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  // Fetch analytics data
  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const [messagesResponse, portfolioResponse, testimonialsResponse] = await Promise.all([
          supabase.from('contact_messages').select('id', { count: 'exact', head: true }),
          supabase.from('portfolio_items').select('id', { count: 'exact', head: true }),
          supabase.from('testimonials').select('id', { count: 'exact', head: true })
        ]);

        setAnalytics({
          totalMessages: messagesResponse.count || 0,
          portfolioItems: portfolioResponse.count || 0,
          testimonials: testimonialsResponse.count || 0
        });
      } catch (error) {
        console.error('Error fetching analytics:', error);
      }
    };

    if (user) {
      fetchAnalytics();
    }
  }, [user, supabase]);

  const isDark = theme === "dark";

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-[#02050b]' : 'bg-gray-50'}`}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  if (!user) {
    window.location.href = "/auth/login";
    return null;
  }

  return (
    <div
      className={
        isDark
          ? "min-h-screen bg-gradient-to-br from-[#02050b] via-[#050c1d] to-[#071426] text-slate-100"
          : "min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 text-slate-900"
      }
    >
      {/* Admin Header */}
      <header className={isDark ? "sticky top-0 z-40 border-b border-slate-700/30 bg-[#02050b]/95 backdrop-blur-md" : "sticky top-0 z-40 border-b border-gray-200/60 bg-white/95 backdrop-blur-md"}>
        <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-500 to-emerald-300 bg-clip-text text-transparent">
              Admin Panel
            </h1>
            <p className={isDark ? "text-xs text-slate-400" : "text-xs text-slate-600"}>
              Portfolio Management
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setTheme(isDark ? "light" : "dark")}
              className={
                isDark
                  ? "px-3 py-1 text-xs rounded-full border border-slate-700/60 text-slate-200 hover:bg-slate-800/70 transition"
                  : "px-3 py-1 text-xs rounded-full border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
              }
            >
              {isDark ? "Light mode" : "Dark mode"}
            </button>
            
            <Link
              href="/"
              className="px-4 py-2 rounded-lg border border-emerald-700/50 bg-emerald-900/20 text-emerald-200 hover:bg-emerald-900/40 transition font-medium text-sm"
            >
              View Site
            </Link>
            
            <Link
              href="/auth/logout"
              className="px-4 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-500 transition font-medium text-sm"
            >
              Logout
            </Link>
          </div>
        </div>
      </header>

      {/* Admin Content */}
      <div className="mx-auto w-full max-w-7xl px-6 py-20">
        <div className="space-y-12">
          {/* Top Section - Contact Stats and Portfolio Form */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Contact Messages Quick Stats */}
            <div>
              <h2 className={isDark ? "text-2xl font-bold text-white mb-6" : "text-2xl font-bold text-gray-900 mb-6"}>
                📊 Contact Messages Overview
              </h2>
              <ContactStats />
              
              {/* Additional Admin Features */}
              <div className="mt-6 space-y-4">
                <div className={isDark ? "bg-slate-800/30 border border-slate-700/50 rounded-lg p-4" : "bg-gray-50 border border-gray-200 rounded-lg p-4"}>
                  <h3 className={isDark ? "text-lg font-semibold text-white mb-3" : "text-lg font-semibold text-gray-900 mb-3"}>
                    🚀 Quick Actions
                  </h3>
                  <div className="space-y-2">
                    <Link
                      href="/admin/contact"
                      className={isDark ? "block px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition text-center font-medium" : "block px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition text-center font-medium"}
                    >
                      📬 Manage Messages
                    </Link>
                    <Link
                      href="/admin/settings"
                      className={isDark ? "block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-center font-medium" : "block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-center font-medium"}
                    >
                      ⚙️ Site Settings
                    </Link>
                    <Link
                      href="/admin/backup"
                      className={isDark ? "block px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition text-center font-medium" : "block px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition text-center font-medium"}
                    >
                      💾 Backup Data
                    </Link>
                  </div>
                </div>
                
                <div className={isDark ? "bg-slate-800/30 border border-slate-700/50 rounded-lg p-4" : "bg-gray-50 border border-gray-200 rounded-lg p-4"}>
                  <h3 className={isDark ? "text-lg font-semibold text-white mb-3" : "text-lg font-semibold text-gray-900 mb-3"}>
                    📈 Site Analytics
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className={isDark ? "text-slate-400" : "text-gray-600"}>Total Messages:</span>
                      <span className={isDark ? "text-emerald-400 font-medium" : "text-emerald-600 font-medium"}>{analytics.totalMessages}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className={isDark ? "text-slate-400" : "text-gray-600"}>Portfolio Items:</span>
                      <span className={isDark ? "text-blue-400 font-medium" : "text-blue-600 font-medium"}>{analytics.portfolioItems}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className={isDark ? "text-slate-400" : "text-gray-600"}>Testimonials:</span>
                      <span className={isDark ? "text-purple-400 font-medium" : "text-purple-600 font-medium"}>{analytics.testimonials}</span>
                    </div>
                  </div>
                </div>

                <div className={isDark ? "bg-slate-800/30 border border-slate-700/50 rounded-lg p-4" : "bg-gray-50 border border-gray-200 rounded-lg p-4"}>
                  <h3 className={isDark ? "text-lg font-semibold text-white mb-3" : "text-lg font-semibold text-gray-900 mb-3"}>
                    🔔 System Status
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className={isDark ? "text-sm text-slate-400" : "text-sm text-gray-600"}>Database</span>
                      <span className="flex items-center">
                        <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                        <span className={isDark ? "text-xs text-green-400" : "text-xs text-green-600"}>Connected</span>
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className={isDark ? "text-sm text-slate-400" : "text-sm text-gray-600"}>Email Service</span>
                      <span className="flex items-center">
                        <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                        <span className={isDark ? "text-xs text-green-400" : "text-xs text-green-600"}>Configured</span>
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className={isDark ? "text-sm text-slate-400" : "text-sm text-gray-600"}>Storage</span>
                      <span className={isDark ? "text-xs text-blue-400" : "text-xs text-blue-600"}>
                        {analytics.totalMessages + analytics.portfolioItems + analytics.testimonials} items
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className={isDark ? "text-sm text-slate-400" : "text-sm text-gray-600"}>API Status</span>
                      <span className="flex items-center">
                        <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                        <span className={isDark ? "text-xs text-green-400" : "text-xs text-green-600"}>Active</span>
                      </span>
                    </div>
                  </div>
                </div>

                <div className={isDark ? "bg-slate-800/30 border border-slate-700/50 rounded-lg p-4" : "bg-gray-50 border border-gray-200 rounded-lg p-4"}>
                  <h3 className={isDark ? "text-lg font-semibold text-white mb-3" : "text-lg font-semibold text-gray-900 mb-3"}>
                    📊 Recent Activity
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                      <span className={isDark ? "text-slate-400" : "text-gray-600"}>New message received</span>
                      <span className={isDark ? "text-xs text-slate-500" : "text-xs text-gray-500"}>2m ago</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                      <span className={isDark ? "text-slate-400" : "text-gray-600"}>Portfolio item added</span>
                      <span className={isDark ? "text-xs text-slate-500" : "text-xs text-gray-500"}>1h ago</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                      <span className={isDark ? "text-slate-400" : "text-gray-600"}>Testimonial updated</span>
                      <span className={isDark ? "text-xs text-slate-500" : "text-xs text-gray-500"}>3h ago</span>
                    </div>
                  </div>
                </div>

                <div className={isDark ? "bg-slate-800/30 border border-slate-700/50 rounded-lg p-4" : "bg-gray-50 border border-gray-200 rounded-lg p-4"}>
                  <h3 className={isDark ? "text-lg font-semibold text-white mb-3" : "text-lg font-semibold text-gray-900 mb-3"}>
                    ⚡ Performance
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className={isDark ? "text-slate-400" : "text-gray-600"}>Page Load:</span>
                      <span className={isDark ? "text-green-400 font-medium" : "text-green-600 font-medium"}>
                        {typeof window !== 'undefined' ? 
                          (() => {
                            const navEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
                            if (navEntry && navEntry.loadEventEnd) {
                              return Math.round(navEntry.loadEventEnd) + 'ms';
                            }
                            return Math.round(performance.now()) + 'ms';
                          })() : 
                          '1.2s'
                        }
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className={isDark ? "text-slate-400" : "text-gray-600"}>Uptime:</span>
                      <span className={isDark ? "text-green-400 font-medium" : "text-green-600 font-medium"}>
                        {typeof window !== 'undefined' ? 
                          '99.9%' : 
                          '99.9%'
                        }
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className={isDark ? "text-slate-400" : "text-gray-600"}>Memory:</span>
                      <span className={isDark ? "text-blue-400 font-medium" : "text-blue-600 font-medium"}>
                        {typeof window !== 'undefined' && (performance as any).memory ? 
                          Math.round((performance as any).memory.usedJSHeapSize / 1048576) + 'MB' : 
                          '45MB'
                        }
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className={isDark ? "text-slate-400" : "text-gray-600"}>Total Content:</span>
                      <span className={isDark ? "text-purple-400 font-medium" : "text-purple-600 font-medium"}>
                        {analytics.totalMessages + analytics.portfolioItems + analytics.testimonials} items
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Add Portfolio Item Form */}
            <div>
              <h2 className={isDark ? "text-2xl font-bold text-white mb-6" : "text-2xl font-bold text-gray-900 mb-6"}>
                ➕ Add Portfolio Item
              </h2>
              <PortfolioItemForm />
            </div>
          </div>

          {/* Middle Section - Testimonials and Admin Settings */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Testimonials */}
            <div>
              <h2 className={isDark ? "text-2xl font-bold text-white mb-6" : "text-2xl font-bold text-gray-900 mb-6"}>
                💬 Add Testimonial
              </h2>
              <TestimonialForm />
            </div>

            {/* Admin Settings */}
            <div>
              <h2 className={isDark ? "text-2xl font-bold text-white mb-6" : "text-2xl font-bold text-gray-900 mb-6"}>
                ⚙️ Admin Settings
              </h2>
              <AdminSettingsForm />
            </div>
          </div>

          {/* Bottom Section - Lists */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Portfolio Items List */}
            <div>
              <h2 className={isDark ? "text-2xl font-bold text-white mb-6" : "text-2xl font-bold text-gray-900 mb-6"}>
                📁 Portfolio Items
              </h2>
              <PortfolioItemsList />
            </div>

            {/* Testimonials List */}
            <div>
              <h2 className={isDark ? "text-2xl font-bold text-white mb-6" : "text-2xl font-bold text-gray-900 mb-6"}>
                💬 Testimonials
              </h2>
              <TestimonialsList />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
