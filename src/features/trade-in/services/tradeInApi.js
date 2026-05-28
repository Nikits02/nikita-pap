import { requestJson } from "../../../shared/services/http";

export function createTradeInRequest(payload) {
  return requestJson("/api/trade-ins", {
    method: "POST",
    body: payload,
    errorMessage: "Erro ao guardar pedido de retoma.",
  });
}
