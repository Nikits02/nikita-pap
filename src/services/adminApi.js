import { requestJson } from "./http";

const ADMIN_TOKEN_KEY = "admin_token";
const ADMIN_SESSION_EXPIRED_MESSAGE = "Sessao expirada.";
const ADMIN_SESSION_ERROR_MESSAGES = new Set([
  "Token em falta.",
  "Token invalido.",
  "Nao autorizado.",
  "Acesso reservado a administradores.",
]);

export function getAdminToken() {
  return localStorage.getItem(ADMIN_TOKEN_KEY);
}

export function setAdminToken(token) {
  localStorage.setItem(ADMIN_TOKEN_KEY, token);
}

export function removeAdminToken() {
  localStorage.removeItem(ADMIN_TOKEN_KEY);
}

function mapAdminError(error) {
  if (ADMIN_SESSION_ERROR_MESSAGES.has(error.message)) {
    throw new Error(ADMIN_SESSION_EXPIRED_MESSAGE);
  }

  throw error;
}

async function requestAdminJson(url, options = {}) {
  const token = getAdminToken();

  if (!token) {
    throw new Error(ADMIN_SESSION_EXPIRED_MESSAGE);
  }

  try {
    return await requestJson(url, { ...options, token });
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
