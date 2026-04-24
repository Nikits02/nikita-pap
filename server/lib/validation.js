const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_ALLOWED_PATTERN = /^[+\d\s().-]+$/;
const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const VEHICLE_SLUG_PATTERN = /^(catalog|highlight|stock)-(\d+)-[a-z0-9-]+$/;
const TEST_DRIVE_HOURS = new Set([
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
]);
const FINANCE_TERMS = new Set([24, 36, 48, 60, 72, 84]);

export function isValidEmail(value) {
  return EMAIL_PATTERN.test(value);
}

export function isValidPhone(value) {
  if (typeof value !== "string") {
    return false;
  }

  const trimmedValue = value.trim();
  const digits = trimmedValue.replace(/\D/g, "");

  return (
    PHONE_ALLOWED_PATTERN.test(trimmedValue) &&
    digits.length >= 9 &&
    digits.length <= 15
  );
}

function getLocalDateString(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function isValidIsoDate(value) {
  if (typeof value !== "string" || !ISO_DATE_PATTERN.test(value)) {
    return false;
  }

  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));

  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}

export function isDateTodayOrFuture(value, currentDate = new Date()) {
  return isValidIsoDate(value) && value >= getLocalDateString(currentDate);
}

export function isValidTestDriveHour(value) {
  return TEST_DRIVE_HOURS.has(value);
}

export function getVehicleLookupFromSlug(slug) {
  const match = typeof slug === "string" ? slug.match(VEHICLE_SLUG_PATTERN) : null;

  if (!match) {
    return null;
  }

  return {
    source: match[1],
    id: Number(match[2]),
  };
}

export function getFinanceSimulationError({
  preco,
  entrada,
  meses,
  taxa,
  prestacaoMensal,
  montanteTotal,
  taeg,
}) {
  if (
    !Number.isFinite(preco) ||
    !Number.isFinite(entrada) ||
    !Number.isInteger(meses) ||
    !Number.isFinite(taxa) ||
    !Number.isFinite(prestacaoMensal) ||
    !Number.isFinite(montanteTotal) ||
    !Number.isFinite(taeg)
  ) {
    return "Dados de simulação inválidos.";
  }

  if (preco < 1000 || preco > 1000000) {
    return "Preço inválido.";
  }

  if (entrada < 0 || entrada > preco * 0.5) {
    return "Entrada inválida.";
  }

  if (!FINANCE_TERMS.has(meses)) {
    return "Prazo inválido.";
  }

  if (taxa < 0 || taxa > 30 || taeg < taxa || taeg > 50) {
    return "Taxa inválida.";
  }

  if (prestacaoMensal <= 0 || montanteTotal <= 0) {
    return "Prestação inválida.";
  }

  if (montanteTotal + 1 < prestacaoMensal * meses) {
    return "Montante total inválido.";
  }

  return null;
}
