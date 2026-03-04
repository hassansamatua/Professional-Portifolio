"use client";

import { useEffect, useState } from "react";
import { NotificationData, createNotification } from "@/lib/websocket";

interface NotificationsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NotificationsPanel({ isOpen, onClose }: NotificationsPanelProps) {
  const [notifications, setNotifications] = useState<NotificationData[]>([]);

  useEffect(() => {
    // Load notifications from localStorage
    const savedNotifications = localStorage.getItem('admin_notifications');
    if (savedNotifications) {
      try {
        setNotifications(JSON.parse(savedNotifications));
      } catch (error) {
        console.error('Error loading notifications:', error);
      }
    }
  }, []);

  // Set up polling for new notifications
  useEffect(() => {
    const checkNotifications = async () => {
      try {
        // In a real implementation, you'd fetch from an API
        // For now, we'll use localStorage as the source
        const savedNotifications = localStorage.getItem('admin_notifications');
        if (savedNotifications) {
          setNotifications(JSON.parse(savedNotifications));
        }
      } catch (error) {
        console.error('Error loading notifications:', error);
      }
    };

    // Check immediately and then every 10 seconds
    checkNotifications();
    const interval = setInterval(checkNotifications, 10000);
    
    return () => clearInterval(interval);
  }, []);

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
    
    // Update localStorage
    const updatedNotifications = notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    );
    localStorage.setItem('admin_notifications', JSON.stringify(updatedNotifications));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    
    // Update localStorage
    const updatedNotifications = notifications.map(n => ({ ...n, read: true }));
    localStorage.setItem('admin_notifications', JSON.stringify(updatedNotifications));
  };

  const clearAll = () => {
    setNotifications([]);
    localStorage.removeItem('admin_notifications');
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start justify-end pt-20 pr-6">
      <div className="bg-slate-800 border border-slate-700 rounded-lg w-96 max-h-[80vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="p-4 border-b border-slate-700 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">
            Notifications
            {unreadCount > 0 && (
              <span className="ml-2 px-2 py-1 rounded-full bg-emerald-600 text-white text-xs">
                {unreadCount}
              </span>
            )}
          </h3>
          <div className="flex items-center gap-2">
            {notifications.length > 0 && (
              <>
                <button
                  onClick={markAllAsRead}
                  className="text-xs text-slate-400 hover:text-white transition"
                >
                  Mark all read
                </button>
                <button
                  onClick={clearAll}
                  className="text-xs text-red-400 hover:text-red-300 transition"
                >
                  Clear all
                </button>
              </>
            )}
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white transition"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="overflow-y-auto max-h-[60vh]">
          {notifications.length === 0 ? (
            <div className="p-8 text-center text-slate-400">
              <div className="text-4xl mb-2">🔔</div>
              <p>No notifications yet</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-700">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 hover:bg-slate-700/50 transition cursor-pointer ${
                    !notification.read ? 'bg-emerald-900/10 border-l-4 border-emerald-500' : ''
                  }`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0">
                      {notification.type === 'new_contact' && <span className="text-2xl">📬</span>}
                      {notification.type === 'message_updated' && <span className="text-2xl">💬</span>}
                      {notification.type === 'system' && <span className="text-2xl">⚙️</span>}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="text-sm font-medium text-white truncate">
                          {notification.title}
                        </h4>
                        {!notification.read && (
                          <span className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0"></span>
                        )}
                      </div>
                      <p className="text-xs text-slate-300 mb-1">{notification.message}</p>
                      <p className="text-xs text-slate-500">
                        {new Date(notification.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Notification Bell Component
export function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationData[]>([]);

  useEffect(() => {
    // Load notifications from localStorage and check for updates
    const checkNotifications = () => {
      const savedNotifications = localStorage.getItem('admin_notifications');
      if (savedNotifications) {
        try {
          setNotifications(JSON.parse(savedNotifications));
        } catch (error) {
          console.error('Error loading notifications:', error);
        }
      }
    };

    // Check immediately and then every 10 seconds
    checkNotifications();
    const interval = setInterval(checkNotifications, 10000);
    
    return () => clearInterval(interval);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="relative p-2 rounded-lg bg-slate-800/30 border border-slate-700/50 text-slate-300 hover:bg-slate-800/50 transition"
      >
        <span className="text-xl">🔔</span>
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>
      
      <NotificationsPanel isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
