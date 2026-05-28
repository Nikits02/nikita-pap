import { requestJson } from "../../../shared/services/http";

export function createContactMessage(payload) {
  return requestJson("/api/contact", {
    method: "POST",
    body: payload,
    errorMessage: "Erro ao enviar contacto.",
  });
}
