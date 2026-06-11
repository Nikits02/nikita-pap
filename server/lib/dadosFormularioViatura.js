import { isValidIsoDate } from "./validacoesFormularios.js";

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
const MIN_VEHICLE_YEAR = 1900;

export function normalizeVehiclePayload(payload = {}) {
  return {
    source: payload.source ?? "catalog",
    marca: payload.marca,
    modelo: payload.modelo,
    tipo: payload.tipo ?? null,
    versao: payload.versao ?? null,
    preco: Number(payload.preco),
    ano: Number(payload.ano),
    potencia: payload.potencia ?? null,
    quilometragem: payload.quilometragem ?? null,
    combustivel: payload.combustivel,
    caixa: payload.caixa,
    inserted_at: payload.inserted_at ?? null,
    novidade:
      payload.novidade === true ||
      payload.novidade === "true" ||
      payload.novidade === 1 ||
      payload.novidade === "1",
    imagem: payload.imagem,
  };
}

export function getVehiclePayloadError(vehicle) {
  const currentYear = new Date().getFullYear();
  const requiredTextFields = [
    vehicle.marca,
    vehicle.modelo,
    vehicle.quilometragem,
    vehicle.combustivel,
    vehicle.caixa,
    vehicle.inserted_at,
    vehicle.imagem,
  ];

  if (
    requiredTextFields.some(
      (field) => typeof field !== "string" || !field.trim(),
    )
  ) {
    return "Campos obrigatórios em falta.";
  }

  if (!["stock", "highlight", "catalog"].includes(vehicle.source)) {
    return "Source inválido.";
  }

<<<<<<< HEAD
  const vehicleYear = Number(vehicle.ano);
  const currentYear = new Date().getFullYear();

  if (
    !Number.isInteger(vehicleYear) ||
    vehicleYear < MIN_VEHICLE_YEAR ||
    vehicleYear > currentYear
=======
  if (!Number.isFinite(vehicle.preco) || vehicle.preco <= 0) {
    return "Preço inválido.";
  }

  if (
    !Number.isInteger(vehicle.ano) ||
    vehicle.ano < 1950 ||
    vehicle.ano > currentYear + 1
>>>>>>> 8b8f679f2b018dfbe7a1ad01940382b468e89654
  ) {
    return "Ano inválido.";
  }

<<<<<<< HEAD
=======
  if (!isValidIsoDate(vehicle.inserted_at)) {
    return "Data de inserção inválida.";
  }

>>>>>>> 8b8f679f2b018dfbe7a1ad01940382b468e89654
  return null;
}

export function getVehicleValues(vehicle) {
  return VEHICLE_FIELDS.map((field) => vehicle[field]);
}
