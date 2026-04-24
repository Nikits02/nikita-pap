import express from "express";
import { pool } from "../db.js";
import { fetchFirstRow, fetchRows } from "../lib/dbQueries.js";
import { sendServerError } from "../lib/http.js";
import {
  getFinanceSimulationError,
  getVehicleLookupFromSlug,
  isDateTodayOrFuture,
  isValidEmail,
  isValidPhone,
  isValidTestDriveHour,
} from "../lib/validation.js";
import { VEHICLE_SELECT_ORDER_QUERY } from "../lib/vehiclePayload.js";

const router = express.Router();

const REQUIRED_FIELDS_MESSAGE = "Campos em falta.";

function normalizeText(value) {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeEmail(value) {
  return normalizeText(value).toLowerCase();
}

function hasMissingFields(fields) {
  return fields.some((field) => !field);
}

function validateContactIdentity(
  res,
  { email, telefone, telefoneObrigatorio = true },
) {
  if (!isValidEmail(email)) {
    return res.status(400).json({ message: "Email inválido." });
  }

  if ((telefoneObrigatorio || telefone) && !isValidPhone(telefone)) {
    return res.status(400).json({ message: "Telefone inválido." });
  }

  return null;
}

router.get("/health", (_req, res) => {
  return res.json({ ok: true });
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
    const vehicleSlug = normalizeText(req.body.vehicleSlug);
    const vehicleLabel = normalizeText(req.body.vehicleLabel);
    const dataPreferida = normalizeText(req.body.dataPreferida);
    const horaPreferida = normalizeText(req.body.horaPreferida);
    const nome = normalizeText(req.body.nome);
    const telefone = normalizeText(req.body.telefone);
    const email = normalizeEmail(req.body.email);

    if (
      hasMissingFields([
        vehicleSlug,
        dataPreferida,
        horaPreferida,
        nome,
        telefone,
        email,
      ])
    ) {
      return res.status(400).json({ message: REQUIRED_FIELDS_MESSAGE });
    }

    const identityError = validateContactIdentity(res, { email, telefone });

    if (identityError) {
      return identityError;
    }

    if (!isDateTodayOrFuture(dataPreferida)) {
      return res.status(400).json({ message: "Data inválida." });
    }

    if (!isValidTestDriveHour(horaPreferida)) {
      return res.status(400).json({ message: "Hora inválida." });
    }

    const vehicleLookup = getVehicleLookupFromSlug(vehicleSlug);

    if (!vehicleLookup) {
      return res.status(400).json({ message: "Viatura inválida." });
    }

    const vehicle = await fetchFirstRow(
      "SELECT id FROM vehicles WHERE id = ? AND source = ? LIMIT 1",
      [vehicleLookup.id, vehicleLookup.source],
    );

    if (!vehicle) {
      return res.status(404).json({ message: "Viatura não encontrada." });
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
        vehicleLabel || null,
        dataPreferida,
        horaPreferida,
        nome,
        telefone,
        email,
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

    if (hasMissingFields([nome, email, telefone])) {
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
