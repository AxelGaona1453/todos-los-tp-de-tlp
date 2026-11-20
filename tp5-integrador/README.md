# Mesa de Ayuda — TP Integrador TLP IV

**Dominio:** A — Mesa de ayuda (Ticket)
**Base de datos:** MongoDB + Mongoose
**Organización del backend:** Carpeta por tipo de archivo (Forma 1)

## Integrantes
- Gaona, Axel — AxelGaona1453
- Apellido, Nombre — usuario de GitHub
- Apellido, Nombre — usuario de GitHub

## Descripción
Aplicación web full stack para gestionar tickets de soporte. Los usuarios pueden ver tickets y suscribirse a ellos;
operadores y administradores los crean, editan y cambian de estado. Cada vez que un ticket cambia de estado, todos sus
suscriptores reciben una notificación in-app (con contador de no leídas) y se imprime una línea en la consola del backend.

## Requisitos previos
- Docker y Docker Compose
- Git
- (Opcional, para desarrollo local) Node.js 22 o superior (probado con Node 24)

## Cómo ejecutar el proyecto

1. Clonar el repositorio:
   ```bash
   git clone https://github.com/AxelGaona1453/todos-los-tp-de-tlp.git
   cd todos-los-tp-de-tlp/tp5-integrador
   ```
2. Crear el archivo de variables de entorno:
   ```bash
   cp .env.example .env
   ```
3. Levantar los servicios:
   ```bash
   docker compose up --build
   ```
4. El seed (permisos, roles, usuarios de prueba y algunos tickets de ejemplo) se ejecuta **automáticamente** al iniciar
   el backend y es idempotente (no duplica datos). Si se quisiera correr a mano:
   ```bash
   docker compose exec backend npm run seed:prod
   ```
5. Abrir la aplicación:
   - Frontend: http://localhost:5173
   - API: http://localhost:3000/api (chequeo: http://localhost:3000/api/health)

## Ejecución sin Docker (opcional)

Levantar solo MongoDB con Docker (o usar uno local):
```bash
docker compose up -d db
```

Backend (otra terminal):
```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

Frontend (otra terminal):
```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

## Variables de entorno

| Variable | Descripción | Ejemplo |
|---|---|---|
| `DB_HOST` | Host de la base de datos | `db` |
| `DB_PORT` | Puerto de la base de datos | `27017` |
| `DB_USER` | Usuario (root de MongoDB) | `tlp4` |
| `DB_PASSWORD` | Contraseña | `tlp4` |
| `DB_NAME` | Nombre de la base | `tp_integrador` |
| `JWT_SECRET` | Clave para firmar los tokens | `cambiar-esto` |
| `JWT_EXPIRES_IN` | Duración del token | `8h` |
| `API_PORT` | Puerto del backend | `3000` |
| `CORS_ORIGIN` | Origen permitido por CORS | `http://localhost:5173` |
| `FRONTEND_PORT` | Puerto donde se publica el frontend | `5173` |
| `VITE_API_URL` | URL de la API para el frontend | `http://localhost:3000/api` |

## Usuarios de prueba

| Rol | Email | Contraseña |
|---|---|---|
| admin | admin@tp.com | Admin123! |
| operador | operador@tp.com | Operador123! |
| usuario | usuario@tp.com | Usuario123! |

Todo usuario que se registra desde la app recibe el rol `usuario`. El admin puede cambiarle el rol desde **Usuarios**.

## Cómo probar el flujo de notificaciones
1. Ingresar como `usuario` y suscribirse a un ticket (botón **Suscribirme** en el detalle).
2. En otra ventana (o en incógnito), ingresar como `operador` y cambiar el estado de ese ticket.
3. Volver a la sesión de `usuario`: en menos de 5 segundos la campanita muestra el contador y la notificación aparece en la bandeja.
4. Verificar la notificación en la consola del backend:
   ```bash
   docker compose logs backend
   ```
   ```
   [NOTIFICACIÓN] Para: usuario@tp.com | Ticket #<id> "<título>" | Estado: ABIERTO → EN_PROGRESO
   ```

## Endpoints principales

Todos (salvo registro, login y health) requieren `Authorization: Bearer <token>`.
Sin token → `401`; sin el permiso → `403`.

| Método | Ruta | Permiso requerido |
|---|---|---|
| POST | /api/auth/register | — |
| POST | /api/auth/login | — |
| GET | /api/auth/me | (autenticado) |
| GET | /api/tickets | ticket:read |
| GET | /api/tickets/:id | ticket:read |
| POST | /api/tickets | ticket:create |
| PUT | /api/tickets/:id | ticket:update |
| PATCH | /api/tickets/:id/status | ticket:change-status |
| DELETE | /api/tickets/:id | ticket:delete |
| GET | /api/subscriptions | ticket:read (IDs de tickets a los que estoy suscripto) |
| POST | /api/subscriptions | subscription:create (body: `{ "ticketId": "..." }`) |
| DELETE | /api/subscriptions/:ticketId | subscription:delete |
| GET | /api/notifications | notification:read |
| GET | /api/notifications/unread-count | notification:read |
| PATCH | /api/notifications/:id/read | notification:read |
| PATCH | /api/notifications/read-all | notification:read |
| GET | /api/users | user:read |
| GET | /api/users/roles | user:assign-role |
| PATCH | /api/users/:id/role | user:assign-role (body: `{ "role": "operador" }`) |

## Patrones y principios SOLID
Ver [PATTERNS.md](./PATTERNS.md).
