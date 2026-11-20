import { NextFunction, Request, Response } from 'express';
import { ForbiddenError, UnauthorizedError } from '../errors/AppError';
import { PermissionName } from '../types/permissions';

/** Responde 403 si el usuario autenticado no tiene el permiso pedido. */
export function authorize(permission: PermissionName) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.auth) {
      throw new UnauthorizedError();
    }
    if (!req.auth.permissions.includes(permission)) {
      throw new ForbiddenError(`Se requiere el permiso "${permission}"`);
    }
    next();
  };
}
