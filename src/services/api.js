import { requestJson } from "./http";

function postJson(url, payload, errorMessage) {
  return requestJson(url, {
    method: "POST",
    body: payload,
    errorMessage,
  });
}

export function fetchVehicles() {
  return requestJson("/api/vehicles", {
    errorMessage: "Erro ao carregar viaturas.",
  });
}

export function createTestDrive(payload) {
  return postJson("/api/test-drives", payload, "Erro ao guardar teste drive.");
}

export function createContactMessage(payload) {
  return postJson("/api/contact", payload, "Erro ao enviar contacto.");
}

export function createTradeInRequest(payload) {
  return postJson(
    "/api/trade-ins",
    payload,
    "Erro ao guardar pedido de retoma.",
  );
}

export function createFinanceRequest(payload) {
  return postJson(
    "/api/finance-requests",
    payload,
    "Erro ao guardar pedido de financiamento.",
  );
}
