import jwt from "jsonwebtoken";
import { AUTH_COOKIE_NAME } from "../lib/auth.js";
import { getRequiredEnv } from "../lib/env.js";

function getCookiesFromRequest(req) {
  const cookieHeader = req.headers.cookie;

  if (!cookieHeader) {
    return {};
  }

  return cookieHeader.split(";").reduce((cookies, pair) => {
    const separatorIndex = pair.indexOf("=");

    if (separatorIndex === -1) {
      return cookies;
    }

    const name = pair.slice(0, separatorIndex).trim();
    const value = pair.slice(separatorIndex + 1).trim();

    if (!name) {
      return cookies;
    }

    cookies[name] = decodeURIComponent(value);
    return cookies;
  }, {});
}

export function getBearerTokenFromRequest(req) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return { error: "Token em falta." };
  }

  const [type, token] = authHeader.split(" ");

  if (type !== "Bearer" || !token) {
    return { error: "Token inválido." };
  }

  return { token };
}

export function authenticateRequest(req, res, next) {
  const { token: bearerToken, error } = getBearerTokenFromRequest(req);
  const cookieToken = getCookiesFromRequest(req)[AUTH_COOKIE_NAME];
  const token = bearerToken ?? cookieToken;

  if (!token && error) {
    return res.status(401).json({ message: error });
  }

  try {
    const decoded = jwt.verify(token, getRequiredEnv("JWT_SECRET"));
    req.auth = decoded;
    return next();
  } catch {
    return res.status(401).json({ message: "Não autorizado." });
  }
}
