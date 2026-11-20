/**
 * Regla de negocio aislada:
 * salario final = salario base + 2% del salario base por cada año de antigüedad.
 */
export interface ISalaryCalculator {
  calculate(baseSalary: number, yearsOfService: number): number;
}

export class SeniorityBonusSalaryCalculator implements ISalaryCalculator {
  private static readonly BONUS_PER_YEAR = 0.02;

  calculate(baseSalary: number, yearsOfService: number): number {
    const bonus = baseSalary * SeniorityBonusSalaryCalculator.BONUS_PER_YEAR * yearsOfService;
    return baseSalary + bonus;
  }
}
