import express from "express";
import bcrypt from "bcryptjs";
import { pool } from "../db.js";
import {
  buildAdminSessionUser,
  buildAuthResponseBody,
  buildRegularSessionUser,
  clearAuthCookie,
  createAuthSuccess,
} from "../lib/auth.js";
import { fetchFirstRow } from "../lib/dbQueries.js";
import { sendServerError } from "../lib/http.js";
import { isValidEmail } from "../lib/validation.js";
import { authenticateRequest } from "../middleware/authenticateRequest.js";
import {
  authRateLimit,
  clearAuthAttempts,
  registerAuthAttempt,
} from "../middleware/authRateLimit.js";

const router = express.Router();

function rejectAuthRequest(req, res, status, message) {
  registerAuthAttempt(req);
  return res.status(status).json({ message });
}

function sendAuthSuccess(req, res, user, status) {
  const response = createAuthSuccess(res, user);
  clearAuthAttempts(req);
  return status ? res.status(status).json(response) : res.json(response);
}

router.get("/auth/session", authenticateRequest, async (req, res) => {
  try {
    if (req.auth.role === "admin") {
      const admin = await fetchFirstRow(
        "SELECT id, username FROM admins WHERE id = ? LIMIT 1",
        [req.auth.userId],
      );

      if (!admin) {
        return res.status(401).json({ message: "Nao autorizado." });
      }

      return res.json({
        ...buildAuthResponseBody(buildAdminSessionUser(admin)),
      });
    }

    const user = await fetchFirstRow(
      "SELECT id, nome, username, email FROM users WHERE id = ? LIMIT 1",
      [req.auth.userId],
    );

    if (!user) {
      return res.status(401).json({ message: "Nao autorizado." });
    }

    return res.json({
      ...buildAuthResponseBody(buildRegularSessionUser(user)),
    });
  } catch (error) {
    return sendServerError(
      res,
      "Erro ao validar sessao",
      "Erro ao validar sessao.",
      error,
    );
  }
});

router.post("/auth/logout", (_req, res) => {
  clearAuthCookie(res);
  return res.json({ ok: true });
});

router.post("/auth/register", authRateLimit, async (req, res) => {
  try {
    const { nome, username, email, password } = req.body;
    const normalizedUsername = username?.trim();
    const normalizedEmail = email?.trim().toLowerCase();

    if (!nome || !normalizedUsername || !normalizedEmail || !password) {
      return rejectAuthRequest(req, res, 400, "Campos em falta.");
    }

    if (password.length < 6) {
      return rejectAuthRequest(
        req,
        res,
        400,
        "A password deve ter pelo menos 6 caracteres.",
      );
    }

    if (!isValidEmail(normalizedEmail)) {
      return rejectAuthRequest(req, res, 400, "Email invalido.");
    }

    const existingUser = await fetchFirstRow(
      "SELECT id FROM users WHERE username = ? OR email = ? LIMIT 1",
      [normalizedUsername, normalizedEmail],
    );

    if (existingUser) {
      return rejectAuthRequest(
        req,
        res,
        409,
        "Ja existe uma conta com esses dados.",
      );
    }

    const existingAdmin = await fetchFirstRow(
      "SELECT id FROM admins WHERE username = ? LIMIT 1",
      [normalizedUsername],
    );

    if (existingAdmin) {
      return rejectAuthRequest(
        req,
        res,
        409,
        "Esse username nao esta disponivel.",
      );
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

    return sendAuthSuccess(req, res, buildRegularSessionUser(user), 201);
  } catch (error) {
    return sendServerError(res, "Erro no registo", "Erro no registo.", error);
  }
});

router.post("/auth/login", authRateLimit, async (req, res) => {
  try {
    const identifier = req.body.identifier?.trim() ?? req.body.username?.trim();
    const { password } = req.body;
    const normalizedEmailIdentifier = identifier?.toLowerCase();

    if (!identifier || !password) {
      return rejectAuthRequest(req, res, 400, "Credenciais em falta.");
    }

    const admin = await fetchFirstRow(
      "SELECT * FROM admins WHERE username = ? LIMIT 1",
      [identifier],
    );

    if (admin) {
      const passwordMatch = await bcrypt.compare(password, admin.password_hash);

      if (!passwordMatch) {
        return rejectAuthRequest(req, res, 401, "Credenciais invalidas.");
      }

      return sendAuthSuccess(req, res, buildAdminSessionUser(admin));
    }

    const user = await fetchFirstRow(
      "SELECT * FROM users WHERE username = ? OR email = ? LIMIT 1",
      [identifier, normalizedEmailIdentifier],
    );

    if (!user) {
      return rejectAuthRequest(req, res, 401, "Credenciais invalidas.");
    }

    const passwordMatch = await bcrypt.compare(password, user.password_hash);

    if (!passwordMatch) {
      return rejectAuthRequest(req, res, 401, "Credenciais invalidas.");
    }

    return sendAuthSuccess(req, res, buildRegularSessionUser(user));
  } catch (error) {
    return sendServerError(res, "Erro no login", "Erro no login.", error);
  }
});

router.post("/admin/login", authRateLimit, async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return rejectAuthRequest(req, res, 400, "Credenciais em falta.");
    }

    const admin = await fetchFirstRow(
      "SELECT * FROM admins WHERE username = ? LIMIT 1",
      [username],
    );

    if (!admin) {
      return rejectAuthRequest(req, res, 401, "Credenciais invalidas.");
    }

    const passwordMatch = await bcrypt.compare(password, admin.password_hash);

    if (!passwordMatch) {
      return rejectAuthRequest(req, res, 401, "Credenciais invalidas.");
    }

    return sendAuthSuccess(req, res, buildAdminSessionUser(admin));
  } catch (error) {
    return sendServerError(res, "Erro no login admin", "Erro no login.", error);
  }
});

export default router;
