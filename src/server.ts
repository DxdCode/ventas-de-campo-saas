import "reflect-metadata"; 
import { connectToDatabase } from "config";
import express from "express";
import authRoutes from "@interfaces/routes/auth/auth.routes";
const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.json({ 
    message: "Servidor activo y conectado a la base de datos",
  });
});

app.use("/api/auth",authRoutes)

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