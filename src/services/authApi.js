import { requestJson } from "./http";

const AUTH_SESSION_KEY = "auth_session";

export function saveAuthSession(data) {
  localStorage.setItem(
    AUTH_SESSION_KEY,
    JSON.stringify({
      user: data.user,
    }),
  );
}

export function getAuthSession() {
  const rawSession = localStorage.getItem(AUTH_SESSION_KEY);

  if (!rawSession) {
    return null;
  }

  try {
    const parsedSession = JSON.parse(rawSession);

    if (
      !parsedSession ||
      typeof parsedSession !== "object" ||
      !parsedSession.user ||
      typeof parsedSession.user !== "object"
    ) {
      clearAuthSession();
      return null;
    }

    return parsedSession;
  } catch {
    clearAuthSession();
    return null;
  }
}

export function clearAuthSession() {
  localStorage.removeItem(AUTH_SESSION_KEY);
}

export async function requestLogout() {
  try {
    await requestJson("/api/auth/logout", {
      method: "POST",
      errorMessage: "Nao foi possivel terminar a sessao.",
    });
  } catch {
    // O cleanup local continua a ser feito mesmo se o pedido falhar.
  }
}

export async function validateAuthSession() {
  try {
    const data = await requestJson("/api/auth/session", {
      errorMessage: "Nao foi possivel validar a sessao.",
    });

    if (!data?.user) {
      clearAuthSession();
      return null;
    }

    saveAuthSession({ user: data.user });
    return data.user;
  } catch {
    clearAuthSession();
    return null;
  }
}

export function getDefaultRouteForUser() {
  return "/conta";
}

export function getPostAuthRoute() {
  return "/";
}

export async function login(payload) {
  const data = await requestJson("/api/auth/login", {
    method: "POST",
    body: payload,
    errorMessage: "Nao foi possivel iniciar sessao.",
  });

  saveAuthSession({ user: data.user });
  return data;
}

export async function register(payload) {
  const data = await requestJson("/api/auth/register", {
    method: "POST",
    body: payload,
    errorMessage: "Nao foi possivel criar a conta.",
  });

  saveAuthSession({ user: data.user });
  return data;
}
