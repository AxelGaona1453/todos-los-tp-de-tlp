import type { Ticket, TicketInput, TicketStatus } from '../types';
import { apiFetch } from './client';

export const ticketsApi = {
  list: () => apiFetch<Ticket[]>('/tickets'),

  get: (id: string) => apiFetch<Ticket>(`/tickets/${id}`),

  create: (data: TicketInput) => apiFetch<Ticket>('/tickets', { method: 'POST', body: JSON.stringify(data) }),

  update: (id: string, data: TicketInput) =>
    apiFetch<Ticket>(`/tickets/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  changeStatus: (id: string, status: TicketStatus) =>
    apiFetch<Ticket>(`/tickets/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),

  remove: (id: string) => apiFetch<void>(`/tickets/${id}`, { method: 'DELETE' })
};

export const subscriptionsApi = {
  myTicketIds: async () => (await apiFetch<{ ticketIds: string[] }>('/subscriptions')).ticketIds,

  subscribe: (ticketId: string) =>
    apiFetch<unknown>('/subscriptions', { method: 'POST', body: JSON.stringify({ ticketId }) }),

  unsubscribe: (ticketId: string) => apiFetch<void>(`/subscriptions/${ticketId}`, { method: 'DELETE' })
};
