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

const app = express();
const port = Number(process.env.PORT) || 3001;
const AUTH_TOKEN_DURATION = "1d";

app.use(cors());
app.use(express.json());

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

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

app.get("/api/vehicles", async (_req, res) => {
  try {
    const [rows] = await pool.query(VEHICLE_SELECT_ORDER_QUERY);

    res.json(rows);
  } catch (error) {
    console.error("Erro ao buscar viaturas:", error.message);
    res.status(500).json({ message: "Erro ao buscar viaturas." });
  }
});

app.post("/api/test-drives", async (req, res) => {
  try {
    const { vehicleSlug, dataPreferida, horaPreferida, nome, telefone, email } =
      req.body;

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
      `INSERT INTO test_drives (vehicle_slug, data_preferida, hora_preferida, nome, telefone, email)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [vehicleSlug, dataPreferida, horaPreferida, nome, telefone, email],
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

    const [existingUsers] = await pool.query(
      "SELECT id FROM users WHERE username = ? OR email = ? LIMIT 1",
      [normalizedUsername, normalizedEmail],
    );

    if (existingUsers.length) {
      return res
        .status(409)
        .json({ message: "Ja existe uma conta com esses dados." });
    }

    const [existingAdmins] = await pool.query(
      "SELECT id FROM admins WHERE username = ? LIMIT 1",
      [normalizedUsername],
    );

    if (existingAdmins.length) {
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

    const [rows] = await pool.query(
      "SELECT id, nome, username, email FROM users WHERE id = ?",
      [result.insertId],
    );

    return res.status(201).json(createAuthResponse(buildRegularSessionUser(rows[0])));
  } catch (error) {
    console.error("Erro no registo:", error.message);
    return res.status(500).json({ message: "Erro no registo." });
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

    const [adminRows] = await pool.query(
      "SELECT * FROM admins WHERE username = ? LIMIT 1",
      [identifier],
    );

    const admin = adminRows[0];

    if (admin) {
      const passwordMatch = await bcrypt.compare(password, admin.password_hash);

      if (!passwordMatch) {
        return res.status(401).json({ message: "Credenciais invalidas." });
      }

      return res.json(createAuthResponse(buildAdminSessionUser(admin)));
    }

    const [userRows] = await pool.query(
      "SELECT * FROM users WHERE username = ? OR email = ? LIMIT 1",
      [identifier, normalizedEmailIdentifier],
    );

    const user = userRows[0];

    if (!user) {
      return res.status(401).json({ message: "Credenciais invalidas." });
    }

    const passwordMatch = await bcrypt.compare(password, user.password_hash);

    if (!passwordMatch) {
      return res.status(401).json({ message: "Credenciais invalidas." });
    }

    return res.json(createAuthResponse(buildRegularSessionUser(user)));
  } catch (error) {
    console.error("Erro no login:", error.message);
    return res.status(500).json({ message: "Erro no login." });
  }
});

app.post("/api/admin/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "Credenciais em falta." });
    }

    const [rows] = await pool.query(
      "SELECT * FROM admins WHERE username = ? LIMIT 1",
      [username],
    );

    const admin = rows[0];

    if (!admin) {
      return res.status(401).json({ message: "Credenciais invalidas." });
    }

    const passwordMatch = await bcrypt.compare(password, admin.password_hash);

    if (!passwordMatch) {
      return res.status(401).json({ message: "Credenciais invalidas." });
    }

    return res.json(createAuthResponse(buildAdminSessionUser(admin)));
  } catch (error) {
    console.error("Erro no login admin:", error.message);
    return res.status(500).json({ message: "Erro no login." });
  }
});

app.get("/api/admin/vehicles", authenticateAdmin, async (_req, res) => {
  try {
    const [rows] = await pool.query(VEHICLE_SELECT_ORDER_QUERY);

    return res.json(rows);
  } catch (error) {
    console.error("Erro ao buscar viaturas do admin:", error.message);
    return res.status(500).json({ message: "Erro ao buscar viaturas." });
  }
});

app.get("/api/admin/vehicles/:id", authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query("SELECT * FROM vehicles WHERE id = ?", [id]);

    if (!rows.length) {
      return res.status(404).json({ message: "Viatura nao encontrada." });
    }

    return res.json(rows[0]);
  } catch (error) {
    console.error("Erro ao buscar viatura do admin:", error.message);
    return res.status(500).json({ message: "Erro ao buscar viatura." });
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

    const [rows] = await pool.query("SELECT * FROM vehicles WHERE id = ?", [
      result.insertId,
    ]);

    return res.status(201).json(rows[0]);
  } catch (error) {
    console.error("Erro ao criar viatura:", error.message);
    return res.status(500).json({ message: "Erro ao criar viatura." });
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

    const [existingRows] = await pool.query(
      "SELECT * FROM vehicles WHERE id = ?",
      [id],
    );

    if (!existingRows.length) {
      return res.status(404).json({ message: "Viatura nao encontrada." });
    }

    await pool.query(
      `UPDATE vehicles
       SET ${VEHICLE_UPDATE_ASSIGNMENTS_SQL}
       WHERE id = ?`,
      [...getVehicleValues(vehicle), id],
    );

    const [updatedRows] = await pool.query(
      "SELECT * FROM vehicles WHERE id = ?",
      [id],
    );

    return res.json(updatedRows[0]);
  } catch (error) {
    console.error("Erro ao atualizar viatura:", error.message);
    return res.status(500).json({ message: "Erro ao atualizar viatura." });
  }
});

app.delete("/api/admin/vehicles/:id", authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const [existingRows] = await pool.query(
      "SELECT * FROM vehicles WHERE id = ?",
      [id],
    );

    if (!existingRows.length) {
      return res.status(404).json({ message: "Viatura nao encontrada." });
    }

    await pool.query("DELETE FROM vehicles WHERE id = ?", [id]);

    return res.json({ ok: true, message: "Viatura eliminada com sucesso." });
  } catch (error) {
    console.error("Erro ao eliminar viatura:", error.message);
    return res.status(500).json({ message: "Erro ao eliminar viatura." });
  }
});

ensureAuthTables()
  .then(() => {
    app.listen(port, () => {
      console.log(`API ligada na porta ${port}`);
    });
  })
  .catch((error) => {
    console.error("Erro ao preparar a autenticacao:", error.message);
    process.exit(1);
  });
