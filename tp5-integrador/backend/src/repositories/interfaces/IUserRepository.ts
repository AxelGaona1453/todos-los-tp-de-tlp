import { CreateUserData, User, UserWithPassword } from '../../models/User';

export interface IUserRepository {
  findById(id: string): Promise<User | null>;
  findByEmailWithPassword(email: string): Promise<UserWithPassword | null>;
  existsByEmail(email: string): Promise<boolean>;
  findAll(): Promise<User[]>;
  create(data: CreateUserData): Promise<User>;
  updateRole(userId: string, roleId: string): Promise<User | null>;
}
