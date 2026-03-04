"use client";

import { useEffect, useState } from "react";

interface ContactStats {
  pending: number;
  replied: number;
  total: number;
}

export function ContactStats() {
  const [stats, setStats] = useState<ContactStats>({
    pending: 0,
    replied: 0,
    total: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
    
    // Set up polling for real-time updates
    const interval = setInterval(fetchStats, 5000); // Update every 5 seconds
    
    return () => clearInterval(interval);
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/contact-stats');
      const data = await response.json();
      
      if (data.error) {
        console.error('Error fetching stats:', data.error);
        return;
      }

      setStats({
        pending: data.pending || 0,
        replied: data.replied || 0,
        total: data.total || 0
      });
    } catch (error) {
      console.error('Error fetching contact stats:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-blue-900/20 to-blue-800/10 border border-blue-700/30 rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-blue-100">Contact Messages</h3>
        <a
          href="/admin/contact"
          className="px-4 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-500 transition text-sm"
        >
          Manage Messages
        </a>
      </div>
      <div className="grid grid-cols-3 gap-4 text-center">
        <div>
          <p className="text-2xl font-bold text-blue-300">
            {loading ? '...' : stats.pending}
          </p>
          <p className="text-xs text-slate-400">Pending</p>
        </div>
        <div>
          <p className="text-2xl font-bold text-emerald-300">
            {loading ? '...' : stats.replied}
          </p>
          <p className="text-xs text-slate-400">Replied</p>
        </div>
        <div>
          <p className="text-2xl font-bold text-slate-300">
            {loading ? '...' : stats.total}
          </p>
          <p className="text-xs text-slate-400">Total</p>
        </div>
      </div>
    </div>
  );
}
