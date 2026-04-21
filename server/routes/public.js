import express from "express";
import { pool } from "../db.js";
import { sendServerError } from "../lib/http.js";
import { fetchRows } from "../lib/dbQueries.js";
import { isValidEmail } from "../lib/validation.js";
import { VEHICLE_SELECT_ORDER_QUERY } from "../lib/vehiclePayload.js";

const router = express.Router();

router.get("/health", (_req, res) => {
  res.json({ ok: true });
});

router.get("/vehicles", async (_req, res) => {
  try {
    return res.json(await fetchRows(VEHICLE_SELECT_ORDER_QUERY));
  } catch (error) {
    return sendServerError(
      res,
      "Erro ao buscar viaturas",
      "Erro ao buscar viaturas.",
      error,
    );
  }
});

router.post("/test-drives", async (req, res) => {
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

    const normalizedEmail = email.trim().toLowerCase();

    if (!isValidEmail(normalizedEmail)) {
      return res.status(400).json({ message: "Email invalido." });
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
        normalizedEmail,
      ],
    );

    return res.status(201).json({ ok: true });
  } catch (error) {
    return sendServerError(
      res,
      "Erro ao guardar teste drive",
      "Erro ao guardar teste drive.",
      error,
    );
  }
});

router.post("/contact", async (req, res) => {
  try {
    const nome = req.body.nome?.trim();
    const email = req.body.email?.trim().toLowerCase();
    const telefone = req.body.telefone?.trim() ?? "";
    const assunto = req.body.assunto?.trim();
    const mensagem = req.body.mensagem?.trim();

    if (!nome || !email || !assunto || !mensagem) {
      return res.status(400).json({ message: "Campos em falta." });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ message: "Email invalido." });
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

router.post("/trade-ins", async (req, res) => {
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

    if (!isValidEmail(email)) {
      return res.status(400).json({ message: "Email invalido." });
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
    return sendServerError(
      res,
      "Erro ao guardar pedido de retoma",
      "Erro ao guardar pedido de retoma.",
      error,
    );
  }
});

router.post("/finance-requests", async (req, res) => {
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

    if (!isValidEmail(email)) {
      return res.status(400).json({ message: "Email invalido." });
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
    return sendServerError(
      res,
      "Erro ao guardar pedido de financiamento",
      "Erro ao guardar pedido de financiamento.",
      error,
    );
  }
});

export default router;
