
import { connectToDatabase } from './config';
import express from 'express'

// Crear la aplicación Express
const app = express()

// Middleware para usar JSON
app.use(express.json())

// Puerto
const PORT = process.env.PORT || 3000;

// Ejemplo de ruta
app.get("/", (req, res) => {
  res.send("Servidor activo y conectado a la base de datos");
});

// Verificamos
export const startServer = async () => {
  try {
    await connectToDatabase();

    app.listen(PORT, () => {
      console.log(`Servidor corriendo en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Error al iniciar el servidor:", error);
    process.exit(1);
  }
};

startServer();