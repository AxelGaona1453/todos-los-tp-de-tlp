import type { ReactNode } from 'react';
import { useAuth } from '../context/AuthContext';

/**
 * Muestra sus hijos solo si el usuario tiene el permiso.
 * Es un complemento visual: la protección real está en el backend (403).
 */
export function Can({ permission, children }: { permission: string; children: ReactNode }) {
  const { hasPermission } = useAuth();
  return hasPermission(permission) ? <>{children}</> : null;
}
