import { requestJson } from "../../../shared/services/http";

export function createFinanceRequest(payload) {
  return requestJson("/api/finance-requests", {
    method: "POST",
    body: payload,
    errorMessage: "Erro ao guardar pedido de financiamento.",
  });
}
