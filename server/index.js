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
import rotasPublicas from "./routes/rotasPublicas.js";
import rotasAutenticacao from "./routes/rotasAutenticacao.js";
import rotasAdmin from "./routes/rotasAdmin.js";

const app = express();
const port = Number(process.env.PORT) || 3002;

function normalizeOrigin(origin) {
  return origin.replace(/\/+$/, "").toLowerCase();
}

function getAllowedCorsOrigins() {
  const configuredOrigins = process.env.CORS_ORIGIN?.split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

  if (configuredOrigins?.length) {
    return configuredOrigins.map(normalizeOrigin);
  }

  return [
    "http://localhost:5174",
    "http://127.0.0.1:5174",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
  ].map(normalizeOrigin);
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

      callback(new Error("Origem não permitida pelo CORS."));
    },
  };
}

getRequiredEnv("JWT_SECRET");

app.disable("x-powered-by");
app.use(cors(buildCorsOptions()));
app.use(express.json({ limit: "10mb" }));
app.use("/uploads", express.static(VEHICLE_UPLOADS_ROOT_DIR));
app.use("/api", rotasPublicas);
app.use("/api", rotasAutenticacao);
app.use("/api", rotasAdmin);

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
