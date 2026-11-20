import { Request, Response } from 'express';
import { EmployeeService } from '../services/employee.service';
import { validateCreateEmployee } from '../validators/employee.validator';

/**
 * Controlador HTTP: traduce request → servicio → response.
 * Express 5 propaga automáticamente los errores de funciones async al errorHandler.
 */
export class EmployeeController {
  private readonly service: EmployeeService;

  constructor(service: EmployeeService) {
    this.service = service;
  }

  create = async (req: Request, res: Response) => {
    const data = validateCreateEmployee(req.body);
    const employee = await this.service.create(data);
    res.status(201).json(employee);
  };

  findAll = async (_req: Request, res: Response) => {
    const employees = await this.service.findAll();
    res.json(employees);
  };

  findById = async (req: Request<{ id: string }>, res: Response) => {
    const employee = await this.service.findById(req.params.id);
    res.json(employee);
  };
}
