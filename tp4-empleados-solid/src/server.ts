import { createApp } from './app';
import { connectDatabase } from './config/database';
import { env } from './config/env';

async function bootstrap() {
  try {
    await connectDatabase(env.mongoUri);
    const app = createApp();
    app.listen(env.port, () => {
      console.log(`Servidor escuchando en http://localhost:${env.port}`);
    });
  } catch (error) {
    console.error('No se pudo conectar a MongoDB', error);
    process.exit(1);
  }
}

bootstrap();
