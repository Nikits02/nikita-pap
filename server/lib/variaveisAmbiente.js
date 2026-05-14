export function getRequiredEnv(name) {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(`Variável de ambiente obrigatória em falta: ${name}`);
  }

  return value;
}

export function getRequiredNumberEnv(name) {
  const value = Number(getRequiredEnv(name));

  if (!Number.isFinite(value)) {
    throw new Error(`Variável de ambiente inválida: ${name}`);
  }

  return value;
}
