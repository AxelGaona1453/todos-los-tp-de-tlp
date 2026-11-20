import { CreateUserData, User, UserModel, UserWithPassword } from '../models/User';
import { IUserRepository } from './interfaces/IUserRepository';
import { isValidId, toId } from './objectId';

interface UserDoc {
  _id: unknown;
  name: string;
  email: string;
  passwordHash: string;
  role: { name: string } | unknown;
  createdAt: Date;
  updatedAt: Date;
}

function toUser(doc: UserDoc): User {
  const role = doc.role as { name?: string } | null;
  return {
    id: toId(doc._id),
    name: doc.name,
    email: doc.email,
    role: role?.name ?? '',
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt
  };
}

export class UserRepository implements IUserRepository {
  async findById(id: string): Promise<User | null> {
    if (!isValidId(id)) return null;
    const doc = await UserModel.findById(id).populate('role', 'name').lean<UserDoc>();
    return doc ? toUser(doc) : null;
  }

  async findByEmailWithPassword(email: string): Promise<UserWithPassword | null> {
    const doc = await UserModel.findOne({ email: email.toLowerCase() })
      .populate('role', 'name')
      .lean<UserDoc>();
    return doc ? { ...toUser(doc), passwordHash: doc.passwordHash } : null;
  }

  async existsByEmail(email: string): Promise<boolean> {
    const found = await UserModel.exists({ email: email.toLowerCase() });
    return found !== null;
  }

  async findAll(): Promise<User[]> {
    const docs = await UserModel.find().sort({ createdAt: 1 }).populate('role', 'name').lean<UserDoc[]>();
    return docs.map(toUser);
  }

  async create(data: CreateUserData): Promise<User> {
    const created = await UserModel.create({
      name: data.name,
      email: data.email,
      passwordHash: data.passwordHash,
      role: data.roleId
    });
    const user = await this.findById(toId(created._id));
    if (!user) throw new Error('No se pudo leer el usuario recién creado');
    return user;
  }

  async updateRole(userId: string, roleId: string): Promise<User | null> {
    if (!isValidId(userId)) return null;
    const doc = await UserModel.findByIdAndUpdate(userId, { role: roleId }, { new: true })
      .populate('role', 'name')
      .lean<UserDoc>();
    return doc ? toUser(doc) : null;
  }
}
