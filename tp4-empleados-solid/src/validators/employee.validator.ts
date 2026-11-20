import { ValidationError } from '../errors/AppError';
import { CreateEmployeeDTO } from '../models/employee.model';

/** Valida el body de creación y devuelve un DTO tipado (o lanza ValidationError). */
export function validateCreateEmployee(body: unknown): CreateEmployeeDTO {
  const { name, position, baseSalary, yearsOfService } = (body ?? {}) as Record<string, unknown>;

  if (!name || !position) {
    throw new ValidationError('Nombre y puesto son obligatorios');
  }

  if (typeof baseSalary !== 'number' || baseSalary <= 0) {
    throw new ValidationError('El salario base debe ser mayor a 0');
  }

  if (
    typeof yearsOfService !== 'number' ||
    yearsOfService < 0 ||
    !Number.isInteger(yearsOfService)
  ) {
    throw new ValidationError('La antigüedad debe ser un entero mayor o igual a 0');
  }

  return {
    name: name as string,
    position: position as string,
    baseSalary,
    yearsOfService
  };
}
