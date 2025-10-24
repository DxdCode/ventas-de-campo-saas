import "reflect-metadata"; 
import { connectToDatabase } from "config";
import express from "express";
import authRoutes from "@interfaces/routes/auth/auth.routes";
import adminRoutes from "@interfaces/routes/admin/admin.routes";
import cors from 'cors'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'
dotenv.config(); 

const app = express();
const allowedOrigins = process.env.NODE_ENV === 'production' ? ['https://yourfrontenddomain.com'] : ['http://127.0.0.1:5500']; 

app.use(cors({
    origin: allowedOrigins,
    credentials: true,
}));


app.use(express.json());
app.use(cookieParser());

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.json({ 
    message: "Servidor activo y conectado a la base de datos",
  });
});

app.use("/api/auth",authRoutes)
app.use("/api/admin",adminRoutes)
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