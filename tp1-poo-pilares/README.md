# TP1 — Los 4 pilares de la POO + getters y setters

Consigna: [gist de la cátedra](https://gist.github.com/aguscenturion/c31ef342495b49d34755a75c67a30e8e)

## Cómo ejecutar

Requiere Node.js 22.18+ (ejecuta TypeScript de forma nativa).

```bash
npm install
npm run ej1   # Abstracción — Producto
npm run ej2   # Encapsulamiento — CuentaBancaria
npm run ej3   # Herencia — Empleado / EmpleadoFijo
npm run ej4   # Polimorfismo — EmpleadoPorHoras / EmpleadoPorComision / calcularNomina
npm run ej5   # Getters y setters — Persona
npm run typecheck
```

## Decisiones

- **Ej. 1 – `venderUnidades`:** lanza un `Error` cuando no hay stock. Una venta fallida no debe pasar
  desapercibida; un mensaje por consola se puede ignorar y el sistema seguiría como si se hubiera vendido,
  en cambio un `Error` obliga a quien llama a manejar el caso.
- **Ej. 2 – Historial:** se guarda como arreglo privado de objetos `{ tipo, monto }`. `obtenerHistorial()`
  devuelve una copia profunda, así modificar lo devuelto no altera la cuenta.
- **Ej. 4:** importa `Empleado` y `EmpleadoFijo` desde `ej3.ts` para reutilizar la jerarquía.
- **Ej. 5:** el constructor usa los propios setters, así las validaciones también se aplican al crear la persona.
