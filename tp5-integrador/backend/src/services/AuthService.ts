import bcrypt from 'bcrypt';
import { ConflictError, UnauthorizedError } from '../errors/AppError';
import { User } from '../models/User';
import { IRoleRepository } from '../repositories/interfaces/IRoleRepository';
import { IUserRepository } from '../repositories/interfaces/IUserRepository';
import { AuthUser } from '../types/auth';
import { TokenService } from './TokenService';

const SALT_ROUNDS = 10;
const DEFAULT_ROLE = 'usuario';

export interface AuthResult {
  token: string;
  user: AuthUser;
}

export class AuthService {
  private readonly userRepository: IUserRepository;
  private readonly roleRepository: IRoleRepository;
  private readonly tokenService: TokenService;

  constructor(userRepository: IUserRepository, roleRepository: IRoleRepository, tokenService: TokenService) {
    this.userRepository = userRepository;
    this.roleRepository = roleRepository;
    this.tokenService = tokenService;
  }

  /** Todo usuario nuevo se registra con el rol "usuario". */
  async register(name: string, email: string, password: string): Promise<AuthResult> {
    if (await this.userRepository.existsByEmail(email)) {
      throw new ConflictError('Ya existe un usuario con ese email');
    }

    const role = await this.roleRepository.findByName(DEFAULT_ROLE);
    if (!role) {
      throw new Error(`No existe el rol "${DEFAULT_ROLE}". ¿Se ejecutó el seed?`);
    }

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    const user = await this.userRepository.create({ name, email, passwordHash, roleId: role.id });
    return this.buildResult(user);
  }

  async login(email: string, password: string): Promise<AuthResult> {
    const user = await this.userRepository.findByEmailWithPassword(email);
    // Mismo mensaje en ambos casos para no revelar qué emails existen.
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      throw new UnauthorizedError('Email o contraseña incorrectos');
    }
    return this.buildResult(user);
  }

  /** Verifica el token y devuelve el usuario con sus permisos actuales (leídos de la base). */
  async authenticate(token: string): Promise<AuthUser> {
    const payload = this.tokenService.verify(token);
    const user = await this.userRepository.findById(payload.sub);
    if (!user) {
      throw new UnauthorizedError('El usuario del token ya no existe');
    }
    return this.toAuthUser(user);
  }

  private async buildResult(user: User): Promise<AuthResult> {
    const token = this.tokenService.sign({ sub: user.id, email: user.email });
    return { token, user: await this.toAuthUser(user) };
  }

  private async toAuthUser(user: User): Promise<AuthUser> {
    const permissions = await this.roleRepository.findPermissionNamesByRoleName(user.role);
    return { id: user.id, name: user.name, email: user.email, role: user.role, permissions };
  }
}
