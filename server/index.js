import "dotenv/config";
import express from "express";
import cors from "cors";
import { pool } from "./db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { authenticateAdmin } from "./middleware/authenticateAdmin.js";
import {
  getVehiclePayloadError,
  getVehicleValues,
  normalizeVehiclePayload,
  VEHICLE_INSERT_COLUMNS_SQL,
  VEHICLE_INSERT_PLACEHOLDERS_SQL,
  VEHICLE_SELECT_ORDER_QUERY,
  VEHICLE_UPDATE_ASSIGNMENTS_SQL,
} from "./lib/vehiclePayload.js";
import {
  ensureVehicleUploadDirectory,
  LEGACY_VEHICLE_UPLOADS_ROOT_DIR,
  saveVehicleImageUpload,
  VehicleImageUploadValidationError,
  VEHICLE_UPLOADS_ROOT_DIR,
} from "./lib/vehicleImageUpload.js";

const app = express();
const port = Number(process.env.PORT) || 3001;
const AUTH_TOKEN_DURATION = "1d";

app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use("/uploads", express.static(VEHICLE_UPLOADS_ROOT_DIR));
app.use("/uploads", express.static(LEGACY_VEHICLE_UPLOADS_ROOT_DIR));

function buildAdminSessionUser(admin) {
  return {
    id: admin.id,
    nome: admin.username,
    username: admin.username,
    email: "",
    role: "admin",
  };
}

function buildRegularSessionUser(user) {
  return {
    id: user.id,
    nome: user.nome,
    username: user.username,
    email: user.email,
    role: "user",
  };
}

function createAuthResponse(user) {
  const token = jwt.sign(
    {
      userId: user.id,
      username: user.username,
      role: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: AUTH_TOKEN_DURATION },
  );

  return {
    ok: true,
    token,
    user,
  };
}

function sendServerError(res, logMessage, clientMessage, error) {
  console.error(`${logMessage}:`, error.message);
  return res.status(500).json({ message: clientMessage });
}

async function fetchRows(query, params = []) {
  const [rows] = await pool.query(query, params);
  return rows;
}

async function fetchFirstRow(query, params = []) {
  const rows = await fetchRows(query, params);
  return rows[0] ?? null;
}

async function ensureTableColumn(tableName, columnName, columnDefinitionSql) {
  const columns = await fetchRows(`SHOW COLUMNS FROM ${tableName} LIKE ?`, [
    columnName,
  ]);

  if (!columns.length) {
    await pool.query(`
      ALTER TABLE ${tableName}
      ADD COLUMN ${columnDefinitionSql}
    `);
  }
}

function buildOrderedTableQuery(tableName, columns = "*") {
  return `
    SELECT ${columns}
    FROM ${tableName}
    ORDER BY created_at DESC, id DESC
  `;
}

function registerAdminListRoute(path, query, logMessage, clientMessage) {
  app.get(path, authenticateAdmin, async (_req, res) => {
    try {
      return res.json(await fetchRows(query));
    } catch (error) {
      return sendServerError(res, logMessage, clientMessage, error);
    }
  });
}

function registerAdminDeleteRoute(
  path,
  tableName,
  notFoundMessage,
  successMessage,
  logMessage,
  clientMessage,
) {
  app.delete(path, authenticateAdmin, async (req, res) => {
    try {
      const existingRecord = await fetchFirstRow(
        `SELECT id FROM ${tableName} WHERE id = ?`,
        [req.params.id],
      );

      if (!existingRecord) {
        return res.status(404).json({ message: notFoundMessage });
      }

      await pool.query(`DELETE FROM ${tableName} WHERE id = ?`, [req.params.id]);

      return res.json({ ok: true, message: successMessage });
    } catch (error) {
      return sendServerError(res, logMessage, clientMessage, error);
    }
  });
}

async function ensureAuthTables() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS admins (
      id INT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(100) NOT NULL UNIQUE,
      password_hash VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      nome VARCHAR(150) NOT NULL,
      username VARCHAR(100) NOT NULL UNIQUE,
      email VARCHAR(150) NOT NULL UNIQUE,
      password_hash VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
}

async function ensureLeadTables() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS test_drives (
      id INT AUTO_INCREMENT PRIMARY KEY,
      vehicle_slug VARCHAR(190) NOT NULL,
      vehicle_label VARCHAR(200) DEFAULT NULL,
      data_preferida DATE NOT NULL,
      hora_preferida VARCHAR(40) NOT NULL,
      nome VARCHAR(150) NOT NULL,
      telefone VARCHAR(60) NOT NULL,
      email VARCHAR(150) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await ensureTableColumn(
    "test_drives",
    "vehicle_label",
    "vehicle_label VARCHAR(200) DEFAULT NULL AFTER vehicle_slug",
  );

  await pool.query(`
    CREATE TABLE IF NOT EXISTS contact_messages (
      id INT AUTO_INCREMENT PRIMARY KEY,
      nome VARCHAR(150) NOT NULL,
      email VARCHAR(150) NOT NULL,
      telefone VARCHAR(60) DEFAULT '',
      assunto VARCHAR(160) NOT NULL,
      mensagem TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS trade_in_requests (
      id INT AUTO_INCREMENT PRIMARY KEY,
      marca VARCHAR(120) NOT NULL,
      modelo VARCHAR(120) NOT NULL,
      ano INT NOT NULL,
      quilometragem INT NOT NULL,
      estado_geral VARCHAR(60) NOT NULL,
      nome VARCHAR(150) NOT NULL,
      telefone VARCHAR(60) NOT NULL,
      email VARCHAR(150) NOT NULL,
      observacoes TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    `);

  await ensureTableColumn(
    "trade_in_requests",
    "is_viewed",
    "is_viewed TINYINT(1) NOT NULL DEFAULT 0",
  );

  await pool.query(`
    CREATE TABLE IF NOT EXISTS finance_requests (
      id INT AUTO_INCREMENT PRIMARY KEY,
      nome VARCHAR(150) NOT NULL,
      email VARCHAR(150) NOT NULL,
      telefone VARCHAR(60) NOT NULL,
      viatura VARCHAR(200) DEFAULT NULL,
      preco DECIMAL(12, 2) NOT NULL,
      entrada DECIMAL(12, 2) NOT NULL,
      meses INT NOT NULL,
      taxa DECIMAL(5, 2) NOT NULL,
      prestacao_mensal DECIMAL(12, 2) NOT NULL,
      montante_total DECIMAL(12, 2) NOT NULL,
      taeg DECIMAL(5, 2) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
}

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

app.get("/api/vehicles", async (_req, res) => {
  try {
    res.json(await fetchRows(VEHICLE_SELECT_ORDER_QUERY));
  } catch (error) {
    sendServerError(res, "Erro ao buscar viaturas", "Erro ao buscar viaturas.", error);
  }
});

app.post("/api/test-drives", async (req, res) => {
  try {
    const {
      vehicleSlug,
      vehicleLabel,
      dataPreferida,
      horaPreferida,
      nome,
      telefone,
      email,
    } = req.body;

    if (
      !vehicleSlug ||
      !dataPreferida ||
      !horaPreferida ||
      !nome ||
      !telefone ||
      !email
    ) {
      return res.status(400).json({ message: "Campos em falta." });
    }

    await pool.query(
      `INSERT INTO test_drives (
        vehicle_slug,
        vehicle_label,
        data_preferida,
        hora_preferida,
        nome,
        telefone,
        email
      ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        vehicleSlug,
        vehicleLabel?.trim() || null,
        dataPreferida,
        horaPreferida,
        nome,
        telefone,
        email,
      ],
    );

    return res.status(201).json({ ok: true });
  } catch (error) {
    console.error("Erro ao guardar teste drive:", error.message);
    return res.status(500).json({ message: "Erro ao guardar teste drive." });
  }
});

app.post("/api/contact", async (req, res) => {
  try {
    const { nome, email, telefone, assunto, mensagem } = req.body;

    if (!nome || !email || !assunto || !mensagem) {
      return res.status(400).json({ message: "Campos em falta." });
    }

    await pool.query(
      `INSERT INTO contact_messages (nome, email, telefone, assunto, mensagem)
       VALUES (?, ?, ?, ?, ?)`,
      [nome, email, telefone, assunto, mensagem],
    );

    return res.status(201).json({ ok: true });
  } catch (error) {
    console.error("Erro ao guardar contacto:", error.message);
    return res.status(500).json({ message: "Erro ao guardar contacto." });
  }
});

app.post("/api/trade-ins", async (req, res) => {
  try {
    const marca = req.body.marca?.trim();
    const modelo = req.body.modelo?.trim();
    const estadoGeral = req.body.estado?.trim();
    const nome = req.body.nome?.trim();
    const telefone = req.body.telefone?.trim();
    const email = req.body.email?.trim().toLowerCase();
    const observacoes = req.body.observacoes?.trim() ?? "";
    const ano = Number(req.body.ano);
    const quilometragem = Number(req.body.quilometragem);
    const currentYear = new Date().getFullYear();

    if (
      !marca ||
      !modelo ||
      !estadoGeral ||
      !nome ||
      !telefone ||
      !email ||
      !Number.isInteger(ano) ||
      !Number.isInteger(quilometragem)
    ) {
      return res.status(400).json({ message: "Campos em falta." });
    }

    if (ano < 1900 || ano > currentYear) {
      return res.status(400).json({ message: "Ano invalido." });
    }

    if (quilometragem < 0) {
      return res.status(400).json({ message: "Quilometragem invalida." });
    }

    await pool.query(
      `INSERT INTO trade_in_requests (
        marca,
        modelo,
        ano,
        quilometragem,
        estado_geral,
        nome,
        telefone,
        email,
        observacoes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        marca,
        modelo,
        ano,
        quilometragem,
        estadoGeral,
        nome,
        telefone,
        email,
        observacoes || null,
      ],
    );

    return res.status(201).json({ ok: true });
  } catch (error) {
    console.error("Erro ao guardar pedido de retoma:", error.message);
    return res.status(500).json({ message: "Erro ao guardar pedido de retoma." });
  }
});

app.post("/api/finance-requests", async (req, res) => {
  try {
    const nome = req.body.nome?.trim();
    const email = req.body.email?.trim().toLowerCase();
    const telefone = req.body.telefone?.trim();
    const viatura = req.body.viatura?.trim() ?? "";
    const preco = Number(req.body.preco);
    const entrada = Number(req.body.entrada);
    const meses = Number(req.body.meses);
    const taxa = Number(req.body.taxa);
    const prestacaoMensal = Number(req.body.prestacaoMensal);
    const montanteTotal = Number(req.body.montanteTotal);
    const taeg = Number(req.body.taeg);

    if (!nome || !email || !telefone) {
      return res.status(400).json({ message: "Campos em falta." });
    }

    if (
      !Number.isFinite(preco) ||
      !Number.isFinite(entrada) ||
      !Number.isInteger(meses) ||
      !Number.isFinite(taxa) ||
      !Number.isFinite(prestacaoMensal) ||
      !Number.isFinite(montanteTotal) ||
      !Number.isFinite(taeg)
    ) {
      return res.status(400).json({ message: "Dados de simulacao invalidos." });
    }

    await pool.query(
      `INSERT INTO finance_requests (
        nome,
        email,
        telefone,
        viatura,
        preco,
        entrada,
        meses,
        taxa,
        prestacao_mensal,
        montante_total,
        taeg
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        nome,
        email,
        telefone,
        viatura || null,
        preco,
        entrada,
        meses,
        taxa,
        prestacaoMensal,
        montanteTotal,
        taeg,
      ],
    );

    return res.status(201).json({ ok: true });
  } catch (error) {
    console.error("Erro ao guardar pedido de financiamento:", error.message);
    return res
      .status(500)
      .json({ message: "Erro ao guardar pedido de financiamento." });
  }
});

app.post("/api/auth/register", async (req, res) => {
  try {
    const { nome, username, email, password } = req.body;
    const normalizedUsername = username?.trim();
    const normalizedEmail = email?.trim().toLowerCase();

    if (!nome || !normalizedUsername || !normalizedEmail || !password) {
      return res.status(400).json({ message: "Campos em falta." });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "A password deve ter pelo menos 6 caracteres." });
    }

    const existingUser = await fetchFirstRow(
      "SELECT id FROM users WHERE username = ? OR email = ? LIMIT 1",
      [normalizedUsername, normalizedEmail],
    );

    if (existingUser) {
      return res
        .status(409)
        .json({ message: "Ja existe uma conta com esses dados." });
    }

    const existingAdmin = await fetchFirstRow(
      "SELECT id FROM admins WHERE username = ? LIMIT 1",
      [normalizedUsername],
    );

    if (existingAdmin) {
      return res
        .status(409)
        .json({ message: "Esse username nao esta disponivel." });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const [result] = await pool.query(
      `INSERT INTO users (nome, username, email, password_hash)
       VALUES (?, ?, ?, ?)`,
      [nome.trim(), normalizedUsername, normalizedEmail, passwordHash],
    );

    const user = await fetchFirstRow(
      "SELECT id, nome, username, email FROM users WHERE id = ?",
      [result.insertId],
    );

    return res.status(201).json(createAuthResponse(buildRegularSessionUser(user)));
  } catch (error) {
    return sendServerError(res, "Erro no registo", "Erro no registo.", error);
  }
});

app.post("/api/auth/login", async (req, res) => {
  try {
    const identifier = req.body.identifier?.trim() ?? req.body.username?.trim();
    const { password } = req.body;
    const normalizedEmailIdentifier = identifier?.toLowerCase();

    if (!identifier || !password) {
      return res.status(400).json({ message: "Credenciais em falta." });
    }

    const admin = await fetchFirstRow(
      "SELECT * FROM admins WHERE username = ? LIMIT 1",
      [identifier],
    );

    if (admin) {
      const passwordMatch = await bcrypt.compare(password, admin.password_hash);

      if (!passwordMatch) {
        return res.status(401).json({ message: "Credenciais invalidas." });
      }

      return res.json(createAuthResponse(buildAdminSessionUser(admin)));
    }

    const user = await fetchFirstRow(
      "SELECT * FROM users WHERE username = ? OR email = ? LIMIT 1",
      [identifier, normalizedEmailIdentifier],
    );

    if (!user) {
      return res.status(401).json({ message: "Credenciais invalidas." });
    }

    const passwordMatch = await bcrypt.compare(password, user.password_hash);

    if (!passwordMatch) {
      return res.status(401).json({ message: "Credenciais invalidas." });
    }

    return res.json(createAuthResponse(buildRegularSessionUser(user)));
  } catch (error) {
    return sendServerError(res, "Erro no login", "Erro no login.", error);
  }
});

app.post("/api/admin/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "Credenciais em falta." });
    }

    const admin = await fetchFirstRow(
      "SELECT * FROM admins WHERE username = ? LIMIT 1",
      [username],
    );

    if (!admin) {
      return res.status(401).json({ message: "Credenciais invalidas." });
    }

    const passwordMatch = await bcrypt.compare(password, admin.password_hash);

    if (!passwordMatch) {
      return res.status(401).json({ message: "Credenciais invalidas." });
    }

    return res.json(createAuthResponse(buildAdminSessionUser(admin)));
  } catch (error) {
    return sendServerError(res, "Erro no login admin", "Erro no login.", error);
  }
});

app.post("/api/admin/uploads/vehicle-image", authenticateAdmin, async (req, res) => {
  try {
    const uploadedImage = await saveVehicleImageUpload(req.body);

    return res.status(201).json(uploadedImage);
  } catch (error) {
    if (error instanceof VehicleImageUploadValidationError) {
      return res.status(400).json({ message: error.message });
    }

    console.error("Erro ao carregar imagem da viatura:", error.message);
    return res.status(500).json({ message: "Erro ao carregar imagem." });
  }
});

registerAdminListRoute(
  "/api/admin/vehicles",
  VEHICLE_SELECT_ORDER_QUERY,
  "Erro ao buscar viaturas do admin",
  "Erro ao buscar viaturas.",
);

registerAdminListRoute(
  "/api/admin/trade-ins",
  buildOrderedTableQuery("trade_in_requests"),
  "Erro ao buscar pedidos de retoma",
  "Erro ao buscar pedidos de retoma.",
);

registerAdminListRoute(
  "/api/admin/test-drives",
  buildOrderedTableQuery("test_drives"),
  "Erro ao buscar pedidos de test drive",
  "Erro ao buscar pedidos de test drive.",
);

app.patch("/api/admin/trade-ins/:id", authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const isViewed = req.body.isViewed;

    if (typeof isViewed !== "boolean") {
      return res.status(400).json({ message: "Estado de leitura invalido." });
    }

    const existingTradeIn = await fetchFirstRow(
      "SELECT * FROM trade_in_requests WHERE id = ?",
      [id],
    );

    if (!existingTradeIn) {
      return res.status(404).json({ message: "Pedido de retoma nao encontrado." });
    }

    await pool.query(
      `UPDATE trade_in_requests
       SET is_viewed = ?
       WHERE id = ?`,
      [Number(isViewed), id],
    );

    const updatedTradeIn = await fetchFirstRow(
      "SELECT * FROM trade_in_requests WHERE id = ?",
      [id],
    );

    return res.json(updatedTradeIn);
  } catch (error) {
    return sendServerError(
      res,
      "Erro ao atualizar pedido de retoma",
      "Erro ao atualizar pedido de retoma.",
      error,
    );
  }
});

registerAdminListRoute(
  "/api/admin/contact-messages",
  buildOrderedTableQuery("contact_messages"),
  "Erro ao buscar mensagens de contacto",
  "Erro ao buscar mensagens de contacto.",
);

registerAdminListRoute(
  "/api/admin/finance-requests",
  buildOrderedTableQuery("finance_requests"),
  "Erro ao buscar pedidos de financiamento",
  "Erro ao buscar pedidos de financiamento.",
);

registerAdminListRoute(
  "/api/admin/users",
  buildOrderedTableQuery("users", "id, nome, username, email, created_at"),
  "Erro ao buscar utilizadores",
  "Erro ao buscar utilizadores.",
);

registerAdminDeleteRoute(
  "/api/admin/contact-messages/:id",
  "contact_messages",
  "Mensagem de contacto nao encontrada.",
  "Mensagem eliminada com sucesso.",
  "Erro ao eliminar mensagem de contacto",
  "Erro ao eliminar mensagem de contacto.",
);

registerAdminDeleteRoute(
  "/api/admin/finance-requests/:id",
  "finance_requests",
  "Pedido de financiamento nao encontrado.",
  "Pedido de financiamento eliminado com sucesso.",
  "Erro ao eliminar pedido de financiamento",
  "Erro ao eliminar pedido de financiamento.",
);

registerAdminDeleteRoute(
  "/api/admin/trade-ins/:id",
  "trade_in_requests",
  "Pedido de retoma nao encontrado.",
  "Pedido de retoma eliminado com sucesso.",
  "Erro ao eliminar pedido de retoma",
  "Erro ao eliminar pedido de retoma.",
);

registerAdminDeleteRoute(
  "/api/admin/test-drives/:id",
  "test_drives",
  "Pedido de test drive nao encontrado.",
  "Pedido de test drive eliminado com sucesso.",
  "Erro ao eliminar pedido de test drive",
  "Erro ao eliminar pedido de test drive.",
);

registerAdminDeleteRoute(
  "/api/admin/users/:id",
  "users",
  "Utilizador nao encontrado.",
  "Utilizador eliminado com sucesso.",
  "Erro ao eliminar utilizador",
  "Erro ao eliminar utilizador.",
);

app.get("/api/admin/vehicles/:id", authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const vehicle = await fetchFirstRow("SELECT * FROM vehicles WHERE id = ?", [id]);

    if (!vehicle) {
      return res.status(404).json({ message: "Viatura nao encontrada." });
    }

    return res.json(vehicle);
  } catch (error) {
    return sendServerError(
      res,
      "Erro ao buscar viatura do admin",
      "Erro ao buscar viatura.",
      error,
    );
  }
});

app.post("/api/admin/vehicles", authenticateAdmin, async (req, res) => {
  try {
    const vehicle = normalizeVehiclePayload(req.body);
    const vehiclePayloadError = getVehiclePayloadError(vehicle);

    if (vehiclePayloadError) {
      return res.status(400).json({ message: vehiclePayloadError });
    }

    const [result] = await pool.query(
      `INSERT INTO vehicles (
        ${VEHICLE_INSERT_COLUMNS_SQL}
      ) VALUES (${VEHICLE_INSERT_PLACEHOLDERS_SQL})`,
      getVehicleValues(vehicle),
    );

    const createdVehicle = await fetchFirstRow(
      "SELECT * FROM vehicles WHERE id = ?",
      [
      result.insertId,
      ],
    );

    return res.status(201).json(createdVehicle);
  } catch (error) {
    return sendServerError(res, "Erro ao criar viatura", "Erro ao criar viatura.", error);
  }
});

app.put("/api/admin/vehicles/:id", authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const vehicle = normalizeVehiclePayload(req.body);
    const vehiclePayloadError = getVehiclePayloadError(vehicle);

    if (vehiclePayloadError) {
      return res.status(400).json({ message: vehiclePayloadError });
    }

    const existingVehicle = await fetchFirstRow(
      "SELECT * FROM vehicles WHERE id = ?",
      [id],
    );

    if (!existingVehicle) {
      return res.status(404).json({ message: "Viatura nao encontrada." });
    }

    await pool.query(
      `UPDATE vehicles
       SET ${VEHICLE_UPDATE_ASSIGNMENTS_SQL}
       WHERE id = ?`,
      [...getVehicleValues(vehicle), id],
    );

    const updatedVehicle = await fetchFirstRow(
      "SELECT * FROM vehicles WHERE id = ?",
      [id],
    );

    return res.json(updatedVehicle);
  } catch (error) {
    return sendServerError(
      res,
      "Erro ao atualizar viatura",
      "Erro ao atualizar viatura.",
      error,
    );
  }
});

registerAdminDeleteRoute(
  "/api/admin/vehicles/:id",
  "vehicles",
  "Viatura nao encontrada.",
  "Viatura eliminada com sucesso.",
  "Erro ao eliminar viatura",
  "Erro ao eliminar viatura.",
);

Promise.all([
  ensureAuthTables(),
  ensureLeadTables(),
  ensureVehicleUploadDirectory(),
])
  .then(() => {
    app.listen(port, () => {
      console.log(`API ligada na porta ${port}`);
    });
  })
  .catch((error) => {
    console.error("Erro ao preparar a autenticacao:", error.message);
    process.exit(1);
  });
