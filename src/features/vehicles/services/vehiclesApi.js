import { requestJson } from "../../../shared/services/http";

export function fetchVehicles() {
  return requestJson("/api/vehicles", {
    errorMessage: "Erro ao carregar viaturas.",
  });
}
