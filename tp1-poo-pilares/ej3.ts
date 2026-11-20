// Ejercicio 3 — Herencia

export class Empleado {
  protected nombre: string;
  protected antiguedad: number;

  constructor(nombre: string, antiguedad: number) {
    this.nombre = nombre;
    this.antiguedad = antiguedad;
  }

  // La clase base no sabe calcular sueldos reales: cada subclase decide cómo.
  calcularSueldo(): number {
    return 0;
  }

  // No se reescribe en las subclases: gracias al polimorfismo de calcularSueldo()
  // funciona para cualquier tipo de empleado.
  describir(): string {
    return `${this.nombre} (${this.antiguedad} años) — sueldo: $${this.calcularSueldo()}`;
  }
}

export class EmpleadoFijo extends Empleado {
  private sueldoBase: number;

  constructor(nombre: string, antiguedad: number, sueldoBase: number) {
    super(nombre, antiguedad);
    this.sueldoBase = sueldoBase;
  }

  // sueldoBase + 2% del sueldoBase por cada año trabajado
  calcularSueldo(): number {
    const bono = this.sueldoBase * 0.02 * this.antiguedad;
    return this.sueldoBase + bono;
  }
}

// ---------------- Bloque de prueba ----------------
// Solo se ejecuta cuando se corre este archivo directamente (npm run ej3),
// no cuando ej4.ts lo importa.
if (import.meta.main) {
  const generico = new Empleado("Genérico", 1);
  const juan = new EmpleadoFijo("Juan", 3, 1000000);
  const maria = new EmpleadoFijo("María", 10, 800000);

  console.log(generico.describir()); // sueldo 0
  console.log(juan.describir()); // 1.000.000 + 6% = 1.060.000
  console.log(maria.describir()); // 800.000 + 20% = 960.000
}
