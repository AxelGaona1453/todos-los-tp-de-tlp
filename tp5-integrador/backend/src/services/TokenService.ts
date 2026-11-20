import jwt, { SignOptions } from 'jsonwebtoken';
import { UnauthorizedError } from '../errors/AppError';
import { TokenPayload } from '../types/auth';

/** Única responsabilidad: firmar y verificar JWT. */
export class TokenService {
  private readonly secret: string;
  private readonly expiresIn: SignOptions['expiresIn'];

  constructor(secret: string, expiresIn: string) {
    this.secret = secret;
    this.expiresIn = expiresIn as SignOptions['expiresIn'];
  }

  sign(payload: TokenPayload): string {
    return jwt.sign(payload, this.secret, { expiresIn: this.expiresIn });
  }

  verify(token: string): TokenPayload {
    try {
      const decoded = jwt.verify(token, this.secret);
      if (typeof decoded === 'string' || typeof decoded.sub !== 'string') {
        throw new UnauthorizedError('Token inválido');
      }
      return { sub: decoded.sub, email: String(decoded.email) };
    } catch {
      throw new UnauthorizedError('Token inválido o expirado');
    }
  }
}
