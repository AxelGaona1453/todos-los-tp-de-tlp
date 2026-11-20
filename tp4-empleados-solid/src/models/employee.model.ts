import { Schema, model } from 'mongoose';

/** Datos que llegan para crear un empleado. */
export interface CreateEmployeeDTO {
  name: string;
  position: string;
  baseSalary: number;
  yearsOfService: number;
}

/** Empleado completo tal como se persiste. */
export interface Employee extends CreateEmployeeDTO {
  finalSalary: number;
}

const employeeSchema = new Schema<Employee>(
  {
    name: { type: String, required: true },
    position: { type: String, required: true },
    baseSalary: { type: Number, required: true },
    yearsOfService: { type: Number, required: true },
    finalSalary: { type: Number, required: true }
  },
  { timestamps: true }
);

export const EmployeeModel = model<Employee>('Employee', employeeSchema);
