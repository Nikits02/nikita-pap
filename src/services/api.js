import { requestJson } from "./http";

export function fetchVehicles() {
  return requestJson("/api/vehicles", {
    errorMessage: "Erro ao carregar viaturas.",
  });
}

export function createTestDrive(payload) {
  return requestJson("/api/test-drives", {
    method: "POST",
    body: payload,
    errorMessage: "Erro ao guardar teste drive.",
  });
}

export function createContactMessage(payload) {
  return requestJson("/api/contact", {
    method: "POST",
    body: payload,
    errorMessage: "Erro ao enviar contacto.",
  });
}

export function createTradeInRequest(payload) {
  return requestJson("/api/trade-ins", {
    method: "POST",
    body: payload,
    errorMessage: "Erro ao guardar pedido de retoma.",
  });
}
