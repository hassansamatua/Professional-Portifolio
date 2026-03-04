"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser-client";
import { useTheme, ThemeProvider } from "@/components/ThemeProvider";
import Link from "next/link";

export default function AdminBackupPage() {
  return (
    <ThemeProvider>
      <AdminBackupContent />
    </ThemeProvider>
  );
}

function AdminBackupContent() {
  const { isDark, setTheme } = useTheme();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [backupHistory, setBackupHistory] = useState<Array<{
    id: number;
    date: string;
    size: string;
    type: string;
    key?: string;
  }>>([
    { id: 1, date: "2024-03-04 10:30", size: "2.3 MB", type: "Full Backup" },
    { id: 2, date: "2024-03-03 15:45", size: "2.1 MB", type: "Full Backup" },
    { id: 3, date: "2024-03-02 09:20", size: "1.9 MB", type: "Partial Backup" }
  ]);
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

  const handleBackup = async (type: string) => {
    setLoading(true);
    setMessage("");

    try {
      // Get actual data from Supabase
      const [portfolioResponse, testimonialsResponse, messagesResponse] = await Promise.all([
        supabase.from('portfolio_items').select('*'),
        supabase.from('testimonials').select('*'),
        supabase.from('contact_messages').select('*')
      ]);

      if (portfolioResponse.error || testimonialsResponse.error || messagesResponse.error) {
        throw new Error('Failed to fetch data for backup');
      }

      // Create backup data
      const backupData = {
        timestamp: new Date().toISOString(),
        type: type,
        data: {
          portfolio_items: portfolioResponse.data || [],
          testimonials: testimonialsResponse.data || [],
          contact_messages: messagesResponse.data || []
        }
      };

      // Calculate backup size
      const dataSize = JSON.stringify(backupData).length;
      const sizeInMB = (dataSize / (1024 * 1024)).toFixed(2);

      // Store backup in localStorage (in production, this would be saved to a file or cloud storage)
      const backupKey = `backup_${Date.now()}`;
      localStorage.setItem(backupKey, JSON.stringify(backupData));

      // Update backup history
      const newBackup = {
        id: backupHistory.length + 1,
        date: new Date().toLocaleString(),
        size: `${sizeInMB} MB`,
        type: type,
        key: backupKey
      };
      
      setBackupHistory([newBackup, ...backupHistory]);
      setMessage(`${type} completed successfully! Backed up ${portfolioResponse.data?.length || 0} portfolio items, ${testimonialsResponse.data?.length || 0} testimonials, and ${messagesResponse.data?.length || 0} messages.`);
      
    } catch (error) {
      console.error('Backup error:', error);
      setMessage(`Backup failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleRestore = async (backupId: number) => {
    setLoading(true);
    setMessage("");

    try {
      const backup = backupHistory.find(b => b.id === backupId);
      if (!backup || !backup.key) {
        throw new Error('Backup not found');
      }

      // Get backup data from localStorage
      const backupDataStr = localStorage.getItem(backup.key);
      if (!backupDataStr) {
        throw new Error('Backup data not found');
      }

      const backupData = JSON.parse(backupDataStr);
      
      // Restore data to Supabase
      const { portfolio_items, testimonials, contact_messages } = backupData.data;

      // Clear existing data (optional - you might want to merge instead)
      await Promise.all([
        supabase.from('portfolio_items').delete().neq('id', 0),
        supabase.from('testimonials').delete().neq('id', 0),
        supabase.from('contact_messages').delete().neq('id', 0)
      ]);

      // Restore portfolio items
      if (portfolio_items && portfolio_items.length > 0) {
        const { error: portfolioError } = await supabase.from('portfolio_items').insert(portfolio_items);
        if (portfolioError) throw portfolioError;
      }

      // Restore testimonials
      if (testimonials && testimonials.length > 0) {
        const { error: testimonialError } = await supabase.from('testimonials').insert(testimonials);
        if (testimonialError) throw testimonialError;
      }

      // Restore contact messages
      if (contact_messages && contact_messages.length > 0) {
        const { error: messageError } = await supabase.from('contact_messages').insert(contact_messages);
        if (messageError) throw messageError;
      }

      setMessage(`Restore completed successfully! Restored ${portfolio_items?.length || 0} portfolio items, ${testimonials?.length || 0} testimonials, and ${contact_messages?.length || 0} messages.`);
      
    } catch (error) {
      console.error('Restore error:', error);
      setMessage(`Restore failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (backupId: number) => {
    setLoading(true);
    setMessage("");

    try {
      const backup = backupHistory.find(b => b.id === backupId);
      
      // Remove backup data from localStorage if it exists
      if (backup && backup.key) {
        localStorage.removeItem(backup.key);
      }
      
      // Remove from history
      setBackupHistory(backupHistory.filter(backup => backup.id !== backupId));
      setMessage("Backup deleted successfully!");
      
    } catch (error) {
      console.error('Delete error:', error);
      setMessage(`Delete failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (backupId: number) => {
    try {
      const backup = backupHistory.find(b => b.id === backupId);
      if (!backup || !backup.key) {
        setMessage("Backup not found for download");
        return;
      }

      // Get backup data from localStorage
      const backupDataStr = localStorage.getItem(backup.key);
      if (!backupDataStr) {
        setMessage("Backup data not found for download");
        return;
      }

      // Create download
      const blob = new Blob([backupDataStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `backup_${backup.type.replace(/\s+/g, '_').toLowerCase()}_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setMessage("Backup downloaded successfully!");
      
    } catch (error) {
      console.error('Download error:', error);
      setMessage(`Download failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
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
                💾 Data Backup
              </h1>
              <p className={isDark ? "text-slate-400" : "text-gray-600"}>
                Manage your website backups
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

        {/* Message */}
        {message && (
          <div className={`mb-6 p-4 rounded-lg ${
            message.includes("success") 
              ? "bg-emerald-50 border-emerald-200 text-emerald-700" 
              : "bg-red-50 border-red-200 text-red-700"
          }`}>
            {message}
          </div>
        )}

        {/* Backup Actions */}
        <div className={isDark ? "bg-slate-800/90 border border-slate-700/50 rounded-2xl p-8 shadow-2xl backdrop-blur-sm" : "bg-white border border-gray-200 rounded-2xl p-8 shadow-2xl"}>
          <h2 className={isDark ? "text-xl font-semibold text-white mb-6" : "text-xl font-semibold text-gray-900 mb-2"}>
            🛡️ Backup Actions
          </h2>
          <p className={isDark ? "text-slate-400 mb-6" : "text-gray-600 mb-6"}>
            Create backups of your website data including portfolio items, testimonials, and contact messages.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => handleBackup("Full Backup")}
              disabled={loading}
              className="px-6 py-4 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 disabled:from-gray-400 disabled:to-gray-500 text-white font-medium rounded-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating Backup...
                </span>
              ) : (
                "📦 Create Full Backup"
              )}
            </button>
            
            <button
              onClick={() => handleBackup("Partial Backup")}
              disabled={loading}
              className="px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 disabled:from-gray-400 disabled:to-gray-500 text-white font-medium rounded-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating Backup...
                </span>
              ) : (
                "📄 Create Partial Backup"
              )}
            </button>
          </div>
        </div>

        {/* Backup History */}
        <div className={isDark ? "bg-slate-800/90 border border-slate-700/50 rounded-2xl p-8 shadow-2xl backdrop-blur-sm" : "bg-white border border-gray-200 rounded-2xl p-8 shadow-2xl"}>
          <h2 className={isDark ? "text-xl font-semibold text-white mb-6" : "text-xl font-semibold text-gray-900 mb-2"}>
            📚 Backup History
          </h2>
          <p className={isDark ? "text-slate-400 mb-6" : "text-gray-600 mb-6"}>
            View and manage your previous backups
          </p>
          
          <div className="space-y-4">
            {backupHistory.map((backup) => (
              <div key={backup.id} className={isDark ? "bg-slate-700/30 border border-slate-600 rounded-lg p-4" : "bg-gray-50 border border-gray-200 rounded-lg p-4"}>
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-4">
                      <div>
                        <h3 className={isDark ? "font-medium text-white" : "font-medium text-gray-900"}>
                          {backup.type}
                        </h3>
                        <p className={isDark ? "text-sm text-slate-400" : "text-sm text-gray-600"}>
                          {backup.date} • {backup.size}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleDownload(backup.id)}
                      className={isDark ? "px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm" : "px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"}
                    >
                      📥 Download
                    </button>
                    <button
                      onClick={() => handleRestore(backup.id)}
                      disabled={loading}
                      className={isDark ? "px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-600 text-sm" : "px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-600 text-sm"}
                    >
                      🔄 Restore
                    </button>
                    <button
                      onClick={() => handleDelete(backup.id)}
                      disabled={loading}
                      className={isDark ? "px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-600 text-sm" : "px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-600 text-sm"}
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Backup Settings */}
        <div className={isDark ? "bg-slate-800/90 border border-slate-700/50 rounded-2xl p-8 shadow-2xl backdrop-blur-sm" : "bg-white border border-gray-200 rounded-2xl p-8 shadow-2xl"}>
          <h2 className={isDark ? "text-xl font-semibold text-white mb-6" : "text-xl font-semibold text-gray-900 mb-2"}>
            ⚙️ Backup Settings
          </h2>
          <p className={isDark ? "text-slate-400 mb-6" : "text-gray-600 mb-6"}>
            Configure automatic backup schedules and retention policies
          </p>
          
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className={isDark ? "font-medium text-white" : "font-medium text-gray-900"}>
                  Automatic Backups
                </h3>
                <p className={isDark ? "text-sm text-slate-400" : "text-sm text-gray-600"}>
                  Create backups automatically every week
                </p>
              </div>
              <button className={isDark ? "px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700" : "px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"}>
                Enable
              </button>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h3 className={isDark ? "font-medium text-white" : "font-medium text-gray-900"}>
                  Retention Period
                </h3>
                <p className={isDark ? "text-sm text-slate-400" : "text-sm text-gray-600"}>
                  Keep backups for 30 days
                </p>
              </div>
              <select className={isDark ? "px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white" : "px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900"}>
                <option>7 days</option>
                <option>30 days</option>
                <option>90 days</option>
                <option>1 year</option>
              </select>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h3 className={isDark ? "font-medium text-white" : "font-medium text-gray-900"}>
                  Backup Location
                </h3>
                <p className={isDark ? "text-sm text-slate-400" : "text-sm text-gray-600"}>
                  Store backups in cloud storage
                </p>
              </div>
              <button className={isDark ? "px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700" : "px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"}>
                Configure
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
