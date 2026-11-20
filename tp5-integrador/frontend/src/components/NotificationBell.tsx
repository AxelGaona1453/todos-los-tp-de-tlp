import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router';
import { NOTIFICATIONS_CHANGED_EVENT, notificationsApi } from '../api/notifications.api';

const POLLING_MS = 5000;

/** Contador de notificaciones no leídas, actualizado por polling cada 5 segundos. */
export function NotificationBell() {
  const [count, setCount] = useState(0);

  const refresh = useCallback(() => {
    notificationsApi
      .unreadCount()
      .then(setCount)
      .catch(() => undefined);
  }, []);

  useEffect(() => {
    refresh();
    const interval = window.setInterval(refresh, POLLING_MS);
    window.addEventListener(NOTIFICATIONS_CHANGED_EVENT, refresh);
    return () => {
      window.clearInterval(interval);
      window.removeEventListener(NOTIFICATIONS_CHANGED_EVENT, refresh);
    };
  }, [refresh]);

  return (
    <Link to="/notifications" className="bell" title="Notificaciones">
      🔔 {count > 0 && <span className="badge">{count}</span>}
    </Link>
  );
}
