import { Request, Response } from 'express';
import { ROLE_NAMES } from '../models/Role';
import { UserService } from '../services/UserService';
import { getBody, param, requireOneOf } from './validation';

export class UserController {
  private readonly userService: UserService;

  constructor(userService: UserService) {
    this.userService = userService;
  }

  list = async (_req: Request, res: Response) => {
    res.json(await this.userService.list());
  };

  listRoles = async (_req: Request, res: Response) => {
    res.json(await this.userService.listRoles());
  };

  assignRole = async (req: Request, res: Response) => {
    const role = requireOneOf(getBody(req), 'role', ROLE_NAMES);
    const user = await this.userService.assignRole(param(req, 'id'), role);
    res.json(user);
  };
}
