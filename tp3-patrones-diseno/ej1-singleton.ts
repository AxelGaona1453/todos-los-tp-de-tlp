// Ejercicio 1 — Patrón Singleton: Inventario único de equipos informáticos

export type EstadoEquipo = "disponible" | "en reparación" | "asignado" | "dado de baja";

export interface Equipo {
  nombre: string;
  tipo: string;
  estado: EstadoEquipo;
}

class Inventario {
  private static instancia: Inventario | null = null;
  private equipos: Equipo[] = [];

  // Constructor privado: nadie de afuera puede hacer `new Inventario()`.
  private constructor() {}

  static obtenerInstancia(): Inventario {
    if (Inventario.instancia === null) {
      Inventario.instancia = new Inventario();
    }
    return Inventario.instancia;
  }

  agregarEquipo(nombre: string, tipo: string, estado: EstadoEquipo): void {
    this.equipos.push({ nombre, tipo, estado });
  }

  listarEquipos(): Equipo[] {
    // Copia para que no se pueda modificar el inventario desde afuera.
    return this.equipos.map((equipo) => ({ ...equipo }));
  }
}

// ---------------- Prueba ----------------
const inventario = Inventario.obtenerInstancia();
inventario.agregarEquipo("Notebook HP", "Portátil", "disponible");
console.log(inventario.listarEquipos());
// [{ nombre: "Notebook HP", tipo: "Portátil", estado: "disponible" }]

const otraReferencia = Inventario.obtenerInstancia();
otraReferencia.agregarEquipo("Impresora Epson", "Periférico", "en reparación");

console.log("¿Es la misma instancia?", inventario === otraReferencia); // true
console.log(inventario.listarEquipos()); // ambos equipos, porque es un único inventario

// const otro = new Inventario(); // ❌ Error: el constructor es privado
