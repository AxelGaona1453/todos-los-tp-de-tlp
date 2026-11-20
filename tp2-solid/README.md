# TP2 — Actividad práctica de SOLID con TypeScript

Consigna: [aguscenturion/actividad-practica-SOLID](https://github.com/aguscenturion/actividad-practica-SOLID)

- `original/` → los ejemplos tal como los dio la cátedra (código difícil de mantener).
- `ejercicios/` → los mismos ejercicios **refactorizados** aplicando cada principio.
  Al final de cada archivo están las respuestas a las preguntas de la consigna.

## Cómo ejecutar

Requiere Node.js 22.18+ (ejecuta TypeScript de forma nativa).

```bash
npm install
npm run 01-srp
npm run 02-ocp
npm run 03-lsp
npm run 04-isp
npm run 05-dip
npm run typecheck
```

## Resumen de cada refactor

| Principio | Problema original | Solución |
|---|---|---|
| **SRP** | `UserManager` valida, guarda y envía correos | `UserValidator`, `UserRepository`, `EmailService` y `UserRegistrationService` (coordina por composición) |
| **OCP** | Un `switch` en `PaymentProcessor` que crece con cada medio de pago | Interfaz `PaymentMethod` + `CardPayment`, `CashPayment`, `TransferPayment`. `PaymentProcessor` delega sin `switch` |
| **LSP** | `Square extends Rectangle` rompe `setWidth`/`setHeight` (área 100 en lugar de 50) | Se elimina la herencia. Ambas implementan `Shape` con `area()` |
| **ISP** | `SimplePrinter` obligada a implementar `scan` y `fax` lanzando errores | Interfaces `Printer`, `Scanner`, `Fax`. `SimplePrinter` implementa solo `Printer` |
| **DIP** | `OrderService` hace `new EmailSender()` | Interfaz `Notifier` inyectada por constructor (`EmailSender`, `SmsSender`, `FakeNotifier` para pruebas) |
