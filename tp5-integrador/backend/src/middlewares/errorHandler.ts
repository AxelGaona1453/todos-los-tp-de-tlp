import { NextFunction, Request, Response } from 'express';
import { AppError } from '../errors/AppError';

/** Punto único de manejo de errores (Express 5 reenvía aquí los errores de handlers async). */
export function errorHandler(error: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({ message: error.message });
  }

  if (error instanceof SyntaxError && 'body' in error) {
    return res.status(400).json({ message: 'El cuerpo de la petición no es un JSON válido' });
  }

  console.error('[ERROR]', error);
  return res.status(500).json({ message: 'Error interno del servidor' });
}

export function notFoundHandler(_req: Request, res: Response) {
  res.status(404).json({ message: 'Ruta no encontrada' });
}
