import { requestJson } from "./http";
import { clearAuthSession } from "./authApi";

const ADMIN_SESSION_EXPIRED_MESSAGE = "Sessao expirada.";
const ADMIN_SESSION_ERROR_MESSAGES = new Set([
  "Token em falta.",
  "Token invalido.",
  "Nao autorizado.",
  "Acesso reservado a administradores.",
]);

function mapAdminError(error) {
  if (ADMIN_SESSION_ERROR_MESSAGES.has(error.message)) {
    clearAuthSession();
    throw new Error(ADMIN_SESSION_EXPIRED_MESSAGE);
  }

  throw error;
}

async function requestAdminJson(url, options = {}) {
  try {
    return await requestJson(url, options);
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

export function fetchAdminVehicles() {
  return requestAdminJson("/api/admin/vehicles", {
    errorMessage: "Nao foi possivel carregar as viaturas.",
  });
}

export function fetchAdminTradeIns() {
  return requestAdminJson("/api/admin/trade-ins", {
    errorMessage: "Nao foi possivel carregar os pedidos de retoma.",
  });
}

export function fetchAdminTestDrives() {
  return requestAdminJson("/api/admin/test-drives", {
    errorMessage: "Nao foi possivel carregar os pedidos de test drive.",
  });
}

export function fetchAdminContactMessages() {
  return requestAdminJson("/api/admin/contact-messages", {
    errorMessage: "Nao foi possivel carregar as mensagens de contacto.",
  });
}

export function fetchAdminFinanceRequests() {
  return requestAdminJson("/api/admin/finance-requests", {
    errorMessage: "Nao foi possivel carregar os pedidos de financiamento.",
  });
}

export function updateAdminTradeInStatus(id, payload) {
  return requestAdminJson(`/api/admin/trade-ins/${id}`, {
    method: "PATCH",
    body: payload,
    errorMessage: "Nao foi possivel atualizar o pedido de retoma.",
  });
}

export function deleteAdminTradeIn(id) {
  return requestAdminJson(`/api/admin/trade-ins/${id}`, {
    method: "DELETE",
    errorMessage: "Nao foi possivel eliminar o pedido de retoma.",
  });
}

export function deleteAdminTestDrive(id) {
  return requestAdminJson(`/api/admin/test-drives/${id}`, {
    method: "DELETE",
    errorMessage: "Nao foi possivel eliminar o pedido de test drive.",
  });
}

export function deleteAdminContactMessage(id) {
  return requestAdminJson(`/api/admin/contact-messages/${id}`, {
    method: "DELETE",
    errorMessage: "Nao foi possivel eliminar a mensagem de contacto.",
  });
}

export function deleteAdminFinanceRequest(id) {
  return requestAdminJson(`/api/admin/finance-requests/${id}`, {
    method: "DELETE",
    errorMessage: "Nao foi possivel eliminar o pedido de financiamento.",
  });
}

export function fetchAdminUsers() {
  return requestAdminJson("/api/admin/users", {
    errorMessage: "Nao foi possivel carregar os utilizadores.",
  });
}

export function deleteAdminUser(id) {
  return requestAdminJson(`/api/admin/users/${id}`, {
    method: "DELETE",
    errorMessage: "Nao foi possivel eliminar o utilizador.",
  });
}

export function fetchAdminVehicle(id) {
  return requestAdminJson(`/api/admin/vehicles/${id}`, {
    errorMessage: "Nao foi possivel carregar a viatura.",
  });
}

export function createAdminVehicle(payload) {
  return requestAdminJson("/api/admin/vehicles", {
    method: "POST",
    body: payload,
    errorMessage: "Nao foi possivel criar a viatura.",
  });
}

export function uploadAdminVehicleImage(payload) {
  return requestAdminJson("/api/admin/uploads/vehicle-image", {
    method: "POST",
    body: payload,
    errorMessage: "Nao foi possivel carregar a imagem.",
  });
}

export function updateAdminVehicle(id, payload) {
  return requestAdminJson(`/api/admin/vehicles/${id}`, {
    method: "PUT",
    body: payload,
    errorMessage: "Nao foi possivel atualizar a viatura.",
  });
}

export function deleteAdminVehicle(id) {
  return requestAdminJson(`/api/admin/vehicles/${id}`, {
    method: "DELETE",
    errorMessage: "Nao foi possivel eliminar a viatura.",
  });
}
