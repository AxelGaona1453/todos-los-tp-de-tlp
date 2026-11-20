import { NextFunction, Request, Response } from 'express';
import { AppError } from '../errors/AppError';

/** Punto único de manejo de errores: evita repetir try/catch en cada ruta. */
export function errorHandler(error: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({ message: error.message });
  }

  console.error(error);
  return res.status(500).json({ message: 'Error interno del servidor' });
}
