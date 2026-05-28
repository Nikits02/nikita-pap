import express from "express";
import { pool } from "../ligacaoBaseDados.js";
import { sendServerError } from "../lib/respostasHttp.js";
import {
  hasMissingFields,
  normalizeEmail,
  normalizeText,
  REQUIRED_FIELDS_MESSAGE,
  validateContactIdentity,
} from "./publicRouteHelpers.js";

const router = express.Router();

router.post("/contact", async (req, res) => {
  try {
    const nome = normalizeText(req.body.nome);
    const email = normalizeEmail(req.body.email);
    const telefone = normalizeText(req.body.telefone);
    const assunto = normalizeText(req.body.assunto);
    const mensagem = normalizeText(req.body.mensagem);

    if (hasMissingFields([nome, email, assunto, mensagem])) {
      return res.status(400).json({ message: REQUIRED_FIELDS_MESSAGE });
    }

    const identityError = validateContactIdentity(res, {
      email,
      telefone,
      telefoneObrigatorio: false,
    });

    if (identityError) {
      return identityError;
    }

    await pool.query(
      `INSERT INTO contact_messages (nome, email, telefone, assunto, mensagem)
       VALUES (?, ?, ?, ?, ?)`,
      [nome, email, telefone, assunto, mensagem],
    );

    return res.status(201).json({ ok: true });
  } catch (error) {
    return sendServerError(
      res,
      "Erro ao guardar contacto",
      "Erro ao guardar contacto.",
      error,
    );
  }
});

export default router;
