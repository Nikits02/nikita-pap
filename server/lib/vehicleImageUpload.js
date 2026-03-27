import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

export const VEHICLE_IMAGE_UPLOAD_MAX_BYTES = 5 * 1024 * 1024;
export const VEHICLE_UPLOADS_ROOT_DIR = path.resolve("server/uploads");
export const VEHICLE_UPLOADS_DIR = path.join(VEHICLE_UPLOADS_ROOT_DIR, "vehicles");

const ALLOWED_VEHICLE_IMAGE_TYPES = new Map([
  ["image/jpeg", "jpg"],
  ["image/png", "png"],
  ["image/webp", "webp"],
]);

const DATA_URL_PATTERN = /^data:(?<mimeType>[-\w.+/]+);base64,(?<content>.+)$/;

export class VehicleImageUploadValidationError extends Error {}

function buildValidationError(message) {
  return new VehicleImageUploadValidationError(message);
}

function sanitizeFileNameSegment(value) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);
}

function parseImageDataUrl(dataUrl) {
  const match = typeof dataUrl === "string" ? dataUrl.match(DATA_URL_PATTERN) : null;

  if (!match?.groups?.mimeType || !match.groups.content) {
    throw buildValidationError("A imagem enviada nao tem um formato valido.");
  }

  return {
    mimeType: match.groups.mimeType,
    content: match.groups.content,
  };
}

function getUploadFileName(originalName, extension) {
  const baseName = sanitizeFileNameSegment(path.parse(originalName ?? "").name);
  const safeBaseName = baseName || "viatura";

  return `${safeBaseName}-${Date.now()}-${randomUUID().slice(0, 8)}.${extension}`;
}

export async function ensureVehicleUploadDirectory() {
  await mkdir(VEHICLE_UPLOADS_DIR, { recursive: true });
}

export async function saveVehicleImageUpload(payload = {}) {
  const { fileName, dataUrl } = payload;

  if (!fileName || !dataUrl) {
    throw buildValidationError("Seleciona uma imagem antes de carregar.");
  }

  const parsedDataUrl = parseImageDataUrl(dataUrl);
  const extension = ALLOWED_VEHICLE_IMAGE_TYPES.get(parsedDataUrl.mimeType);

  if (!extension) {
    throw buildValidationError("Formato invalido. Usa JPG, PNG ou WEBP.");
  }

  const buffer = Buffer.from(parsedDataUrl.content, "base64");

  if (!buffer.length) {
    throw buildValidationError("A imagem enviada esta vazia.");
  }

  if (buffer.length > VEHICLE_IMAGE_UPLOAD_MAX_BYTES) {
    throw buildValidationError("A imagem nao pode ter mais de 5 MB.");
  }

  const storedFileName = getUploadFileName(fileName, extension);
  const absoluteFilePath = path.join(VEHICLE_UPLOADS_DIR, storedFileName);

  await writeFile(absoluteFilePath, buffer);

  return {
    imagem: `/uploads/vehicles/${storedFileName}`,
  };
}
