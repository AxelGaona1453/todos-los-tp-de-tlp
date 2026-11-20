import { NotFoundError, ValidationError } from '../errors/AppError';
import { Role } from '../models/Role';
import { User } from '../models/User';
import { IRoleRepository } from '../repositories/interfaces/IRoleRepository';
import { IUserRepository } from '../repositories/interfaces/IUserRepository';

export class UserService {
  private readonly userRepository: IUserRepository;
  private readonly roleRepository: IRoleRepository;

  constructor(userRepository: IUserRepository, roleRepository: IRoleRepository) {
    this.userRepository = userRepository;
    this.roleRepository = roleRepository;
  }

  async list(): Promise<User[]> {
    return this.userRepository.findAll();
  }

  async listRoles(): Promise<Role[]> {
    return this.roleRepository.findAll();
  }

  async assignRole(userId: string, roleName: string): Promise<User> {
    const role = await this.roleRepository.findByName(roleName);
    if (!role) {
      throw new ValidationError(`El rol "${roleName}" no existe`);
    }

    const user = await this.userRepository.updateRole(userId, role.id);
    if (!user) {
      throw new NotFoundError('Usuario no encontrado');
    }
    return user;
  }
}
