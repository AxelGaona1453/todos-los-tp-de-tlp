import { Request } from 'express';
import { UnauthorizedError, ValidationError } from '../errors/AppError';
import { AuthUser } from '../types/auth';

/** Helpers de validación de entrada usados por los controllers. */

export function getBody(req: Request): Record<string, unknown> {
  const body: unknown = req.body;
  return body && typeof body === 'object' ? (body as Record<string, unknown>) : {};
}

export function requireString(body: Record<string, unknown>, field: string, label = field, minLength = 1): string {
  const value = body[field];
  if (typeof value !== 'string' || value.trim().length < minLength) {
    throw new ValidationError(
      minLength > 1
        ? `El campo "${label}" es obligatorio y debe tener al menos ${minLength} caracteres`
        : `El campo "${label}" es obligatorio`
    );
  }
  return value.trim();
}

export function optionalString(body: Record<string, unknown>, field: string, label = field): string | undefined {
  if (body[field] === undefined) return undefined;
  return requireString(body, field, label);
}

export function requireEmail(body: Record<string, unknown>, field = 'email'): string {
  const email = requireString(body, field, 'email').toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new ValidationError('El email no tiene un formato válido');
  }
  return email;
}

export function requireOneOf<T extends string>(
  body: Record<string, unknown>,
  field: string,
  allowed: readonly T[]
): T {
  const value = body[field];
  if (typeof value !== 'string' || !allowed.includes(value as T)) {
    throw new ValidationError(`El campo "${field}" debe ser uno de: ${allowed.join(', ')}`);
  }
  return value as T;
}

/** Usuario autenticado (lo deja el middleware authenticate). */
export function currentUser(req: Request): AuthUser {
  if (!req.auth) {
    throw new UnauthorizedError();
  }
  return req.auth;
}

export function param(req: Request, name: string): string {
  const value = (req.params as Record<string, string | undefined>)[name];
  if (!value) {
    throw new ValidationError(`Falta el parámetro "${name}"`);
  }
  return value;
}
