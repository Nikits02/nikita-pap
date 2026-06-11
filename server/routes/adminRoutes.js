import express from "express";
import { pool } from "../ligacaoBaseDados.js";
import { fetchFirstRow, fetchRows, buildOrderedTableQuery } from "../lib/consultasBaseDados.js";
import {
  sendFinanceStatusEmail,
  sendTestDriveStatusEmail,
  sendTradeInStatusEmail,
} from "../lib/notificacoesEmail.js";
import { sendServerError } from "../lib/respostasHttp.js";
import { authenticateAdmin } from "../middleware/requireAdminLogin.js";
import {
  getVehiclePayloadError,
  getVehicleValues,
  normalizeVehiclePayload,
  VEHICLE_INSERT_COLUMNS_SQL,
  VEHICLE_INSERT_PLACEHOLDERS_SQL,
  VEHICLE_SELECT_ORDER_QUERY,
  VEHICLE_UPDATE_ASSIGNMENTS_SQL,
} from "../lib/dadosFormularioViatura.js";
import {
  saveVehicleImageUpload,
  VehicleImageUploadValidationError,
} from "../lib/uploadImagemViatura.js";

const router = express.Router();
const ADMIN_LEAD_STATUSES = new Set([
  "new",
  "in_contact",
  "scheduled",
  "completed",
  "cancelled",
]);
const ADMIN_CONTACT_STATUSES = new Set([
  "new",
  "responded",
]);
const ADMIN_DECISION_STATUSES = new Set([
  "new",
  "accepted",
  "rejected",
]);

const ADMIN_LIST_ROUTES = [
  {
    path: "/admin/vehicles",
    query: VEHICLE_SELECT_ORDER_QUERY,
    logMessage: "Erro ao buscar viaturas do admin",
    clientMessage: "Erro ao buscar viaturas.",
  },
  {
    path: "/admin/trade-ins",
    query: buildOrderedTableQuery("trade_in_requests"),
    logMessage: "Erro ao buscar pedidos de retoma",
    clientMessage: "Erro ao buscar pedidos de retoma.",
  },
  {
    path: "/admin/test-drives",
    query: buildOrderedTableQuery("test_drives"),
    logMessage: "Erro ao buscar pedidos de test drive",
    clientMessage: "Erro ao buscar pedidos de test drive.",
  },
  {
    path: "/admin/contact-messages",
    query: buildOrderedTableQuery("contact_messages"),
    logMessage: "Erro ao buscar mensagens de contacto",
    clientMessage: "Erro ao buscar mensagens de contacto.",
  },
  {
    path: "/admin/finance-requests",
    query: buildOrderedTableQuery("finance_requests"),
    logMessage: "Erro ao buscar pedidos de financiamento",
    clientMessage: "Erro ao buscar pedidos de financiamento.",
  },
  {
    path: "/admin/users",
    query: buildOrderedTableQuery("users", "id, nome, username, email, created_at"),
    logMessage: "Erro ao buscar utilizadores",
    clientMessage: "Erro ao buscar utilizadores.",
  },
];

const ADMIN_DELETE_ROUTES = [
  {
    path: "/admin/contact-messages/:id",
    tableName: "contact_messages",
    notFoundMessage: "Mensagem de contacto não encontrada.",
    successMessage: "Mensagem eliminada com sucesso.",
    logMessage: "Erro ao eliminar mensagem de contacto",
    clientMessage: "Erro ao eliminar mensagem de contacto.",
  },
  {
    path: "/admin/finance-requests/:id",
    tableName: "finance_requests",
    notFoundMessage: "Pedido de financiamento não encontrado.",
    successMessage: "Pedido de financiamento eliminado com sucesso.",
    logMessage: "Erro ao eliminar pedido de financiamento",
    clientMessage: "Erro ao eliminar pedido de financiamento.",
  },
  {
    path: "/admin/trade-ins/:id",
    tableName: "trade_in_requests",
    notFoundMessage: "Pedido de retoma não encontrado.",
    successMessage: "Pedido de retoma eliminado com sucesso.",
    logMessage: "Erro ao eliminar pedido de retoma",
    clientMessage: "Erro ao eliminar pedido de retoma.",
  },
  {
    path: "/admin/test-drives/:id",
    tableName: "test_drives",
    notFoundMessage: "Pedido de test drive não encontrado.",
    successMessage: "Pedido de test drive eliminado com sucesso.",
    logMessage: "Erro ao eliminar pedido de test drive",
    clientMessage: "Erro ao eliminar pedido de test drive.",
  },
  {
    path: "/admin/users/:id",
    tableName: "users",
    notFoundMessage: "Utilizador não encontrado.",
    successMessage: "Utilizador eliminado com sucesso.",
    logMessage: "Erro ao eliminar utilizador",
    clientMessage: "Erro ao eliminar utilizador.",
  },
  {
    path: "/admin/vehicles/:id",
    tableName: "vehicles",
    notFoundMessage: "Viatura não encontrada.",
    successMessage: "Viatura eliminada com sucesso.",
    logMessage: "Erro ao eliminar viatura",
    clientMessage: "Erro ao eliminar viatura.",
  },
];

const ADMIN_SUMMARY_QUERIES = {
  vehicles: "SELECT COUNT(*) AS total FROM vehicles",
  tradeIns: `
    SELECT COUNT(*) AS total
    FROM trade_in_requests
    WHERE COALESCE(NULLIF(status, ''), 'new') = 'new'
  `,
  finance: `
    SELECT COUNT(*) AS total
    FROM finance_requests
    WHERE COALESCE(NULLIF(status, ''), 'new') = 'new'
  `,
  testDrives: `
    SELECT COUNT(*) AS total
    FROM test_drives
    WHERE COALESCE(NULLIF(status, ''), 'new') = 'new'
  `,
  contacts: `
    SELECT COUNT(*) AS total
    FROM contact_messages
    WHERE COALESCE(NULLIF(status, ''), 'new') = 'new'
  `,
};

function registerAdminListRoute({ path, query, logMessage, clientMessage }) {
  router.get(path, authenticateAdmin, async (_req, res) => {
    try {
      return res.json(await fetchRows(query));
    } catch (error) {
      return sendServerError(res, logMessage, clientMessage, error);
    }
  });
}

function registerAdminDeleteRoute({
  path,
  tableName,
  notFoundMessage,
  successMessage,
  logMessage,
  clientMessage,
}) {
  router.delete(path, authenticateAdmin, async (req, res) => {
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

function normalizeAdminText(value) {
  return typeof value === "string" ? value.trim() : "";
}

async function fetchAdminSummaryCount(query) {
  const row = await fetchFirstRow(query);

  return Number(row?.total ?? 0);
}

async function fetchAdminSummary() {
  const summaryEntries = await Promise.all(
    Object.entries(ADMIN_SUMMARY_QUERIES).map(async ([key, query]) => [
      key,
      await fetchAdminSummaryCount(query),
    ]),
  );

  return Object.fromEntries(summaryEntries);
}

async function updateAdminLeadRecord({
  req,
  res,
  tableName,
  notFoundMessage,
  logMessage,
  clientMessage,
  allowedStatuses = ADMIN_LEAD_STATUSES,
  notificationStatuses = new Set(),
  sendStatusEmail = null,
  emailLogMessage = "Erro ao enviar email:",
  updateIsViewed = false,
}) {
  try {
    const { id } = req.params;
    const status = normalizeAdminText(req.body.status);

    if (!allowedStatuses.has(status)) {
      return res.status(400).json({ message: "Estado inválido." });
    }

    const existingRecord = await fetchFirstRow(
      `SELECT * FROM ${tableName} WHERE id = ?`,
      [id],
    );

    if (!existingRecord) {
      return res.status(404).json({ message: notFoundMessage });
    }

    const updateAssignments = ["status = ?"];
    const updateParams = [status];

    if (updateIsViewed) {
      updateAssignments.push("is_viewed = ?");
      updateParams.push(Number(status !== "new"));
    }

    await pool.query(
      `UPDATE ${tableName}
       SET ${updateAssignments.join(", ")}
       WHERE id = ?`,
      [...updateParams, id],
    );

    const updatedRecord = await fetchFirstRow(
      `SELECT * FROM ${tableName} WHERE id = ?`,
      [id],
    );

    if (
      sendStatusEmail &&
      existingRecord.status !== status &&
      notificationStatuses.has(status)
    ) {
      try {
        const emailResult = await sendStatusEmail(updatedRecord, status);

        return res.json({
          ...updatedRecord,
          notification_email_sent: !emailResult.skipped,
          notification_email_skipped_reason: emailResult.reason ?? null,
        });
      } catch (emailError) {
        console.error(emailLogMessage, emailError.message);

        return res.json({
          ...updatedRecord,
          notification_email_sent: false,
          notification_email_error: true,
        });
      }
    }

    return res.json(updatedRecord);
  } catch (error) {
    return sendServerError(res, logMessage, clientMessage, error);
  }
}

router.post("/admin/uploads/vehicle-image", authenticateAdmin, async (req, res) => {
  try {
    const uploadedImage = await saveVehicleImageUpload(req.body);
    return res.status(201).json(uploadedImage);
  } catch (error) {
    if (error instanceof VehicleImageUploadValidationError) {
      return res.status(400).json({ message: error.message });
    }

    return sendServerError(
      res,
      "Erro ao carregar imagem da viatura",
      "Erro ao carregar imagem.",
      error,
    );
  }
});

ADMIN_LIST_ROUTES.forEach(registerAdminListRoute);

router.get("/admin/summary", authenticateAdmin, async (_req, res) => {
  try {
    return res.json(await fetchAdminSummary());
  } catch (error) {
    return sendServerError(
      res,
      "Erro ao buscar resumo do admin",
      "Erro ao buscar resumo.",
      error,
    );
  }
});

router.patch("/admin/trade-ins/:id", authenticateAdmin, async (req, res) =>
  updateAdminLeadRecord({
    req,
    res,
    tableName: "trade_in_requests",
    notFoundMessage: "Pedido de retoma não encontrado.",
    logMessage: "Erro ao atualizar pedido de retoma",
    clientMessage: "Erro ao atualizar pedido de retoma.",
    allowedStatuses: ADMIN_DECISION_STATUSES,
    notificationStatuses: new Set(["accepted", "rejected"]),
    sendStatusEmail: sendTradeInStatusEmail,
    emailLogMessage: "Erro ao enviar email de retoma:",
    updateIsViewed: true,
  }),
);

router.patch("/admin/finance-requests/:id", authenticateAdmin, async (req, res) =>
  updateAdminLeadRecord({
    req,
    res,
    tableName: "finance_requests",
    notFoundMessage: "Pedido de financiamento não encontrado.",
    logMessage: "Erro ao atualizar pedido de financiamento",
    clientMessage: "Erro ao atualizar pedido de financiamento.",
    allowedStatuses: ADMIN_DECISION_STATUSES,
    notificationStatuses: new Set(["accepted", "rejected"]),
    sendStatusEmail: sendFinanceStatusEmail,
    emailLogMessage: "Erro ao enviar email de financiamento:",
  }),
);

router.patch("/admin/test-drives/:id", authenticateAdmin, async (req, res) =>
  updateAdminLeadRecord({
    req,
    res,
    tableName: "test_drives",
    notFoundMessage: "Pedido de test drive não encontrado.",
    logMessage: "Erro ao atualizar pedido de test drive",
    clientMessage: "Erro ao atualizar pedido de test drive.",
    notificationStatuses: new Set(["scheduled", "cancelled"]),
    sendStatusEmail: sendTestDriveStatusEmail,
    emailLogMessage: "Erro ao enviar email de test drive:",
  }),
);

router.patch("/admin/contact-messages/:id", authenticateAdmin, async (req, res) =>
  updateAdminLeadRecord({
    req,
    res,
    tableName: "contact_messages",
    notFoundMessage: "Mensagem de contacto não encontrada.",
    logMessage: "Erro ao atualizar mensagem de contacto",
    clientMessage: "Erro ao atualizar mensagem de contacto.",
    allowedStatuses: ADMIN_CONTACT_STATUSES,
  }),
);

router.get("/admin/vehicles/:id", authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const vehicle = await fetchFirstRow("SELECT * FROM vehicles WHERE id = ?", [id]);

    if (!vehicle) {
      return res.status(404).json({ message: "Viatura não encontrada." });
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

router.post("/admin/vehicles", authenticateAdmin, async (req, res) => {
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
      [result.insertId],
    );

    return res.status(201).json(createdVehicle);
  } catch (error) {
    return sendServerError(
      res,
      "Erro ao criar viatura",
      "Erro ao criar viatura.",
      error,
    );
  }
});

router.put("/admin/vehicles/:id", authenticateAdmin, async (req, res) => {
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
      return res.status(404).json({ message: "Viatura não encontrada." });
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

ADMIN_DELETE_ROUTES.forEach(registerAdminDeleteRoute);

export default router;
