# TP4 — Práctica SOLID: Empleados y Salarios (refactor)

Se partió del starter `empleados-solid-starter` (todo en un único `src/server.ts`) y se refactorizó
separando responsabilidades. **El comportamiento observable de la API se mantiene**: mismos endpoints,
mismos códigos de estado y mismos mensajes de error.

## Regla de negocio

**salario final = salario base + 2% del salario base por cada año de antigüedad**

Ejemplo: base 1.000.000, 5 años → adicional 10% → salario final 1.100.000.

## Problemas del diseño original

1. **Una sola pieza con todas las responsabilidades (viola SRP):** en `server.ts` convivían configuración,
   conexión a la base, esquema/modelo, validación, regla de negocio, acceso a datos, rutas y arranque.
2. **Regla de negocio acoplada a la ruta HTTP:** el cálculo del salario estaba dentro del handler de Express;
   no se podía reutilizar ni probar sin levantar el servidor.
3. **Dependencia directa de Mongoose en los handlers (viola DIP):** cambiar la base de datos obligaba
   a tocar las rutas.
4. **Manejo de errores repetido:** el mismo `try/catch` con `500` copiado en cada endpoint.
5. **Validación mezclada con el flujo del controlador.**
6. **Sin composition root:** los objetos no se podían reemplazar (por ejemplo, por dobles de prueba).

## Nueva estructura

```
src/
├── server.ts                        # arranque: conecta la base y levanta el servidor
├── app.ts                           # composition root: crea y conecta las dependencias
├── config/
│   ├── env.ts                       # variables de entorno
│   └── database.ts                  # conexión a MongoDB
├── models/
│   └── employee.model.ts            # esquema Mongoose + tipos Employee / CreateEmployeeDTO
├── repositories/
│   └── employee.repository.ts       # IEmployeeRepository + MongoEmployeeRepository
├── services/
│   ├── salary.calculator.ts         # ISalaryCalculator + regla de negocio del salario
│   └── employee.service.ts          # lógica de negocio (no conoce Express ni Mongoose)
├── controllers/
│   └── employee.controller.ts       # request → servicio → response
├── routes/
│   └── employee.routes.ts           # POST /, GET /, GET /:id
├── validators/
│   └── employee.validator.ts        # validación del body
├── errors/
│   └── AppError.ts                  # AppError, ValidationError (400), NotFoundError (404)
└── middlewares/
    └── errorHandler.ts              # manejo centralizado de errores
```

## SOLID aplicado

| Principio | Dónde |
|---|---|
| **S** | Cada archivo tiene una única razón de cambio (rutas, controlador, servicio, repositorio, validación, cálculo, errores). |
| **O** | Para cambiar la política salarial se crea otra clase que implemente `ISalaryCalculator`, sin modificar `EmployeeService`. |
| **L** | Cualquier implementación de `IEmployeeRepository` (Mongo, en memoria, fake de pruebas) puede reemplazar a otra. |
| **I** | Interfaces chicas y específicas: `IEmployeeRepository` (3 métodos) e `ISalaryCalculator` (1 método). |
| **D** | `EmployeeService` depende de las interfaces y las recibe por constructor; las implementaciones se eligen en `app.ts`. |

## Endpoints

| Método | Ruta | Respuesta |
|---|---|---|
| POST | `/employees` | `201` con el empleado creado (incluye `finalSalary`) · `400` si los datos son inválidos |
| GET | `/employees` | `200` con la lista, más recientes primero |
| GET | `/employees/:id` | `200` con el empleado · `404` si no existe |

## Cómo ejecutar

```bash
cp .env.example .env
docker compose up -d
npm install
npm run dev
```

Ejemplo:

```bash
curl -X POST http://localhost:3000/employees \
  -H "Content-Type: application/json" \
  -d '{"name":"Ana","position":"Dev","baseSalary":1000000,"yearsOfService":5}'
# → finalSalary: 1100000
```
