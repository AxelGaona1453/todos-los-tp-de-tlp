import { Role, RoleModel } from '../models/Role';
import { IRoleRepository } from './interfaces/IRoleRepository';
import { toId } from './objectId';

interface RoleDoc {
  _id: unknown;
  name: string;
  permissions: { name: string }[];
}

function toRole(doc: RoleDoc): Role {
  return {
    id: toId(doc._id),
    name: doc.name,
    permissions: doc.permissions.map((permission) => permission.name)
  };
}

export class RoleRepository implements IRoleRepository {
  async findAll(): Promise<Role[]> {
    const docs = await RoleModel.find().sort({ name: 1 }).populate('permissions', 'name').lean<RoleDoc[]>();
    return docs.map(toRole);
  }

  async findByName(name: string): Promise<Role | null> {
    const doc = await RoleModel.findOne({ name }).populate('permissions', 'name').lean<RoleDoc>();
    return doc ? toRole(doc) : null;
  }

  async findPermissionNamesByRoleName(name: string): Promise<string[]> {
    const role = await this.findByName(name);
    return role ? role.permissions : [];
  }
}
