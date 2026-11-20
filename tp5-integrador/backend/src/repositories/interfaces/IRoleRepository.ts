import { Role } from '../../models/Role';

export interface IRoleRepository {
  findAll(): Promise<Role[]>;
  findByName(name: string): Promise<Role | null>;
  /** Devuelve los nombres de permisos (ej. "ticket:read") del rol con ese nombre. */
  findPermissionNamesByRoleName(name: string): Promise<string[]>;
}
