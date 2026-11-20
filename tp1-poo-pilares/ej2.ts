// Ejercicio 2 — Encapsulamiento

type Movimiento = {
  tipo: "depósito" | "retiro";
  monto: number;
};

class CuentaBancaria {
  readonly titular: string;
  private saldo: number;
  private historial: Movimiento[] = [];

  constructor(titular: string, saldoInicial: number) {
    if (saldoInicial < 0) {
      throw new Error("El saldo inicial no puede ser negativo");
    }
    this.titular = titular;
    this.saldo = saldoInicial;
  }

  depositar(monto: number): void {
    if (monto <= 0) {
      throw new Error("El monto a depositar debe ser mayor a 0");
    }
    this.saldo += monto;
    this.historial.push({ tipo: "depósito", monto });
  }

  retirar(monto: number): void {
    if (monto <= 0) {
      throw new Error("El monto a retirar debe ser mayor a 0");
    }
    if (monto > this.saldo) {
      throw new Error(`Saldo insuficiente: disponible $${this.saldo}, pedido $${monto}`);
    }
    this.saldo -= monto;
    this.historial.push({ tipo: "retiro", monto });
  }

  consultarSaldo(): number {
    return this.saldo;
  }

  // Devuelve una COPIA (arreglo y objetos nuevos): si quien llama la modifica,
  // el historial interno de la cuenta no se altera.
  obtenerHistorial(): Movimiento[] {
    return this.historial.map((movimiento) => ({ ...movimiento }));
  }
}

// ---------------- Bloque de prueba ----------------
const cuenta = new CuentaBancaria("Ana Pérez", 5000);
console.log(`Titular: ${cuenta.titular} — saldo inicial: $${cuenta.consultarSaldo()}`);

cuenta.depositar(2000);
cuenta.retirar(1500);
console.log("Saldo actual:", cuenta.consultarSaldo());

try {
  cuenta.depositar(0);
} catch (error) {
  console.log("Error esperado:", (error as Error).message);
}

try {
  cuenta.retirar(100000);
} catch (error) {
  console.log("Error esperado:", (error as Error).message);
}

const copia = cuenta.obtenerHistorial();
copia.push({ tipo: "depósito", monto: 999999 });
copia[0].monto = 1;
console.log("Copia modificada desde afuera:", copia);
console.log("Historial real (intacto):", cuenta.obtenerHistorial());

// cuenta.saldo = 1000000;  // ❌ Error de compilación: 'saldo' es private
