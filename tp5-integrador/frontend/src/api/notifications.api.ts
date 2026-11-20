import type { AppNotification } from '../types';
import { apiFetch } from './client';

/** Evento para que la campanita se actualice al instante (además del polling). */
export const NOTIFICATIONS_CHANGED_EVENT = 'notifications:changed';

export const notificationsApi = {
  list: () => apiFetch<AppNotification[]>('/notifications'),

  unreadCount: async () => (await apiFetch<{ count: number }>('/notifications/unread-count')).count,

  markAsRead: (id: string) => apiFetch<void>(`/notifications/${id}/read`, { method: 'PATCH' }),

  markAllAsRead: () => apiFetch<void>('/notifications/read-all', { method: 'PATCH' })
};
