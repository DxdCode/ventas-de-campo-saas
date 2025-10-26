import "reflect-metadata";
import { connectToDatabase } from "config";
import express from "express";
import authRoutes from "@interfaces/routes/auth/auth.routes";
import adminRoutes from "@interfaces/routes/admin/admin.routes";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

const allowedOrigins =
  process.env.NODE_ENV === "production"
    ? ["https://localhost:3000.com"]
    : [
        "http://127.0.0.1:5500",
        "http://10.0.2.2:5173",
      ];

app.use(
  cors({
    origin: allowedOrigins,
  })
);

app.use(express.json());

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.json({
    message: "Servidor activo y conectado a la base de datos",
  });
});

// Rutas principales
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);

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
