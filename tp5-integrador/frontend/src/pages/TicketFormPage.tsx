import { useEffect, useState, type FormEvent } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import { ticketsApi } from '../api/tickets.api';

/** Sirve para crear (/tickets/new) y para editar (/tickets/:id/edit). */
export function TicketFormPage() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!id) return;
    ticketsApi
      .get(id)
      .then((ticket) => {
        setTitle(ticket.title);
        setDescription(ticket.description);
      })
      .catch((err: Error) => setError(err.message));
  }, [id]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const ticket = id
        ? await ticketsApi.update(id, { title, description })
        : await ticketsApi.create({ title, description });
      navigate(`/tickets/${ticket.id}`);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="card form-card">
      <p>
        <Link to={id ? `/tickets/${id}` : '/tickets'}>← Volver</Link>
      </p>
      <h1>{isEdit ? 'Editar ticket' : 'Nuevo ticket'}</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Título
          <input value={title} onChange={(e) => setTitle(e.target.value)} required />
        </label>
        <label>
          Descripción
          <textarea rows={5} value={description} onChange={(e) => setDescription(e.target.value)} required />
        </label>
        {error && <p className="alert error">{error}</p>}
        <button type="submit" disabled={submitting}>
          {submitting ? 'Guardando…' : 'Guardar'}
        </button>
      </form>
    </section>
  );
}
