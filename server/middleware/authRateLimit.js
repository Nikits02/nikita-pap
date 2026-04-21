const AUTH_RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;
const AUTH_RATE_LIMIT_MAX_ATTEMPTS = 10;
const authAttemptStore = new Map();

function cleanupExpiredAuthAttempts(now) {
  for (const [key, entry] of authAttemptStore.entries()) {
    if (now - entry.firstAttemptAt >= AUTH_RATE_LIMIT_WINDOW_MS) {
      authAttemptStore.delete(key);
    }
  }
}

function getAuthRateLimitKey(req) {
  const forwardedFor = req.headers["x-forwarded-for"];
  const forwardedIp = Array.isArray(forwardedFor)
    ? forwardedFor[0]
    : forwardedFor?.split(",")[0];

  return forwardedIp?.trim() || req.ip || "unknown";
}

export function authRateLimit(req, res, next) {
  const now = Date.now();
  const key = getAuthRateLimitKey(req);

  cleanupExpiredAuthAttempts(now);

  const currentEntry = authAttemptStore.get(key);

  if (
    currentEntry &&
    now - currentEntry.firstAttemptAt < AUTH_RATE_LIMIT_WINDOW_MS &&
    currentEntry.count >= AUTH_RATE_LIMIT_MAX_ATTEMPTS
  ) {
    return res.status(429).json({
      message: "Demasiadas tentativas. Tente novamente dentro de alguns minutos.",
    });
  }

  req.authRateLimitKey = key;
  return next();
}

export function registerAuthAttempt(req) {
  const key = req.authRateLimitKey ?? getAuthRateLimitKey(req);
  const now = Date.now();
  const currentEntry = authAttemptStore.get(key);

  if (!currentEntry || now - currentEntry.firstAttemptAt >= AUTH_RATE_LIMIT_WINDOW_MS) {
    authAttemptStore.set(key, { count: 1, firstAttemptAt: now });
    return;
  }

  authAttemptStore.set(key, {
    count: currentEntry.count + 1,
    firstAttemptAt: currentEntry.firstAttemptAt,
  });
}

export function clearAuthAttempts(req) {
  const key = req.authRateLimitKey ?? getAuthRateLimitKey(req);
  authAttemptStore.delete(key);
}
