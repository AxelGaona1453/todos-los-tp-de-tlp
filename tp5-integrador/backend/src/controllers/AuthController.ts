import { Request, Response } from 'express';
import { AuthService } from '../services/AuthService';
import { currentUser, getBody, requireEmail, requireString } from './validation';

export class AuthController {
  private readonly authService: AuthService;

  constructor(authService: AuthService) {
    this.authService = authService;
  }

  register = async (req: Request, res: Response) => {
    const body = getBody(req);
    const name = requireString(body, 'name', 'nombre');
    const email = requireEmail(body);
    const password = requireString(body, 'password', 'contraseña', 6);

    const result = await this.authService.register(name, email, password);
    res.status(201).json(result);
  };

  login = async (req: Request, res: Response) => {
    const body = getBody(req);
    const email = requireEmail(body);
    const password = requireString(body, 'password', 'contraseña');

    const result = await this.authService.login(email, password);
    res.json(result);
  };

  me = async (req: Request, res: Response) => {
    res.json(currentUser(req));
  };
}
