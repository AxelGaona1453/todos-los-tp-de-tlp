// Ejercicio 4 — Patrón Adapter: integrar un inventario viejo al sistema nuevo

export {};

interface Equipo {
  nombre: string;
  tipo: string;
  estado: string;
}

// Contrato objetivo que espera el sistema nuevo.
interface Inventario {
  agregarEquipo(nombre: string, tipo: string, estado: string): void;
  listarEquipos(): Equipo[];
}

// Clase antigua (no se puede/quiere modificar): otra interfaz y otro formato.
class InventarioViejo {
  private items: string[] = [];

  // Guardaba cada ítem como un texto "nombre|tipo|estado".
  agregarItem(item: string): void {
    this.items.push(item);
  }

  obtenerItems(): string[] {
    return [...this.items];
  }
}

// Adaptador: implementa la interfaz nueva y traduce las llamadas al formato viejo.
class AdaptadorInventario implements Inventario {
  private inventarioViejo: InventarioViejo;

  constructor(inventarioViejo: InventarioViejo) {
    this.inventarioViejo = inventarioViejo;
  }

  agregarEquipo(nombre: string, tipo: string, estado: string): void {
    this.inventarioViejo.agregarItem(`${nombre}|${tipo}|${estado}`);
  }

  listarEquipos(): Equipo[] {
    return this.inventarioViejo.obtenerItems().map((item) => {
      const [nombre, tipo, estado] = item.split("|");
      return { nombre, tipo, estado };
    });
  }
}

// El sistema nuevo solo conoce la interfaz Inventario.
function mostrarInventario(inventario: Inventario): void {
  console.log(inventario.listarEquipos());
}

// ---------------- Prueba ----------------
const inventarioViejo = new InventarioViejo();
const adaptador = new AdaptadorInventario(inventarioViejo);
adaptador.agregarEquipo("Servidor Dell", "Servidor", "disponible");
console.log(adaptador.listarEquipos());
// [{ nombre: "Servidor Dell", tipo: "Servidor", estado: "disponible" }]

adaptador.agregarEquipo("Notebook HP", "Portátil", "en reparación");
mostrarInventario(adaptador);
console.log("Así lo guarda internamente el inventario viejo:", inventarioViejo.obtenerItems());
