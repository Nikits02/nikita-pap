import { requestJson } from "./http";
import { removeAdminToken, setAdminToken } from "./adminApi";

const AUTH_SESSION_KEY = "auth_session";

function setAuthSession(data) {
  localStorage.setItem(
    AUTH_SESSION_KEY,
    JSON.stringify({
      token: data.token,
      user: data.user,
    }),
  );

  if (data.user?.role === "admin" && data.token) {
    setAdminToken(data.token);
    return;
  }

  removeAdminToken();
}

export function getAuthSession() {
  const rawSession = localStorage.getItem(AUTH_SESSION_KEY);

  if (!rawSession) {
    return null;
  }

  try {
    return JSON.parse(rawSession);
  } catch {
    clearAuthSession();
    return null;
  }
}

export function getCurrentUser() {
  return getAuthSession()?.user ?? null;
}

export function getAuthToken() {
  return getAuthSession()?.token ?? null;
}

export function clearAuthSession() {
  localStorage.removeItem(AUTH_SESSION_KEY);
  removeAdminToken();
}

export function getDefaultRouteForUser(user) {
  return "/conta";
}

export async function login(payload) {
  const data = await requestJson("/api/auth/login", {
    method: "POST",
    body: payload,
    errorMessage: "Nao foi possivel iniciar sessao.",
  });

  setAuthSession(data);
  return data;
}

export async function register(payload) {
  const data = await requestJson("/api/auth/register", {
    method: "POST",
    body: payload,
    errorMessage: "Nao foi possivel criar a conta.",
  });

  setAuthSession(data);
  return data;
}
