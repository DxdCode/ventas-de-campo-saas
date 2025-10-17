import "reflect-metadata";
import { DataSource } from "typeorm";
import dotenv from "dotenv";
import { entities } from "@domain/entities/index"; 
dotenv.config();

export const AppDataSource = new DataSource({
  type: "mysql",
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD ,
  database: process.env.DB_NAME,
  entities,
  synchronize: true,
  logging: false
});

export const connectToDatabase = async () => {
  try {
    if (AppDataSource.isInitialized) {
      return;
    }
    await AppDataSource.initialize();
    console.log("Conexión a la base de datos");
  } catch (error) {
    console.error("Error al conectar con la base de datos: ", error);
    throw error;
  }
};