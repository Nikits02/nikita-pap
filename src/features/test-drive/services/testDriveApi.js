import { requestJson } from "../../../shared/services/http";

export function fetchTestDriveAvailability(date, vehicleSlug) {
  const searchParams = new URLSearchParams({
    date,
    vehicleSlug,
  });

  return requestJson(`/api/test-drives/availability?${searchParams}`, {
    errorMessage: "Erro ao carregar disponibilidade.",
  });
}

export function createTestDrive(payload) {
  return requestJson("/api/test-drives", {
    method: "POST",
    body: payload,
    errorMessage: "Erro ao guardar teste drive.",
  });
}
