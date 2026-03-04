"use client";

import { useEffect, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser-client";
import { NotificationBell } from "@/components/admin/NotificationsPanel";
import Link from "next/link";

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  attachments: any[];
  status: 'pending' | 'replied' | 'archived';
  admin_reply?: string;
  admin_reply_sent_at?: string;
  created_at: string;
  updated_at: string;
}

export default function ContactMessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [replyText, setReplyText] = useState("");
  const [isSendingReply, setIsSendingReply] = useState(false);
  const [filter, setFilter] = useState<'all' | 'pending' | 'replied' | 'archived'>('all');
  const [searchTerm, setSearchTerm] = useState("");
  const [theme, setTheme] = useState<"dark" | "light">("dark");

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

  // Set up polling for real-time updates
  useEffect(() => {
    const interval = setInterval(fetchMessages, 10000); // Check every 10 seconds
    
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    fetchMessages();
  }, [filter]);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (filter !== 'all') {
        query = query.eq('status', filter);
      }

      const { data, error } = await query;

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendReply = async () => {
    if (!selectedMessage || !replyText.trim()) return;

    try {
      setIsSendingReply(true);

      // Send email to user via API
      await fetch(`${window.location.origin}/api/send-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'admin_reply',
          to: selectedMessage.email,
          subject: `Re: ${selectedMessage.subject} - Response from Hansco Dev`,
          data: {
            email: selectedMessage.email,
            name: selectedMessage.name,
            subject: selectedMessage.subject,
            reply: replyText
          }
        })
      });

      // Update message in database
      const { error } = await supabase
        .from('contact_messages')
        .update({
          admin_reply: replyText,
          admin_reply_sent_at: new Date().toISOString(),
          status: 'replied'
        })
        .eq('id', selectedMessage.id);

      if (error) throw error;

      // Refresh messages and close modal
      await fetchMessages();
      setSelectedMessage(null);
      setReplyText("");
    } catch (error) {
      console.error('Error sending reply:', error);
      alert('Failed to send reply. Please try again.');
    } finally {
      setIsSendingReply(false);
    }
  };

  const handleUpdateStatus = async (messageId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('contact_messages')
        .update({ status: newStatus })
        .eq('id', messageId);

      if (error) throw error;
      await fetchMessages();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handleDeleteMessage = async (messageId: string) => {
    if (!confirm('Are you sure you want to delete this message?')) return;

    try {
      const { error } = await supabase
        .from('contact_messages')
        .delete()
        .eq('id', messageId);

      if (error) throw error;
      await fetchMessages();
    } catch (error) {
      console.error('Error deleting message:', error);
    }
  };

  const filteredMessages = messages.filter(message => 
    message.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    message.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    message.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    message.message.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-900/30 text-yellow-300 border-yellow-700/50';
      case 'replied': return 'bg-green-900/30 text-green-300 border-green-700/50';
      case 'archived': return 'bg-slate-900/30 text-slate-300 border-slate-700/50';
      default: return 'bg-slate-900/30 text-slate-300 border-slate-700/50';
    }
  };

  const isDark = theme === "dark";

  return (
    <div
      className={
        isDark
          ? "min-h-screen bg-gradient-to-br from-[#02050b] via-[#050c1d] to-[#071426] text-slate-100"
          : "min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 text-slate-900"
      }
    >
      <div className="mx-auto max-w-7xl px-6 py-12">
        {/* Header */}
        <header className={isDark ? "sticky top-0 z-40 border-b border-slate-700/30 bg-[#02050b]/95 backdrop-blur-md" : "sticky top-0 z-40 border-b border-gray-200/60 bg-white/95 backdrop-blur-md"}>
          <div className="flex items-center justify-between gap-6">
            <div>
              <h1 className={isDark ? "text-2xl font-bold text-white mb-2" : "text-2xl font-bold text-gray-900 mb-2"}>Contact Messages</h1>
              <p className={isDark ? "text-slate-400" : "text-gray-600"}>Manage and respond to contact form submissions</p>
            </div>
            <div className="flex items-center gap-4">
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
                href="/admin"
                className={isDark 
                  ? "px-4 py-2 rounded-lg border border-slate-700/50 bg-slate-800/30 text-slate-200 hover:bg-slate-800/50 transition"
                  : "px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 transition"
                }
              >
                ← Back to Admin
              </Link>
              <NotificationBell />
            </div>
          </div>
        </header>

        {/* Filters and Search */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="flex gap-2">
            {(['all', 'pending', 'replied', 'archived'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-lg border font-medium transition ${
                  filter === status
                    ? 'bg-emerald-600 text-white border-emerald-600'
                    : 'bg-slate-800/30 text-slate-300 border-slate-700/50 hover:bg-slate-800/50'
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
                {status !== 'all' && (
                  <span className="ml-2 px-2 py-1 rounded-full bg-slate-700/50 text-xs">
                    {messages.filter(m => m.status === status).length}
                  </span>
                )}
              </button>
            ))}
          </div>
          
          <input
            type="text"
            placeholder="Search messages..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-4 py-2 rounded-lg bg-slate-800/30 border border-slate-700/50 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {/* Messages List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
            <p className="mt-4 text-slate-400">Loading messages...</p>
          </div>
        ) : filteredMessages.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-400">No messages found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredMessages.map((message) => (
              <div
                key={message.id}
                className="bg-slate-800/30 border border-slate-700/50 rounded-lg p-6 hover:bg-slate-800/50 transition cursor-pointer"
                onClick={() => setSelectedMessage(message)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-white">{message.name}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(message.status)}`}>
                        {message.status}
                      </span>
                    </div>
                    <p className="text-slate-400 text-sm">{message.email}</p>
                    <p className="text-white font-medium mt-1">{message.subject}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-slate-400 text-sm">
                      {new Date(message.created_at).toLocaleDateString()}
                    </p>
                    <p className="text-slate-500 text-xs">
                      {new Date(message.created_at).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
                
                <p className="text-slate-300 line-clamp-2 mb-3">
                  {message.message}
                </p>
                
                {message.attachments && message.attachments.length > 0 && (
                  <div className="flex items-center gap-2 text-slate-400 text-sm">
                    <span>📎</span>
                    <span>{message.attachments.length} attachment(s)</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Message Detail Modal */}
        {selectedMessage && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-slate-800 border border-slate-700 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white">Message Details</h2>
                  <button
                    onClick={() => setSelectedMessage(null)}
                    className="text-slate-400 hover:text-white transition"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-slate-400">From</p>
                      <p className="text-white font-medium">{selectedMessage.name}</p>
                      <p className="text-slate-300">{selectedMessage.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-400">Date</p>
                      <p className="text-white">{new Date(selectedMessage.created_at).toLocaleString()}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-slate-400">Subject</p>
                    <p className="text-white font-medium">{selectedMessage.subject}</p>
                  </div>

                  <div>
                    <p className="text-sm text-slate-400">Message</p>
                    <div className="bg-slate-900/50 rounded-lg p-4 text-slate-300 whitespace-pre-wrap">
                      {selectedMessage.message}
                    </div>
                  </div>

                  {selectedMessage.attachments && selectedMessage.attachments.length > 0 && (
                    <div>
                      <p className="text-sm text-slate-400 mb-2">Attachments</p>
                      <div className="space-y-2">
                        {selectedMessage.attachments.map((att, index) => (
                          <div key={index} className="flex items-center gap-2 bg-slate-900/50 rounded-lg p-3">
                            <span>📎</span>
                            <span className="text-slate-300">{att.name}</span>
                            <span className="text-slate-500 text-sm">
                              ({(att.size / 1024 / 1024).toFixed(2)} MB)
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedMessage.admin_reply && (
                    <div>
                      <p className="text-sm text-slate-400">Your Reply</p>
                      <div className="bg-emerald-900/20 border border-emerald-700/50 rounded-lg p-4 text-emerald-300 whitespace-pre-wrap">
                        {selectedMessage.admin_reply}
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        Sent: {selectedMessage.admin_reply_sent_at ? 
                          new Date(selectedMessage.admin_reply_sent_at).toLocaleString() : 
                          'Unknown'
                        }
                      </p>
                    </div>
                  )}
                </div>

                {/* Reply Form */}
                {selectedMessage.status !== 'replied' && (
                  <div className="border-t border-slate-700 pt-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Send Reply</h3>
                    <textarea
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Type your reply here..."
                      rows={5}
                      className="w-full px-4 py-3 rounded-lg bg-slate-900/50 border border-slate-700 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                    />
                    <div className="flex items-center gap-3 mt-4">
                      <button
                        onClick={handleSendReply}
                        disabled={isSendingReply || !replyText.trim()}
                        className="px-6 py-2 rounded-lg bg-emerald-600 text-white font-medium hover:bg-emerald-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSendingReply ? 'Sending...' : 'Send Reply'}
                      </button>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center gap-3 mt-6 pt-6 border-t border-slate-700">
                  <select
                    value={selectedMessage.status}
                    onChange={(e) => handleUpdateStatus(selectedMessage.id, e.target.value)}
                    className="px-4 py-2 rounded-lg bg-slate-900/50 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="pending">Pending</option>
                    <option value="replied">Replied</option>
                    <option value="archived">Archived</option>
                  </select>
                  
                  <button
                    onClick={() => window.open(`mailto:${selectedMessage.email}`)}
                    className="px-4 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-500 transition"
                  >
                    Reply via Email
                  </button>
                  
                  <button
                    onClick={() => handleDeleteMessage(selectedMessage.id)}
                    className="px-4 py-2 rounded-lg bg-red-600 text-white font-medium hover:bg-red-500 transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
