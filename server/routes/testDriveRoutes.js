import express from "express";
import { pool } from "../ligacaoBaseDados.js";
import { fetchFirstRow, fetchRows } from "../lib/consultasBaseDados.js";
import { sendServerError } from "../lib/respostasHttp.js";
import {
  getVehicleLookupFromSlug,
  isDateTodayOrFuture,
  isValidTestDriveHour,
} from "../lib/validacoesFormularios.js";
import {
  hasMissingFields,
  normalizeEmail,
  normalizeText,
  REQUIRED_FIELDS_MESSAGE,
  validateContactIdentity,
} from "./publicRouteHelpers.js";

const router = express.Router();

async function getExistingVehicleFromSlug(vehicleSlug) {
  const vehicleLookup = getVehicleLookupFromSlug(vehicleSlug);

  if (!vehicleLookup) {
    return null;
  }

  return fetchFirstRow(
    "SELECT id FROM vehicles WHERE id = ? AND source = ? LIMIT 1",
    [vehicleLookup.id, vehicleLookup.source],
  );
}

router.get("/test-drives/availability", async (req, res) => {
  try {
    const date = normalizeText(req.query.date);
    const vehicleSlug = normalizeText(req.query.vehicleSlug);

    if (!vehicleSlug) {
      return res.status(400).json({ message: "Viatura em falta." });
    }

    if (!isDateTodayOrFuture(date)) {
      return res.status(400).json({ message: "Data inválida." });
    }

    const vehicle = await getExistingVehicleFromSlug(vehicleSlug);

    if (!vehicle) {
      return res.status(404).json({ message: "Viatura não encontrada." });
    }

    const bookedSlots = await fetchRows(
      `SELECT DISTINCT LEFT(hora_preferida, 5) AS hour
       FROM test_drives
       WHERE vehicle_slug = ? AND data_preferida = ?
       ORDER BY hour ASC`,
      [vehicleSlug, date],
    );

    return res.json({
      date,
      vehicleSlug,
      bookedHours: bookedSlots.map((slot) => slot.hour),
    });
  } catch (error) {
    return sendServerError(
      res,
      "Erro ao buscar disponibilidade de test drive",
      "Erro ao buscar disponibilidade.",
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

    const vehicle = await getExistingVehicleFromSlug(vehicleSlug);

    if (!vehicle) {
      return res.status(400).json({ message: "Viatura inválida." });
    }

    const existingTestDrive = await fetchFirstRow(
      `SELECT id
       FROM test_drives
       WHERE vehicle_slug = ? AND data_preferida = ? AND LEFT(hora_preferida, 5) = ?
       LIMIT 1`,
      [vehicleSlug, dataPreferida, horaPreferida],
    );

    if (existingTestDrive) {
      return res.status(409).json({
        message: "Esta hora já não está disponível.",
      });
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
    if (error?.code === "ER_DUP_ENTRY") {
      return res.status(409).json({
        message: "Esta hora já não está disponível.",
      });
    }

    return sendServerError(
      res,
      "Erro ao guardar teste drive",
      "Erro ao guardar teste drive.",
      error,
    );
  }
});

export default router;
