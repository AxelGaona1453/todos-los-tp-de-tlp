import express from 'express';
import { EmployeeController } from './controllers/employee.controller';
import { errorHandler } from './middlewares/errorHandler';
import { MongoEmployeeRepository } from './repositories/employee.repository';
import { createEmployeeRouter } from './routes/employee.routes';
import { EmployeeService } from './services/employee.service';
import { SeniorityBonusSalaryCalculator } from './services/salary.calculator';

/** Composition root: acá se crean las dependencias y se conectan por constructor. */
export function createApp() {
  const app = express();
  app.use(express.json());

  const repository = new MongoEmployeeRepository();
  const salaryCalculator = new SeniorityBonusSalaryCalculator();
  const service = new EmployeeService(repository, salaryCalculator);
  const controller = new EmployeeController(service);

  app.use('/employees', createEmployeeRouter(controller));
  app.use(errorHandler);

  return app;
}
