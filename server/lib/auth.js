import jwt from "jsonwebtoken";
import { getRequiredEnv } from "./env.js";

const AUTH_TOKEN_DURATION = "1d";
export const AUTH_COOKIE_NAME = "auth_token";

function isProductionEnvironment() {
  return process.env.NODE_ENV === "production";
}

function buildAuthCookieAttributes(options = {}) {
  const attributes = [
    `${AUTH_COOKIE_NAME}=${options.value ?? ""}`,
    "Path=/",
    "HttpOnly",
    "SameSite=Lax",
  ];

  if (isProductionEnvironment()) {
    attributes.push("Secure");
  }

  if (options.expiresNow) {
    attributes.push("Max-Age=0");
  }

  return attributes.join("; ");
}

export function buildAdminSessionUser(admin) {
  return {
    id: admin.id,
    nome: admin.username,
    username: admin.username,
    email: "",
    role: "admin",
  };
}

export function buildRegularSessionUser(user) {
  return {
    id: user.id,
    nome: user.nome,
    username: user.username,
    email: user.email,
    role: "user",
  };
}

export function createAuthToken(user) {
  return jwt.sign(
    {
      userId: user.id,
      username: user.username,
      role: user.role,
    },
    getRequiredEnv("JWT_SECRET"),
    { expiresIn: AUTH_TOKEN_DURATION },
  );
}

export function setAuthCookie(res, token) {
  res.setHeader("Set-Cookie", buildAuthCookieAttributes({ value: token }));
}

export function clearAuthCookie(res) {
  res.setHeader("Set-Cookie", buildAuthCookieAttributes({ expiresNow: true }));
}

export function buildAuthResponseBody(user) {
  return {
    ok: true,
    user,
  };
}

export function createAuthSuccess(res, user) {
  const token = createAuthToken(user);
  setAuthCookie(res, token);
  return buildAuthResponseBody(user);
}
