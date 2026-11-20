import { env } from '../config/env';
import { DatabaseConnection } from './DatabaseConnection';
import { runSeed } from './seed';

/** Ejecución manual del seed: `npm run seed` (el backend también lo corre al iniciar). */
async function run(): Promise<void> {
  const database = DatabaseConnection.getInstance();
  await database.connect(env.mongoUri);
  await runSeed();
  await database.disconnect();
}

run().catch((error) => {
  console.error('[SEED] Error', error);
  process.exit(1);
});
