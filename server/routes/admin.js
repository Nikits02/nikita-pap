import express from "express";
import { pool } from "../db.js";
import { fetchFirstRow, fetchRows, buildOrderedTableQuery } from "../lib/dbQueries.js";
import { sendServerError } from "../lib/http.js";
import { authenticateAdmin } from "../middleware/authenticateAdmin.js";
import {
  getVehiclePayloadError,
  getVehicleValues,
  normalizeVehiclePayload,
  VEHICLE_INSERT_COLUMNS_SQL,
  VEHICLE_INSERT_PLACEHOLDERS_SQL,
  VEHICLE_SELECT_ORDER_QUERY,
  VEHICLE_UPDATE_ASSIGNMENTS_SQL,
} from "../lib/vehiclePayload.js";
import {
  saveVehicleImageUpload,
  VehicleImageUploadValidationError,
} from "../lib/vehicleImageUpload.js";

const router = express.Router();

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

router.patch("/admin/trade-ins/:id", authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const isViewed = req.body.isViewed;

    if (typeof isViewed !== "boolean") {
      return res.status(400).json({ message: "Estado de leitura inválido." });
    }

    const existingTradeIn = await fetchFirstRow(
      "SELECT * FROM trade_in_requests WHERE id = ?",
      [id],
    );

    if (!existingTradeIn) {
      return res
        .status(404)
        .json({ message: "Pedido de retoma não encontrado." });
    }

    await pool.query(
      `UPDATE trade_in_requests
       SET is_viewed = ?
       WHERE id = ?`,
      [Number(isViewed), id],
    );

    const updatedTradeIn = await fetchFirstRow(
      "SELECT * FROM trade_in_requests WHERE id = ?",
      [id],
    );

    return res.json(updatedTradeIn);
  } catch (error) {
    return sendServerError(
      res,
      "Erro ao atualizar pedido de retoma",
      "Erro ao atualizar pedido de retoma.",
      error,
    );
  }
});

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
