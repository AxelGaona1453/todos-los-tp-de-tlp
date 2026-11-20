import 'dotenv/config';

function required(name: string, fallback?: string): string {
  const value = process.env[name] ?? fallback;
  if (value === undefined || value === '') {
    throw new Error(`Falta la variable de entorno ${name}`);
  }
  return value;
}

const dbHost = required('DB_HOST', 'localhost');
const dbPort = required('DB_PORT', '27017');
const dbUser = process.env.DB_USER ?? '';
const dbPassword = process.env.DB_PASSWORD ?? '';
const dbName = required('DB_NAME', 'tp_integrador');

const credentials = dbUser ? `${encodeURIComponent(dbUser)}:${encodeURIComponent(dbPassword)}@` : '';
const authSource = dbUser ? '?authSource=admin' : '';

export const env = {
  apiPort: Number(required('API_PORT', '3000')),
  mongoUri: `mongodb://${credentials}${dbHost}:${dbPort}/${dbName}${authSource}`,
  jwtSecret: required('JWT_SECRET'),
  jwtExpiresIn: required('JWT_EXPIRES_IN', '8h'),
  corsOrigin: process.env.CORS_ORIGIN ?? '*'
};
