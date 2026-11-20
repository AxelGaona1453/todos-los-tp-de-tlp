// DIP — Dependency Inversion Principle
// Antes: OrderService hacía `new EmailSender()` adentro (dependencia concreta).
// Ahora: OrderService depende de la abstracción Notifier y la recibe por constructor.

interface Notifier {
  send(to: string, message: string): void;
}

class EmailSender implements Notifier {
  send(to: string, message: string): void {
    console.log(`Correo para ${to}: ${message}`);
  }
}

class SmsSender implements Notifier {
  send(to: string, message: string): void {
    console.log(`SMS para ${to}: ${message}`);
  }
}

// Doble de prueba: permite probar OrderService sin enviar nada real.
class FakeNotifier implements Notifier {
  sent: { to: string; message: string }[] = [];

  send(to: string, message: string): void {
    this.sent.push({ to, message });
  }
}

class OrderService {
  private notifier: Notifier;

  constructor(notifier: Notifier) {
    this.notifier = notifier;
  }

  createOrder(customerContact: string): void {
    console.log("Pedido creado");
    this.notifier.send(customerContact, "Tu pedido fue creado");
  }
}

// ---------------- Prueba ----------------
new OrderService(new EmailSender()).createOrder("ana@example.com");
new OrderService(new SmsSender()).createOrder("+54 9 370 1234567");

const fake = new FakeNotifier();
new OrderService(fake).createOrder("test@example.com");
console.log("Mensajes capturados por el fake:", fake.sent);

/*
Respuestas:
- ¿Qué dependencia concreta crea OrderService? EmailSender, con `new` dentro de createOrder.
- ¿Cómo probarías la clase sin enviar un correo? Pasándole por constructor un
  Notifier falso (FakeNotifier) que solo registre los envíos.
- ¿Qué contrato común podrían implementar correo y SMS? Notifier, con send(to, message).
*/
