export const TICKET_STATUSES = ['ABIERTO', 'EN_PROGRESO', 'RESUELTO', 'CERRADO'] as const;
export type TicketStatus = (typeof TICKET_STATUSES)[number];

export const ROLE_NAMES = ['admin', 'operador', 'usuario'] as const;
export type RoleName = (typeof ROLE_NAMES)[number];

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: string;
  permissions: string[];
}

export interface AuthResponse {
  token: string;
  user: AuthUser;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

export interface Ticket {
  id: string;
  title: string;
  description: string;
  status: TicketStatus;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface TicketInput {
  title: string;
  description: string;
}

export interface AppNotification {
  id: string;
  ticketId: string;
  ticketTitle: string;
  previousStatus: TicketStatus;
  newStatus: TicketStatus;
  message: string;
  read: boolean;
  createdAt: string;
}
