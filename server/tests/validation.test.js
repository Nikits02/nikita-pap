import assert from "node:assert/strict";
import test from "node:test";
import {
  getFinanceSimulationError,
  getVehicleLookupFromSlug,
  isDateTodayOrFuture,
  isValidEmail,
  isValidIsoDate,
  isValidPhone,
  isValidTestDriveHour,
} from "../lib/validation.js";

test("isValidEmail accepts common valid email addresses", () => {
  assert.equal(isValidEmail("cliente@email.pt"), true);
  assert.equal(isValidEmail("nome.apelido+stand@example.com"), true);
});

test("isValidEmail rejects incomplete email addresses", () => {
  assert.equal(isValidEmail("cliente"), false);
  assert.equal(isValidEmail("cliente@"), false);
  assert.equal(isValidEmail("cliente@email"), false);
  assert.equal(isValidEmail("cliente email@example.com"), false);
});

test("isValidPhone accepts common Portuguese phone formats", () => {
  assert.equal(isValidPhone("912345678"), true);
  assert.equal(isValidPhone("+351 912 345 678"), true);
  assert.equal(isValidPhone("(+351) 912-345-678"), true);
});

test("isValidPhone rejects invalid phone values", () => {
  assert.equal(isValidPhone("123"), false);
  assert.equal(isValidPhone("telefone912345678"), false);
  assert.equal(isValidPhone("+351 912 345 678 999 999"), false);
});

test("isValidIsoDate validates real calendar dates", () => {
  assert.equal(isValidIsoDate("2026-04-22"), true);
  assert.equal(isValidIsoDate("2026-02-29"), false);
  assert.equal(isValidIsoDate("22-04-2026"), false);
});

test("isDateTodayOrFuture rejects dates before the current day", () => {
  const currentDate = new Date(2026, 3, 22);

  assert.equal(isDateTodayOrFuture("2026-04-21", currentDate), false);
  assert.equal(isDateTodayOrFuture("2026-04-22", currentDate), true);
  assert.equal(isDateTodayOrFuture("2026-04-23", currentDate), true);
});

test("isValidTestDriveHour only accepts configured hours", () => {
  assert.equal(isValidTestDriveHour("09:00"), true);
  assert.equal(isValidTestDriveHour("13:00"), false);
  assert.equal(isValidTestDriveHour("09:30"), false);
});

test("getVehicleLookupFromSlug extracts source and id from vehicle slugs", () => {
  assert.deepEqual(getVehicleLookupFromSlug("catalog-12-porsche-macan"), {
    source: "catalog",
    id: 12,
  });
  assert.deepEqual(getVehicleLookupFromSlug("highlight-8-ferrari-roma"), {
    source: "highlight",
    id: 8,
  });
  assert.equal(getVehicleLookupFromSlug("contacto-test-drive"), null);
});

test("getFinanceSimulationError accepts a valid finance simulation", () => {
  assert.equal(
    getFinanceSimulationError({
      preco: 120000,
      entrada: 24000,
      meses: 60,
      taxa: 6.9,
      prestacaoMensal: 1896.5,
      montanteTotal: 113790,
      taeg: 7.9,
    }),
    null,
  );
});

test("getFinanceSimulationError rejects invalid finance ranges", () => {
  const validSimulation = {
    preco: 120000,
    entrada: 24000,
    meses: 60,
    taxa: 6.9,
    prestacaoMensal: 1896.5,
    montanteTotal: 113790,
    taeg: 7.9,
  };

  assert.equal(
    getFinanceSimulationError({ ...validSimulation, entrada: 90000 }),
    "Entrada inválida.",
  );
  assert.equal(
    getFinanceSimulationError({ ...validSimulation, meses: 18 }),
    "Prazo inválido.",
  );
  assert.equal(
    getFinanceSimulationError({ ...validSimulation, taxa: 45 }),
    "Taxa inválida.",
  );
});

