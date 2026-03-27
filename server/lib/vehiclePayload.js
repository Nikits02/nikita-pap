export const VEHICLE_FIELDS = [
  "source",
  "marca",
  "modelo",
  "tipo",
  "versao",
  "preco",
  "ano",
  "potencia",
  "quilometragem",
  "combustivel",
  "caixa",
  "inserted_at",
  "novidade",
  "imagem",
];

export const VEHICLE_SELECT_ORDER_QUERY =
  "SELECT * FROM vehicles ORDER BY inserted_at DESC, id DESC";

export const VEHICLE_INSERT_COLUMNS_SQL = VEHICLE_FIELDS.join(",\n        ");
export const VEHICLE_INSERT_PLACEHOLDERS_SQL = VEHICLE_FIELDS.map(() => "?").join(
  ", ",
);
export const VEHICLE_UPDATE_ASSIGNMENTS_SQL = VEHICLE_FIELDS.map(
  (field) => `${field} = ?`,
).join(", ");

export function normalizeVehiclePayload(payload = {}) {
  return {
    source: payload.source ?? "catalog",
    marca: payload.marca,
    modelo: payload.modelo,
    tipo: payload.tipo ?? null,
    versao: payload.versao ?? null,
    preco: payload.preco,
    ano: payload.ano ?? null,
    potencia: payload.potencia ?? null,
    quilometragem: payload.quilometragem ?? null,
    combustivel: payload.combustivel,
    caixa: payload.caixa,
    inserted_at: payload.inserted_at ?? null,
    novidade: payload.novidade ?? false,
    imagem: payload.imagem,
  };
}

export function getVehiclePayloadError(vehicle) {
  if (
    !vehicle.marca ||
    !vehicle.modelo ||
    vehicle.preco == null ||
    !vehicle.combustivel ||
    !vehicle.caixa ||
    !vehicle.imagem
  ) {
    return "Campos obrigatorios em falta.";
  }

  if (!["stock", "highlight", "catalog"].includes(vehicle.source)) {
    return "Source invalido.";
  }

  return null;
}

export function getVehicleValues(vehicle) {
  return VEHICLE_FIELDS.map((field) => vehicle[field]);
}
