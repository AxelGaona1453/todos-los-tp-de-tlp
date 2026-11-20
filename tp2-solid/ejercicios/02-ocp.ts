// OCP — Open/Closed Principle
// Antes: cada medio de pago nuevo obligaba a agregar un `case` en PaymentProcessor.
// Ahora: PaymentProcessor depende de la interfaz PaymentMethod y delega en ella.
// Agregar un medio nuevo = crear una clase nueva, sin modificar PaymentProcessor.

interface PaymentMethod {
  pay(amount: number): void;
}

class CardPayment implements PaymentMethod {
  pay(amount: number): void {
    console.log(`Pagando $${amount} con tarjeta`);
  }
}

class CashPayment implements PaymentMethod {
  pay(amount: number): void {
    console.log(`Pagando $${amount} en efectivo`);
  }
}

class TransferPayment implements PaymentMethod {
  pay(amount: number): void {
    console.log(`Pagando $${amount} con transferencia`);
  }
}

// Cerrado para modificación: no cambia al sumar medios de pago.
class PaymentProcessor {
  pay(method: PaymentMethod, amount: number): void {
    method.pay(amount);
  }
}

// ---------------- Prueba ----------------
const processor = new PaymentProcessor();
processor.pay(new CardPayment(), 100);
processor.pay(new CashPayment(), 250);
processor.pay(new TransferPayment(), 1000);

/*
Respuestas:
- ¿Qué parte debe modificarse para agregar transferencia? En el original, el switch
  de PaymentProcessor (y el tipo PaymentType). Ahora solo se agrega TransferPayment.
- ¿Cómo representar un medio de pago? Con una interfaz PaymentMethod y una clase por medio.
- ¿Qué comportamiento común tienen? Todos saben pagar un monto: pay(amount).
*/
