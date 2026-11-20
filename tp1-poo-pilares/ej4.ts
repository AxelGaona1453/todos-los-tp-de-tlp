// Ejercicio 4 — Polimorfismo
// Reutiliza la jerarquía del ejercicio 3.
import { Empleado, EmpleadoFijo } from "./ej3.ts";

class EmpleadoPorHoras extends Empleado {
  private horasTrabajadas: number;
  private valorHora: number;

  constructor(nombre: string, antiguedad: number, horasTrabajadas: number, valorHora: number) {
    super(nombre, antiguedad);
    this.horasTrabajadas = horasTrabajadas;
    this.valorHora = valorHora;
  }

  // horas × valor hora, sin bono por antigüedad
  calcularSueldo(): number {
    return this.horasTrabajadas * this.valorHora;
  }
}

class EmpleadoPorComision extends Empleado {
  private ventasDelMes: number;
  private porcentajeComision: number;

  constructor(nombre: string, antiguedad: number, ventasDelMes: number, porcentajeComision: number) {
    super(nombre, antiguedad);
    this.ventasDelMes = ventasDelMes;
    this.porcentajeComision = porcentajeComision;
  }

  // ventas × porcentaje
  calcularSueldo(): number {
    return (this.ventasDelMes * this.porcentajeComision) / 100;
  }
}

function calcularNomina(empleados: Empleado[]): number {
  let total = 0;
  for (const empleado of empleados) {
    total += empleado.calcularSueldo();
  }
  return total;
}

// ---------------- Bloque de prueba ----------------
const empleados: Empleado[] = [
  new EmpleadoFijo("Juan", 3, 1000000),
  new EmpleadoPorHoras("Lucía", 1, 120, 5000),
  new EmpleadoPorComision("Pedro", 2, 4000000, 10),
  new EmpleadoFijo("María", 10, 800000),
  new EmpleadoPorHoras("Tomás", 0, 80, 6000),
];

// Recorremos sin preguntar de qué tipo es cada empleado: cada uno sabe calcular su sueldo.
for (const empleado of empleados) {
  console.log(empleado.describir());
}

console.log("Total de la nómina: $" + calcularNomina(empleados));
