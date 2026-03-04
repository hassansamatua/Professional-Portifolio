"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser-client";
import { useTheme } from "@/components/ThemeProvider";
import Link from "next/link";

export default function AdminSettingsPage() {
  const { isDark, setTheme } = useTheme();
  const [siteName, setSiteName] = useState("Hansco Dev");
  const [siteDescription, setSiteDescription] = useState("Developer • Designer • Teacher");
  const [contactEmail, setContactEmail] = useState("hanscodev@gmail.com");
  const [socialLinks, setSocialLinks] = useState({
    github: "https://github.com/hanscodev",
    linkedin: "https://linkedin.com/in/hanscodev",
    twitter: "https://twitter.com/hanscodev"
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();
  const supabase = createSupabaseBrowserClient();

  useEffect(() => {
    // Check authentication
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/auth/login");
      }
    };

    checkUser();
  }, [router, supabase]);

  const handleSaveSettings = async () => {
    setLoading(true);
    setMessage("");

    try {
      // In a real implementation, you would save these to a settings table
      // For now, we'll just show a success message
      setMessage("Settings saved successfully!");
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
    } catch (error) {
      setMessage("Failed to save settings. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLinkChange = (platform: string, value: string) => {
    setSocialLinks(prev => ({
      ...prev,
      [platform]: value
    }));
  };

  return (
    <div
      className={
        isDark
          ? "min-h-screen bg-gradient-to-br from-[#02050b] via-[#050c1d] to-[#071426] text-slate-100"
          : "min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 text-slate-900"
      }
    >
      <div className="mx-auto max-w-4xl px-6 py-12">
        {/* Header */}
        <header className={isDark ? "sticky top-0 z-40 border-b border-slate-700/30 bg-[#02050b]/95 backdrop-blur-md" : "sticky top-0 z-40 border-b border-gray-200/60 bg-white/95 backdrop-blur-md"}>
          <div className="flex items-center justify-between gap-6">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-500 to-emerald-300 bg-clip-text text-transparent">
                ⚙️ Site Settings
              </h1>
              <p className={isDark ? "text-slate-400" : "text-gray-600"}>
                Configure your website settings
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => setTheme(isDark ? "light" : "dark")}
                className={
                  isDark
                    ? "px-3 py-1 text-xs rounded-full border border-slate-700/60 text-slate-200 hover:bg-slate-800/70 transition"
                    : "px-3 py-1 text-xs rounded-full border-gray-300 text-gray-700 hover:bg-gray-100 transition"
                }
              >
                {isDark ? "Light mode" : "Dark mode"}
              </button>
              
              <Link
                href="/admin"
                className={isDark 
                  ? "px-4 py-2 rounded-lg border border-slate-700/50 bg-slate-800/30 text-slate-200 hover:bg-slate-800/50 transition"
                  : "px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 transition"
                }
              >
                ← Back to Admin
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

        {/* Settings Form */}
        <div className={isDark ? "bg-slate-800/90 border border-slate-700/50 rounded-2xl p-8 shadow-2xl backdrop-blur-sm" : "bg-white border border-gray-200 rounded-2xl p-8 shadow-2xl"}>
          {message && (
            <div className={`mb-6 p-4 rounded-lg ${
              message.includes("success") 
                ? "bg-emerald-50 border-emerald-200 text-emerald-700" 
                : "bg-red-50 border-red-200 text-red-700"
            }`}>
              {message}
            </div>
          )}

          <form onSubmit={handleSaveSettings} className="space-y-6">
            {/* Site Information */}
            <div>
              <h3 className={isDark ? "text-lg font-semibold text-white mb-4" : "text-lg font-semibold text-gray-900 mb-4"}>
                🌐 Site Information
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className={isDark ? "block text-sm font-medium text-slate-300 mb-2" : "block text-sm font-medium text-gray-700 mb-2"}>
                    Site Name
                  </label>
                  <input
                    type="text"
                    value={siteName}
                    onChange={(e) => setSiteName(e.target.value)}
                    className={isDark 
                      ? "w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-400 focus:outline-none transition"
                      : "w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:outline-none transition"
                    }
                    placeholder="Hansco Dev"
                  />
                </div>

                <div>
                  <label className={isDark ? "block text-sm font-medium text-slate-300 mb-2" : "block text-sm font-medium text-gray-700 mb-2"}>
                    Site Description
                  </label>
                  <textarea
                    value={siteDescription}
                    onChange={(e) => setSiteDescription(e.target.value)}
                    rows={3}
                    className={isDark 
                      ? "w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-400 focus:outline-none transition"
                      : "w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:outline-none transition"
                    }
                    placeholder="Developer • Designer • Teacher"
                  />
                </div>

                <div>
                  <label className={isDark ? "block text-sm font-medium text-slate-300 mb-2" : "block text-sm font-medium text-gray-700 mb-2"}>
                    Contact Email
                  </label>
                  <input
                    type="email"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    className={isDark 
                      ? "w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-400 focus:outline-none transition"
                      : "w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:outline-none transition"
                    }
                    placeholder="admin@example.com"
                  />
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div>
              <h3 className={isDark ? "text-lg font-semibold text-white mb-4" : "text-lg font-semibold text-gray-900 mb-4"}>
                🔗 Social Links
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className={isDark ? "block text-sm font-medium text-slate-300 mb-2" : "block text-sm font-medium text-gray-700 mb-2"}>
                    GitHub
                  </label>
                  <input
                    type="url"
                    value={socialLinks.github}
                    onChange={(e) => handleSocialLinkChange("github", e.target.value)}
                    className={isDark 
                      ? "w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-400 focus:outline-none transition"
                      : "w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:outline-none transition"
                    }
                    placeholder="https://github.com/username"
                  />
                </div>

                <div>
                  <label className={isDark ? "block text-sm font-medium text-slate-300 mb-2" : "block text-sm font-medium text-gray-700 mb-2"}>
                    LinkedIn
                  </label>
                  <input
                    type="url"
                    value={socialLinks.linkedin}
                    onChange={(e) => handleSocialLinkChange("linkedin", e.target.value)}
                    className={isDark 
                      ? "w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-400 focus:outline-none transition"
                      : "w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:outline-none transition"
                    }
                    placeholder="https://linkedin.com/in/username"
                  />
                </div>

                <div>
                  <label className={isDark ? "block text-sm font-medium text-slate-300 mb-2" : "block text-sm font-medium text-gray-700 mb-2"}>
                    Twitter
                  </label>
                  <input
                    type="url"
                    value={socialLinks.twitter}
                    onChange={(e) => handleSocialLinkChange("twitter", e.target.value)}
                    className={isDark 
                      ? "w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-400 focus:outline-none transition"
                      : "w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:outline-none transition"
                    }
                    placeholder="https://twitter.com/username"
                  />
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 disabled:from-gray-400 disabled:to-gray-500 text-white font-medium rounded-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </span>
                ) : (
                  "Save Settings"
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Additional Settings */}
        <div className={isDark ? "bg-slate-800/90 border border-slate-700/50 rounded-2xl p-8 shadow-2xl backdrop-blur-sm" : "bg-white border border-gray-200 rounded-2xl p-8 shadow-2xl"}>
          <h3 className={isDark ? "text-lg font-semibold text-white mb-4" : "text-lg font-semibold text-gray-900 mb-4"}>
            🔧 Advanced Settings
          </h3>
          
          <div className="space-y-6">
            <div className={isDark ? "bg-slate-700/30 border border-slate-600 rounded-lg p-4" : "bg-gray-50 border border-gray-200 rounded-lg p-4"}>
              <h4 className={isDark ? "font-medium text-white mb-2" : "font-medium text-gray-900 mb-2"}>
                📧 Email Configuration
              </h4>
              <p className={isDark ? "text-sm text-slate-400 mb-4" : "text-sm text-gray-600 mb-4"}>
                Configure SMTP settings for contact form emails
              </p>
              <div className="flex gap-2">
                <button
                  className={isDark ? "px-3 py-1 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 text-sm" : "px-3 py-1 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 text-sm"}
                >
                  Configure Email
                </button>
                <button
                  className={isDark ? "px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm" : "px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"}
                >
                  Test Email
                </button>
              </div>
            </div>

            <div className={isDark ? "bg-slate-700/30 border border-slate-600 rounded-lg p-4" : "bg-gray-50 border border-gray-200 rounded-lg p-4"}>
              <h4 className={isDark ? "font-medium text-white mb-2" : "font-medium text-gray-900 mb-2"}>
                🗃️ Database
              </h4>
              <p className={isDark ? "text-sm text-slate-400 mb-4" : "text-sm text-gray-600 mb-4"}>
                Manage database connections and migrations
              </p>
              <div className="flex gap-2">
                <button
                  className={isDark ? "px-3 py-1 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm" : "px-3 py-1 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm"}
                >
                  Run Migration
                </button>
                <button
                  className={isDark ? "px-3 py-1 bg-orange-600 text-white rounded-lg hover:bg-orange-700 text-sm" : "px-3 py-1 bg-orange-600 text-white rounded-lg hover:bg-orange-700 text-sm"}
                >
                  View Tables
                </button>
              </div>
            </div>

            <div className={isDark ? "bg-slate-700/30 border border-slate-600 rounded-lg p-4" : "bg-gray-50 border border-gray-200 rounded-lg p-4"}>
              <h4 className={isDark ? "font-medium text-white mb-2" : "font-medium text-gray-900 mb-2"}>
                🚀 Performance
              </h4>
              <p className={isDark ? "text-sm text-slate-400 mb-4" : "text-sm text-gray-600 mb-4"}>
                Optimize site performance and caching
              </p>
              <div className="flex gap-2">
                <button
                  className={isDark ? "px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm" : "px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"}
                >
                  Clear Cache
                </button>
                <button
                  className={isDark ? "px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm" : "px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm"}
                >
                  Rebuild Site
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
