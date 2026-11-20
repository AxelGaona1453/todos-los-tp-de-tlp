import { isValidObjectId } from 'mongoose';

/** Un id con formato inválido no puede existir en la base: se trata como "no encontrado". */
export function isValidId(id: string): boolean {
  return isValidObjectId(id);
}

/** Convierte un ObjectId (o un documento poblado) a string. */
export function toId(value: unknown): string {
  if (value && typeof value === 'object' && '_id' in value) {
    return String((value as { _id: unknown })._id);
  }
  return String(value);
}
