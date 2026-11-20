// Ejercicio 1 — Abstracción
// Solo modelamos lo que importa PARA VENDER: nombre, precio, categoría y stock.
// Datos como el color del embalaje, el peso o el proveedor existen en la realidad,
// pero no aportan nada a la venta, así que quedan afuera del modelo.

class Producto {
  nombre: string;
  precio: number;
  categoria: string;
  stock: number;

  constructor(nombre: string, precio: number, categoria: string, stock: number) {
    this.nombre = nombre;
    this.precio = precio;
    this.categoria = categoria;
    this.stock = stock;
  }

  describir(): string {
    return `${this.nombre} (${this.categoria}): $${this.precio} — ${this.stock} unidades`;
  }

  hayStock(cantidad: number): boolean {
    return cantidad > 0 && cantidad <= this.stock;
  }

  // Decisión: lanzamos un Error si no hay stock suficiente.
  // Justificación: una venta fallida es una situación excepcional que quien llama
  // NO debería poder ignorar sin darse cuenta (un console.log pasa desapercibido
  // y el sistema seguiría como si se hubiera vendido). Con un Error, el llamador
  // está obligado a manejarlo (try/catch) o el programa se detiene.
  venderUnidades(cantidad: number): void {
    if (!this.hayStock(cantidad)) {
      throw new Error(
        `No hay stock suficiente de ${this.nombre}: se pidieron ${cantidad} y hay ${this.stock}`
      );
    }
    this.stock -= cantidad;
  }

  // Simulación: devuelve el precio con descuento sin modificar this.precio.
  aplicarDescuento(porcentaje: number): number {
    return this.precio - (this.precio * porcentaje) / 100;
  }
}

// ---------------- Bloque de prueba ----------------
const teclado = new Producto("Teclado", 10000, "electrónica", 5);
const yerba = new Producto("Yerba 1kg", 3500, "almacén", 20);

console.log(teclado.describir());
console.log(yerba.describir());

console.log("¿Hay stock de 3 teclados?", teclado.hayStock(3));
console.log("¿Hay stock de 10 teclados?", teclado.hayStock(10));

teclado.venderUnidades(3);
console.log("Después de vender 3:", teclado.describir());

try {
  teclado.venderUnidades(10);
} catch (error) {
  console.log("Error esperado:", (error as Error).message);
}

console.log("Precio con 15% de descuento:", teclado.aplicarDescuento(15));
console.log("Precio original intacto:", teclado.precio);
