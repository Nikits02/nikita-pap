import {
  isValidEmail,
  isValidPhone,
} from "../lib/validacoesFormularios.js";

export const REQUIRED_FIELDS_MESSAGE = "Campos em falta.";

export function normalizeText(value) {
  return typeof value === "string" ? value.trim() : "";
}

export function normalizeEmail(value) {
  return normalizeText(value).toLowerCase();
}

export function hasMissingFields(fields) {
  return fields.some((field) => !field);
}

export function validateContactIdentity(
  res,
  { email, telefone, telefoneObrigatorio = true },
) {
  if (!isValidEmail(email)) {
    return res.status(400).json({ message: "Email inválido." });
  }

  if ((telefoneObrigatorio || telefone) && !isValidPhone(telefone)) {
    return res.status(400).json({ message: "Telefone inválido." });
  }

  return null;
}
