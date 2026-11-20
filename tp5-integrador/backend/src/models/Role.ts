import { Schema, Types } from 'mongoose';
import { DatabaseConnection } from '../database/DatabaseConnection';

export const ROLE_NAMES = ['admin', 'operador', 'usuario'] as const;
export type RoleName = (typeof ROLE_NAMES)[number];

export interface Role {
  id: string;
  name: string;
  permissions: string[];
}

const roleSchema = new Schema({
  name: { type: String, required: true, unique: true, trim: true },
  permissions: [{ type: Types.ObjectId, ref: 'Permission' }]
});

export const RoleModel = DatabaseConnection.getInstance().getConnection().model('Role', roleSchema);
