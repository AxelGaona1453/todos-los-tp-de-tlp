import mongoose, { Connection } from 'mongoose';

/**
 * Singleton: encapsula la conexión de Mongoose.
 * El constructor es privado y la única forma de obtener el objeto es getInstance(),
 * así toda la aplicación comparte una única conexión a la base de datos.
 * Todos los modelos se registran sobre getConnection().
 */
export class DatabaseConnection {
  private static instance: DatabaseConnection | null = null;
  private readonly connection: Connection;

  private constructor() {
    this.connection = mongoose.connection;
  }

  static getInstance(): DatabaseConnection {
    if (DatabaseConnection.instance === null) {
      DatabaseConnection.instance = new DatabaseConnection();
    }
    return DatabaseConnection.instance;
  }

  async connect(uri: string): Promise<void> {
    if (this.connection.readyState === 1) return;
    await mongoose.connect(uri);
    console.log('[DB] MongoDB conectado');
  }

  async disconnect(): Promise<void> {
    await mongoose.disconnect();
  }

  getConnection(): Connection {
    return this.connection;
  }
}
