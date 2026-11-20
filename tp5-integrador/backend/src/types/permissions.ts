/** Catálogo de permisos (formato recurso:accion). */
export const PERMISSIONS = {
  TICKET_READ: 'ticket:read',
  TICKET_CREATE: 'ticket:create',
  TICKET_UPDATE: 'ticket:update',
  TICKET_CHANGE_STATUS: 'ticket:change-status',
  TICKET_DELETE: 'ticket:delete',
  SUBSCRIPTION_CREATE: 'subscription:create',
  SUBSCRIPTION_DELETE: 'subscription:delete',
  NOTIFICATION_READ: 'notification:read',
  USER_READ: 'user:read',
  USER_ASSIGN_ROLE: 'user:assign-role'
} as const;

export type PermissionName = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];
