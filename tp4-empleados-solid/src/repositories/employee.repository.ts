import { Employee, EmployeeModel } from '../models/employee.model';

/** Abstracción del acceso a datos: el servicio depende de esto, no de Mongoose (DIP). */
export interface IEmployeeRepository {
  create(data: Employee): Promise<unknown>;
  findAll(): Promise<unknown[]>;
  findById(id: string): Promise<unknown | null>;
}

/** Implementación concreta con Mongoose. Único lugar que conoce el modelo. */
export class MongoEmployeeRepository implements IEmployeeRepository {
  async create(data: Employee) {
    return EmployeeModel.create(data);
  }

  async findAll() {
    return EmployeeModel.find().sort({ createdAt: -1 });
  }

  async findById(id: string) {
    return EmployeeModel.findById(id);
  }
}
