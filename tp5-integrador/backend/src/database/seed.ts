import bcrypt from 'bcrypt';
import { PermissionModel } from '../models/Permission';
import { RoleModel, RoleName } from '../models/Role';
import { TicketModel } from '../models/Ticket';
import { UserModel } from '../models/User';
import { PERMISSIONS, PermissionName } from '../types/permissions';

/** Matriz de permisos por rol (sección RF2 de la consigna). */
const ROLE_PERMISSIONS: Record<RoleName, PermissionName[]> = {
  admin: Object.values(PERMISSIONS),
  operador: [
    PERMISSIONS.TICKET_READ,
    PERMISSIONS.TICKET_CREATE,
    PERMISSIONS.TICKET_UPDATE,
    PERMISSIONS.TICKET_CHANGE_STATUS,
    PERMISSIONS.SUBSCRIPTION_CREATE,
    PERMISSIONS.SUBSCRIPTION_DELETE,
    PERMISSIONS.NOTIFICATION_READ
  ],
  usuario: [
    PERMISSIONS.TICKET_READ,
    PERMISSIONS.SUBSCRIPTION_CREATE,
    PERMISSIONS.SUBSCRIPTION_DELETE,
    PERMISSIONS.NOTIFICATION_READ
  ]
};

const TEST_USERS: { name: string; email: string; password: string; role: RoleName }[] = [
  { name: 'Admin', email: 'admin@tp.com', password: 'Admin123!', role: 'admin' },
  { name: 'Operador', email: 'operador@tp.com', password: 'Operador123!', role: 'operador' },
  { name: 'Usuario', email: 'usuario@tp.com', password: 'Usuario123!', role: 'usuario' }
];

const SAMPLE_TICKETS = [
  { title: 'No funciona la impresora del 2° piso', description: 'La impresora muestra error de papel atascado.' },
  { title: 'Alta de cuenta de correo', description: 'Crear casilla de correo para el nuevo integrante de RRHH.' },
  { title: 'VPN se desconecta', description: 'La conexión VPN se corta cada 10 minutos desde casa.' }
];

/**
 * Seed idempotente: se puede ejecutar en cada arranque sin duplicar datos.
 * Permisos y roles se sincronizan; usuarios y tickets de prueba solo se crean si no existen.
 */
export async function runSeed(): Promise<void> {
  // 1. Permisos
  for (const name of Object.values(PERMISSIONS)) {
    await PermissionModel.updateOne({ name }, { $setOnInsert: { name } }, { upsert: true });
  }
  const permissions = await PermissionModel.find().lean<{ _id: unknown; name: string }[]>();
  const permissionIdByName = new Map(permissions.map((p) => [p.name, p._id]));

  // 2. Roles con sus permisos
  for (const [roleName, permissionNames] of Object.entries(ROLE_PERMISSIONS)) {
    await RoleModel.updateOne(
      { name: roleName },
      { name: roleName, permissions: permissionNames.map((name) => permissionIdByName.get(name)) },
      { upsert: true }
    );
  }

  // 3. Usuarios de prueba
  for (const testUser of TEST_USERS) {
    if (await UserModel.exists({ email: testUser.email })) continue;
    const role = await RoleModel.findOne({ name: testUser.role });
    await UserModel.create({
      name: testUser.name,
      email: testUser.email,
      passwordHash: await bcrypt.hash(testUser.password, 10),
      role: role?._id
    });
  }

  // 4. Tickets de ejemplo (solo si la colección está vacía)
  if ((await TicketModel.countDocuments()) === 0) {
    const operador = await UserModel.findOne({ email: 'operador@tp.com' });
    await TicketModel.insertMany(SAMPLE_TICKETS.map((ticket) => ({ ...ticket, createdBy: operador?._id })));
  }

  console.log('[SEED] Roles, permisos y usuarios de prueba listos');
}
