import "dotenv/config";
import express from "express";
import cors from "cors";
import {
  ensureAuthTables,
  ensureCatalogTables,
  ensureLeadTables,
} from "./lib/prepararBaseDados.js";
import { getRequiredEnv } from "./lib/variaveisAmbiente.js";
import {
  ensureVehicleUploadDirectory,
  VEHICLE_UPLOADS_ROOT_DIR,
} from "./lib/uploadImagemViatura.js";
import adminRoutes from "./routes/adminRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import financeRoutes from "./routes/financeRoutes.js";
import healthRoutes from "./routes/healthRoutes.js";
import testDriveRoutes from "./routes/testDriveRoutes.js";
import tradeInRoutes from "./routes/tradeInRoutes.js";
import vehicleRoutes from "./routes/vehicleRoutes.js";

const app = express();
const port = Number(process.env.PORT) || 3002;
const DEV_FRONTEND_HOSTS = new Set([
  "localhost",
  "127.0.0.1",
  "::1",
  "nikitamotors",
]);
const DEV_FRONTEND_PORTS = new Set(["5173", "5174", "5175"]);

function normalizeOrigin(origin) {
  return origin.replace(/\/+$/, "").toLowerCase();
}

function getDefaultCorsOrigins() {
  return [
    "http://localhost:5174",
    "http://127.0.0.1:5174",
    "http://nikitamotors:5174",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
  ];
}

function getAllowedCorsOrigins() {
  const configuredOrigins = process.env.CORS_ORIGIN?.split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
  const origins =
    configuredOrigins && configuredOrigins.length > 0
      ? configuredOrigins
      : getDefaultCorsOrigins();

  return [...new Set(origins)].map(normalizeOrigin);
}

function isLocalDevelopmentOrigin(origin) {
  if (process.env.NODE_ENV === "production") {
    return false;
  }

  try {
    const parsedOrigin = new URL(origin);

    return (
      parsedOrigin.protocol === "http:" &&
      DEV_FRONTEND_HOSTS.has(parsedOrigin.hostname.toLowerCase()) &&
      DEV_FRONTEND_PORTS.has(parsedOrigin.port)
    );
  } catch {
    return false;
  }
}

function buildCorsOptions() {
  const allowedOrigins = getAllowedCorsOrigins();

  return {
    credentials: true,
    origin(origin, callback) {
      if (!origin) {
        callback(null, true);
        return;
      }

      if (allowedOrigins.includes(normalizeOrigin(origin))) {
        callback(null, true);
        return;
      }

      if (isLocalDevelopmentOrigin(origin)) {
        callback(null, true);
        return;
      }

      console.warn(`Origem bloqueada pelo CORS: ${origin}`);
      callback(new Error("Origem não permitida pelo CORS."));
    },
  };
}

getRequiredEnv("JWT_SECRET");

app.disable("x-powered-by");
app.use(cors(buildCorsOptions()));
app.use(express.json({ limit: "10mb" }));
app.use("/uploads", express.static(VEHICLE_UPLOADS_ROOT_DIR));
app.use("/api", healthRoutes);
app.use("/api", vehicleRoutes);
app.use("/api", contactRoutes);
app.use("/api", financeRoutes);
app.use("/api", testDriveRoutes);
app.use("/api", tradeInRoutes);
app.use("/api", authRoutes);
app.use("/api", adminRoutes);

Promise.all([
  ensureAuthTables(),
  ensureCatalogTables(),
  ensureLeadTables(),
  ensureVehicleUploadDirectory(),
])
  .then(() => {
    app.listen(port, () => {
      console.log(`API ligada na porta ${port}`);
    });
  })
  .catch((error) => {
    console.error("Erro ao preparar a autenticação:", error.message);
    process.exit(1);
  });
