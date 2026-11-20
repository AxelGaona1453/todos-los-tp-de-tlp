import { NotFoundError } from '../errors/AppError';
import { CreateEmployeeDTO } from '../models/employee.model';
import { IEmployeeRepository } from '../repositories/employee.repository';
import { ISalaryCalculator } from './salary.calculator';

/** Lógica de negocio de empleados. No conoce Express ni Mongoose. */
export class EmployeeService {
  private readonly repository: IEmployeeRepository;
  private readonly salaryCalculator: ISalaryCalculator;

  constructor(repository: IEmployeeRepository, salaryCalculator: ISalaryCalculator) {
    this.repository = repository;
    this.salaryCalculator = salaryCalculator;
  }

  async create(data: CreateEmployeeDTO) {
    const finalSalary = this.salaryCalculator.calculate(data.baseSalary, data.yearsOfService);
    const employee = await this.repository.create({ ...data, finalSalary });
    console.log(`Empleado creado: ${data.name} - salario final: ${finalSalary}`);
    return employee;
  }

  async findAll() {
    return this.repository.findAll();
  }

  async findById(id: string) {
    const employee = await this.repository.findById(id);
    if (!employee) {
      throw new NotFoundError('Empleado no encontrado');
    }
    return employee;
  }
}
