export function getVehicleLabel(vehicle) {
  return `${vehicle.title} ${vehicle.versao ?? ""}`.replace(/\s+/g, " ").trim();
}
