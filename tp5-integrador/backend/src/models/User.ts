import { Schema, Types } from 'mongoose';
import { DatabaseConnection } from '../database/DatabaseConnection';

/** Usuario sin datos sensibles (lo que se expone hacia afuera). */
export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}

/** Usuario con el hash de la contraseña (solo para autenticación). */
export interface UserWithPassword extends User {
  passwordHash: string;
}

export interface CreateUserData {
  name: string;
  email: string;
  passwordHash: string;
  roleId: string;
}

const userSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    role: { type: Types.ObjectId, ref: 'Role', required: true }
  },
  { timestamps: true }
);

export const UserModel = DatabaseConnection.getInstance().getConnection().model('User', userSchema);
