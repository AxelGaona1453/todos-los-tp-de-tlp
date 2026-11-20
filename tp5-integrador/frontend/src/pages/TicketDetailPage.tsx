import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import { subscriptionsApi, ticketsApi } from '../api/tickets.api';
import { Can } from '../components/Can';
import { StatusBadge } from '../components/StatusBadge';
import { useAuth } from '../context/AuthContext';
import { TICKET_STATUSES, type Ticket, type TicketStatus } from '../types';

export function TicketDetailPage() {
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const { hasPermission } = useAuth();
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [subscribed, setSubscribed] = useState(false);
  const [newStatus, setNewStatus] = useState<TicketStatus>('ABIERTO');
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');

  const load = useCallback(async () => {
    try {
      const [found, ids] = await Promise.all([ticketsApi.get(id), subscriptionsApi.myTicketIds()]);
      setTicket(found);
      setNewStatus(found.status);
      setSubscribed(ids.includes(found.id));
    } catch (err) {
      setError((err as Error).message);
    }
  }, [id]);

  useEffect(() => {
    void load();
  }, [load]);

  const run = async (action: () => Promise<void>, successMessage: string) => {
    setError('');
    setInfo('');
    try {
      await action();
      setInfo(successMessage);
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const toggleSubscription = () =>
    run(
      async () => {
        if (subscribed) {
          await subscriptionsApi.unsubscribe(id);
        } else {
          await subscriptionsApi.subscribe(id);
        }
        setSubscribed(!subscribed);
      },
      subscribed ? 'Te desuscribiste del ticket' : 'Te suscribiste: vas a recibir una notificación cuando cambie de estado'
    );

  const changeStatus = () =>
    run(async () => {
      setTicket(await ticketsApi.changeStatus(id, newStatus));
    }, `Estado actualizado a ${newStatus}`);

  const remove = async () => {
    if (!window.confirm('¿Eliminar este ticket? Esta acción no se puede deshacer.')) return;
    await run(async () => {
      await ticketsApi.remove(id);
      navigate('/tickets');
    }, 'Ticket eliminado');
  };

  if (!ticket) {
    return error ? <p className="alert error">{error}</p> : <p>Cargando…</p>;
  }

  const canSubscribe = subscribed ? hasPermission('subscription:delete') : hasPermission('subscription:create');

  return (
    <section className="card">
      <p>
        <Link to="/tickets">← Volver</Link>
      </p>
      <div className="page-header">
        <h1>{ticket.title}</h1>
        <StatusBadge status={ticket.status} />
      </div>
      <p className="description">{ticket.description}</p>
      <p className="muted small">
        ID: {ticket.id} · Creado: {new Date(ticket.createdAt).toLocaleString()} · Actualizado:{' '}
        {new Date(ticket.updatedAt).toLocaleString()}
      </p>

      {error && <p className="alert error">{error}</p>}
      {info && <p className="alert success">{info}</p>}

      <div className="actions">
        {canSubscribe && (
          <button className={subscribed ? 'secondary' : ''} onClick={toggleSubscription}>
            {subscribed ? 'Desuscribirme' : 'Suscribirme'}
          </button>
        )}

        <Can permission="ticket:change-status">
          <div className="inline">
            <select value={newStatus} onChange={(e) => setNewStatus(e.target.value as TicketStatus)}>
              {TICKET_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
            <button onClick={changeStatus} disabled={newStatus === ticket.status}>
              Cambiar estado
            </button>
          </div>
        </Can>

        <Can permission="ticket:update">
          <Link className="button secondary" to={`/tickets/${ticket.id}/edit`}>
            Editar
          </Link>
        </Can>

        <Can permission="ticket:delete">
          <button className="danger" onClick={remove}>
            Eliminar
          </button>
        </Can>
      </div>
    </section>
  );
}
