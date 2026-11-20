import { NextFunction, Request, Response } from 'express';
import { UnauthorizedError } from '../errors/AppError';
import { AuthService } from '../services/AuthService';

/**
 * Verifica el JWT del header Authorization y deja en req.auth al usuario
 * con sus permisos actuales (si un admin le cambia el rol, aplica en la próxima request).
 */
export function createAuthenticate(authService: AuthService) {
  return async (req: Request, _res: Response, next: NextFunction) => {
    const header = req.headers.authorization;
    if (!header || !header.startsWith('Bearer ')) {
      throw new UnauthorizedError('Falta el token (Authorization: Bearer <token>)');
    }

    req.auth = await authService.authenticate(header.slice('Bearer '.length).trim());
    next();
  };
}
