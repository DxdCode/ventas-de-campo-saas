import "reflect-metadata"; 
import { connectToDatabase } from "config";
import express from "express";
const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.json({ 
    message: "Servidor activo y conectado a la base de datos",
    timestamp: new Date().toISOString()
  });
});

const startServer = async () => {
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