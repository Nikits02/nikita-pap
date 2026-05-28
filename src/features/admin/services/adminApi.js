import { requestJson } from "../../../shared/services/http";
import { clearAuthSession } from "../../auth/services/authApi";
import { clearVehiclesCache } from "../../vehicles/services/vehiclesApi";

const ADMIN_SESSION_EXPIRED_MESSAGE = "Sessão expirada.";
const ADMIN_SESSION_ERROR_MESSAGES = new Set([
  "Token em falta.",
  "Token inválido.",
  "Não autorizado.",
  "Acesso reservado a administradores.",
]);

function mapAdminError(error) {
  if (ADMIN_SESSION_ERROR_MESSAGES.has(error.message)) {
    clearAuthSession();
    throw new Error(ADMIN_SESSION_EXPIRED_MESSAGE);
  }

  throw error;
}

async function requestAdminJson(url, errorMessage, method = "GET", body) {
  try {
    return await requestJson(url, { method, body, errorMessage });
  } catch (error) {
    mapAdminError(error);
  }
}

export function loginAdmin(payload) {
  return requestJson("/api/admin/login", {
    method: "POST",
    body: payload,
    errorMessage: "Erro no login admin.",
  });
}

export function fetchAdminDashboardSummary() {
  return requestAdminJson(
    "/api/admin/summary",
    "Não foi possível carregar o resumo.",
  );
}

export function fetchAdminVehicles() {
  return requestAdminJson(
    "/api/admin/vehicles",
    "Não foi possível carregar as viaturas.",
  );
}

export function fetchAdminTradeIns() {
  return requestAdminJson(
    "/api/admin/trade-ins",
    "Não foi possível carregar os pedidos de retoma.",
  );
}

export function fetchAdminTestDrives() {
  return requestAdminJson(
    "/api/admin/test-drives",
    "Não foi possível carregar os pedidos de test drive.",
  );
}

export function fetchAdminContactMessages() {
  return requestAdminJson(
    "/api/admin/contact-messages",
    "Não foi possível carregar as mensagens de contacto.",
  );
}

export function fetchAdminFinanceRequests() {
  return requestAdminJson(
    "/api/admin/finance-requests",
    "Não foi possível carregar os pedidos de financiamento.",
  );
}

export function updateAdminTradeInStatus(id, payload) {
  return requestAdminJson(
    `/api/admin/trade-ins/${id}`,
    "Não foi possível atualizar o pedido de retoma.",
    "PATCH",
    payload,
  );
}

export function updateAdminFinanceRequest(id, payload) {
  return requestAdminJson(
    `/api/admin/finance-requests/${id}`,
    "Não foi possível atualizar o pedido de financiamento.",
    "PATCH",
    payload,
  );
}

export function updateAdminTestDrive(id, payload) {
  return requestAdminJson(
    `/api/admin/test-drives/${id}`,
    "Não foi possível atualizar o pedido de test drive.",
    "PATCH",
    payload,
  );
}

export function updateAdminContactMessage(id, payload) {
  return requestAdminJson(
    `/api/admin/contact-messages/${id}`,
    "Não foi possível atualizar a mensagem de contacto.",
    "PATCH",
    payload,
  );
}

export function deleteAdminTradeIn(id) {
  return requestAdminJson(
    `/api/admin/trade-ins/${id}`,
    "Não foi possível eliminar o pedido de retoma.",
    "DELETE",
  );
}

export function deleteAdminTestDrive(id) {
  return requestAdminJson(
    `/api/admin/test-drives/${id}`,
    "Não foi possível eliminar o pedido de test drive.",
    "DELETE",
  );
}

export function deleteAdminContactMessage(id) {
  return requestAdminJson(
    `/api/admin/contact-messages/${id}`,
    "Não foi possível eliminar a mensagem de contacto.",
    "DELETE",
  );
}

export function deleteAdminFinanceRequest(id) {
  return requestAdminJson(
    `/api/admin/finance-requests/${id}`,
    "Não foi possível eliminar o pedido de financiamento.",
    "DELETE",
  );
}

export function fetchAdminUsers() {
  return requestAdminJson(
    "/api/admin/users",
    "Não foi possível carregar os utilizadores.",
  );
}

export function deleteAdminUser(id) {
  return requestAdminJson(
    `/api/admin/users/${id}`,
    "Não foi possível eliminar o utilizador.",
    "DELETE",
  );
}

export function fetchAdminVehicle(id) {
  return requestAdminJson(
    `/api/admin/vehicles/${id}`,
    "Não foi possível carregar a viatura.",
  );
}

export async function createAdminVehicle(payload) {
  const vehicle = await requestAdminJson(
    "/api/admin/vehicles",
    "Não foi possível criar a viatura.",
    "POST",
    payload,
  );

  clearVehiclesCache();
  return vehicle;
}

export function uploadAdminVehicleImage(payload) {
  return requestAdminJson(
    "/api/admin/uploads/vehicle-image",
    "Não foi possível carregar a imagem.",
    "POST",
    payload,
  );
}

export async function updateAdminVehicle(id, payload) {
  const vehicle = await requestAdminJson(
    `/api/admin/vehicles/${id}`,
    "Não foi possível atualizar a viatura.",
    "PUT",
    payload,
  );

  clearVehiclesCache();
  return vehicle;
}

export async function deleteAdminVehicle(id) {
  const result = await requestAdminJson(
    `/api/admin/vehicles/${id}`,
    "Não foi possível eliminar a viatura.",
    "DELETE",
  );

  clearVehiclesCache();
  return result;
}
