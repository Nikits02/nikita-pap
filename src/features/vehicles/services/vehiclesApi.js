import { requestJson } from "../../../shared/services/http";

let cachedVehicles = null;
let pendingVehiclesRequest = null;

export function clearVehiclesCache() {
  cachedVehicles = null;
  pendingVehiclesRequest = null;
}

export function fetchVehicles() {
  if (cachedVehicles) {
    return Promise.resolve(cachedVehicles);
  }

  if (!pendingVehiclesRequest) {
    pendingVehiclesRequest = requestJson("/api/vehicles", {
      errorMessage: "Erro ao carregar viaturas.",
    })
      .then((vehicles) => {
        cachedVehicles = vehicles;
        return vehicles;
      })
      .finally(() => {
        pendingVehiclesRequest = null;
      });
  }

  return pendingVehiclesRequest;
}
