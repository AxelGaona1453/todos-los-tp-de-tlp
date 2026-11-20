import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { subscriptionsApi, ticketsApi } from '../api/tickets.api';
import { Can } from '../components/Can';
import { StatusBadge } from '../components/StatusBadge';
import type { Ticket } from '../types';

export function TicketListPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [subscribedIds, setSubscribedIds] = useState<string[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([ticketsApi.list(), subscriptionsApi.myTicketIds()])
      .then(([ticketList, ids]) => {
        setTickets(ticketList);
        setSubscribedIds(ids);
      })
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section>
      <div className="page-header">
        <h1>Tickets</h1>
        <Can permission="ticket:create">
          <Link className="button" to="/tickets/new">
            + Nuevo ticket
          </Link>
        </Can>
      </div>

      {error && <p className="alert error">{error}</p>}
      {loading && <p>Cargando…</p>}
      {!loading && tickets.length === 0 && <p className="muted">No hay tickets todavía.</p>}

      <ul className="ticket-list">
        {tickets.map((ticket) => (
          <li key={ticket.id} className="card ticket-item">
            <div>
              <Link to={`/tickets/${ticket.id}`} className="ticket-title">
                {ticket.title}
              </Link>
              <p className="muted small">Actualizado: {new Date(ticket.updatedAt).toLocaleString()}</p>
            </div>
            <div className="ticket-meta">
              {subscribedIds.includes(ticket.id) && <span className="chip">Suscripto</span>}
              <StatusBadge status={ticket.status} />
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
