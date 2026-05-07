import express from "express";
import { pool } from "../databaseConnection.js";
import { fetchFirstRow, fetchRows, buildOrderedTableQuery } from "../lib/databaseQueries.js";
import {
  sendFinanceStatusEmail,
  sendTestDriveStatusEmail,
  sendTradeInStatusEmail,
} from "../lib/emailNotifications.js";
import { sendServerError } from "../lib/httpResponses.js";
import { authenticateAdmin } from "../middleware/requireAdminLogin.js";
import {
  getVehiclePayloadError,
  getVehicleValues,
  normalizeVehiclePayload,
  VEHICLE_INSERT_COLUMNS_SQL,
  VEHICLE_INSERT_PLACEHOLDERS_SQL,
  VEHICLE_SELECT_ORDER_QUERY,
  VEHICLE_UPDATE_ASSIGNMENTS_SQL,
} from "../lib/vehicleFormPayload.js";
import {
  saveVehicleImageUpload,
  VehicleImageUploadValidationError,
} from "../lib/vehicleImageUploadHandler.js";

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
  [
    "/admin/vehicles",
    VEHICLE_SELECT_ORDER_QUERY,
    "Erro ao buscar viaturas do admin",
    "Erro ao buscar viaturas.",
  ],
  [
    "/admin/trade-ins",
    buildOrderedTableQuery("trade_in_requests"),
    "Erro ao buscar pedidos de retoma",
    "Erro ao buscar pedidos de retoma.",
  ],
  [
    "/admin/test-drives",
    buildOrderedTableQuery("test_drives"),
    "Erro ao buscar pedidos de test drive",
    "Erro ao buscar pedidos de test drive.",
  ],
  [
    "/admin/contact-messages",
    buildOrderedTableQuery("contact_messages"),
    "Erro ao buscar mensagens de contacto",
    "Erro ao buscar mensagens de contacto.",
  ],
  [
    "/admin/finance-requests",
    buildOrderedTableQuery("finance_requests"),
    "Erro ao buscar pedidos de financiamento",
    "Erro ao buscar pedidos de financiamento.",
  ],
  [
    "/admin/users",
    buildOrderedTableQuery("users", "id, nome, username, email, created_at"),
    "Erro ao buscar utilizadores",
    "Erro ao buscar utilizadores.",
  ],
];

const ADMIN_DELETE_ROUTES = [
  [
    "/admin/contact-messages/:id",
    "contact_messages",
    "Mensagem de contacto não encontrada.",
    "Mensagem eliminada com sucesso.",
    "Erro ao eliminar mensagem de contacto",
    "Erro ao eliminar mensagem de contacto.",
  ],
  [
    "/admin/finance-requests/:id",
    "finance_requests",
    "Pedido de financiamento não encontrado.",
    "Pedido de financiamento eliminado com sucesso.",
    "Erro ao eliminar pedido de financiamento",
    "Erro ao eliminar pedido de financiamento.",
  ],
  [
    "/admin/trade-ins/:id",
    "trade_in_requests",
    "Pedido de retoma não encontrado.",
    "Pedido de retoma eliminado com sucesso.",
    "Erro ao eliminar pedido de retoma",
    "Erro ao eliminar pedido de retoma.",
  ],
  [
    "/admin/test-drives/:id",
    "test_drives",
    "Pedido de test drive não encontrado.",
    "Pedido de test drive eliminado com sucesso.",
    "Erro ao eliminar pedido de test drive",
    "Erro ao eliminar pedido de test drive.",
  ],
  [
    "/admin/users/:id",
    "users",
    "Utilizador não encontrado.",
    "Utilizador eliminado com sucesso.",
    "Erro ao eliminar utilizador",
    "Erro ao eliminar utilizador.",
  ],
  [
    "/admin/vehicles/:id",
    "vehicles",
    "Viatura não encontrada.",
    "Viatura eliminada com sucesso.",
    "Erro ao eliminar viatura",
    "Erro ao eliminar viatura.",
  ],
];

function registerAdminListRoute(path, query, logMessage, clientMessage) {
  router.get(path, authenticateAdmin, async (_req, res) => {
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
      return res.status(400).json({ message: "Estado invalido." });
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

ADMIN_LIST_ROUTES.forEach((routeConfig) => registerAdminListRoute(...routeConfig));

router.patch("/admin/trade-ins/:id", authenticateAdmin, async (req, res) =>
  updateAdminLeadRecord({
    req,
    res,
    tableName: "trade_in_requests",
    notFoundMessage: "Pedido de retoma nao encontrado.",
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
    notFoundMessage: "Pedido de financiamento nao encontrado.",
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
    notFoundMessage: "Pedido de test drive nao encontrado.",
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
    notFoundMessage: "Mensagem de contacto nao encontrada.",
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

ADMIN_DELETE_ROUTES.forEach((routeConfig) =>
  registerAdminDeleteRoute(...routeConfig),
);

export default router;
