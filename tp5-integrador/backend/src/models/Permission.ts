import { Schema } from 'mongoose';
import { DatabaseConnection } from '../database/DatabaseConnection';

export interface Permission {
  id: string;
  name: string;
}

const permissionSchema = new Schema({
  name: { type: String, required: true, unique: true, trim: true }
});

export const PermissionModel = DatabaseConnection.getInstance()
  .getConnection()
  .model('Permission', permissionSchema);
