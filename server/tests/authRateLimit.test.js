import assert from "node:assert/strict";
import test from "node:test";
import {
  authRateLimit,
  clearAuthAttempts,
  registerAuthAttempt,
} from "../middleware/authRateLimit.js";

function createRequest(ip) {
  return {
    headers: {},
    ip,
  };
}

function createResponseMock() {
  return {
    statusCode: null,
    body: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      this.body = payload;
      return this;
    },
  };
}

function runRateLimit(req) {
  const res = createResponseMock();
  let didCallNext = false;

  authRateLimit(req, res, () => {
    didCallNext = true;
  });

  return { res, didCallNext };
}

test("authRateLimit allows requests below the attempt limit", () => {
  const req = createRequest("rate-limit-allow-test");
  const { res, didCallNext } = runRateLimit(req);

  assert.equal(didCallNext, true);
  assert.equal(res.statusCode, null);
});

test("authRateLimit blocks an IP after too many failed attempts", () => {
  const req = createRequest("rate-limit-block-test");

  for (let attempt = 0; attempt < 10; attempt += 1) {
    const result = runRateLimit(req);

    assert.equal(result.didCallNext, true);
    registerAuthAttempt(req);
  }

  const { res, didCallNext } = runRateLimit(req);

  assert.equal(didCallNext, false);
  assert.equal(res.statusCode, 429);
  assert.deepEqual(res.body, {
    message: "Demasiadas tentativas. Tente novamente dentro de alguns minutos.",
  });
});

test("clearAuthAttempts resets the stored attempts for an IP", () => {
  const req = createRequest("rate-limit-clear-test");

  for (let attempt = 0; attempt < 10; attempt += 1) {
    runRateLimit(req);
    registerAuthAttempt(req);
  }

  clearAuthAttempts(req);

  const { res, didCallNext } = runRateLimit(req);

  assert.equal(didCallNext, true);
  assert.equal(res.statusCode, null);
});

