// Ejercicio 3 — Patrón Observer: seguimiento del estado de un equipo

export {};

// Equipo depende de esta interfaz, no de Soporte: se pueden sumar otros
// observadores (mail, log, etc.) sin modificar Equipo.
interface Observador {
  actualizar(equipo: Equipo): void;
}

class Equipo {
  readonly nombre: string;
  readonly tipo: string;
  private estado: string;
  private observadores: Observador[] = [];

  constructor(nombre: string, tipo: string, estado: string) {
    this.nombre = nombre;
    this.tipo = tipo;
    this.estado = estado;
  }

  obtenerEstado(): string {
    return this.estado;
  }

  agregarObservador(observador: Observador): void {
    if (!this.observadores.includes(observador)) {
      this.observadores.push(observador);
    }
  }

  quitarObservador(observador: Observador): void {
    this.observadores = this.observadores.filter((o) => o !== observador);
  }

  cambiarEstado(nuevoEstado: string): void {
    this.estado = nuevoEstado;
    this.notificarObservadores();
  }

  private notificarObservadores(): void {
    for (const observador of this.observadores) {
      observador.actualizar(this);
    }
  }
}

class Soporte implements Observador {
  actualizar(equipo: Equipo): void {
    console.log(
      `Soporte notificado: ${equipo.nombre} ha cambiado su estado a ${equipo.obtenerEstado()}.`
    );
  }
}

// Otro observador, agregado sin tocar la clase Equipo.
class RegistroLog implements Observador {
  actualizar(equipo: Equipo): void {
    console.log(`[LOG ${new Date().toISOString()}] ${equipo.nombre} -> ${equipo.obtenerEstado()}`);
  }
}

// ---------------- Prueba ----------------
const soporte = new Soporte();
const equipo = new Equipo("Notebook HP", "Portátil", "disponible");
equipo.agregarObservador(soporte);
equipo.cambiarEstado("en reparación");
// Soporte notificado: Notebook HP ha cambiado su estado a en reparación.

const log = new RegistroLog();
equipo.agregarObservador(log);
equipo.cambiarEstado("disponible");

equipo.quitarObservador(soporte);
equipo.cambiarEstado("asignado"); // solo lo recibe el log
