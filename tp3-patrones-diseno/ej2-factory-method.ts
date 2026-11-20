// Ejercicio 2 — Patrón Factory Method: creación de equipos

export {};

type TipoEquipo = "Notebook" | "Desktop" | "Servidor";

// Clase abstracta común: crearEquipo siempre devuelve este tipo uniforme.
abstract class EquipoInformatico {
  protected nombre: string;
  protected ram: string;
  protected procesador: string;

  constructor(nombre: string, ram: string, procesador: string) {
    this.nombre = nombre;
    this.ram = ram;
    this.procesador = procesador;
  }

  abstract detalles(): string;
}

class Notebook extends EquipoInformatico {
  detalles(): string {
    return `Tipo: Notebook, Nombre: ${this.nombre}, RAM: ${this.ram}, Procesador: ${this.procesador}`;
  }
}

class Desktop extends EquipoInformatico {
  detalles(): string {
    return `Tipo: Desktop, Nombre: ${this.nombre}, RAM: ${this.ram}, Procesador: ${this.procesador}`;
  }
}

class Servidor extends EquipoInformatico {
  detalles(): string {
    return `Tipo: Servidor, Nombre: ${this.nombre}, RAM: ${this.ram}, Procesador: ${this.procesador}`;
  }
}

class EquipoFactory {
  crearEquipo(tipo: TipoEquipo, nombre: string, ram: string, procesador: string): EquipoInformatico {
    switch (tipo) {
      case "Notebook":
        return new Notebook(nombre, ram, procesador);
      case "Desktop":
        return new Desktop(nombre, ram, procesador);
      case "Servidor":
        return new Servidor(nombre, ram, procesador);
      default:
        throw new Error(`Tipo de equipo no soportado: ${tipo as string}`);
    }
  }
}

// ---------------- Prueba ----------------
const factory = new EquipoFactory();

const notebook = factory.crearEquipo("Notebook", "Dell XPS", "16GB", "i7");
console.log(notebook.detalles());
// Tipo: Notebook, Nombre: Dell XPS, RAM: 16GB, Procesador: i7

const desktop = factory.crearEquipo("Desktop", "Lenovo ThinkCentre", "32GB", "Ryzen 7");
const servidor = factory.crearEquipo("Servidor", "Dell PowerEdge", "128GB", "Xeon");

// Todos se tratan igual gracias a la clase abstracta común.
const equipos: EquipoInformatico[] = [notebook, desktop, servidor];
equipos.forEach((equipo) => console.log(equipo.detalles()));
