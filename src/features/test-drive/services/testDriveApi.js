import { requestJson } from "../../../shared/services/http";

export function fetchTestDriveAvailability(date) {
  return requestJson(
    `/api/test-drives/availability?date=${encodeURIComponent(date)}`,
    {
      errorMessage: "Erro ao carregar disponibilidade.",
    },
  );
}

export function createTestDrive(payload) {
  return requestJson("/api/test-drives", {
    method: "POST",
    body: payload,
    errorMessage: "Erro ao guardar teste drive.",
  });
}
