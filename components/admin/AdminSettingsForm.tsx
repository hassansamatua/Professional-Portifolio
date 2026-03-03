"use client";

import { useState, useEffect } from "react";
import { getAdminSettings, updateAdminSettings, AdminSettings } from "@/lib/supabase/portfolio";

export function AdminSettingsForm() {
  const [settings, setSettings] = useState<AdminSettings>({
    portfolio_title: "",
    portfolio_description: "",
    admin_email: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const data = await getAdminSettings();
      setSettings(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load settings");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      await updateAdminSettings(settings);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-center py-8 text-slate-300">Loading settings...</div>;

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-slate-800/30 border border-slate-700/50 rounded-lg p-6">
      <h3 className="text-xl font-semibold text-emerald-100">Portfolio Settings</h3>

      {error && (
        <div className="bg-red-950/50 border border-red-700/50 text-red-200 p-4 rounded-lg">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-emerald-950/50 border border-emerald-700/50 text-emerald-200 p-4 rounded-lg">
          Settings updated successfully!
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">
          Portfolio Title
        </label>
        <input
          type="text"
          value={settings.portfolio_title}
          onChange={(e) => setSettings({ ...settings, portfolio_title: e.target.value })}
          className="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg px-4 py-2 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/30 transition"
          placeholder="Your Portfolio Title"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">
          Portfolio Description
        </label>
        <textarea
          value={settings.portfolio_description}
          onChange={(e) =>
            setSettings({ ...settings, portfolio_description: e.target.value })
          }
          rows={4}
          className="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg px-4 py-2 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/30 transition"
          placeholder="Describe your portfolio..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">
          Admin Email
        </label>
        <input
          type="email"
          value={settings.admin_email}
          onChange={(e) => setSettings({ ...settings, admin_email: e.target.value })}
          className="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg px-4 py-2 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/30 transition"
          placeholder="admin@hansco.dev"
        />
      </div>

      <button
        type="submit"
        disabled={saving}
        className="w-full bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {saving ? "Saving..." : "Save Settings"}
      </button>
    </form>
  );
}
