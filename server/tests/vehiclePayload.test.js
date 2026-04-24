import assert from "node:assert/strict";
import test from "node:test";
import {
  getVehiclePayloadError,
  getVehicleValues,
  normalizeVehiclePayload,
  VEHICLE_FIELDS,
} from "../lib/vehiclePayload.js";

const validVehiclePayload = {
  source: "catalog",
  marca: "Porsche",
  modelo: "Macan",
  tipo: "SUV",
  versao: "GTS",
  preco: 89900,
  ano: 2024,
  potencia: "440 cv",
  quilometragem: "12 000 km",
  combustivel: "Gasolina",
  caixa: "Automatica",
  inserted_at: "2026-04-22",
  novidade: true,
  imagem: "/uploads/vehicles/porsche-macan.png",
};

test("normalizeVehiclePayload applies defaults for optional vehicle fields", () => {
  const vehicle = normalizeVehiclePayload({
    marca: "BMW",
    modelo: "M8",
    preco: 145000,
    ano: 2023,
    quilometragem: "8 000 km",
    combustivel: "Gasolina",
    caixa: "Automatica",
    inserted_at: "2026-04-22",
    imagem: "/uploads/vehicles/bmw-m8.png",
  });

  assert.equal(vehicle.source, "catalog");
  assert.equal(vehicle.tipo, null);
  assert.equal(vehicle.versao, null);
  assert.equal(vehicle.novidade, false);
});

test("getVehiclePayloadError accepts a complete vehicle payload", () => {
  assert.equal(getVehiclePayloadError(validVehiclePayload), null);
});

test("getVehiclePayloadError rejects missing required vehicle fields", () => {
  assert.equal(
    getVehiclePayloadError({ ...validVehiclePayload, marca: "" }),
    "Campos obrigatórios em falta.",
  );
});

test("getVehiclePayloadError rejects invalid vehicle source values", () => {
  assert.equal(
    getVehiclePayloadError({ ...validVehiclePayload, source: "homepage" }),
    "Source inválido.",
  );
});

test("getVehicleValues keeps database values in VEHICLE_FIELDS order", () => {
  const values = getVehicleValues(validVehiclePayload);

  assert.equal(values.length, VEHICLE_FIELDS.length);
  assert.deepEqual(
    values,
    VEHICLE_FIELDS.map((field) => validVehiclePayload[field]),
  );
});

