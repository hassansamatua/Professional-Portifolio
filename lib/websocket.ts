export interface NotificationData {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'new_contact' | 'message_updated' | 'system';
  title: string;
  message: string;
  timestamp: Date;
  read?: boolean;
}

export function createNotification(data: Omit<NotificationData, 'id' | 'timestamp'>): NotificationData {
  return {
    ...data,
    id: Math.random().toString(36).substr(2, 9),
    timestamp: new Date(),
    read: false,
  };
}

export function formatNotificationTime(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  
  if (diff < 60000) {
    return 'Just now';
  } else if (diff < 3600000) {
    return `${Math.floor(diff / 60000)}m ago`;
  } else if (diff < 86400000) {
    return `${Math.floor(diff / 3600000)}h ago`;
  } else {
    return date.toLocaleDateString();
  }
}
