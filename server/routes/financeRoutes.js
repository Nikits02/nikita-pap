import express from "express";
import { pool } from "../ligacaoBaseDados.js";
import { getFinanceSimulationError } from "../lib/validacoesFormularios.js";
import { sendServerError } from "../lib/respostasHttp.js";
import {
  hasMissingFields,
  normalizeEmail,
  normalizeText,
  REQUIRED_FIELDS_MESSAGE,
  validateContactIdentity,
} from "./publicRouteHelpers.js";

const router = express.Router();

router.post("/finance-requests", async (req, res) => {
  try {
    const nome = normalizeText(req.body.nome);
    const email = normalizeEmail(req.body.email);
    const telefone = normalizeText(req.body.telefone);
    const viatura = normalizeText(req.body.viatura);
    const preco = Number(req.body.preco);
    const entrada = Number(req.body.entrada);
    const meses = Number(req.body.meses);
    const taxa = Number(req.body.taxa);
    const prestacaoMensal = Number(req.body.prestacaoMensal);
    const montanteTotal = Number(req.body.montanteTotal);
    const taeg = Number(req.body.taeg);

    if (hasMissingFields([nome, email, telefone, viatura])) {
      return res.status(400).json({ message: REQUIRED_FIELDS_MESSAGE });
    }

    const identityError = validateContactIdentity(res, { email, telefone });

    if (identityError) {
      return identityError;
    }

    const financeSimulationError = getFinanceSimulationError({
      preco,
      entrada,
      meses,
      taxa,
      prestacaoMensal,
      montanteTotal,
      taeg,
    });

    if (financeSimulationError) {
      return res.status(400).json({ message: financeSimulationError });
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
        viatura,
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
    return sendServerError(
      res,
      "Erro ao guardar pedido de financiamento",
      "Erro ao guardar pedido de financiamento.",
      error,
    );
  }
});

export default router;
