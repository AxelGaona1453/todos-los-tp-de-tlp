import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router';
import { NOTIFICATIONS_CHANGED_EVENT, notificationsApi } from '../api/notifications.api';
import type { AppNotification } from '../types';

const POLLING_MS = 5000;

export function NotificationsPage() {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [error, setError] = useState('');

  const load = useCallback(() => {
    notificationsApi
      .list()
      .then(setNotifications)
      .catch((err: Error) => setError(err.message));
  }, []);

  useEffect(() => {
    load();
    const interval = window.setInterval(load, POLLING_MS);
    return () => window.clearInterval(interval);
  }, [load]);

  const afterChange = () => {
    load();
    window.dispatchEvent(new Event(NOTIFICATIONS_CHANGED_EVENT));
  };

  const markAsRead = async (id: string) => {
    await notificationsApi.markAsRead(id);
    afterChange();
  };

  const markAll = async () => {
    await notificationsApi.markAllAsRead();
    afterChange();
  };

  const unread = notifications.filter((notification) => !notification.read).length;

  return (
    <section>
      <div className="page-header">
        <h1>Notificaciones</h1>
        {unread > 0 && (
          <button className="secondary" onClick={markAll}>
            Marcar todas como leídas ({unread})
          </button>
        )}
      </div>

      {error && <p className="alert error">{error}</p>}
      {notifications.length === 0 && (
        <p className="muted">No tenés notificaciones. Suscribite a un ticket para recibir avisos.</p>
      )}

      <ul className="notification-list">
        {notifications.map((notification) => (
          <li key={notification.id} className={`card notification ${notification.read ? 'read' : 'unread'}`}>
            <div>
              <p>
                {!notification.read && <span className="dot" />}
                <Link to={`/tickets/${notification.ticketId}`}>{notification.ticketTitle}</Link>:{' '}
                <strong>{notification.previousStatus}</strong> → <strong>{notification.newStatus}</strong>
              </p>
              <p className="muted small">{new Date(notification.createdAt).toLocaleString()}</p>
            </div>
            {!notification.read && (
              <button className="secondary" onClick={() => markAsRead(notification.id)}>
                Marcar como leída
              </button>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
