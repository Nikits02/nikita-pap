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

const MAX_TRADE_IN_MILEAGE = 150000;
const MAX_TRADE_IN_MILEAGE_MESSAGE =
  "Só aceitamos veículos até 150 000 km.";

router.post("/trade-ins", async (req, res) => {
  try {
    const marca = normalizeText(req.body.marca);
    const modelo = normalizeText(req.body.modelo);
    const estadoGeral = normalizeText(req.body.estado);
    const nome = normalizeText(req.body.nome);
    const telefone = normalizeText(req.body.telefone);
    const email = normalizeEmail(req.body.email);
    const observacoes = normalizeText(req.body.observacoes);
    const ano = Number(req.body.ano);
    const quilometragem = Number(req.body.quilometragem);
    const currentYear = new Date().getFullYear();

    if (
      hasMissingFields([marca, modelo, estadoGeral, nome, telefone, email]) ||
      !Number.isInteger(ano) ||
      !Number.isInteger(quilometragem)
    ) {
      return res.status(400).json({ message: REQUIRED_FIELDS_MESSAGE });
    }

    const identityError = validateContactIdentity(res, { email, telefone });

    if (identityError) {
      return identityError;
    }

    if (ano < 1900 || ano > currentYear) {
      return res.status(400).json({ message: "Ano inválido." });
    }

    if (quilometragem < 0) {
      return res.status(400).json({ message: "Quilometragem inválida." });
    }

    if (quilometragem > MAX_TRADE_IN_MILEAGE) {
      return res.status(400).json({ message: MAX_TRADE_IN_MILEAGE_MESSAGE });
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
    return sendServerError(
      res,
      "Erro ao guardar pedido de retoma",
      "Erro ao guardar pedido de retoma.",
      error,
    );
  }
});

export default router;
