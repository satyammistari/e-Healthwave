import { NotificationType } from '@/types/notification';

export interface NotificationHistory {
  id: string;
  type: NotificationType;
  patientId: string;
  phoneNumber: string;
  message: string;
  status: 'sent' | 'delivered' | 'failed';
  timestamp: Date;
  language: string;
  metadata?: Record<string, any>;
}

class NotificationHistoryService {
  private history: NotificationHistory[] = [];

  addNotification(notification: Omit<NotificationHistory, 'id'>): string {
    const id = `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const newNotification = { ...notification, id };
    this.history.push(newNotification);
    return id;
  }

  updateStatus(id: string, status: NotificationHistory['status']): void {
    const notification = this.history.find(n => n.id === id);
    if (notification) {
      notification.status = status;
    }
  }

  getHistory(): NotificationHistory[] {
    return this.history;
  }

  getHistoryByPatient(patientId: string): NotificationHistory[] {
    return this.history.filter(n => n.patientId === patientId);
  }

  getHistoryByType(type: NotificationType): NotificationHistory[] {
    return this.history.filter(n => n.type === type);
  }

  getHistoryByStatus(status: NotificationHistory['status']): NotificationHistory[] {
    return this.history.filter(n => n.status === status);
  }

  clearHistory(): void {
    this.history = [];
  }
}

export const notificationHistoryService = new NotificationHistoryService(); 