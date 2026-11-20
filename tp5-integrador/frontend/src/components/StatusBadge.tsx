import type { TicketStatus } from '../types';

export function StatusBadge({ status }: { status: TicketStatus }) {
  return <span className={`status status-${status.toLowerCase()}`}>{status.replace('_', ' ')}</span>;
}
